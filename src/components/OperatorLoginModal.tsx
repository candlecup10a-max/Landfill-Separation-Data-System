import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  ShieldCheck, 
  UserCheck, 
  Lock,
  ArrowRight,
  Check
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { DEMO_OPERATORS } from '../utils/auth';

interface OperatorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
  currentUser: AuthUser | null;
}

export const OperatorLoginModal: React.FC<OperatorLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser?.role || 'admin');
  const [pin, setPin] = useState<string>('8821');

  if (!isOpen) return null;

  const operators = Object.values(DEMO_OPERATORS);

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'admin') setPin('8821');
    else if (role === 'engineer') setPin('4092');
    else if (role === 'operator') setPin('1108');
    else setPin('0099');
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    const op = DEMO_OPERATORS[selectedRole];
    if (op) {
      onLogin({
        ...op,
        lastLogin: new Date().toISOString(),
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Operator Station Access
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Landfill Separation Facility #4
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

        {/* Content Form */}
        <form onSubmit={handleAuthenticate} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
              Select Operator Station Profile:
            </label>
            <div className="space-y-2">
              {operators.map((op) => {
                const isSelected = selectedRole === op.role;
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => handleSelectRole(op.role)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-600/30 bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {op.avatarUrl ? (
                        <img
                          src={op.avatarUrl}
                          alt={op.name}
                          className="w-9 h-9 rounded-full object-cover border border-emerald-500"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                          {op.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{op.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {op.badgeNumber}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {op.roleTitle} (Clearance Lvl {op.clearanceLevel})
                        </div>
                      </div>
                    </div>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">Select</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Security Access PIN / Badge Code</span>
              <span className="text-[10px] font-mono text-emerald-700">Pre-filled for demonstration</span>
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 tracking-widest focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <span>Authenticate Operator Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
