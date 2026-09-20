import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Key, 
  History, 
  Check, 
  Lock, 
  Unlock, 
  Sliders,
  Settings
} from 'lucide-react';
import { UserProfile, UserRole, AuditLogEntry } from '../types';
import { AVAILABLE_ROLES } from '../utils/auth';

interface UserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onChangeUser: (user: UserProfile) => void;
  auditLogs: AuditLogEntry[];
}

export const UserRoleModal: React.FC<UserRoleModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onChangeUser,
  auditLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'switch_role' | 'audit_log'>('switch_role');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>User Access Control & Security</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {currentUser.role.toUpperCase()}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Switch industrial workstation user role and review audit logging
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 px-6 pt-2 bg-white">
          <button
            onClick={() => setActiveTab('switch_role')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'switch_role'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Operator Roles & Permissions
          </button>
          <button
            onClick={() => setActiveTab('audit_log')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'audit_log'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Workstation Audit Trail ({auditLogs.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'switch_role' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Select an operational profile to test role-based access control (RBAC) across the Landfill Sorter:
              </p>
              <div className="space-y-2">
                {AVAILABLE_ROLES.map((roleDef) => {
                  const isCurrent = currentUser.role === roleDef.role;
                  return (
                    <div
                      key={roleDef.role}
                      onClick={() => onChangeUser(roleDef)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-slate-50 border-emerald-600 ring-2 ring-emerald-600/30'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{roleDef.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase">
                            {roleDef.role}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-500 pt-1">
                          {roleDef.permissions.canRegisterItems && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700">Register Items</span>
                          )}
                          {roleDef.permissions.canExportDataset && (
                            <span className="px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-700">Export AI Models</span>
                          )}
                          {roleDef.permissions.canCalibrateSensors && (
                            <span className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-700">Calibrate Sensors</span>
                          )}
                          {roleDef.permissions.canEditRawCsv && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700">Edit Raw CSVs</span>
                          )}
                        </div>
                      </div>

                      {isCurrent ? (
                        <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold font-mono">
                          <Check className="w-4 h-4" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700 mb-2">
                Recent User Actions & Hardware Events:
              </div>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{log.action}</div>
                      <div className="text-[11px] text-slate-500">{log.details}</div>
                    </div>
                    <div className="text-right text-[10px] text-slate-400">
                      <div>{log.userName}</div>
                      <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
          <span>Current Operator: {currentUser.name} ({currentUser.role})</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-200 bg-white border border-slate-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
