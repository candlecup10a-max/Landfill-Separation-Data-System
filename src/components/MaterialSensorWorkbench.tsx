import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Magnet, 
  Sparkles, 
  Waves, 
  Radio, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Zap,
  Gauge,
  HelpCircle,
  Sliders,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { SensorTelemetry, CategoryId } from '../types';
import { MATERIAL_SENSOR_PRESETS } from '../utils/sensorPresets';

interface MaterialSensorWorkbenchProps {
  telemetry: SensorTelemetry;
  onChange: (updated: SensorTelemetry) => void;
  categoryId: CategoryId;
  materialName: string;
  isLiveTesting?: boolean;
}

export const MaterialSensorWorkbench: React.FC<MaterialSensorWorkbenchProps> = ({
  telemetry,
  onChange,
  categoryId,
  materialName,
  isLiveTesting = false,
}) => {
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(null);
  const [isSensorSimulating, setIsSensorSimulating] = useState<boolean>(false);
  const [showDetailedInfo, setShowDetailedInfo] = useState<boolean>(false);

  // Apply a preset
  const handleApplyPreset = (presetIndex: number) => {
    setActivePresetIndex(presetIndex);
    const preset = MATERIAL_SENSOR_PRESETS[presetIndex];
    if (preset) {
      onChange({ ...preset.telemetry });
    }
  };

  // Simulate contact pulse on sensing device plate
  const triggerSensorPulse = () => {
    setIsSensorSimulating(true);
    setTimeout(() => {
      setIsSensorSimulating(false);
    }, 700);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 shadow-xs">
      {/* Sensor Workbench Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-xs">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Multimodal Material Sensor Matrix
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                ACTIVE SENSING
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Detects material physics upon approach & physical contact (Metal, Glass, Plastic, Paper, Textile)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDetailedInfo(!showDetailedInfo)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>{showDetailedInfo ? 'Hide Sensor Docs' : 'Sensor Principles'}</span>
          </button>

          <button
            type="button"
            onClick={triggerSensorPulse}
            disabled={isSensorSimulating}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs active:scale-95 transition-all"
          >
            <Zap className={`w-3.5 h-3.5 ${isSensorSimulating ? 'animate-spin' : 'fill-current'}`} />
            <span>{isSensorSimulating ? 'Calibrating...' : 'Pulse Sensor'}</span>
          </button>
        </div>
      </div>

      {/* Educational Sensor Principles Overview */}
      {showDetailedInfo && (
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-2 font-mono">
          <div className="font-bold text-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>How the Device Detects Materials:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-600">
            <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-200/60">
              <strong className="text-amber-900 block font-bold mb-0.5">1. Inductive & Magnetic</strong>
              <span>Detects ferrous iron (magnetic) vs. non-ferrous aluminum cans via high-frequency eddy-current coil.</span>
            </div>
            <div className="p-2 rounded-lg bg-cyan-50/50 border border-cyan-200/60">
              <strong className="text-cyan-900 block font-bold mb-0.5">2. NIR Spectrometer (1400-2300nm)</strong>
              <span>Measures molecular polymer vibration peaks (1660nm PET, 1730nm HDPE, 1450nm Cellulose).</span>
            </div>
            <div className="p-2 rounded-lg bg-purple-50/50 border border-purple-200/60">
              <strong className="text-purple-900 block font-bold mb-0.5">3. Touch Hardness & Capacitive</strong>
              <span>Acoustic tap and dielectric sensors distinguish glass (brittle/dielectric 7.2) from soft textiles (damping &lt;20).</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Calibration Material Presets */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono flex items-center justify-between">
          <span>Quick Calibration Presets (Click to calibrate sensors):</span>
          <span className="text-[10px] text-slate-400 font-normal">Matching Category: {categoryId}</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {MATERIAL_SENSOR_PRESETS.map((preset, idx) => {
            const isSelected = activePresetIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {preset.materialName}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4-Zone Live Sensor Instrumentation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* SENSOR 1: INDUCTIVE / EDDY CURRENT (METALS) */}
        <div className={`p-3 rounded-xl border bg-white space-y-2 transition-all ${
          telemetry.inductiveResponse > 200 ? 'border-amber-400 ring-1 ring-amber-400/20 bg-amber-50/20' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono">
              <Magnet className="w-3.5 h-3.5 text-amber-600" />
              <span>Inductive Coil (Metals)</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
              telemetry.inductiveResponse > 600 ? 'bg-rose-100 text-rose-800' : telemetry.inductiveResponse > 200 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
            }`}>
              {telemetry.inductiveResponse > 600 ? 'FERROUS (IRON)' : telemetry.inductiveResponse > 200 ? 'NON-FERROUS (ALU)' : 'NON-METALLIC'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-600">
              <span>Coil Saturation:</span>
              <strong className="text-slate-900">{telemetry.inductiveResponse} / 1023</strong>
            </div>
            <input
              type="range"
              min="0"
              max="1023"
              step="5"
              value={telemetry.inductiveResponse}
              onChange={(e) =>
                onChange({
                  ...telemetry,
                  inductiveResponse: parseInt(e.target.value, 10),
                  isMagnetic: parseInt(e.target.value, 10) > 650,
                  dominantModality: parseInt(e.target.value, 10) > 200 ? 'Inductive' : telemetry.dominantModality,
                })
              }
              className="w-full accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <label className="flex items-center gap-2 text-[11px] font-mono text-slate-700 cursor-pointer pt-0.5">
            <input
              type="checkbox"
              checked={telemetry.isMagnetic}
              onChange={(e) => onChange({ ...telemetry, isMagnetic: e.target.checked })}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Magnetic Pull Detected</span>
          </label>
        </div>

        {/* SENSOR 2: NIR SPECTROMETER (PLASTICS & CELLULOSE) */}
        <div className={`p-3 rounded-xl border bg-white space-y-2 transition-all ${
          telemetry.nirWavelengthNm > 0 ? 'border-emerald-400 ring-1 ring-emerald-400/20 bg-emerald-50/20' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono">
              <Waves className="w-3.5 h-3.5 text-emerald-600" />
              <span>NIR Spectrometer</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              {telemetry.nirWavelengthNm > 0 ? `${telemetry.nirWavelengthNm} nm` : 'OFF'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-600">
              <span>Peak Absorption:</span>
              <strong className="text-slate-900">
                {telemetry.nirWavelengthNm === 1660
                  ? '1660nm (PET Resin)'
                  : telemetry.nirWavelengthNm === 1730
                  ? '1730nm (HDPE/PP)'
                  : telemetry.nirWavelengthNm === 1450
                  ? '1450nm (Cellulose)'
                  : telemetry.nirWavelengthNm > 0
                  ? `${telemetry.nirWavelengthNm}nm`
                  : 'No Absorption'}
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="2400"
              step="10"
              value={telemetry.nirWavelengthNm}
              onChange={(e) =>
                onChange({
                  ...telemetry,
                  nirWavelengthNm: parseInt(e.target.value, 10),
                })
              }
              className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Reflectance: {Math.round(telemetry.opticalReflectance * 100)}%</span>
            <span>Resin Match: {telemetry.sensorConfidence}%</span>
          </div>
        </div>

        {/* SENSOR 3: OPTICAL UV/VIS & DIELECTRIC (GLASS VS PLASTIC) */}
        <div className={`p-3 rounded-xl border bg-white space-y-2 transition-all ${
          telemetry.uvTransmissionPercent > 50 ? 'border-cyan-400 ring-1 ring-cyan-400/20 bg-cyan-50/20' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>UV/Vis Light & Dielectric</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
              telemetry.uvTransmissionPercent > 70 ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-500'
            }`}>
              {telemetry.uvTransmissionPercent > 70 ? 'GLASS (HIGH UV)' : 'OPAQUE/PLASTIC'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-600">
              <span>UV Light Passage:</span>
              <strong className="text-slate-900">{telemetry.uvTransmissionPercent}% Transmitted</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={telemetry.uvTransmissionPercent}
              onChange={(e) =>
                onChange({
                  ...telemetry,
                  uvTransmissionPercent: parseInt(e.target.value, 10),
                })
              }
              className="w-full accent-cyan-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Dielectric (ε): {telemetry.capacitiveDielectric}</span>
            <span>Gloss: {telemetry.opticalReflectance > 0.8 ? 'High Specular' : 'Matte'}</span>
          </div>
        </div>

        {/* SENSOR 4: TOUCH IMPACT & ACOUSTIC DAMPING (TEXTILES & WOOD) */}
        <div className={`p-3 rounded-xl border bg-white space-y-2 transition-all ${
          telemetry.surfaceHardnessDamping < 25 ? 'border-purple-400 ring-1 ring-purple-400/20 bg-purple-50/20' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono">
              <Activity className="w-3.5 h-3.5 text-purple-600" />
              <span>Contact Plate Damping</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
              telemetry.surfaceHardnessDamping < 25 ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {telemetry.surfaceHardnessDamping < 25 ? 'TEXTILE / SOFT' : telemetry.surfaceHardnessDamping > 80 ? 'RIGID / HARD' : 'MEDIUM'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-600">
              <span>Hardness & Tap Resistance:</span>
              <strong className="text-slate-900">{telemetry.surfaceHardnessDamping} / 100</strong>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={telemetry.surfaceHardnessDamping}
              onChange={(e) =>
                onChange({
                  ...telemetry,
                  surfaceHardnessDamping: parseInt(e.target.value, 10),
                  dominantModality: parseInt(e.target.value, 10) < 25 ? 'Tactile/Damping' : telemetry.dominantModality,
                })
              }
              className="w-full accent-purple-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Primary Sensor: {telemetry.dominantModality}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
