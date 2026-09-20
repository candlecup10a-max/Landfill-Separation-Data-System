import { WasteItem, CategoryDataset, CategoryId, RawDatasetEntry } from '../types';
import { INITIAL_REGISTERED_ITEMS, CATEGORIES_CONFIG } from '../data/initialData';
import { getInitialParsedDataset } from './csvParser';
import { generateDefaultSensorTelemetry } from './sensorPresets';

const STORAGE_KEYS = {
  ITEMS: 'landfill_separation_registered_items_v2',
  DATASETS: 'landfill_separation_raw_datasets_v2',
  SETTINGS: 'landfill_separation_settings_v2',
};

// Initialize datasets dictionary
export function loadAllDatasets(): Record<CategoryId, CategoryDataset> {
  const defaultDatasets: Record<CategoryId, CategoryDataset> = {} as any;

  CATEGORIES_CONFIG.forEach((cat) => {
    const init = getInitialParsedDataset(cat.id);
    defaultDatasets[cat.id] = {
      categoryId: cat.id,
      fileName: init.fileName,
      fileFormat: cat.fileType,
      rawText: init.rawText,
      parsedRows: init.rows,
      lastModified: new Date().toISOString(),
    };
  });

  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DATASETS);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults in case of any missing keys
      return { ...defaultDatasets, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load raw datasets from localStorage', e);
  }

  return defaultDatasets;
}

export function saveAllDatasets(datasets: Record<CategoryId, CategoryDataset>) {
  try {
    localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(datasets));
  } catch (e) {
    console.error('Failed to save raw datasets to localStorage', e);
  }
}

// Load registered items catalog
export function loadRegisteredItems(): WasteItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure any existing items without sensorTelemetry get auto-backfilled
        return parsed.map((item) => {
          if (!item.sensorTelemetry) {
            return {
              ...item,
              sensorTelemetry: generateDefaultSensorTelemetry(item.categoryId, item.material),
            };
          }
          return item;
        });
      }
    }
  } catch (e) {
    console.error('Failed to load registered items from localStorage', e);
  }
  return INITIAL_REGISTERED_ITEMS.map((item) => ({
    ...item,
    sensorTelemetry: item.sensorTelemetry || generateDefaultSensorTelemetry(item.categoryId, item.material),
  }));
}

export function saveRegisteredItems(items: WasteItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save registered items to localStorage', e);
  }
}

// Reset everything to factory defaults
export function resetSystemToDefault(): {
  items: WasteItem[];
  datasets: Record<CategoryId, CategoryDataset>;
} {
  try {
    localStorage.removeItem(STORAGE_KEYS.ITEMS);
    localStorage.removeItem(STORAGE_KEYS.DATASETS);
  } catch (e) {
    console.error('Failed to clear storage', e);
  }

  const defaultDatasets: Record<CategoryId, CategoryDataset> = {} as any;
  CATEGORIES_CONFIG.forEach((cat) => {
    const init = getInitialParsedDataset(cat.id);
    defaultDatasets[cat.id] = {
      categoryId: cat.id,
      fileName: init.fileName,
      fileFormat: cat.fileType,
      rawText: init.rawText,
      parsedRows: init.rows,
      lastModified: new Date().toISOString(),
    };
  });

  saveRegisteredItems(INITIAL_REGISTERED_ITEMS);
  saveAllDatasets(defaultDatasets);

  return {
    items: INITIAL_REGISTERED_ITEMS,
    datasets: defaultDatasets,
  };
}
