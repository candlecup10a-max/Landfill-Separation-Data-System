import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Play, 
  RotateCcw, 
  Cpu, 
  Scan, 
  Ruler, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Upload, 
  Trash2,
  Boxes,
  Wrench,
  Wine,
  Package,
  Shirt,
  Info,
  Activity
} from 'lucide-react';
import { WasteItem, CategoryId, MachineSortResult } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';

interface AISortingSimulatorProps {
  items: WasteItem[];
  onOpenAddItem: () => void;
}

export const AISortingSimulator: React.FC<AISortingSimulatorProps> = ({
  items,
  onOpenAddItem,
}) => {
  const [selectedItemForTest, setSelectedItemForTest] = useState<WasteItem | null>(items[0] || null);
  const [customTestName, setCustomTestName] = useState<string>('Unidentified Metallized Foil Pouch');
  const [customTestMaterial, setCustomTestMaterial] = useState<string>('Composite Multi-layer Polymer/Foil');
  const [customHeight, setCustomHeight] = useState<string>('18');
  const [customWidth, setCustomWidth] = useState<string>('12');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [testMode, setTestMode] = useState<'catalog' | 'custom'>('catalog');

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0); // 0: Idle, 1: Scanning, 2: NIR Spectral Analysis, 3: Chute Separation Ejected
  const [activeSortResult, setActiveSortResult] = useState<MachineSortResult | null>(null);
  
  // Historical sorting log
  const [sortHistory, setSortHistory] = useState<MachineSortResult[]>([]);
  const [chuteStats, setChuteStats] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  });

  // Execute AI Sorting Classification
  const runSortingAlgorithm = () => {
    setIsSimulating(true);
    setSimulationStep(1);
    setActiveSortResult(null);

    const testItem = testMode === 'catalog' && selectedItemForTest
      ? selectedItemForTest
      : {
          id: 'TEST-CUSTOM',
          name: customTestName,
          material: customTestMaterial,
          heightCm: parseFloat(customHeight) || 15,
          widthCm: parseFloat(customWidth) || 10,
          categoryId: 'general_waste' as CategoryId,
          images: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

    // Step 1: Laser & Racur Vision Scan
    setTimeout(() => {
      setSimulationStep(2);

      // Step 2: Spectral & Material Matching
      setTimeout(() => {
        setSimulationStep(3);

        const matLower = testItem.material.toLowerCase();
        const nameLower = testItem.name.toLowerCase();

        let detectedCat: CategoryId = 'general_waste';
        let targetChute = 6;
        let confidence = 0.94;
        let reason = '';
        let matchedRef = testItem.id;

        // Rule-based classification based on the 5 target registered materials
        if (
          matLower.includes('pet') ||
          matLower.includes('hdpe') ||
          matLower.includes('pvc') ||
          matLower.includes('ldpe') ||
          matLower.includes('polypropylene') ||
          matLower.includes('polystyrene') ||
          matLower.includes('abs') ||
          matLower.includes('plastic') ||
          testItem.categoryId === 'plastic'
        ) {
          detectedCat = 'plastic';
          targetChute = 1;
          confidence = 0.96;
          reason = 'Multi-racur optical profile & NIR absorption peak (1660nm) matched registered polymer standard (plastic.json).';
        } else if (
          matLower.includes('iron') ||
          matLower.includes('steel') ||
          matLower.includes('aluminum') ||
          matLower.includes('metal') ||
          testItem.categoryId === 'iron_aluminum'
        ) {
          detectedCat = 'iron_aluminum';
          targetChute = 2;
          confidence = 0.98;
          reason = 'Inductive eddy-current sensor & high electromagnetic response matched metal product standard (iron-aluminium.csv).';
        } else if (
          matLower.includes('glass') ||
          matLower.includes('silica') ||
          matLower.includes('borosilicate') ||
          testItem.categoryId === 'glass'
        ) {
          detectedCat = 'glass';
          targetChute = 3;
          confidence = 0.95;
          reason = 'High refractive index (1.52) & high optical transparency matched glass standard (glass.csv).';
        } else if (
          matLower.includes('wood') ||
          matLower.includes('paper') ||
          matLower.includes('cardboard') ||
          matLower.includes('timber') ||
          matLower.includes('cellulose') ||
          testItem.categoryId === 'paper_cardboard'
        ) {
          detectedCat = 'paper_cardboard';
          targetChute = 4;
          confidence = 0.93;
          reason = 'Cellulose fibrous structure & low density signature matched paper/wood standard (wood.csv).';
        } else if (
          matLower.includes('cotton') ||
          matLower.includes('fabric') ||
          matLower.includes('textile') ||
          matLower.includes('denim') ||
          matLower.includes('polyester fiber') ||
          matLower.includes('wool') ||
          testItem.categoryId === 'textile'
        ) {
          detectedCat = 'textile';
          targetChute = 5;
          confidence = 0.91;
          reason = 'Flexible woven pattern & tactile reflectance matched textile standard (textile.csv).';
        } else {
          // Unclassified / Mixed / Composite -> Chute 6: General Waste
          detectedCat = 'general_waste';
          targetChute = 6;
          confidence = 0.88;
          reason = 'Non-standard composite/unrecognized material signature. Diverted safely to Chute #6 (Landfill General Waste).';
        }

        const result: MachineSortResult = {
          detectedCategory: detectedCat,
          targetChute,
          confidence,
          matchedItemId: testItem.id,
          matchedItemName: testItem.name,
          matchedMaterial: testItem.material,
          detectedDimensions: {
            heightCm: testItem.heightCm,
            widthCm: testItem.widthCm,
          },
          classificationReason: reason,
          spectralFeatures: {
            reflectivity: detectedCat === 'glass' || detectedCat === 'plastic' ? 0.85 : 0.45,
            density: detectedCat === 'iron_aluminum' ? 7.8 : detectedCat === 'glass' ? 2.5 : 0.9,
            transparency: detectedCat === 'glass' || matLower.includes('pet'),
            magnetic: matLower.includes('iron') || matLower.includes('steel'),
            flexibility: detectedCat === 'textile' ? 'Flexible' : detectedCat === 'glass' ? 'Brittle' : 'Rigid',
          },
          sortedAt: new Date().toLocaleTimeString(),
        };

        setActiveSortResult(result);
        setSortHistory((prev) => [result, ...prev.slice(0, 9)]);
        setChuteStats((prev) => ({
          ...prev,
          [targetChute]: (prev[targetChute] || 0) + 1,
        }));
        setIsSimulating(false);
      }, 900);
    }, 900);
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setCustomImageUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const activeCategoryConfig = activeSortResult
    ? CATEGORIES_CONFIG.find((c) => c.id === activeSortResult.detectedCategory)
    : null;

  return (
    <div className="space-y-4">
      {/* Simulation Chute Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {CATEGORIES_CONFIG.map((cat) => (
          <div
            key={cat.id}
            className="p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs"
          >
            <div className="flex items-center justify-between text-[10px]">
              <span
                className="font-mono font-bold px-1.5 py-0.2 rounded border text-[9px]"
                style={{
                  backgroundColor: `${cat.color.primary}18`,
                  color: cat.color.primary,
                  borderColor: `${cat.color.primary}40`,
                }}
              >
                CHUTE #{cat.chuteNumber}
              </span>
              <span className="text-slate-600 font-mono text-[10px] font-medium truncate">{cat.shortName}</span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-lg font-bold font-mono text-slate-900">
                {chuteStats[cat.chuteNumber] || 0}
              </span>
              <span className="text-[9px] text-slate-500 font-mono">Sorted</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Testing Chute Machine Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Feed Infeed & Test Parameters */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Separation Machine Infeed</h3>
                  <p className="text-[10px] text-slate-500 font-mono">6-chute optical & spectral classifier</p>
                </div>
              </div>

              {/* Mode toggle */}
              <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => setTestMode('catalog')}
                  className={`px-2 py-0.5 rounded-md transition-colors text-[11px] ${
                    testMode === 'catalog' ? 'bg-emerald-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Catalog
                </button>
                <button
                  onClick={() => setTestMode('custom')}
                  className={`px-2 py-0.5 rounded-md transition-colors text-[11px] ${
                    testMode === 'custom' ? 'bg-emerald-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {testMode === 'catalog' ? (
              /* Select from registered products */
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Target Product for Infeed:
                </label>
                <select
                  value={selectedItemForTest?.id || ''}
                  onChange={(e) => {
                    const it = items.find((i) => i.id === e.target.value);
                    if (it) setSelectedItemForTest(it);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                >
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.id}] {item.name} ({item.material})
                    </option>
                  ))}
                </select>

                {selectedItemForTest && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                    <div className="w-14 h-14 bg-white rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                      {selectedItemForTest.images?.[0] ? (
                        <img
                          src={selectedItemForTest.images[0].url}
                          alt={selectedItemForTest.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Boxes className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="text-xs space-y-0.5 overflow-hidden">
                      <div className="font-bold text-slate-900 truncate text-xs">{selectedItemForTest.name}</div>
                      <div className="text-[11px] text-emerald-700 font-mono font-medium">{selectedItemForTest.material}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {selectedItemForTest.heightCm} × {selectedItemForTest.widthCm} cm • {selectedItemForTest.images?.length || 0} training angles
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Custom Test Waste */
              <div className="space-y-2">
                <div className="space-y-0.5">
                  <label className="text-[10px] text-slate-500 font-mono font-medium">Description</label>
                  <input
                    type="text"
                    value={customTestName}
                    onChange={(e) => setCustomTestName(e.target.value)}
                    placeholder="e.g. Potato chip pouch, ceramic mug, milk carton"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-[10px] text-slate-500 font-mono font-medium">Material Composition</label>
                  <input
                    type="text"
                    value={customTestMaterial}
                    onChange={(e) => setCustomTestMaterial(e.target.value)}
                    placeholder="e.g. Multi-layer laminate, ceramic, unknown"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-mono font-medium">Height (cm)</label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-mono font-medium">Width (cm)</label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900"
                    />
                  </div>
                </div>

                {/* Upload custom sample photo */}
                <div className="relative border border-dashed border-slate-300 rounded-lg p-2 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{customImageUrl ? 'Photo Attached (Click to change)' : 'Upload Sample Photo'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Launch Sorter Button */}
            <button
              id="btn-run-sorting-sim"
              onClick={runSortingAlgorithm}
              disabled={isSimulating}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 shadow-sm active:scale-98 transition-all"
            >
              {isSimulating ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-white" />
                  <span>Optical Chute Scanning...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Feed Item into Chute Sorter</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Registration Helper */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1.5 shadow-xs">
            <div className="font-bold text-emerald-700 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Separation Logic Matrix</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
              Items registered in the 5 categories (Plastic, Metal, Glass, Paper/Wood, Textile) are cleanly recognized and ejected to Chutes #1–#5. Unregistered or composite items divert to <strong>Chute #6 (General Waste)</strong>.
            </p>
          </div>
        </div>

        {/* Right Column: Live Sorter Chute & Sensor Telemetry */}
        <div className="lg:col-span-7 space-y-3">
          {/* Sorter Conveyor & Diverter Animation Stage */}
          <div className="relative min-h-[380px] lg:min-h-[440px] 2xl:min-h-[500px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between p-4 shadow-sm">
            {/* Stage Top Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-white font-bold">SORT-CHUTE SCANNER #1</span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span>Status: <strong className={isSimulating ? 'text-amber-400' : 'text-emerald-400'}>{isSimulating ? 'EVALUATING' : 'READY'}</strong></span>
                <span>Belt: <strong className="text-white">2.4 m/s</strong></span>
              </div>
            </div>

            {/* Conveyor Belt & Optical Sensor Field */}
            <div className="relative flex-1 flex items-center justify-center my-3 overflow-hidden">
              {/* Conveyor lines */}
              <div className="absolute inset-x-0 h-20 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-around overflow-hidden shadow-inner">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-full bg-slate-800 ${isSimulating ? 'animate-pulse' : ''}`}
                  />
                ))}
              </div>

              {/* Scanning Laser Line when active */}
              {isSimulating && (
                <div className="absolute inset-y-0 w-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-laserScan z-20 pointer-events-none" />
              )}

              {/* The Product on Conveyor */}
              <div className="relative z-10 p-2.5 bg-slate-800 rounded-xl border border-slate-700 shadow-lg flex flex-col items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                  {testMode === 'catalog' && selectedItemForTest?.images?.[0] ? (
                    <img
                      src={selectedItemForTest.images[0].url}
                      alt="Active test item"
                      className="w-full h-full object-contain"
                    />
                  ) : customImageUrl ? (
                    <img
                      src={customImageUrl}
                      alt="Custom waste"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Boxes className="w-8 h-8 text-emerald-400" />
                  )}
                </div>

                <span className="text-[10px] font-mono font-bold text-slate-200 mt-0.5 max-w-[120px] truncate text-center">
                  {testMode === 'catalog' && selectedItemForTest ? selectedItemForTest.name : customTestName}
                </span>
              </div>

              {/* Chute Separation Diverter Arm indicators */}
              <div className="absolute bottom-0.5 inset-x-3 flex justify-between text-[9px] font-mono text-slate-500">
                <span>[INLET]</span>
                <span>[LASER NIR PROFILER]</span>
                <span>[PNEUMATIC EJECTOR]</span>
              </div>
            </div>

            {/* Active Classification Diagnosis Banner */}
            {activeSortResult ? (
              <div
                className="p-3 rounded-lg border flex items-center justify-between gap-3 animate-fadeIn"
                style={{
                  backgroundColor: `${activeCategoryConfig?.color.primary}18`,
                  borderColor: `${activeCategoryConfig?.color.primary}50`,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="p-2 rounded-lg border font-mono text-xs font-bold shrink-0"
                    style={{
                      backgroundColor: `${activeCategoryConfig?.color.primary}30`,
                      color: activeCategoryConfig?.color.primary,
                      borderColor: `${activeCategoryConfig?.color.primary}60`,
                    }}
                  >
                    CHUTE #{activeSortResult.targetChute}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {activeCategoryConfig?.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-emerald-400 border border-slate-700">
                        {(activeSortResult.confidence * 100).toFixed(0)}% Confidence
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-mono">
                      {activeSortResult.classificationReason}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono text-[9px] text-slate-400 hidden sm:block">
                  <div>Ref: {activeCategoryConfig?.fileName}</div>
                  <div>Time: {activeSortResult.sortedAt}</div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-400 text-center font-mono">
                {isSimulating
                  ? simulationStep === 1
                    ? '⚡ PHASE 1: Laser Profiler measuring dimensions...'
                    : '⚡ PHASE 2: Spectral NIR matching against material database...'
                  : 'Ready. Press "Feed Item into Chute Sorter" to run separation cycle.'}
              </div>
            )}
          </div>

          {/* Historical Separation Log */}
          {sortHistory.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2 shadow-xs">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center justify-between">
                <span>Recent Machine Sorting Log</span>
                <span className="text-slate-400 font-mono">Last 10 cycles</span>
              </h4>

              <div className="divide-y divide-slate-100 font-mono text-xs">
                {sortHistory.map((item, idx) => {
                  const conf = CATEGORIES_CONFIG.find((c) => c.id === item.detectedCategory);
                  return (
                    <div key={idx} className="py-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-1.5 py-0.2 rounded text-[9px] font-bold border"
                          style={{
                            backgroundColor: `${conf?.color.primary}18`,
                            color: conf?.color.primary,
                            borderColor: `${conf?.color.primary}40`,
                          }}
                        >
                          CHUTE #{item.targetChute}
                        </span>
                        <span className="text-slate-800 font-sans font-medium text-xs">{item.matchedItemName}</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-[10px] text-slate-500">
                        <span className="text-emerald-700 font-bold">{(item.confidence * 100).toFixed(0)}%</span>
                        <span className="text-slate-400">{item.sortedAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
