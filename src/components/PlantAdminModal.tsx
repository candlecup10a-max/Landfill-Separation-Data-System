import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  Check, 
  Factory, 
  Cpu, 
  Sliders, 
  Database,
  Gauge,
  Activity,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { PlantHardwareConfig, AuthUser, SystemAuditEntry } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';

interface PlantAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  hardwareConfig: PlantHardwareConfig;
  currentUser: AuthUser | null;
  auditLogs: SystemAuditEntry[];
  onSaveHardwareConfig: (config: PlantHardwareConfig) => void;
  onResetFactoryData: () => void;
  onSwitchOperator?: (user: AuthUser) => void;
}

export const PlantAdminModal: React.FC<PlantAdminModalProps> = ({
  isOpen,
  onClose,
  hardwareConfig,
  currentUser,
  auditLogs,
  onSaveHardwareConfig,
  onResetFactoryData,
}) => {
  const [conveyorSpeed, setConveyorSpeed] = useState<string>(hardwareConfig.conveyorSpeedMps.toString());
  const [pneumaticPressure, setPneumaticPressure] = useState<string>(hardwareConfig.pneumaticPressurePsi.toString());
  const [shutterSpeed, setShutterSpeed] = useState<string>(hardwareConfig.opticalShutterSpeedUs.toString());
  const [sampleRate, setSampleRate] = useState<string>(hardwareConfig.sensorSampleRateHz.toString());
  const [confidenceThreshold, setConfidenceThreshold] = useState<string>(hardwareConfig.minClassificationConfidence.toString());
  const [autoEject, setAutoEject] = useState<boolean>(hardwareConfig.autoEjectUncertainItems);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PlantHardwareConfig = {
      ...hardwareConfig,
      conveyorSpeedMps: parseFloat(conveyorSpeed) || 1.8,
      pneumaticPressurePsi: parseFloat(pneumaticPressure) || 92,
      opticalShutterSpeedUs: parseInt(shutterSpeed, 10) || 450,
      sensorSampleRateHz: parseInt(sampleRate, 10) || 250,
      minClassificationConfidence: parseInt(confidenceThreshold, 10) || 82,
      autoEjectUncertainItems: autoEject,
    };
    onSaveHardwareConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Central Plant Admin & Telemetry
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                {currentUser 
                  ? `Operator Station #${currentUser.badgeNumber} • Clearance Level ${currentUser.clearanceLevel} (${currentUser.role.toUpperCase()})`
                  : 'Operator Station: Guest Mode'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Active Operator Status */}
          {currentUser && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      {currentUser.badgeNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">{currentUser.roleTitle} • {currentUser.facility}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 font-medium">
                <UserCheck className="w-4 h-4" />
                <span>Authorized Shift: {currentUser.shift}</span>
              </div>
            </div>
          )}

          {/* Plant & Hardware Parameters */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
              <Factory className="w-4 h-4 text-emerald-600" />
              <span>Conveyor Line & Pneumatic Actuator Calibrations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Conveyor Belt Velocity</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={conveyorSpeed}
                    onChange={(e) => setConveyorSpeed(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500 font-mono">m/s</span>
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pneumatic Ejector Pressure</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="1"
                    value={pneumaticPressure}
                    onChange={(e) => setPneumaticPressure(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500 font-mono">PSI</span>
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  <span>Optical Camera Shutter</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="10"
                    value={shutterSpeed}
                    onChange={(e) => setShutterSpeed(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500 font-mono">μs</span>
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="text-[11px] font-bold text-slate-700">Sensor Telemetry Sample Rate</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="10"
                    value={sampleRate}
                    onChange={(e) => setSampleRate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500 font-mono">Hz</span>
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="text-[11px] font-bold text-slate-700">Min. Classification Confidence</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="1"
                    min="50"
                    max="99"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500 font-mono">%</span>
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                <label className="text-[11px] font-bold text-slate-700">Divert Uncertain Waste</label>
                <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={autoEject}
                    onChange={(e) => setAutoEject(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                  />
                  <span>Eject to Chute #6 if &lt; threshold</span>
                </label>
              </div>
            </div>
          </div>

          {/* 6-Chute Hardware Map */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-600" />
              <span>Pneumatic Chute Channel Hardware Map</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
              {CATEGORIES_CONFIG.map((cat) => (
                <div
                  key={cat.id}
                  className="p-2.5 rounded-xl border flex flex-col justify-between space-y-1 bg-white shadow-xs"
                  style={{ borderColor: `${cat.color.primary}40` }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-bold text-[10px] px-1.5 py-0.2 rounded"
                      style={{
                        backgroundColor: `${cat.color.primary}20`,
                        color: cat.color.primary,
                      }}
                    >
                      CHUTE #{cat.chuteNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">{cat.fileType.toUpperCase()}</span>
                  </div>
                  <div className="font-bold text-slate-900 text-[11px] truncate">{cat.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{cat.fileName}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Hardware & Calibration Audit Logs</span>
            </h3>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                        {log.category}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[10px]">{log.details}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Factory Reset */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Database className="w-4 h-4 text-amber-500" />
                <span>Reset Database & Seed Original Data</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all items and data to original seed records?')) {
                    onResetFactoryData();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Factory Reset</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Restore the initial 6 data files (plastic.json, iron-aluminium.csv, glass.csv, wood.csv, textile.csv, empty general waste) and preloaded test items with calibrated multi-racur image sets and sensor signatures.
            </p>
          </div>

          {/* Footer Save */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {savedSuccess ? (
              <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                Hardware calibration updated
              </span>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Hardware Calibration</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
