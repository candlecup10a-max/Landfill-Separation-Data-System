import { CategoryId, RawDatasetEntry, WasteItem, TrainingExportStats, RacurAngle } from '../types';
import {
  RAW_PLASTIC_JSON,
  RAW_IRON_ALUMINIUM_CSV,
  RAW_GLASS_CSV,
  RAW_WOOD_CSV,
  RAW_TEXTILE_CSV,
} from '../data/initialData';

// Simple robust CSV parser handling commas, quotes, and newlines
export function parseCsv(csvText: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length === 0 || !lines[0].trim()) {
    return { headers: [], rows: [] };
  }

  // Parse header line
  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCsvLine(line);
    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] !== undefined ? values[idx] : '';
    });
    rows.push(rowObj);
  }

  return { headers, rows };
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ''));
  return result;
}

export function arrayToCsv(headers: string[], rows: Record<string, any>[]): string {
  if (!rows || rows.length === 0) return headers.join(',');
  const headerLine = headers.join(',');
  const rowLines = rows.map((r) =>
    headers
      .map((h) => {
        const val = String(r[h] ?? '');
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      })
      .join(',')
  );
  return [headerLine, ...rowLines].join('\n');
}

// Convert Plastic JSON hierarchy into flat inspectable rows for the data cell
export function flattenPlasticJson(jsonText: string): { headers: string[]; rows: RawDatasetEntry[] } {
  try {
    const parsed = JSON.parse(jsonText);
    const sectors = parsed?.plastic_classification_system?.market_sectors || [];
    const rows: RawDatasetEntry[] = [];
    let counter = 1;

    sectors.forEach((sec: any) => {
      const subcats = sec.subcategories || [];
      subcats.forEach((sub: any) => {
        const examples = (sub.item_examples || []).join(', ');
        rows.push({
          id: counter++,
          Sector_ID: sec.sector_id,
          Sector_Name: sec.sector_name,
          Category_ID: sub.category_id,
          Category_Name: sub.category_name,
          Item_Examples: examples,
        });
      });
    });

    return {
      headers: ['id', 'Sector_ID', 'Sector_Name', 'Category_ID', 'Category_Name', 'Item_Examples'],
      rows,
    };
  } catch (e) {
    console.error('Failed to flatten plastic json', e);
    return { headers: ['id', 'raw'], rows: [{ id: 1, raw: jsonText }] };
  }
}

// Extract parsed rows from initial raw datasets
export function getInitialParsedDataset(categoryId: CategoryId): {
  fileName: string;
  rawText: string;
  headers: string[];
  rows: RawDatasetEntry[];
} {
  switch (categoryId) {
    case 'plastic': {
      const flattened = flattenPlasticJson(RAW_PLASTIC_JSON);
      return {
        fileName: 'plastic.json',
        rawText: RAW_PLASTIC_JSON,
        headers: flattened.headers,
        rows: flattened.rows,
      };
    }
    case 'iron_aluminum': {
      const parsed = parseCsv(RAW_IRON_ALUMINIUM_CSV);
      return {
        fileName: 'iron-aluminium.csv',
        rawText: RAW_IRON_ALUMINIUM_CSV,
        headers: parsed.headers,
        rows: parsed.rows.map((r) => ({ ...r, id: r.ID || r.id })),
      };
    }
    case 'glass': {
      const parsed = parseCsv(RAW_GLASS_CSV);
      return {
        fileName: 'glass.csv',
        rawText: RAW_GLASS_CSV,
        headers: parsed.headers,
        rows: parsed.rows.map((r) => ({ ...r, id: r.ID || r.id })),
      };
    }
    case 'paper_cardboard': {
      const parsed = parseCsv(RAW_WOOD_CSV);
      return {
        fileName: 'wood.csv',
        rawText: RAW_WOOD_CSV,
        headers: parsed.headers,
        rows: parsed.rows.map((r) => ({ ...r, id: r.ID || r.id })),
      };
    }
    case 'textile': {
      const parsed = parseCsv(RAW_TEXTILE_CSV);
      return {
        fileName: 'textile.csv',
        rawText: RAW_TEXTILE_CSV,
        headers: parsed.headers,
        rows: parsed.rows.map((r) => ({ ...r, id: r.ID || r.id })),
      };
    }
    case 'general_waste':
    default: {
      return {
        fileName: 'empty',
        rawText: '',
        headers: ['ID', 'Item_Name', 'Reason_Unclassified', 'Disposal_Chute'],
        rows: [],
      };
    }
  }
}

