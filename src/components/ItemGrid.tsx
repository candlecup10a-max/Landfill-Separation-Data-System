import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Eye, 
  Plus, 
  Ruler, 
  Layers, 
  Image as ImageIcon,
  ArrowUpDown,
  Grid,
  List as ListIcon,
  LayoutList,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Weight,
  Sparkles,
  Camera,
  ChevronRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { WasteItem, CategoryId, RacurAngle } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';

interface ItemGridProps {
  items: WasteItem[];
  selectedCategory: CategoryId | 'all';
  onSelectItem: (item: WasteItem) => void;
  onEditItem: (item: WasteItem) => void;
  onDeleteItem: (itemId: string) => void;
  onBatchDelete: (itemIds: string[]) => void;
  onAddNew: () => void;
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  selectedCategory,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  onBatchDelete,
  onAddNew,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'table'>('list');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'size' | 'racurs' | 'date'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.id.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.material.toLowerCase().includes(query) ||
      (item.subCategory && item.subCategory.toLowerCase().includes(query)) ||
      (item.industrySector && item.industrySector.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let result = 0;
    if (sortBy === 'id') {
      result = a.id.localeCompare(b.id, undefined, { numeric: true });
    } else if (sortBy === 'name') {
      result = a.name.localeCompare(b.name);
    } else if (sortBy === 'size') {
      const volA = a.heightCm * a.widthCm * (a.depthCm || 1);
      const volB = b.heightCm * b.widthCm * (b.depthCm || 1);
      result = volA - volB;
    } else if (sortBy === 'racurs') {
      result = (a.images?.length || 0) - (b.images?.length || 0);
    } else if (sortBy === 'date') {
      result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return sortOrder === 'asc' ? result : -result;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === sortedItems.length && sortedItems.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedItems.map((i) => i.id)));
    }
  };

  const toggleSelectItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Delete ${selectedIds.size} selected items?`)) {
      onBatchDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const currentCategoryConfig = CATEGORIES_CONFIG.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-2.5">
      {/* Control Bar: Search, Sort, View Toggle, Batch Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200/90 shadow-2xs">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, name, material..."
            className="w-full pl-7 pr-4 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[11px] font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sorting & View Mode & Actions */}
        <div className="flex items-center gap-1.5 flex-wrap justify-between sm:justify-end">
          {/* Batch delete if items selected */}
          {selectedIds.size > 0 && (
            <button
              onClick={handleBatchDelete}
              className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors shadow-2xs"
            >
              <Trash2 className="w-3 h-3 text-rose-600" />
              <span>Delete ({selectedIds.size})</span>
            </button>
          )}

          {/* Sort selector */}
          <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-400 text-[9px] uppercase font-bold tracking-tight">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none text-[11px] cursor-pointer py-0.5"
            >
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="racurs">Racurs</option>
              <option value="date">Date</option>
            </select>
            <button
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="p-0.5 text-slate-400 hover:text-slate-700"
              title={`Order: ${sortOrder.toUpperCase()}`}
            >
              <ArrowUpDown className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* View mode buttons: List, Grid, Table */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-md text-xs transition-all ${
                viewMode === 'list' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Detailed List View"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-md text-xs transition-all ${
                viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded-md text-xs transition-all ${
                viewMode === 'table' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="btn-register-item"
            onClick={onAddNew}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Header filter status */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 font-mono">
        <div className="flex items-center gap-2">
          <span>
            <strong className="text-slate-900 font-bold">{sortedItems.length}</strong> of{' '}
            <strong className="text-slate-900 font-bold">{items.length}</strong> items
          </span>
          {selectedCategory !== 'all' && currentCategoryConfig && (
            <span
              className="text-[9px] font-bold px-1.5 py-0.2 rounded border"
              style={{
                backgroundColor: `${currentCategoryConfig.color.primary}12`,
                color: currentCategoryConfig.color.primary,
                borderColor: `${currentCategoryConfig.color.primary}35`,
              }}
            >
              {currentCategoryConfig.shortName} ({currentCategoryConfig.fileName})
            </span>
          )}
        </div>

        <button
          onClick={toggleSelectAll}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          {selectedIds.size === sortedItems.length && sortedItems.length > 0 ? (
            <CheckSquare className="w-3 h-3 text-emerald-600" />
          ) : (
            <Square className="w-3 h-3 text-slate-400" />
          )}
          <span>Select All</span>
        </button>
      </div>

      {/* View Switcher: List vs Grid vs Table */}
      {sortedItems.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center space-y-2 bg-white shadow-2xs">
          <Layers className="w-6 h-6 text-slate-400 mx-auto" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">No items found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm
              ? `No items matching "${searchTerm}". Try a different query or category filter.`
              : 'Start registering items into this category for the Landfill Separation Machine algorithm.'}
          </p>
          <button
            id="btn-register-item-empty"
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Item</span>
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* COMPACT DETAILED ITEMS LIST VIEW */
        <div className="space-y-1.5">
          {sortedItems.map((item) => {
            const catConfig = CATEGORIES_CONFIG.find((c) => c.id === item.categoryId) || CATEGORIES_CONFIG[0];
            const isChecked = selectedIds.has(item.id);
            const mainImg = item.images?.[0];

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`group relative bg-white rounded-lg border p-2 sm:px-3 sm:py-2 transition-all duration-150 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 hover:shadow-2xs hover:border-slate-300 ${
                  isChecked
                    ? 'border-emerald-600 ring-1 ring-emerald-600/30 bg-emerald-50/15'
                    : 'border-slate-200/90 shadow-2xs'
                }`}
              >
                {/* Left Section: Checkbox + Image + Identification */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <button
                    onClick={(e) => toggleSelectItem(item.id, e)}
                    className="text-slate-400 hover:text-slate-800 shrink-0"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Square className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Compact Thumbnail */}
                  <div className="relative w-11 h-11 bg-slate-50 rounded-lg overflow-hidden border border-slate-200/90 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-slate-300">
                    {mainImg ? (
                      <img
                        src={mainImg.url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="text-slate-400 text-[9px] font-mono">None</div>
                    )}
                    <span className="absolute bottom-0.5 right-0.5 bg-white/95 px-1 py-0.1 rounded text-[7px] font-mono font-bold text-slate-700 border border-slate-200">
                      {item.images?.length || 0}r
                    </span>
                  </div>

                  {/* Item Core Details */}
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-100 px-1 py-0.2 rounded border border-slate-200">
                        {item.id}
                      </span>
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border"
                        style={{
                          backgroundColor: `${catConfig.color.primary}12`,
                          color: catConfig.color.primary,
                          borderColor: `${catConfig.color.primary}30`,
                        }}
                      >
                        #{catConfig.chuteNumber} {catConfig.shortName}
                      </span>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                        {item.name}
                      </span>
                    </div>

                    {/* Meta Spec Badges */}
                    <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-500 font-mono">
                      <span className="font-medium text-emerald-800 bg-emerald-50/80 px-1 py-0.1 rounded border border-emerald-200/80">
                        {item.material}
                      </span>
                      <div className="flex items-center gap-0.5 text-slate-500">
                        <Ruler className="w-2.5 h-2.5 text-slate-400" />
                        <span>{item.heightCm}×{item.widthCm}{item.depthCm ? `×${item.depthCm}` : ''}cm</span>
                      </div>
                      {item.weightGrams && (
                        <div className="flex items-center gap-0.5 text-slate-500">
                          <Weight className="w-2.5 h-2.5 text-slate-400" />
                          <span>{item.weightGrams}g</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section: Action Buttons */}
                <div
                  className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onSelectItem(item)}
                    className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md shadow-2xs transition-colors"
                    title="Inspect Product & Racurs"
                  >
                    <Eye className="w-3 h-3 text-slate-500" />
                    <span className="text-[11px]">View</span>
                  </button>

                  <button
                    onClick={() => onEditItem(item)}
                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-md shadow-2xs transition-colors"
                    title="Edit Item"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${item.name} (${item.id})?`)) {
                        onDeleteItem(item.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-md shadow-2xs transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === 'grid' ? (
        /* COMPACT CARD GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
          {sortedItems.map((item) => {
            const catConfig = CATEGORIES_CONFIG.find((c) => c.id === item.categoryId) || CATEGORIES_CONFIG[0];
            const isChecked = selectedIds.has(item.id);
            const mainImg = item.images?.[0];

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`group relative bg-white rounded-lg border transition-all duration-150 overflow-hidden cursor-pointer flex flex-col justify-between hover:shadow-sm hover:border-slate-300 ${
                  isChecked
                    ? 'border-emerald-600 ring-1 ring-emerald-600/30 bg-emerald-50/10'
                    : 'border-slate-200/90 shadow-2xs'
                }`}
              >
                {/* Top Bar with Chute & Select Box */}
                <div className="p-1.5 flex items-center justify-between border-b border-slate-100 bg-slate-50/60">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => toggleSelectItem(item.id, e)}
                      className="text-slate-400 hover:text-slate-800"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Square className="w-3 h-3" />
                      )}
                    </button>
                    <span className="font-mono text-[10px] font-bold text-slate-900">{item.id}</span>
                  </div>

                  <span
                    className="text-[8px] font-mono font-bold px-1 py-0.2 rounded border"
                    style={{
                      backgroundColor: `${catConfig.color.primary}12`,
                      color: catConfig.color.primary,
                      borderColor: `${catConfig.color.primary}30`,
                    }}
                  >
                    #{catConfig.chuteNumber}
                  </span>
                </div>

                {/* Multi-angle Preview Thumbnail */}
                <div className="relative aspect-square bg-slate-50 flex items-center justify-center p-2 overflow-hidden border-b border-slate-100">
                  {mainImg ? (
                    <img
                      src={mainImg.url}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="text-slate-400 text-[10px] font-mono">No racur</div>
                  )}

                  {/* Multi-racur count badge */}
                  <div className="absolute bottom-1 right-1 bg-white/95 border border-slate-200 px-1 py-0.1 rounded text-[8px] font-mono font-semibold text-emerald-700 flex items-center gap-0.5 shadow-2xs">
                    <ImageIcon className="w-2 h-2" />
                    <span>{item.images?.length || 0}r</span>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-2 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 leading-tight">
                      {item.name}
                    </h3>
                    
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      {item.material}
                    </div>
                  </div>

                  {/* Dimensions & Quick Actions */}
                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-500">
                    <span>{item.heightCm}×{item.widthCm}cm</span>

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditItem(item);
                        }}
                        className="p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Edit Item"
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete ${item.name}?`)) {
                            onDeleteItem(item.id);
                          }
                        }}
                        className="p-0.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Item"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* COMPACT HIGH DENSITY TABLE VIEW */
        <div className="bg-white rounded-lg border border-slate-200/90 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[9px] uppercase font-bold tracking-wider text-slate-500 border-b border-slate-200/90 font-mono">
                <tr>
                  <th className="py-2 px-2.5 w-7">
                    <button onClick={toggleSelectAll}>
                      {selectedIds.size === sortedItems.length && sortedItems.length > 0 ? (
                        <CheckSquare className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Square className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-2 px-2">ID</th>
                  <th className="py-2 px-2">Product Name</th>
                  <th className="py-2 px-2">Chute & Category</th>
                  <th className="py-2 px-2">Material</th>
                  <th className="py-2 px-2">Dims (cm)</th>
                  <th className="py-2 px-2 text-center">Racurs</th>
                  <th className="py-2 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedItems.map((item, idx) => {
                  const catConfig = CATEGORIES_CONFIG.find((c) => c.id === item.categoryId) || CATEGORIES_CONFIG[0];
                  const isChecked = selectedIds.has(item.id);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors text-xs ${
                        isChecked ? 'bg-emerald-50/30' : idx % 2 === 1 ? 'bg-slate-50/20' : 'bg-white'
                      }`}
                    >
                      <td className="py-1.5 px-2.5" onClick={(e) => toggleSelectItem(item.id, e)}>
                        {isChecked ? (
                          <CheckSquare className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Square className="w-3 h-3 text-slate-400" />
                        )}
                      </td>
                      <td className="py-1.5 px-2 font-mono font-bold text-slate-900 text-[11px]">{item.id}</td>
                      <td className="py-1.5 px-2 font-semibold text-slate-900 max-w-xs truncate">{item.name}</td>
                      <td className="py-1.5 px-2">
                        <span
                          className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border"
                          style={{
                            backgroundColor: `${catConfig.color.primary}12`,
                            color: catConfig.color.primary,
                            borderColor: `${catConfig.color.primary}30`,
                          }}
                        >
                          #{catConfig.chuteNumber} {catConfig.shortName}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-slate-600 font-mono text-[10px]">{item.material}</td>
                      <td className="py-1.5 px-2 font-mono text-slate-600 text-[11px]">{item.heightCm}×{item.widthCm}</td>
                      <td className="py-1.5 px-2 text-center">
                        <span className="font-mono px-1 py-0.2 rounded bg-slate-100 text-emerald-700 font-bold text-[9px] border border-slate-200">
                          {item.images?.length || 0}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectItem(item)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                            title="Inspect"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onEditItem(item)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                            title="Edit"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${item.name}?`)) {
                                onDeleteItem(item.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

