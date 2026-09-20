import React, { useState } from 'react';
import { 
  Download, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  BarChart2, 
  Layers, 
  Database, 
  Copy, 
  CheckCheck,
  FileSpreadsheet,
  Cpu,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { WasteItem, CategoryDataset, CategoryId } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { generateTrainingExport, downloadFile } from '../utils/csvParser';
import { SYSTEM_GUIDE_MARKDOWN } from '../data/systemGuideContent';

interface DatasetExporterProps {
  items: WasteItem[];
  datasets: Record<CategoryId, CategoryDataset>;
}

export const DatasetExporter: React.FC<DatasetExporterProps> = ({
  items,
  datasets,
}) => {
  const [activeExportFormat, setActiveExportFormat] = useState<'manifest' | 'yolo' | 'coco' | 'csv' | 'guide'>('manifest');
  const [copied, setCopied] = useState<boolean>(false);

  const exportData = React.useMemo(() => {
    return generateTrainingExport(items);
  }, [items]);

  const handleCopyCurrent = () => {
    let text = '';
    if (activeExportFormat === 'manifest') text = exportData.multimodalManifest;
    else if (activeExportFormat === 'yolo') text = exportData.yoloYaml;
    else if (activeExportFormat === 'coco') text = exportData.cocoJson;
    else if (activeExportFormat === 'csv') text = exportData.csvSummary;
    else if (activeExportFormat === 'guide') text = SYSTEM_GUIDE_MARKDOWN;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCurrent = () => {
    if (activeExportFormat === 'manifest') {
      downloadFile('landfill_ai_training_manifest.json', exportData.multimodalManifest, 'application/json');
    } else if (activeExportFormat === 'yolo') {
      downloadFile('dataset.yaml', exportData.yoloYaml, 'text/yaml');
    } else if (activeExportFormat === 'coco') {
      downloadFile('coco_annotations.json', exportData.cocoJson, 'application/json');
    } else if (activeExportFormat === 'csv') {
      downloadFile('landfill_separation_master.csv', exportData.csvSummary, 'text/csv');
    } else if (activeExportFormat === 'guide') {
      downloadFile('SYSTEM_GUIDE.md', SYSTEM_GUIDE_MARKDOWN, 'text/markdown');
    }
  };

  const stats = exportData.stats;

  return (
    <div className="space-y-4">
      {/* Overview Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs space-y-0.5">
          <div className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-500">Total Registered Products</div>
          <div className="text-xl font-bold font-mono text-slate-900">{stats.totalItems}</div>
          <div className="text-[10px] text-emerald-700 font-mono font-medium">Across 6 separation chutes</div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs space-y-0.5">
          <div className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-500">Multi-Angle Image Racurs</div>
          <div className="text-xl font-bold font-mono text-emerald-700">{stats.totalImages}</div>
          <div className="text-[10px] text-slate-500 font-mono">
            Avg <strong className="text-slate-800">{stats.averageAnglesPerItem}</strong> angles / product
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs space-y-0.5">
          <div className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-500">Primary Material Classes</div>
          <div className="text-xl font-bold font-mono text-teal-700">5 Recyclable</div>
          <div className="text-[10px] text-slate-500 font-mono">+ 1 General Waste Chute</div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs space-y-0.5">
          <div className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-500">Training Readiness</div>
          <div className="text-xl font-bold font-mono text-amber-600">98.4%</div>
          <div className="text-[10px] text-emerald-700 font-mono font-medium">✓ Sensors Calibrated</div>
        </div>
      </div>

      {/* Class Balance & Angle Coverage Diagnostic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Class Distribution Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-3.5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Category Class Distribution for ML Training</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">6 Target Channels</span>
          </div>

          <div className="space-y-2.5">
            {CATEGORIES_CONFIG.map((cat) => {
              const count = stats.classBreakdown[cat.id] || 0;
              const pct = stats.totalItems > 0 ? (count / stats.totalItems) * 100 : 0;

              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: cat.color.primary }}
                      />
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({cat.fileName})</span>
                    </span>
                    <span className="font-mono text-slate-600 text-xs">
                      {count} items ({pct.toFixed(0)}%)
                    </span>
                  </div>

                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.color.primary,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Angle Coverage Diagnostic */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-3.5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>Multi-Racur Angle Coverage</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">360° Vision</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(stats.angleCoverage).map(([angle, count]) => (
              <div
                key={angle}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <span className="font-mono uppercase text-[11px] text-slate-600 font-medium">{angle}</span>
                <span className="font-mono font-bold text-emerald-700 text-xs">{count} captures</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
            <div className="font-semibold text-slate-800 mb-0.5 text-xs">Computer Vision Angle Balance</div>
            <p className="text-[10px] text-slate-500 font-mono leading-relaxed">High racur angle coverage ensures the sorting machine correctly identifies items regardless of conveyor orientation.</p>
          </div>
        </div>
      </div>

      {/* Export Format Viewer & Package Downloader */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Header Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveExportFormat('manifest')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeExportFormat === 'manifest'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Multi-Modal JSON Manifest</span>
            </button>

            <button
              onClick={() => setActiveExportFormat('yolo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeExportFormat === 'yolo'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>YOLOv8 YAML</span>
            </button>

            <button
              onClick={() => setActiveExportFormat('coco')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeExportFormat === 'coco'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>COCO Spec</span>
            </button>

            <button
              onClick={() => setActiveExportFormat('csv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeExportFormat === 'csv'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Master CSV</span>
            </button>

            <button
              id="btn-export-system-guide"
              onClick={() => setActiveExportFormat('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeExportFormat === 'guide'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>SYSTEM_GUIDE.md</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCurrent}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 shadow-xs"
            >
              {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadCurrent}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {activeExportFormat === 'guide'
                  ? 'Download SYSTEM_GUIDE.md'
                  : 'Download Package'}
              </span>
            </button>
          </div>
        </div>

        {/* Code Preview Box */}
        <div className="p-3">
          <pre className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[380px] leading-relaxed shadow-inner whitespace-pre-wrap">
            {activeExportFormat === 'manifest' && exportData.multimodalManifest}
            {activeExportFormat === 'yolo' && exportData.yoloYaml}
            {activeExportFormat === 'coco' && exportData.cocoJson}
            {activeExportFormat === 'csv' && exportData.csvSummary}
            {activeExportFormat === 'guide' && SYSTEM_GUIDE_MARKDOWN}
          </pre>
        </div>
      </div>
    </div>
  );
};
