import React, { useState } from 'react';
import { 
  FileCode2, 
  FileSpreadsheet, 
  Download, 
  Plus, 
  Trash2, 
  Search, 
  RotateCcw, 
  Edit2, 
  Check, 
  X, 
  Copy, 
  CheckCheck,
  Code,
  Table as TableIcon,
  ChevronDown,
  Info
} from 'lucide-react';
import { CategoryId, CategoryDataset, RawDatasetEntry } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { arrayToCsv, downloadFile, getInitialParsedDataset, parseCsv, flattenPlasticJson } from '../utils/csvParser';

interface RawDataScrollCellProps {
  datasets: Record<CategoryId, CategoryDataset>;
  onUpdateDataset: (categoryId: CategoryId, updated: CategoryDataset) => void;
  activeCategoryId?: CategoryId;
}

export const RawDataScrollCell: React.FC<RawDataScrollCellProps> = ({
  datasets,
  onUpdateDataset,
  activeCategoryId = 'plastic',
}) => {
  const [selectedCat, setSelectedCat] = useState<CategoryId>(activeCategoryId);
  const [viewFormat, setViewFormat] = useState<'table' | 'raw'>('table');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddingRow, setIsAddingRow] = useState<boolean>(false);
  const [newRowData, setNewRowData] = useState<Record<string, string>>({});
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editingRowData, setEditingRowData] = useState<Record<string, string>>({});
  const [rawTextDraft, setRawTextDraft] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const getDefaultDatasetForCat = (catId: CategoryId): CategoryDataset => {
    const init = getInitialParsedDataset(catId);
    const cfg = CATEGORIES_CONFIG.find((c) => c.id === catId);
    return {
      categoryId: catId,
      fileName: init.fileName,
      fileFormat: cfg?.fileType || 'csv',
      rawText: init.rawText,
      parsedRows: init.rows,
      lastModified: new Date().toISOString(),
    };
  };

  const currentDataset: CategoryDataset = datasets[selectedCat] || getDefaultDatasetForCat(selectedCat);
  const categoryConfig = CATEGORIES_CONFIG.find((c) => c.id === selectedCat) || CATEGORIES_CONFIG[0];

  // Dynamic headers extraction
  const headers = React.useMemo(() => {
    if (currentDataset.parsedRows && currentDataset.parsedRows.length > 0) {
      return Object.keys(currentDataset.parsedRows[0]).filter((k) => k !== 'id');
    }
    if (selectedCat === 'plastic') return ['Sector_ID', 'Sector_Name', 'Category_ID', 'Category_Name', 'Item_Examples'];
    if (selectedCat === 'iron_aluminum') return ['Category', 'Item_Name', 'Material'];
    if (selectedCat === 'glass') return ['Category'];
    if (selectedCat === 'paper_cardboard') return ['Category', 'Sub-Category', 'Item Name', 'Primary Wood Type'];
    if (selectedCat === 'textile') return ['Item_Category', 'Industry_Sector'];
    return ['Item_Name', 'Reason_Unclassified', 'Disposal_Chute'];
  }, [currentDataset, selectedCat]);

  // Filtered rows
  const filteredRows = React.useMemo(() => {
    const rows = currentDataset.parsedRows || [];
    if (!searchTerm.trim()) return rows;
    const q = searchTerm.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [currentDataset.parsedRows, searchTerm]);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleSwitchCategory = (catId: CategoryId) => {
    setSelectedCat(catId);
    setIsAddingRow(false);
    setEditingRowIndex(null);
    setSearchTerm('');
    setRawTextDraft(datasets[catId]?.rawText || '');
  };

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(currentDataset.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCurrentFile = () => {
    const filename = categoryConfig.fileName === 'empty' ? 'general-waste.csv' : categoryConfig.fileName;
    const mime = categoryConfig.fileType === 'json' ? 'application/json' : 'text/csv';
    downloadFile(filename, currentDataset.rawText, mime);
    showFeedback(`Downloaded ${filename} successfully`);
  };

  // Add Row
  const handleSaveNewRow = () => {
    const newId = currentDataset.parsedRows.length + 1;
    const rowToInsert: RawDatasetEntry = { id: newId, ...newRowData };
    const updatedRows = [...currentDataset.parsedRows, rowToInsert];

    // Rebuild raw text
    let updatedRaw = currentDataset.rawText;
    if (categoryConfig.fileType === 'csv' || categoryConfig.fileType === 'empty') {
      updatedRaw = arrayToCsv(['ID', ...headers], updatedRows.map((r) => ({ ID: r.id, ...r })));
    }

    onUpdateDataset(selectedCat, {
      ...currentDataset,
      parsedRows: updatedRows,
      rawText: updatedRaw,
      lastModified: new Date().toISOString(),
    });

    setIsAddingRow(false);
    setNewRowData({});
    showFeedback(`Added new record to ${categoryConfig.fileName}`);
  };

  // Delete Row
  const handleDeleteRow = (index: number) => {
    const updatedRows = currentDataset.parsedRows.filter((_, idx) => idx !== index);
    let updatedRaw = currentDataset.rawText;
    if (categoryConfig.fileType === 'csv' || categoryConfig.fileType === 'empty') {
      updatedRaw = arrayToCsv(['ID', ...headers], updatedRows.map((r, i) => ({ ID: i + 1, ...r })));
    }

    onUpdateDataset(selectedCat, {
      ...currentDataset,
      parsedRows: updatedRows,
      rawText: updatedRaw,
      lastModified: new Date().toISOString(),
    });

    showFeedback(`Removed record from ${categoryConfig.fileName}`);
  };

  // Inline Edit Row
  const handleStartEditRow = (index: number, row: RawDatasetEntry) => {
    setEditingRowIndex(index);
    setEditingRowData({ ...row });
  };

  const handleSaveEditRow = (index: number) => {
    const updatedRows = currentDataset.parsedRows.map((r, idx) =>
      idx === index ? { ...editingRowData, id: r.id } : r
    );

    let updatedRaw = currentDataset.rawText;
    if (categoryConfig.fileType === 'csv' || categoryConfig.fileType === 'empty') {
      updatedRaw = arrayToCsv(['ID', ...headers], updatedRows.map((r) => ({ ID: r.id, ...r })));
    }

    onUpdateDataset(selectedCat, {
      ...currentDataset,
      parsedRows: updatedRows,
      rawText: updatedRaw,
      lastModified: new Date().toISOString(),
    });

    setEditingRowIndex(null);
    showFeedback(`Updated record #${index + 1} in ${categoryConfig.fileName}`);
  };

  // Save Raw Text Draft (when user directly edits raw code/csv)
  const handleSaveRawText = () => {
    try {
      let parsedRows: RawDatasetEntry[] = [];
      if (categoryConfig.fileType === 'json') {
        JSON.parse(rawTextDraft); // validate JSON syntax
        parsedRows = flattenPlasticJson(rawTextDraft).rows;
      } else {
        const parsed = parseCsv(rawTextDraft);
        parsedRows = parsed.rows.map((r, idx) => ({ id: idx + 1, ...r }));
      }

      onUpdateDataset(selectedCat, {
        ...currentDataset,
        rawText: rawTextDraft,
        parsedRows,
        lastModified: new Date().toISOString(),
      });

      showFeedback(`Saved and validated ${categoryConfig.fileName}`);
    } catch (err: any) {
      alert(`Syntax error in file: ${err.message}`);
    }
  };

  // Reset category file to initial factory state
  const handleResetCurrentFile = () => {
    if (window.confirm(`Reset ${categoryConfig.fileName} to initial standard data?`)) {
      const init = getInitialParsedDataset(selectedCat);
      onUpdateDataset(selectedCat, {
        categoryId: selectedCat,
        fileName: init.fileName,
        fileFormat: categoryConfig.fileType,
        rawText: init.rawText,
        parsedRows: init.rows,
        lastModified: new Date().toISOString(),
      });
      setRawTextDraft(init.rawText);
      showFeedback(`Reset ${categoryConfig.fileName} to original data`);
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Category Tabs for the 6 Files */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
          {CATEGORIES_CONFIG.map((cat) => {
            const active = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                id={`btn-file-tab-${cat.id}`}
                onClick={() => handleSwitchCategory(cat.id)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono font-medium transition-all shrink-0 ${
                  active
                    ? 'bg-slate-100 text-slate-900 border border-emerald-600 shadow-2xs ring-1 ring-emerald-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: cat.color.primary }}
                />
                <span className="font-bold">{cat.fileName}</span>
                <span className="text-[10px] text-slate-400 font-sans hidden md:inline">
                  (#{cat.chuteNumber})
                </span>
              </button>
            );
          })}
        </div>

        {/* View Toggle (Table vs Raw Code) */}
        <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
          <button
            onClick={() => setViewFormat('table')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold transition-colors ${
              viewFormat === 'table'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3 h-3" />
            <span>Table View</span>
          </button>

          <button
            onClick={() => {
              setViewFormat('raw');
              setRawTextDraft(currentDataset.rawText);
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold transition-colors ${
              viewFormat === 'raw'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>Source</span>
          </button>
        </div>
      </div>

      {/* Main Scroll Down Cell Container */}
      <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs flex flex-col">
        {/* Cell Header with File Metadata & Action Bar */}
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="p-1 rounded-md border flex items-center justify-center font-mono text-xs font-bold"
              style={{
                backgroundColor: `${categoryConfig.color.primary}15`,
                color: categoryConfig.color.primary,
                borderColor: `${categoryConfig.color.primary}35`,
              }}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-xs font-bold text-slate-900 font-mono">
                  {categoryConfig.fileName}
                </h3>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {currentDataset.parsedRows?.length || 0} rows
                </span>
                <span
                  className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border"
                  style={{
                    backgroundColor: `${categoryConfig.color.primary}12`,
                    color: categoryConfig.color.primary,
                    borderColor: `${categoryConfig.color.primary}30`,
                  }}
                >
                  Chute #{categoryConfig.chuteNumber} • {categoryConfig.shortName}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 flex-wrap">
            {feedbackMsg && (
              <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 animate-pulse">
                ✓ {feedbackMsg}
              </span>
            )}

            <button
              onClick={handleDownloadCurrentFile}
              className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-md border border-slate-200 shadow-2xs transition-colors"
              title="Download this file"
            >
              <Download className="w-3 h-3" />
              <span className="text-[11px]">Download</span>
            </button>

            <button
              onClick={handleCopyRaw}
              className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-md border border-slate-200 shadow-2xs transition-colors"
              title="Copy contents"
            >
              {copied ? <CheckCheck className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleResetCurrentFile}
              className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md border border-slate-200 shadow-2xs"
              title="Reset this file to default values"
            >
              <RotateCcw className="w-3 h-3" />
            </button>

            {viewFormat === 'table' && (
              <button
                onClick={() => {
                  setIsAddingRow(!isAddingRow);
                  setNewRowData({});
                }}
                className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md shadow-2xs active:scale-95 transition-all"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
                <span className="text-[11px]">Add Row</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabular Data View with Scroll-Down Cell */}
        {viewFormat === 'table' ? (
          <div className="p-2.5 space-y-2">
            {/* Search filter in file */}
            <div className="flex items-center justify-between gap-3">
              <div className="relative max-w-xs w-full">
                <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${categoryConfig.fileName}...`}
                  className="w-full pl-7 pr-3 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                <Info className="w-3 h-3 text-slate-400" />
                <span>Showing {filteredRows.length} rows</span>
              </div>
            </div>

            {/* Add Row Form Bar */}
            {isAddingRow && (
              <div className="p-2.5 bg-slate-50 border border-emerald-500/40 rounded-lg space-y-1.5 animate-fadeIn shadow-2xs">
                <div className="text-xs font-bold text-emerald-800 flex items-center justify-between">
                  <span>Add New Record to {categoryConfig.fileName}</span>
                  <button
                    onClick={() => setIsAddingRow(false)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {headers.map((h) => (
                    <div key={h} className="space-y-0.5">
                      <label className="text-[9px] text-slate-500 font-mono">{h}</label>
                      <input
                        type="text"
                        value={newRowData[h] || ''}
                        onChange={(e) =>
                          setNewRowData({ ...newRowData, [h]: e.target.value })
                        }
                        placeholder={`Enter ${h}`}
                        className="w-full px-2 py-1 rounded bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-1.5 pt-1">
                  <button
                    onClick={() => setIsAddingRow(false)}
                    className="px-2 py-0.5 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNewRow}
                    className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md shadow-2xs"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* THE SCROLL DOWN CELL (Responsive Height & Smooth Scrollbar) */}
            <div className="h-[460px] lg:h-[520px] 2xl:h-[600px] overflow-y-auto overflow-x-auto rounded-lg border border-slate-200/90 bg-white shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-20 bg-slate-100 border-b border-slate-200/90 text-[9px] font-mono uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-2 px-2.5 w-10 bg-slate-100">#</th>
                    {headers.map((h) => (
                      <th key={h} className="py-2 px-2.5 bg-slate-100 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                    <th className="py-2 px-2.5 w-14 text-right bg-slate-100">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={headers.length + 2}
                        className="p-8 text-center text-slate-400 text-xs"
                      >
                        {selectedCat === 'general_waste' && currentDataset.parsedRows.length === 0
                          ? 'General waste dataset is currently empty. Click "Add Row" or register unclassified items.'
                          : 'No matching records found in this cell.'}
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, idx) => {
                      const isEditing = editingRowIndex === idx;

                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-emerald-50/30 transition-colors group ${
                            idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                          }`}
                        >
                          <td className="py-1.5 px-2.5 font-mono text-[10px] text-slate-400">
                            {idx + 1}
                          </td>

                          {headers.map((h) => (
                            <td key={h} className="py-1.5 px-2.5 text-slate-800">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editingRowData[h] ?? ''}
                                  onChange={(e) =>
                                    setEditingRowData({
                                      ...editingRowData,
                                      [h]: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-0.5 bg-white border border-emerald-500 rounded text-xs text-slate-900 font-mono"
                                />
                              ) : (
                                <span className="font-mono text-[11px] text-slate-800">
                                  {String(row[h] || '—')}
                                </span>
                              )}
                            </td>
                          ))}

                          <td className="py-1.5 px-2.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveEditRow(idx)}
                                    className="p-0.5 text-emerald-600 hover:text-emerald-700"
                                    title="Save"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => setEditingRowIndex(null)}
                                    className="p-0.5 text-slate-400 hover:text-slate-700"
                                    title="Cancel"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleStartEditRow(idx, row)}
                                    className="p-0.5 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Edit Row"
                                  >
                                    <Edit2 className="w-2.5 h-2.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRow(idx)}
                                    className="p-0.5 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete Row"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Raw Code / File Editor Mode */
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
              <span>Source Editor ({categoryConfig.fileName})</span>
              <button
                onClick={handleSaveRawText}
                className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md shadow-2xs"
              >
                Save Changes
              </button>
            </div>

            <textarea
              value={rawTextDraft}
              onChange={(e) => setRawTextDraft(e.target.value)}
              rows={16}
              className="w-full p-3 rounded-lg bg-slate-900 font-mono text-xs text-emerald-400 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed shadow-inner"
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};
