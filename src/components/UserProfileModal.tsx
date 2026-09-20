import React from 'react';
import { 
  User, 
  ShieldCheck, 
  LogOut, 
  Building2, 
  Clock, 
  BadgeCheck, 
  X, 
  KeyRound, 
  UserCheck, 
  Layers,
  Award,
  Radio
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { DEMO_OPERATORS } from '../utils/auth';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
  onLogout: () => void;
  onSwitchUser: (newUser: AuthUser) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onSwitchUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 border border-emerald-500/40 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono tracking-tight text-white">
                OPERATOR PROFILE & BADGE
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Active Terminal Session
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card Details */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-base flex items-center justify-center border-2 border-emerald-400 shadow-xs shrink-0">
                {user.name.charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {user.name}
                </h4>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : user.role === 'engineer'
                    ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                    : user.role === 'operator'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {user.role.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
              <p className="text-[11px] font-mono text-emerald-700 font-medium truncate mt-0.5">
                {user.roleTitle}
              </p>
            </div>
          </div>

          {/* Badge & Security Specs */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Badge ID</span>
              <strong className="text-slate-900 font-bold">{user.badgeNumber}</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Clearance Level</span>
              <strong className="text-emerald-700 font-bold">Level {user.clearanceLevel} Security</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Assigned Shift</span>
              <strong className="text-slate-800 font-bold">{user.shift}</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Facility Node</span>
              <strong className="text-slate-800 font-bold truncate block">EcoSort #4</strong>
            </div>
          </div>

          {/* Switch Operator Quick Switcher */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">
              Quick Switch Terminal Role:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['operator', 'engineer', 'admin', 'guest'] as UserRole[]).map((role) => {
                const demo = DEMO_OPERATORS[role];
                const isCurrent = user.role === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      onSwitchUser(demo);
                      onClose();
                    }}
                    disabled={isCurrent}
                    className={`px-2 py-1.5 rounded-lg text-xs font-mono text-center transition-all border ${
                      isCurrent
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold opacity-75'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="capitalize block font-semibold">{role}</span>
                    <span className="text-[9px] text-slate-400">Lvl {demo.clearanceLevel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors font-mono"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Operator</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
