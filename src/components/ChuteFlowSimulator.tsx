import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Activity,
  Radio,
  Gauge,
  Zap,
  Info,
  Sliders,
  Settings
} from 'lucide-react';
import { WasteItem, CategoryId } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';

interface ChuteFlowSimulatorProps {
  items: WasteItem[];
  onSelectItem?: (item: WasteItem) => void;
}

interface SimulatedConveyorObject {
  id: string;
  item: WasteItem;
  xPercent: number; // 0 (start) to 100 (exit)
  speed: number;
  stage: 'approaching' | 'optical_scan' | 'sensor_fusion' | 'diverted' | 'discharged';
  detectedChute: number;
  targetChute: number;
  divertProgress: number;
  sensorLog: {
    inductive: number;
    nir: number;
    uv: number;
    damping: number;
  };
}

export const ChuteFlowSimulator: React.FC<ChuteFlowSimulatorProps> = ({
  items,
  onSelectItem,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [conveyorSpeed, setConveyorSpeed] = useState<number>(1);
  const [activeObjects, setActiveObjects] = useState<SimulatedConveyorObject[]>([]);
  const [totalSortedCount, setTotalSortedCount] = useState<number>(0);
  const [chuteStats, setChuteStats] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  });
  const [lastScannedItem, setLastScannedItem] = useState<WasteItem | null>(null);
  const [scanPulse, setScanPulse] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Spawn an item onto conveyor
  const spawnItemOnBelt = (specificItem?: WasteItem) => {
    const itemToSpawn = specificItem || items[Math.floor(Math.random() * items.length)];
    if (!itemToSpawn) return;

    const catConfig = CATEGORIES_CONFIG.find((c) => c.id === itemToSpawn.categoryId) || CATEGORIES_CONFIG[0];
    const targetChute = catConfig.chuteNumber;

    const newObj: SimulatedConveyorObject = {
      id: `sim_${Date.now()}_${Math.random()}`,
      item: itemToSpawn,
      xPercent: 0,
      speed: 14 * conveyorSpeed, // percent per second
      stage: 'approaching',
      detectedChute: targetChute,
      targetChute: targetChute,
      divertProgress: 0,
      sensorLog: {
        inductive: itemToSpawn.sensorTelemetry?.inductiveResponse || 0,
        nir: itemToSpawn.sensorTelemetry?.nirWavelengthNm || 0,
        uv: itemToSpawn.sensorTelemetry?.uvTransmissionPercent || 0,
        damping: itemToSpawn.sensorTelemetry?.surfaceHardnessDamping || 50,
      }
    };

    setActiveObjects((prev) => [...prev, newObj]);
  };

  // Main simulation tick loop
  useEffect(() => {
    if (!isRunning) return;

    const tick = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setActiveObjects((prev) => {
        const next: SimulatedConveyorObject[] = [];

        prev.forEach((obj) => {
          let updated = { ...obj };
          updated.xPercent += updated.speed * dt;

          // Stage transitions along conveyor:
          // 0% - 25%: approaching
          // 25% - 40%: optical scan
          // 40% - 55%: sensor fusion
          // 55% - 90%: chute diverter
          // 90%+: discharged

          if (updated.xPercent >= 25 && updated.xPercent < 40) {
            updated.stage = 'optical_scan';
            if (lastScannedItem?.id !== updated.item.id) {
              setLastScannedItem(updated.item);
              setScanPulse(true);
              setTimeout(() => setScanPulse(false), 300);
            }
          } else if (updated.xPercent >= 40 && updated.xPercent < 55) {
            updated.stage = 'sensor_fusion';
          } else if (updated.xPercent >= 55 && updated.xPercent < 90) {
            // Divert down appropriate chute
            updated.stage = 'diverted';
            updated.divertProgress = Math.min(100, updated.divertProgress + dt * 60);
          } else if (updated.xPercent >= 90) {
            updated.stage = 'discharged';
            // Count stat
            setTotalSortedCount((c) => c + 1);
            setChuteStats((stats) => ({
              ...stats,
              [updated.targetChute]: (stats[updated.targetChute] || 0) + 1,
            }));
            return; // remove from belt
          }

          next.push(updated);
        });

        return next;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, conveyorSpeed, lastScannedItem]);

  // Periodic auto-spawner when running
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      if (activeObjects.length < 4) {
        spawnItemOnBelt();
      }
    }, 2800 / conveyorSpeed);
    return () => clearInterval(interval);
  }, [isRunning, conveyorSpeed, activeObjects.length, items]);

  const handleReset = () => {
    setActiveObjects([]);
    setTotalSortedCount(0);
    setChuteStats({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    setLastScannedItem(null);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 overflow-hidden shadow-2xl p-4 sm:p-6 space-y-6">
      {/* Simulator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                Industrial 6-Chute Sorter Flow Simulator
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PLC SIMULATOR v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Live conveyor belt simulation with multi-angle optical detection & pneumatic chute diversion
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-md cursor-pointer ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            <span>{isRunning ? 'Halt Conveyor' : 'Start Sorter'}</span>
          </button>

          <button
            onClick={() => spawnItemOnBelt()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Drop Item</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            title="Reset Simulation Stats"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed selector */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-mono">
            {[0.5, 1, 2].map((sp) => (
              <button
                key={sp}
                onClick={() => setConveyorSpeed(sp)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  conveyorSpeed === sp
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Conveyor Belt & 6 Sorting Chutes */}
      <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-hidden min-h-[280px]">
        {/* Top Scanning Stations Banner */}
        <div className="grid grid-cols-12 gap-2 text-[10px] font-mono mb-3 text-slate-400">
          <div className="col-span-3 border-l-2 border-slate-700 pl-2">
            1. FEEDER INLET (0% - 25%)
          </div>
          <div className="col-span-3 border-l-2 border-cyan-500 pl-2 text-cyan-400">
            2. OPTICAL VISION CAMERAS (25% - 40%)
          </div>
          <div className="col-span-3 border-l-2 border-purple-500 pl-2 text-purple-400">
            3. MULTIMODAL SENSORS (40% - 55%)
          </div>
          <div className="col-span-3 border-l-2 border-emerald-500 pl-2 text-emerald-400">
            4. 6-CHUTE DIVERTERS (55% - 100%)
          </div>
        </div>

        {/* The Conveyor Track */}
        <div className="relative h-24 bg-slate-900 rounded-xl border border-slate-800 flex items-center overflow-hidden shadow-inner">
          {/* Moving Conveyor Belt Pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #334155, #334155 10px, #1e293b 10px, #1e293b 20px)',
              animation: isRunning ? `conveyorBelt ${1 / conveyorSpeed}s linear infinite` : 'none',
            }}
          />

          {/* Station Markers */}
          {/* Station 1: Optical Camera Gantry */}
          <div className="absolute left-[30%] -top-1 bottom-0 w-12 border-x border-cyan-500/40 bg-cyan-950/20 flex flex-col items-center justify-between pointer-events-none z-10">
            <span className="text-[8px] font-mono text-cyan-400 bg-cyan-950 px-1 rounded-b">CAM</span>
            <div className={`w-full h-1 bg-cyan-400/80 ${scanPulse ? 'shadow-[0_0_12px_#06b6d4]' : ''}`} />
          </div>

          {/* Station 2: Sensor Gantry */}
          <div className="absolute left-[45%] -top-1 bottom-0 w-12 border-x border-purple-500/40 bg-purple-950/20 flex flex-col items-center justify-between pointer-events-none z-10">
            <span className="text-[8px] font-mono text-purple-400 bg-purple-950 px-1 rounded-b">SENS</span>
            <div className="w-full h-1 bg-purple-400/80" />
          </div>

          {/* Animated items moving across conveyor */}
          {activeObjects.map((obj) => {
            const catConfig = CATEGORIES_CONFIG.find((c) => c.id === obj.item.categoryId) || CATEGORIES_CONFIG[0];
            const img = obj.item.images?.[0];

            return (
              <div
                key={obj.id}
                className="absolute z-20 flex flex-col items-center transition-transform pointer-events-auto cursor-pointer"
                style={{
                  left: `${obj.xPercent}%`,
                  transform: `translateX(-50%) translateY(${obj.stage === 'diverted' ? (obj.divertProgress * 0.4) : 0}px)`,
                }}
                onClick={() => onSelectItem?.(obj.item)}
              >
                {/* Product Avatar Box */}
                <div 
                  className="w-12 h-12 rounded-xl bg-slate-800 border flex items-center justify-center p-1 shadow-lg relative group"
                  style={{ borderColor: catConfig.color.primary }}
                >
                  {img ? (
                    <img
                      src={img.url}
                      alt={obj.item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-[8px] font-mono font-bold" style={{ color: catConfig.color.primary }}>
                      {obj.item.id}
                    </span>
                  )}
                  {/* Tooltip on hover */}
                  <div className="absolute -top-7 whitespace-nowrap bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {obj.item.name}
                  </div>
                </div>

                {/* ID and Status Pill */}
                <span 
                  className="mt-1 text-[8px] font-mono font-bold px-1 rounded shadow-xs"
                  style={{
                    backgroundColor: `${catConfig.color.primary}33`,
                    color: catConfig.color.primary,
                  }}
                >
                  #{obj.targetChute}
                </span>
              </div>
            );
          })}
        </div>

        {/* 6 Automated Separation Chute Bins */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4">
          {CATEGORIES_CONFIG.map((cat) => {
            const count = chuteStats[cat.chuteNumber] || 0;
            return (
              <div
                key={cat.id}
                className="p-3 rounded-xl border bg-slate-900/90 flex flex-col justify-between space-y-2 transition-all hover:bg-slate-900 shadow-md"
                style={{ borderColor: `${cat.color.primary}44` }}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span 
                    className="font-bold text-[11px] px-1.5 py-0.2 rounded border"
                    style={{
                      backgroundColor: `${cat.color.primary}20`,
                      color: cat.color.primary,
                      borderColor: `${cat.color.primary}40`,
                    }}
                  >
                    CHUTE #{cat.chuteNumber}
                  </span>
                  <span className="text-slate-400 text-[10px] font-bold">{count} sorted</span>
                </div>

                <div>
                  <div className="text-xs font-bold text-white truncate">{cat.shortName}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{cat.fileName}</div>
                </div>

                {/* Simulated Pneumatic Actuator status */}
                <div className="flex items-center justify-between text-[9px] font-mono pt-1 border-t border-slate-800 text-slate-400">
                  <span>ACTUATOR</span>
                  <span className="text-emerald-400 font-bold">READY (65 PSI)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Telemetry Sensor Fusion Readout */}
      {lastScannedItem && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h3 className="text-xs font-bold font-mono text-white uppercase">
                Last Optical & Multimodal Telemetry: {lastScannedItem.name} ({lastScannedItem.id})
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              DISPATCH TO CHUTE #{CATEGORIES_CONFIG.find((c) => c.id === lastScannedItem.categoryId)?.chuteNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Material & Resin:</span>
              <strong className="text-emerald-400">{lastScannedItem.material}</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Dimensions:</span>
              <strong className="text-white">{lastScannedItem.heightCm} × {lastScannedItem.widthCm} cm</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Registered Racurs:</span>
              <strong className="text-cyan-400">{lastScannedItem.images?.length || 0} camera angles</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Inductive Saturation:</span>
              <strong className="text-amber-400">{lastScannedItem.sensorTelemetry?.inductiveResponse || 0} / 1023</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
