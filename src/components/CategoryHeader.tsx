import React from 'react';
import { 
  Boxes, 
  Wrench, 
  Wine, 
  Package, 
  Shirt, 
  Trash2, 
  FileText,
  Layers
} from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { CategoryId, WasteItem } from '../types';

interface CategoryHeaderProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  items: WasteItem[];
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  Boxes: <Boxes className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
  Wine: <Wine className="w-4 h-4" />,
  Package: <Package className="w-4 h-4" />,
  Shirt: <Shirt className="w-4 h-4" />,
  Trash2: <Trash2 className="w-4 h-4" />,
};

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  selectedCategory,
  onSelectCategory,
  items,
}) => {
  // Count items per category
  const itemCounts = CATEGORIES_CONFIG.reduce((acc, cat) => {
    acc[cat.id] = items.filter((it) => it.categoryId === cat.id).length;
    return acc;
  }, {} as Record<CategoryId, number>);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider font-mono">
            Separation Chutes (6)
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            5 Recyclable + 1 General Waste
          </span>
        </div>

        <button
          id="cat-filter-all"
          onClick={() => onSelectCategory('all')}
          className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white font-bold shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>All ({items.length})</span>
        </button>
      </div>

      {/* 6 Compact Modern Micro-Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
        {CATEGORIES_CONFIG.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = itemCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              id={`cat-card-${cat.id}`}
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
              className={`relative text-left px-2.5 py-1.5 rounded-lg border transition-all duration-150 overflow-hidden group flex items-center justify-between gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-slate-50 border-emerald-600 ring-1 ring-emerald-600/30 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color.primary }}
                  title={`Chute #${cat.chuteNumber}`}
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-1 leading-tight">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {cat.shortName}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      #{cat.chuteNumber}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono truncate">
                    {cat.fileName}
                  </div>
                </div>
              </div>

              <span 
                className={`font-mono font-bold text-[10px] px-1.5 py-0.2 rounded shrink-0 border ${
                  isSelected 
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
