import React, { useState } from 'react';
import { 
  Activity, 
  Camera, 
  Radio, 
  Magnet, 
  Waves, 
  Wind, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  RotateCw,
  Zap,
  Gauge
} from 'lucide-react';
import { HardwareSensorConfig } from '../types';
import { DEFAULT_HARDWARE_CONFIG } from '../utils/auth';

interface HardwareStatusBannerProps {
  onOpenSimulator: () => void;
}

export const HardwareStatusBanner: React.FC<HardwareStatusBannerProps> = ({
  onOpenSimulator,
}) => {
  const [config, setConfig] = useState<HardwareSensorConfig>(DEFAULT_HARDWARE_CONFIG);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);

  const handleCalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-4 space-y-3 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Gauge className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                Industrial Sorter Hardware Matrix
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              6-Chute pneumatic diverter matrix • Multi-angle vision camera array • 4-Modality sensor bus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCalibrate}
            disabled={isCalibrating}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isCalibrating ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isCalibrating ? 'Calibrating...' : 'Calibrate Sensors'}</span>
          </button>
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Live Flow Simulator</span>
          </button>
        </div>
      </div>

      {/* 5 Hardware Sensor Stations Readout */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
        {/* Camera Gantry */}
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="flex items-center gap-1">
              <Camera className="w-3 h-3 text-cyan-400" />
              <span>Vision Cam Gantry</span>
            </span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
          <div className="text-white font-bold text-[11px]">3-Axis RGB Array</div>
          <div className="text-[10px] text-slate-500">{config.cameraGantryFps} FPS • 4K Shutter</div>
        </div>

        {/* Inductive Coil */}
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="flex items-center gap-1">
              <Magnet className="w-3 h-3 text-amber-400" />
              <span>Inductive Coil</span>
            </span>
            <span className="text-emerald-400 font-bold">ARMED</span>
          </div>
          <div className="text-white font-bold text-[11px]">Eddy-Current Sens</div>
          <div className="text-[10px] text-slate-500">Threshold: {config.inductiveThreshold}</div>
        </div>

        {/* NIR Spectrometer */}
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="flex items-center gap-1">
              <Waves className="w-3 h-3 text-emerald-400" />
              <span>NIR Spectrometer</span>
            </span>
            <span className="text-emerald-400 font-bold">READY</span>
          </div>
          <div className="text-white font-bold text-[11px]">900–2500 nm</div>
          <div className="text-[10px] text-slate-500">PET/HDPE Molecular</div>
        </div>

        {/* Contact Damping Plate */}
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-purple-400" />
              <span>Touch Hardness</span>
            </span>
            <span className="text-emerald-400 font-bold">ACTIVE</span>
          </div>
          <div className="text-white font-bold text-[11px]">Acoustic Tap Sens</div>
          <div className="text-[10px] text-slate-500">Damping Micro-probe</div>
        </div>

        {/* Pneumatics Diverter */}
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-blue-400" />
              <span>Air Diverters</span>
            </span>
            <span className="text-emerald-400 font-bold">{config.pneumaticPressurePsi} PSI</span>
          </div>
          <div className="text-white font-bold text-[11px]">6 Chute Actuators</div>
          <div className="text-[10px] text-slate-500">Latency: 12 ms pulse</div>
        </div>
      </div>
    </div>
  );
};
