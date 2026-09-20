import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  Upload, 
  RefreshCw, 
  Save, 
  Check, 
  AlertCircle,
  Plus,
  Trash2,
  Table as TableIcon,
  Code
} from 'lucide-react';
import { CategoryId, RawCsvDataset } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { parseCsvToMatrix, matrixToCsv, downloadFile } from '../utils/csvParser';

interface CsvViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasets: Record<CategoryId, RawCsvDataset>;
  onUpdateDataset: (categoryId: CategoryId, newCsvContent: string) => void;
  defaultCategoryId?: CategoryId;
}

export const CsvViewerModal: React.FC<CsvViewerModalProps> = ({
  isOpen,
  onClose,
  datasets,
  onUpdateDataset,
  defaultCategoryId = 'plastic',
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>(defaultCategoryId);
  const [viewMode, setViewMode] = useState<'table' | 'raw'>('table');
  const [rawText, setRawText] = useState<string>('');
  const [matrixData, setMatrixData] = useState<{ headers: string[]; rows: string[][] }>({ headers: [], rows: [] });
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    setActiveCategory(defaultCategoryId);
  }, [defaultCategoryId, isOpen]);

  useEffect(() => {
    const currentDataset = datasets[activeCategory];
    if (currentDataset) {
      setRawText(currentDataset.content);
      const parsed = parseCsvToMatrix(currentDataset.content);
      setMatrixData(parsed);
    }
  }, [activeCategory, datasets]);

  if (!isOpen) return null;

  const currentCategoryConfig = CATEGORIES_CONFIG.find((c) => c.id === activeCategory) || CATEGORIES_CONFIG[0];

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...matrixData.rows];
    if (newRows[rowIndex]) {
      newRows[rowIndex] = [...newRows[rowIndex]];
      newRows[rowIndex][colIndex] = value;
      const updatedMatrix = { ...matrixData, rows: newRows };
      setMatrixData(updatedMatrix);
      const newCsv = matrixToCsv(updatedMatrix.headers, updatedMatrix.rows);
      setRawText(newCsv);
    }
  };

  const handleAddRow = () => {
    const emptyRow = new Array(matrixData.headers.length).fill('');
    const newRows = [...matrixData.rows, emptyRow];
    const updatedMatrix = { ...matrixData, rows: newRows };
    setMatrixData(updatedMatrix);
    const newCsv = matrixToCsv(updatedMatrix.headers, updatedMatrix.rows);
    setRawText(newCsv);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newRows = matrixData.rows.filter((_, idx) => idx !== rowIndex);
    const updatedMatrix = { ...matrixData, rows: newRows };
    setMatrixData(updatedMatrix);
    const newCsv = matrixToCsv(updatedMatrix.headers, updatedMatrix.rows);
    setRawText(newCsv);
  };

  const handleSave = () => {
    onUpdateDataset(activeCategory, rawText);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(rawText, currentCategoryConfig.fileName, 'text/csv');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
        const parsed = parseCsvToMatrix(content);
        setMatrixData(parsed);
        onUpdateDataset(activeCategory, content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Landfill CSV Matrix Manager</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {currentCategoryConfig.fileName}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Inspect, edit and synchronize the 6 raw category datasets for the sorting system
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

        {/* Category Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto">
          {CATEGORIES_CONFIG.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Chute #{cat.chuteNumber}: {cat.fileName}
              </button>
            );
          })}
        </div>

        {/* Body Toolbar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Interactive Table</span>
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'raw' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Raw CSV Text</span>
              </button>
            </div>

            {viewMode === 'table' && (
              <button
                onClick={handleAddRow}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Import CSV</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .csv</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors cursor-pointer"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {viewMode === 'table' ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 font-mono text-[11px] text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    {matrixData.headers.map((h, i) => (
                      <th key={i} className="py-2.5 px-3 border-r border-slate-200 font-bold uppercase">
                        {h}
                      </th>
                    ))}
                    <th className="py-2.5 px-3 w-12 text-center">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {matrixData.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50">
                      <td className="py-2 px-2 text-center text-[10px] text-slate-400 font-mono">
                        {rIdx + 1}
                      </td>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-1 px-2 border-r border-slate-100">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                            className="w-full px-2 py-1 text-xs text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded"
                          />
                        </td>
                      ))}
                      <td className="py-1 px-2 text-center">
                        <button
                          onClick={() => handleDeleteRow(rIdx)}
                          className="p-1 text-slate-300 hover:text-rose-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <textarea
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                setMatrixData(parseCsvToMatrix(e.target.value));
              }}
              className="w-full h-80 p-4 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 font-mono">
          <span>
            {matrixData.rows.length} rows loaded from {currentCategoryConfig.fileName}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-200 bg-white border border-slate-200 cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
