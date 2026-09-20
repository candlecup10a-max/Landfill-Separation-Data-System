import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileCode, 
  Copy, 
  Check, 
  Database, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  FileSpreadsheet,
  Settings,
  Sparkles,
  Terminal,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { WasteItem, TrainingDatasetExport, CategoryId } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { generateTrainingExport, convertItemsToCsv, downloadFile } from '../utils/csvParser';

interface TrainingExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: WasteItem[];
}

export const TrainingExportModal: React.FC<TrainingExportModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'yolo' | 'coco' | 'csv' | 'json' | 'chute_router'>('yolo');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [includeAugmentation, setIncludeAugmentation] = useState<boolean>(true);
  const [trainSplitRatio, setTrainSplitRatio] = useState<number>(80);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const targetItems = selectedCategory === 'all' 
    ? items 
    : items.filter((i) => i.categoryId === selectedCategory);

  const trainingData: TrainingDatasetExport = generateTrainingExport(targetItems);

  // Generate preview payload according to selected format
  const getExportPayload = (): { content: string; filename: string; mimeType: string } => {
    const timestamp = new Date().toISOString().split('T')[0];

    if (selectedFormat === 'yolo') {
      const yoloYaml = `# ===================================================
# LANDFILL WASTE SEPARATION SYSTEM - YOLOv8 DATASET CONFIG
# Generated: ${new Date().toISOString()}
# Total Samples: ${targetItems.length} Registered Waste Objects
# ===================================================

path: ./datasets/landfill_separation
train: images/train
val: images/val
test: images/test

# 6 Automated Sorter Chute Target Classes:
names:
  0: plastic          # Chute #1 - plastic.csv
  1: iron_aluminum    # Chute #2 - iron_aluminum.csv
  2: glass            # Chute #3 - glass.csv
  3: paper_cardboard  # Chute #4 - paper_wood.csv
  4: textile          # Chute #5 - textile.csv
  5: general_waste    # Chute #6 - general_waste.csv

# Multi-racur bounding annotation sample:
# <class-index> <x_center> <y_center> <width> <height>
${targetItems.slice(0, 10).map((it) => {
  const classIdx = CATEGORIES_CONFIG.findIndex((c) => c.id === it.categoryId);
  return `# ${it.id} (${it.name}) -> ${classIdx} 0.500 0.500 0.720 0.840`;
}).join('\n')}
... (${targetItems.length} total annotated bounding classes)
`;
      return { content: yoloYaml, filename: `yolov8_landfill_dataset_${timestamp}.yaml`, mimeType: 'text/yaml' };
    }

    if (selectedFormat === 'coco') {
      const cocoObj = {
        info: {
          description: "Landfill Separation Machine Multi-Angle Vision Dataset",
          version: "2.4.0",
          year: 2026,
          contributor: "Landfill Automation Vision System",
          date_created: new Date().toISOString(),
        },
        categories: CATEGORIES_CONFIG.map((c, idx) => ({
          id: idx + 1,
          name: c.id,
          supercategory: "waste_material",
          chute_number: c.chuteNumber,
          file_name: c.fileName,
        })),
        images: targetItems.flatMap((it) => 
          (it.images || []).map((img, imgIdx) => ({
            id: `${it.id}_${img.angle}`,
            file_name: `${it.id}_${img.angle}.jpg`,
            width: Math.round(it.widthCm * 50),
            height: Math.round(it.heightCm * 50),
            racur_angle: img.angle,
            parent_item_id: it.id,
          }))
        ),
        annotations: targetItems.map((it, idx) => ({
          id: idx + 1,
          image_id: `${it.id}_front`,
          category_id: CATEGORIES_CONFIG.findIndex((c) => c.id === it.categoryId) + 1,
          bbox: [50, 50, Math.round(it.widthCm * 35), Math.round(it.heightCm * 35)],
          area: Math.round(it.widthCm * it.heightCm * 100),
          iscrowd: 0,
        })),
      };
      return { 
        content: JSON.stringify(cocoObj, null, 2), 
        filename: `coco_landfill_annotations_${timestamp}.json`, 
        mimeType: 'application/json' 
      };
    }

    if (selectedFormat === 'csv') {
      const csvStr = convertItemsToCsv(targetItems);
      return { 
        content: csvStr, 
        filename: `landfill_items_export_${selectedCategory}_${timestamp}.csv`, 
        mimeType: 'text/csv' 
      };
    }

    if (selectedFormat === 'chute_router') {
      const routerConfig = {
        system: "Landfill Separation Chute Dispatcher Firmware v3.1",
        hardware_chutes: CATEGORIES_CONFIG.map((c) => ({
          chute_id: c.chuteNumber,
          category_key: c.id,
          target_file: c.fileName,
          pneumatic_actuator_pressure_psi: c.id === 'glass' ? 45 : c.id === 'iron_aluminum' ? 95 : 65,
          registered_item_count: targetItems.filter((i) => i.categoryId === c.id).length,
          item_ids: targetItems.filter((i) => i.categoryId === c.id).map((i) => i.id),
        })),
        telemetry_thresholds: {
          inductive_metal_threshold: 400,
          nir_plastic_pet_band_nm: 1660,
          uv_transmission_glass_min: 75,
        }
      };
      return { 
        content: JSON.stringify(routerConfig, null, 2), 
        filename: `chute_router_matrix_${timestamp}.json`, 
        mimeType: 'application/json' 
      };
    }

    // Default JSON
    return { 
      content: JSON.stringify(targetItems, null, 2), 
      filename: `landfill_separation_full_${timestamp}.json`, 
      mimeType: 'application/json' 
    };
  };

  const exportPayload = getExportPayload();

  const handleCopy = () => {
    navigator.clipboard.writeText(exportPayload.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(exportPayload.content, exportPayload.filename, exportPayload.mimeType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>AI Model Training & Sorter Export</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  {targetItems.length} Items Ready
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Package dataset annotations, multi-angle racur images, and chute routing weights
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Format Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Export Format Target
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => setSelectedFormat('yolo')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedFormat === 'yolo'
                    ? 'bg-slate-50 border-emerald-600 ring-2 ring-emerald-600/30'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-700">YOLOv8</span>
                  <span className="text-[10px] text-slate-400 font-mono">.yaml</span>
                </div>
                <div className="text-xs text-slate-600">Vision Computer Model</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('coco')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedFormat === 'coco'
                    ? 'bg-slate-50 border-emerald-600 ring-2 ring-emerald-600/30'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-700">COCO JSON</span>
                  <span className="text-[10px] text-slate-400 font-mono">.json</span>
                </div>
                <div className="text-xs text-slate-600">Instance Segmentation</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('csv')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedFormat === 'csv'
                    ? 'bg-slate-50 border-emerald-600 ring-2 ring-emerald-600/30'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-700">CSV Sheet</span>
                  <span className="text-[10px] text-slate-400 font-mono">.csv</span>
                </div>
                <div className="text-xs text-slate-600">Spreadsheet Matrix</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('chute_router')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedFormat === 'chute_router'
                    ? 'bg-slate-50 border-emerald-600 ring-2 ring-emerald-600/30'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-700">Chute Router</span>
                  <span className="text-[10px] text-slate-400 font-mono">.json</span>
                </div>
                <div className="text-xs text-slate-600">Machine PLC Matrix</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('json')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedFormat === 'json'
                    ? 'bg-slate-50 border-emerald-600 ring-2 ring-emerald-600/30'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-700">Full Raw</span>
                  <span className="text-[10px] text-slate-400 font-mono">.json</span>
                </div>
                <div className="text-xs text-slate-600">Complete Database</div>
              </button>
            </div>
          </div>

          {/* Configuration Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            {/* Category Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All 6 Categories ({items.length} total items)</option>
                {CATEGORIES_CONFIG.map((cat) => {
                  const count = items.filter((i) => i.categoryId === cat.id).length;
                  return (
                    <option key={cat.id} value={cat.id}>
                      Chute #{cat.chuteNumber}: {cat.name} ({count} items) - {cat.fileName}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Split & Options */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Train / Val Split Ratio</span>
                <span className="font-mono text-emerald-700">{trainSplitRatio}% Train / {100 - trainSplitRatio}% Val</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={trainSplitRatio}
                onChange={(e) => setTrainSplitRatio(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Code/Data Preview Window */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-600">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-slate-900">{exportPayload.filename}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-sans cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-800 shadow-inner">
              {exportPayload.content}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/80">
          <div className="text-xs text-slate-500 font-mono">
            {targetItems.length} objects ready for AI export
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download {exportPayload.filename.split('.').pop()?.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
