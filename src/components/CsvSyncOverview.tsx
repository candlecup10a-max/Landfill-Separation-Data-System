import React from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Eye, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  ArrowDownToLine,
  Database
} from 'lucide-react';
import { CategoryId, RawCsvDataset, WasteItem } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { downloadFile } from '../utils/csvParser';

interface CsvSyncOverviewProps {
  datasets: Record<CategoryId, RawCsvDataset>;
  items: WasteItem[];
  onOpenCsvViewer: (categoryId: CategoryId) => void;
  onSyncWithCatalog: () => void;
}

export const CsvSyncOverview: React.FC<CsvSyncOverviewProps> = ({
  datasets,
  items,
  onOpenCsvViewer,
  onSyncWithCatalog,
}) => {
  const handleDownloadAll = () => {
    // Trigger download of each CSV
    CATEGORIES_CONFIG.forEach((cat) => {
      const ds = datasets[cat.id];
      if (ds) {
        downloadFile(ds.content, cat.fileName, 'text/csv');
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                6-Category CSV Dataset Files
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Direct linkage between machine chute dispatch and raw CSV training files
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSyncWithCatalog}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Sync registered items into raw CSV datasets"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sync Catalog & CSVs</span>
          </button>
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
            title="Download all 6 CSV files"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Download All 6 CSVs</span>
          </button>
        </div>
      </div>

      {/* 6 Category Files Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CATEGORIES_CONFIG.map((cat) => {
          const ds = datasets[cat.id];
          const catItems = items.filter((i) => i.categoryId === cat.id);
          const rawRowCount = ds ? ds.content.split('\n').filter((l) => l.trim().length > 0).length - 1 : 0;

          return (
            <div
              key={cat.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border"
                      style={{
                        backgroundColor: `${cat.color.primary}15`,
                        color: cat.color.primary,
                        borderColor: `${cat.color.primary}30`,
                      }}
                    >
                      CHUTE #{cat.chuteNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {cat.shortName}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-emerald-700 font-bold truncate">
                    {cat.fileName}
                  </div>
                </div>

                <button
                  onClick={() => downloadFile(ds.content, cat.fileName, 'text/csv')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-colors cursor-pointer shrink-0"
                  title={`Download ${cat.fileName}`}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Counts & Status */}
              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs font-mono text-slate-600">
                <span>{catItems.length} items ({rawRowCount} rows)</span>
                <button
                  onClick={() => onOpenCsvViewer(cat.id)}
                  className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>Inspect CSV</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
