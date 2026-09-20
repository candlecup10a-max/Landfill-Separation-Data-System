import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Download, 
  Copy, 
  Check, 
  Cpu, 
  Layers, 
  Radio, 
  Network, 
  FileText, 
  Sparkles,
  Bot,
  Wind,
  Glasses
} from 'lucide-react';
import { SYSTEM_GUIDE_MARKDOWN } from '../data/systemGuideContent';
import { downloadFile } from '../utils/csvParser';

interface SystemGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemGuideModal: React.FC<SystemGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'machines' | 'chutes' | 'protocols'>('all');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    downloadFile('SYSTEM_GUIDE.md', SYSTEM_GUIDE_MARKDOWN, 'text/markdown');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(SYSTEM_GUIDE_MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Machine Compatibility & System Guide</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  SYSTEM_GUIDE.md
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Hardware integration specifications for optical chute sorters, AI robotics, and PLC systems.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-guide-copy"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              title="Copy markdown text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied' : 'Copy MD'}</span>
            </button>

            <button
              id="btn-guide-download"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-xs cursor-pointer"
              title="Download SYSTEM_GUIDE.md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>

            <button
              id="btn-guide-close"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-200 bg-white overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Full Guide
          </button>
          <button
            onClick={() => setActiveTab('machines')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'machines'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-500" />
            <span>Machinery Classes</span>
          </button>
          <button
            onClick={() => setActiveTab('chutes')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'chutes'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-500" />
            <span>6-Chute Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('protocols')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'protocols'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-amber-500" />
            <span>PLC & Edge Protocols</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] text-slate-800 text-xs sm:text-sm">
          {(activeTab === 'all' || activeTab === 'machines') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
                  1. Applicable Machinery Classifications
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type A */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Type A: High-Speed Optical Chute Sorters</h4>
                      <div className="text-[10px] text-slate-500 font-mono">Compressed Air-Jet Array (6-8 bar)</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Fast-moving conveyor belts or gravity chutes (2.0–4.5 m/s) passing below line-scan cameras and NIR spectrometers. Once classified, high-speed solenoid valves fire to eject items into assigned chutes.
                  </p>
                  <div className="text-[11px] font-mono text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-semibold text-emerald-800">Compatible Equipment:</div>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      <li>TOMRA AUTOSORT™ (NIR + VIS)</li>
                      <li>STEINERT UniSort PR EVO 5.0</li>
                      <li>Pellenc ST Mistral+ Series</li>
                      <li>REDWAVE 2i Optical Chute Sorters</li>
                    </ul>
                  </div>
                </div>

                {/* Type B */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Type B: AI Robotic Sorting Cells</h4>
                      <div className="text-[10px] text-slate-500 font-mono">Delta Pickers & Articulated Arms (40-80 ppm)</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Overhead stereoscopic cameras calculate 3D pose, object perimeter, and surface normal angles for vacuum or mechanical gripper pick-and-place trajectories.
                  </p>
                  <div className="text-[11px] font-mono text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-semibold text-blue-800">Compatible Equipment:</div>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      <li>AMP Robotics Cortex™ Dual-Gantry</li>
                      <li>ZenRobotics Fast & Heavy Pickers (ZRR2)</li>
                      <li>EverestLabs IBrain™ Robotic Sorter</li>
                      <li>Machinex SamurAI™ Sorting Robot</li>
                    </ul>
                  </div>
                </div>

                {/* Type C */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-600 text-white">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Type C: Multi-Sensor Sensor-Fusion Sorters</h4>
                      <div className="text-[10px] text-slate-500 font-mono">Inductive Coils + NIR Absorption + Acoustic Tap</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Combines visual RGB inspection with inductive eddy current sensing and near-infrared spectral response to differentiate non-ferrous conductors and polymer resin formulas.
                  </p>
                  <div className="text-[11px] font-mono text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-semibold text-amber-800">Compatible Equipment:</div>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      <li>MSS, Inc. CIRRUS® Multi-Sensor Sorter</li>
                      <li>Binder+Co CLARITY & MINEX Sorters</li>
                      <li>Eriez Eddy Current Induction Bars</li>
                    </ul>
                  </div>
                </div>

                {/* Type D */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-600 text-white">
                      <Glasses className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Type D: Edge Vision & Auditing Stations</h4>
                      <div className="text-[10px] text-slate-500 font-mono">Embedded AI Accelerators (Jetson / Hailo)</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Fixed smart cameras monitoring stream purity, detecting hazardous items (batteries, gas canisters), and auditing negative sorting lines before landfill disposal.
                  </p>
                  <div className="text-[11px] font-mono text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-semibold text-purple-800">Compatible Platforms:</div>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      <li>NVIDIA Jetson AGX Orin Industrial</li>
                      <li>Basler ace / dart & Cognex In-Sight 3800</li>
                      <li>Hailo-8 / Intel OpenVINO Edge IPCs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'chutes') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Layers className="w-4 h-4 text-cyan-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
                  2. 6-Chute Routing Matrix & Physical Actuators
                </h3>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                      <th className="p-3">Chute</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">File Format</th>
                      <th className="p-3">Target Materials</th>
                      <th className="p-3">Actuator Mechanism</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-emerald-700">Chute #1</td>
                      <td className="p-3 font-semibold">Plastic</td>
                      <td className="p-3 text-slate-500">plastic.json</td>
                      <td className="p-3">PET, HDPE, PP, LDPE (Bottles, tubs)</td>
                      <td className="p-3 text-slate-600">High-pressure pneumatic jet array (6 bar)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-amber-700">Chute #2</td>
                      <td className="p-3 font-semibold">Iron & Aluminium</td>
                      <td className="p-3 text-slate-500">iron-aluminium.csv</td>
                      <td className="p-3">Steel food cans, aluminium beverage cans, foil</td>
                      <td className="p-3 text-slate-600">Overband magnet + Eddy current rotor</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-cyan-700">Chute #3</td>
                      <td className="p-3 font-semibold">Glass</td>
                      <td className="p-3 text-slate-500">glass.csv</td>
                      <td className="p-3">Flint, amber, emerald beverage bottles & jars</td>
                      <td className="p-3 text-slate-600">Pneumatic cushioned diverter flap</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-yellow-700">Chute #4</td>
                      <td className="p-3 font-semibold">Wood & Paper</td>
                      <td className="p-3 text-slate-500">wood.csv</td>
                      <td className="p-3">Cardboard shipping boxes, paper reams, timber</td>
                      <td className="p-3 text-slate-600">Mechanical paddle / diverter finger</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-purple-700">Chute #5</td>
                      <td className="p-3 font-semibold">Textile</td>
                      <td className="p-3 text-slate-500">textile.csv</td>
                      <td className="p-3">Natural & synthetic garments, linens, fibers</td>
                      <td className="p-3 text-slate-600">Vacuum suction gripper / air ejector</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-700">Chute #6</td>
                      <td className="p-3 font-semibold">General Waste</td>
                      <td className="p-3 text-slate-500">general_waste.csv</td>
                      <td className="p-3">Unclassified composites, residues, landfill reject</td>
                      <td className="p-3 text-slate-600">Passive conveyor drop (end of line)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'protocols') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Network className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
                  3. Hardware Integration & PLC Interface Protocols
                </h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 space-y-2 border border-slate-800">
                  <div className="text-emerald-400 font-bold flex items-center justify-between">
                    <span>Industrial Ethernet & Fieldbus Architecture</span>
                    <span className="text-[10px] text-slate-400">Response &lt; 5 ms</span>
                  </div>
                  <pre className="text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
{`AI Inference (NVIDIA Jetson / Edge IPC) ──[1 Gbps Ethernet]──> Siemens S7-1500 / Allen-Bradley PLC
                                                                    │
                                                           [24V DC Digital I/O]
                                                                    ▼
                                                    6-Chute High-Speed Pneumatic Valves`}
                  </pre>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 font-sans">
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 text-xs font-mono font-bold block">1. OPC UA (IEC 62541)</strong>
                    <p className="text-xs text-slate-600">
                      Standardized object data structures publishing classified chute ID, confidence score (0.00–1.00), and encoder-synced conveyor timestamps.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 text-xs font-mono font-bold block">2. Modbus TCP & PROFINET</strong>
                    <p className="text-xs text-slate-600">
                      Direct cyclic register exchange with Siemens S7-1200/1500 and Beckhoff TwinCAT systems for millisecond valve actuation.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 text-xs font-mono font-bold block">3. ROS2 (Robot Operating System)</strong>
                    <p className="text-xs text-slate-600">
                      Publishes 3D bounding boxes, pick surface normals, and mass predictions to robotic arm motion planners.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 text-xs font-mono font-bold block">4. MQTT / Sparkplug B</strong>
                    <p className="text-xs text-slate-600">
                      Lightweight telemetry logging for plant SCADA systems and real-time landfill diversion rate analytics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/80">
          <div className="text-xs text-slate-500 font-mono">
            File stored at repository root: <code className="bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-800">/SYSTEM_GUIDE.md</code>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Markdown</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
