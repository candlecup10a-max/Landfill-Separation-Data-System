import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Users,
  Sliders,
  Activity,
  AlertTriangle,
  Radio,
  FileCode2,
  Download,
  Trash2,
  RefreshCw,
  Plus,
  CheckCircle2,
  Lock,
  Unlock,
  Layers,
  Power,
  Zap,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Settings,
  HardDrive,
  BadgeAlert,
  HelpCircle,
  BarChart3,
  Server,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { 
  AuthUser, 
  UserRole, 
  SystemAuditEntry, 
  PlantHardwareConfig, 
  CategoryId, 
  WasteItem,
  CategoryDataset 
} from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { 
  loadRegisteredOperators, 
  saveRegisteredOperators, 
  loadSystemAuditLogs, 
  saveSystemAuditLogs,
  loadPlantHardwareConfig,
  savePlantHardwareConfig,
  DEMO_OPERATORS
} from '../utils/auth';

interface AdminDashboardProps {
  currentUser: AuthUser;
  items: WasteItem[];
  datasets: Record<CategoryId, CategoryDataset>;
  onSwitchUser: (user: AuthUser) => void;
  onResetSystem: () => void;
  onNotify: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  items,
  datasets,
  onSwitchUser,
  onResetSystem,
  onNotify,
}) => {
  const [adminTab, setAdminTab] = useState<'hardware' | 'operators' | 'sensors' | 'audit' | 'database'>('hardware');
  
  // Hardware Config State
  const [hardwareConfig, setHardwareConfig] = useState<PlantHardwareConfig>(() => loadPlantHardwareConfig());
  
  // Operators State
  const [operators, setOperators] = useState<AuthUser[]>(() => loadRegisteredOperators());
  const [isAddingOperator, setIsAddingOperator] = useState<boolean>(false);
  const [newOpName, setNewOpName] = useState<string>('');
  const [newOpEmail, setNewOpEmail] = useState<string>('');
  const [newOpRole, setNewOpRole] = useState<UserRole>('operator');
  const [newOpShift, setNewOpShift] = useState<string>('Day Shift A');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<SystemAuditEntry[]>(() => loadSystemAuditLogs());
  const [auditFilter, setAuditFilter] = useState<string>('ALL');
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [manualNote, setManualNote] = useState<string>('');

  // Confirmation modals
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [diagnosticsRunning, setDiagnosticsRunning] = useState<boolean>(false);
  const [diagnosticsResult, setDiagnosticsResult] = useState<string | null>(null);

  const isAdmin = currentUser.clearanceLevel >= 3 || currentUser.role === 'admin';

  // Save hardware config changes
  const updateHardware = (updates: Partial<PlantHardwareConfig>) => {
    setHardwareConfig((prev) => {
      const next = { ...prev, ...updates };
      savePlantHardwareConfig(next);
      return next;
    });

    // Add audit log
    const entry: SystemAuditEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      operatorName: currentUser.name,
      operatorBadge: currentUser.badgeNumber,
      action: 'Plant Hardware Parameters Adjusted',
      category: 'HARDWARE',
      severity: 'info',
      details: `Updated parameters: ${Object.keys(updates).join(', ')}`,
    };
    addAudit(entry);
  };

  const addAudit = (entry: SystemAuditEntry) => {
    setAuditLogs((prev) => {
      const next = [entry, ...prev];
      saveSystemAuditLogs(next);
      return next;
    });
  };

  const handleToggleEmergencyStop = () => {
    const newState = !hardwareConfig.emergencyStopEngaged;
    updateHardware({ emergencyStopEngaged: newState });
    
    const entry: SystemAuditEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      operatorName: currentUser.name,
      operatorBadge: currentUser.badgeNumber,
      action: newState ? 'EMERGENCY STOP ENGAGED' : 'EMERGENCY STOP CLEARED',
      category: 'OVERRIDE',
      severity: newState ? 'critical' : 'warning',
      details: newState 
        ? 'Operator triggered master conveyor and pneumatic shutoff.' 
        : 'Emergency safety lockout reset to nominal operation.',
    };
    addAudit(entry);
    onNotify(newState ? '⚠️ EMERGENCY STOP ENGAGED across sorting line!' : 'Conveyor lines restarted and armed.');
  };

  // Add new operator
  const handleCreateOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpName.trim() || !newOpEmail.trim()) return;

    const clearance = newOpRole === 'admin' ? 3 : newOpRole === 'engineer' ? 2 : 1;
    const badgeNum = `${newOpRole.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOp: AuthUser = {
      id: `USR-${Date.now().toString().slice(-5)}`,
      name: newOpName.trim(),
      email: newOpEmail.trim(),
      role: newOpRole,
      roleTitle: 
        newOpRole === 'admin' 
          ? 'Operations Plant Administrator' 
          : newOpRole === 'engineer' 
          ? 'Sensor & Optics Calibration Engineer' 
          : 'Sorting Conveyor Specialist',
      facility: 'EcoSort Reclamation Facility #4',
      badgeNumber: badgeNum,
      clearanceLevel: clearance,
      shift: newOpShift,
      lastLogin: 'Never',
    };

    const updated = [...operators, newOp];
    setOperators(updated);
    saveRegisteredOperators(updated);

    addAudit({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      operatorName: currentUser.name,
      operatorBadge: currentUser.badgeNumber,
      action: 'Operator Badge Issued',
      category: 'SECURITY',
      severity: 'info',
      details: `Issued badge ${badgeNum} (${newOpRole.toUpperCase()} - Level ${clearance}) to ${newOpName}.`,
    });

    setNewOpName('');
    setNewOpEmail('');
    setIsAddingOperator(false);
    onNotify(`Badge ${badgeNum} created for ${newOpName}`);
  };

  const handleRemoveOperator = (opId: string, opName: string) => {
    if (operators.length <= 1) {
      onNotify('Cannot remove the last operator badge.');
      return;
    }
    const updated = operators.filter((o) => o.id !== opId);
    setOperators(updated);
    saveRegisteredOperators(updated);

    addAudit({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      operatorName: currentUser.name,
      operatorBadge: currentUser.badgeNumber,
      action: 'Operator Badge Revoked',
      category: 'SECURITY',
      severity: 'warning',
      details: `Revoked access credentials for ${opName} (ID: ${opId}).`,
    });
    onNotify(`Revoked badge for ${opName}`);
  };

  const handleRunDiagnostics = () => {
    setDiagnosticsRunning(true);
    setDiagnosticsResult(null);

    setTimeout(() => {
      setDiagnosticsRunning(false);
      setDiagnosticsResult('ALL SYSTEMS GREEN: 6 Optical Cameras, 6 Ejector Valves (92 PSI), Inductive Resonators, and NIR Spectroscopy Sensors operating within nominal tolerances.');
      
      addAudit({
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        operatorName: currentUser.name,
        operatorBadge: currentUser.badgeNumber,
        action: 'System Self-Test & Diagnostic Passed',
        category: 'CALIBRATION',
        severity: 'info',
        details: 'Self-test confirmed 0.04% optical frame drop rate and 100% actuator response time.',
      });
      onNotify('Diagnostic routine completed successfully.');
    }, 1200);
  };

  const handleAddManualAuditNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNote.trim()) return;

    addAudit({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      operatorName: currentUser.name,
      operatorBadge: currentUser.badgeNumber,
      action: 'Supervisor Log Entry',
      category: 'OVERRIDE',
      severity: 'info',
      details: manualNote.trim(),
    });

    setManualNote('');
    onNotify('Manual supervisor note recorded in audit log.');
  };

  const handleExportSystemBackup = () => {
    const backupData = {
      systemVersion: 'Landfill-Separation-v2.4',
      exportedAt: new Date().toISOString(),
      exportedBy: currentUser,
      hardwareConfig,
      registeredItemsCount: items.length,
      registeredItems: items,
      datasets,
      operators,
      auditLogs,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `landfill-separation-system-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addAudit({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      operatorName: currentUser.name,
      operatorBadge: currentUser.badgeNumber,
      action: 'System Database Backup Downloaded',
      category: 'DATASET',
      severity: 'info',
      details: `Full JSON snapshot containing ${items.length} items and ${operators.length} badges exported.`,
    });
    onNotify('Full system backup JSON generated and downloaded.');
  };

  // Filtered audit logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditFilter !== 'ALL' && log.category !== auditFilter) return false;
    if (auditSearch.trim()) {
      const q = auditSearch.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.operatorName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.operatorBadge.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {/* Top Admin Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-3.5 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 border border-emerald-500/40 text-emerald-400 shadow-inner shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm font-bold font-mono tracking-tight text-white uppercase">
                  Central Plant Admin & Reclamation Console
                </h1>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LEVEL 3
                </span>
                {hardwareConfig.emergencyStopEngaged && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                    ⚠️ LINE HALTED
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Hardware Control • Sensor Sensitivity Calibration • Security Badges • System Audit Ledger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Elevation or Switch for Non-Admins */}
            {!isAdmin && (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs font-mono">
                <BadgeAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[10px]">L{currentUser.clearanceLevel}</span>
                <button
                  onClick={() => onSwitchUser(DEMO_OPERATORS.admin)}
                  className="px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] transition-colors cursor-pointer"
                >
                  Elevate
                </button>
              </div>
            )}

            {/* Emergency Stop Button */}
            <button
              id="btn-emergency-stop"
              onClick={handleToggleEmergencyStop}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all shadow-xs active:scale-98 cursor-pointer ${
                hardwareConfig.emergencyStopEngaged
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-500/30'
                  : 'bg-rose-600 hover:bg-rose-500 text-white ring-2 ring-rose-600/30'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{hardwareConfig.emergencyStopEngaged ? 'RESUME LINE' : 'E-STOP'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-slate-800 text-xs font-mono">
          <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="text-[9px] text-slate-400 block">Conveyor Line Speed</span>
            <strong className="text-emerald-400 text-xs font-bold">
              {hardwareConfig.emergencyStopEngaged ? '0.00 m/s' : `${hardwareConfig.conveyorSpeedMps.toFixed(2)} m/s`}
            </strong>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="text-[9px] text-slate-400 block">Ejection Pressure</span>
            <strong className="text-cyan-400 text-xs font-bold">{hardwareConfig.pneumaticPressurePsi} PSI</strong>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="text-[9px] text-slate-400 block">Registered Operators</span>
            <strong className="text-purple-300 text-xs font-bold">{operators.length} Badges</strong>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="text-[9px] text-slate-400 block">Audit Log Entries</span>
            <strong className="text-slate-200 text-xs font-bold">{auditLogs.length} Events</strong>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setAdminTab('hardware')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
            adminTab === 'hardware'
              ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Hardware & Controls</span>
        </button>

        <button
          onClick={() => setAdminTab('operators')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
            adminTab === 'operators'
              ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Operators</span>
          <span className="px-1 py-0.2 rounded bg-slate-200 text-slate-700 text-[9px]">{operators.length}</span>
        </button>

        <button
          onClick={() => setAdminTab('sensors')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
            adminTab === 'sensors'
              ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Sensor Calibration</span>
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
            adminTab === 'audit'
              ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Audit Log</span>
          <span className="px-1 py-0.2 rounded bg-slate-200 text-slate-700 text-[9px]">{auditLogs.length}</span>
        </button>

        <button
          onClick={() => setAdminTab('database')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
            adminTab === 'database'
              ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Database & Backup</span>
        </button>
      </div>

      {/* TAB 1: PLANT HARDWARE CONTROLS */}
      {adminTab === 'hardware' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Main Actuators & Conveyor Speed */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-mono">Conveyor Line & Actuators</h3>
                  <p className="text-xs text-slate-500">Physical sorting velocity and pneumatic pulse</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                LINE #4 ACTIVE
              </span>
            </div>

            {/* Conveyor Speed Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Conveyor Belt Velocity</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {hardwareConfig.conveyorSpeedMps.toFixed(2)} m/s ({Math.round(hardwareConfig.conveyorSpeedMps * 3.6)} km/h)
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.05"
                value={hardwareConfig.conveyorSpeedMps}
                onChange={(e) => updateHardware({ conveyorSpeedMps: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0.5 m/s (High Precision Inspection)</span>
                <span>2.0 m/s (Nominal)</span>
                <span>4.0 m/s (Max Sorter Throughput)</span>
              </div>
            </div>

            {/* Pneumatic Ejector Pressure */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Pneumatic Ejector Nozzle Pressure</span>
                <span className="font-mono font-bold text-cyan-700 text-sm">{hardwareConfig.pneumaticPressurePsi} PSI</span>
              </div>
              <input
                type="range"
                min="40"
                max="140"
                step="2"
                value={hardwareConfig.pneumaticPressurePsi}
                onChange={(e) => updateHardware({ pneumaticPressurePsi: parseInt(e.target.value) })}
                className="w-full accent-cyan-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>40 PSI (Light plastics)</span>
                <span>90 PSI (Nominal all-waste)</span>
                <span>140 PSI (Heavy glass / metal)</span>
              </div>
            </div>

            {/* Laser Trigger Offset */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Laser Optical Trigger Distance Offset</span>
                <span className="font-mono font-bold text-purple-700 text-sm">
                  {hardwareConfig.laserTriggerCalibrationMm.toFixed(1)} mm
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="30.0"
                step="0.5"
                value={hardwareConfig.laserTriggerCalibrationMm}
                onChange={(e) => updateHardware({ laserTriggerCalibrationMm: parseFloat(e.target.value) })}
                className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* AI Sorting Decision & Confidence Policy */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-mono">AI Classification Thresholds</h3>
                  <p className="text-xs text-slate-500">Autonomous gating and rejection tolerances</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                MODEL V2.4
              </span>
            </div>

            {/* Minimum Confidence Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Minimum Classification Confidence</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {hardwareConfig.minClassificationConfidence}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="98"
                step="1"
                value={hardwareConfig.minClassificationConfidence}
                onChange={(e) => updateHardware({ minClassificationConfidence: parseInt(e.target.value) })}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>50% (Permissive)</span>
                <span>80% (Strict ISO)</span>
                <span>98% (Ultra-Pure Stream)</span>
              </div>
            </div>

            {/* Auto-eject toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-900 block font-mono">
                  Auto-Divert Uncertain Items to Chute #6 (Others)
                </span>
                <span className="text-[11px] text-slate-500">
                  Prevents cross-contamination in recyclable fractions
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hardwareConfig.autoEjectUncertainItems}
                  onChange={(e) => updateHardware({ autoEjectUncertainItems: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Optical Camera Shutter Speed */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Multi-Racur High-Speed Camera Exposure</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{hardwareConfig.opticalShutterSpeedUs} µs</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={hardwareConfig.opticalShutterSpeedUs}
                onChange={(e) => updateHardware({ opticalShutterSpeedUs: parseInt(e.target.value) })}
                className="w-full accent-slate-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OPERATOR DIRECTORY & BADGES */}
      {adminTab === 'operators' && (
        <div className="space-y-5">
          {/* Header Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-mono">FACILITY OPERATOR BADGE DIRECTORY</h3>
              <p className="text-xs text-slate-500">
                Authorized sorting specialists, calibration engineers, and administrators
              </p>
            </div>

            <button
              onClick={() => setIsAddingOperator(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Operator Badge</span>
            </button>
          </div>

          {/* Add Operator Modal/Form */}
          {isAddingOperator && (
            <form
              onSubmit={handleCreateOperator}
              className="bg-slate-50 rounded-2xl border border-emerald-300 p-5 shadow-md space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 font-mono">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  <span>Issue New Terminal Badge Credentials</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingOperator(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newOpName}
                    onChange={(e) => setNewOpName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Email / ID</label>
                  <input
                    type="email"
                    required
                    value={newOpEmail}
                    onChange={(e) => setNewOpEmail(e.target.value)}
                    placeholder="e.g. sconnor@plant.eco"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Clearance Role</label>
                  <select
                    value={newOpRole}
                    onChange={(e) => setNewOpRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  >
                    <option value="operator">Operator (Clearance Level 1)</option>
                    <option value="engineer">Calibration Engineer (Level 2)</option>
                    <option value="admin">Plant Administrator (Level 3)</option>
                    <option value="guest">Field Auditor / Guest (Level 1)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Assigned Shift</label>
                  <select
                    value={newOpShift}
                    onChange={(e) => setNewOpShift(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  >
                    <option value="Day Shift A">Day Shift A (06:00 - 14:00)</option>
                    <option value="Evening Shift B">Evening Shift B (14:00 - 22:00)</option>
                    <option value="Night Shift C">Night Shift C (22:00 - 06:00)</option>
                    <option value="General Operations">General Operations</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-xl shadow-xs"
                >
                  Create & Issue Badge
                </button>
              </div>
            </form>
          )}

          {/* Operator Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {operators.map((op) => {
              const isCurrent = currentUser.id === op.id;
              return (
                <div
                  key={op.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3 relative transition-all ${
                    isCurrent
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {op.avatarUrl ? (
                        <img
                          src={op.avatarUrl}
                          alt={op.name}
                          className="w-10 h-10 rounded-full object-cover border border-emerald-500 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-bold text-sm flex items-center justify-center shrink-0">
                          {op.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{op.name}</h4>
                          {isCurrent && (
                            <span className="text-[9px] font-mono px-1.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{op.email}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                        op.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : op.role === 'engineer'
                          ? 'bg-cyan-100 text-cyan-800'
                          : op.role === 'operator'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      LVL {op.clearanceLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-[9px] text-slate-400 block">Badge</span>
                      <strong className="text-slate-900">{op.badgeNumber}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">Shift</span>
                      <strong className="text-slate-700">{op.shift}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => onSwitchUser(op)}
                      disabled={isCurrent}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all ${
                        isCurrent
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isCurrent ? 'Active Operator' : 'Switch Terminal Access'}
                    </button>

                    {!isCurrent && (
                      <button
                        onClick={() => handleRemoveOperator(op.id, op.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Revoke Badge"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SENSOR CALIBRATION & DIAGNOSTICS */}
      {adminTab === 'sensors' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-mono">
                  MATERIAL SENSOR ARRAYS & CONTINUOUS DIAGNOSTICS
                </h3>
                <p className="text-xs text-slate-500">
                  Inductive, Spectroscopic, Dielectric, and Ultrasonic Damping Baseline Calibration
                </p>
              </div>

              <button
                onClick={handleRunDiagnostics}
                disabled={diagnosticsRunning}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-sm transition-all disabled:opacity-75 cursor-pointer"
              >
                <Zap className={`w-4 h-4 ${diagnosticsRunning ? 'animate-spin' : ''}`} />
                <span>{diagnosticsRunning ? 'Testing Sensor Array...' : 'Run Diagnostics Sweep'}</span>
              </button>
            </div>

            {/* Diagnostic Message */}
            {diagnosticsResult && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Diagnostics Report Summary</strong>
                  <p>{diagnosticsResult}</p>
                </div>
              </div>
            )}

            {/* 4 Sensor Banks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              {/* Bank 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-800">Inductive Coil Bank</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-slate-900 text-sm font-bold">120 kHz Excitation</div>
                <div className="text-[11px] text-slate-500">
                  Eddy Current ferrous & non-ferrous aluminum discriminator
                </div>
                <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-200 flex justify-between">
                  <span>Status: CALIBRATED</span>
                  <span>SNR: 42.1 dB</span>
                </div>
              </div>

              {/* Bank 2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800">NIR Spectrometer</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-slate-900 text-sm font-bold">900 - 2100 nm</div>
                <div className="text-[11px] text-slate-500">
                  Polymer resin signature detector (PET/HDPE/PVC/PP/PS/ABS)
                </div>
                <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-200 flex justify-between">
                  <span>Status: LOCKED</span>
                  <span>Accuracy: 99.4%</span>
                </div>
              </div>

              {/* Bank 3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-800">Dielectric ε Sensor</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-slate-900 text-sm font-bold">1.0 - 8.5 Relative ε</div>
                <div className="text-[11px] text-slate-500">
                  Moisture content & high-frequency capacitive discriminator
                </div>
                <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-200 flex justify-between">
                  <span>Status: READY</span>
                  <span>Zero-Drift: 0.01%</span>
                </div>
              </div>

              {/* Bank 4 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-800">Tap Hardness Piezo</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-slate-900 text-sm font-bold">2.5 kHz Acoustic Band</div>
                <div className="text-[11px] text-slate-500">
                  Vibration damping for foam vs rigid cardboard & glass
                </div>
                <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-200 flex justify-between">
                  <span>Status: ARMED</span>
                  <span>Response: 4.2 ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM AUDIT LEDGER */}
      {adminTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-mono">PLANT AUDIT & EVENT LEDGER</h3>
                <p className="text-xs text-slate-500">
                  Chronological tamper-evident records of security, calibration, hardware, and dataset events
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    placeholder="Search audit logs..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <select
                  value={auditFilter}
                  onChange={(e) => setAuditFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none font-mono"
                >
                  <option value="ALL">All Categories</option>
                  <option value="SECURITY">Security</option>
                  <option value="HARDWARE">Hardware</option>
                  <option value="CALIBRATION">Calibration</option>
                  <option value="DATASET">Dataset</option>
                  <option value="OVERRIDE">Override</option>
                </select>
              </div>
            </div>

            {/* Supervisor note input */}
            <form onSubmit={handleAddManualAuditNote} className="flex gap-2">
              <input
                type="text"
                value={manualNote}
                onChange={(e) => setManualNote(e.target.value)}
                placeholder="Log supervisor note (e.g. 'Shift changed, line inspected for debris')..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold rounded-xl shrink-0"
              >
                Add Supervisor Entry
              </button>
            </form>

            {/* Log list */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filteredAuditLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-mono">
                  No matching audit entries found.
                </div>
              ) : (
                filteredAuditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-1.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            log.category === 'SECURITY'
                              ? 'bg-purple-100 text-purple-800'
                              : log.category === 'OVERRIDE'
                              ? 'bg-rose-100 text-rose-800'
                              : log.category === 'HARDWARE'
                              ? 'bg-amber-100 text-amber-800'
                              : log.category === 'CALIBRATION'
                              ? 'bg-cyan-100 text-cyan-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {log.category}
                        </span>
                        <strong className="text-slate-900 font-bold">{log.action}</strong>
                      </div>

                      <span className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-slate-600 font-sans text-xs">{log.details}</p>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                      <span>
                        Operator: <strong className="text-slate-700">{log.operatorName}</strong> ({log.operatorBadge})
                      </span>
                      <span>ID: {log.id}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DATABASE & MAINTENANCE */}
      {adminTab === 'database' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Backup & Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-mono">System Database Snapshot</h3>
                <p className="text-xs text-slate-500">Export complete offline JSON backup</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Generates a complete snapshot including all registered items with multi-angle racur images, physical sensor telemetry signatures, 6-chute dataset partitions, and operator badges.
            </p>

            <button
              onClick={handleExportSystemBackup}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Complete System Backup (JSON)</span>
            </button>
          </div>

          {/* Database Factory Reset */}
          <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm space-y-4 bg-rose-50/20">
            <div className="flex items-center gap-2.5 border-b border-rose-100 pb-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700 border border-rose-200">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-900 font-mono">Factory Reset & Re-Seed</h3>
                <p className="text-xs text-rose-700">Restore initial waste dataset partitions</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Resets all 6 CSV dataset files, re-indexes the 12 initial physical items, and restores default sensor calibration presets.
            </p>

            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Initiate Factory Reset Protocol</span>
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-rose-100 border border-rose-300 space-y-3">
                <p className="text-xs font-bold text-rose-900 font-mono">
                  ⚠️ CONFIRM FACTORY PURGE: Are you sure you want to reset all registered items to defaults?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onResetSystem();
                      setShowResetConfirm(false);
                      onNotify('System restored to factory default dataset.');
                    }}
                    className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-xs"
                  >
                    Confirm & Wipe
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 rounded-lg bg-white text-slate-700 font-mono text-xs border border-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