// Generate complete AI training export package
export function generateTrainingExport(items: WasteItem[]): {
  stats: TrainingExportStats;
  yoloYaml: string;
  cocoJson: string;
  multimodalManifest: string;
  csvSummary: string;
} {
  const classBreakdown: Record<CategoryId, number> = {
    plastic: 0,
    iron_aluminum: 0,
    glass: 0,
    paper_cardboard: 0,
    textile: 0,
    general_waste: 0,
  };

  const angleCoverage: Record<RacurAngle, number> = {
    front: 0,
    side: 0,
    top: 0,
    isometric: 0,
    bottom: 0,
    back: 0,
    detail: 0,
  };

  let totalImages = 0;

  items.forEach((item) => {
    classBreakdown[item.categoryId] = (classBreakdown[item.categoryId] || 0) + 1;
    (item.images || []).forEach((img) => {
      totalImages++;
      if (angleCoverage[img.angle] !== undefined) {
        angleCoverage[img.angle]++;
      }
    });
  });

  const stats: TrainingExportStats = {
    totalItems: items.length,
    totalImages,
    classBreakdown,
    angleCoverage,
    averageAnglesPerItem: items.length ? Number((totalImages / items.length).toFixed(2)) : 0,
  };

  // YOLO Dataset YAML configuration
  const yoloYaml = `# Landfill Separation Machine AI Training Specification
# Generated: ${new Date().toISOString()}
train: ../dataset/images/train
val: ../dataset/images/val
test: ../dataset/images/test

nc: 6
names:
  0: plastic_materials
  1: iron_aluminum_products
  2: glass_materials
  3: paper_cardboard_materials
  4: textile_materials
  5: general_waste

# Sensor parameters for Separation Arm:
sensors:
  - optical_rgb_multi_racur
  - near_infrared_spectral_nir
  - inductive_metal_detector
  - laser_dimensional_profiler
`;

  // Multi-modal dataset manifest for Computer Vision + Sensor Fusion
  const multimodalManifest = JSON.stringify(
    {
      dataset_name: 'Landfill_Separation_Machine_Algorithm_Dataset',
      version: '2.0.0',
      created_at: new Date().toISOString(),
      target_machine: '6-Chute High-Speed Optical Landfill Classifier',
      statistics: stats,
      classes: [
        { class_id: 0, key: 'plastic', label: 'Plastic Materials', source_file: 'plastic.json' },
        { class_id: 1, key: 'iron_aluminum', label: 'Iron & Aluminum Products', source_file: 'iron-aluminium.csv' },
        { class_id: 2, key: 'glass', label: 'Glass Materials', source_file: 'glass.csv' },
        { class_id: 3, key: 'paper_cardboard', label: 'Paper & Cardboard & Wood', source_file: 'wood.csv' },
        { class_id: 4, key: 'textile', label: 'Textile Materials', source_file: 'textile.csv' },
        { class_id: 5, key: 'general_waste', label: 'General Waste (Refuse)', source_file: 'empty' },
      ],
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        category: it.categoryId,
        material: it.material,
        dimensions: {
          height_cm: it.heightCm,
          width_cm: it.widthCm,
          depth_cm: it.depthCm ?? null,
        },
        weight_grams: it.weightGrams ?? null,
        sub_category: it.subCategory ?? null,
        industry_sector: it.industrySector ?? null,
        recyclability: it.recyclabilityRating ?? null,
        notes: it.notes ?? '',
        racur_images: it.images.map((img) => ({
          image_id: img.id,
          angle: img.angle,
          angle_label: img.angleLabel,
          timestamp: img.timestamp,
        })),
      })),
    },
    null,
    2
  );

  // COCO format annotations skeleton
  const cocoJson = JSON.stringify(
    {
      info: {
        description: 'Landfill AI Separation Multi-Racur Dataset',
        date_created: new Date().toISOString(),
      },
      categories: [
        { id: 1, name: 'plastic_materials', supercategory: 'recyclable' },
        { id: 2, name: 'iron_aluminum_products', supercategory: 'recyclable' },
        { id: 3, name: 'glass_materials', supercategory: 'recyclable' },
        { id: 4, name: 'paper_cardboard_materials', supercategory: 'recyclable' },
        { id: 5, name: 'textile_materials', supercategory: 'recyclable' },
        { id: 6, name: 'general_waste', supercategory: 'landfill' },
      ],
      images: items.flatMap((item) =>
        item.images.map((img, idx) => ({
          id: `${item.id}_${img.angle}`,
          file_name: `${item.id}_racur_${img.angle}.jpg`,
          width: 640,
          height: 640,
          item_id: item.id,
          angle: img.angle,
        }))
      ),
    },
    null,
    2
  );

  // CSV Summary of all registered items
  const csvHeaders = [
    'Item_ID',
    'Item_Name',
    'Category_ID',
    'Material',
    'Height_CM',
    'Width_CM',
    'Depth_CM',
    'Weight_Grams',
    'Sub_Category',
    'Industry_Sector',
    'Recyclability',
    'Racur_Angles_Count',
    'Created_At',
  ];

  const csvRows = items.map((it) => ({
    Item_ID: it.id,
    Item_Name: it.name,
    Category_ID: it.categoryId,
    Material: it.material,
    Height_CM: it.heightCm,
    Width_CM: it.widthCm,
    Depth_CM: it.depthCm ?? '',
    Weight_Grams: it.weightGrams ?? '',
    Sub_Category: it.subCategory ?? '',
    Industry_Sector: it.industrySector ?? '',
    Recyclability: it.recyclabilityRating ?? '',
    Racur_Angles_Count: it.images.length,
    Created_At: it.createdAt,
  }));

  const csvSummary = arrayToCsv(csvHeaders, csvRows);

  return {
    stats,
    yoloYaml,
    cocoJson,
    multimodalManifest,
    csvSummary,
  };
}

// Helper to trigger browser file download
export function downloadFile(filename: string, content: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
