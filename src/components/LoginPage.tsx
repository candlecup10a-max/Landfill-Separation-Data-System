import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Zap,
  Building2
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { DEMO_OPERATORS, getRememberedEmail, saveRememberedEmail } from '../utils/auth';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onCancelOrGuest?: () => void;
  initialRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onCancelOrGuest,
  initialRole = 'operator',
}) => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(() => getRememberedEmail() || 'operator@recycle.ai');
  const [password, setPassword] = useState<string>('ecopass123');
  const [fullName, setFullName] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid operator email address or ID.');
      return;
    }

    if (!password.trim() || password.length < 4) {
      setErrorMessage('Password or PIN must be at least 4 characters.');
      return;
    }

    if (isRegistering && !fullName.trim()) {
      setErrorMessage('Please enter the full name of the operator.');
      return;
    }

    setIsLoading(true);
    saveRememberedEmail(email, rememberMe);

    // Brief token verification
    setTimeout(() => {
      setIsLoading(false);

      // Check if matches demo operator
      const matchingDemo = Object.values(DEMO_OPERATORS).find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (matchingDemo && !isRegistering) {
        onLoginSuccess({
          ...matchingDemo,
          lastLogin: new Date().toISOString(),
        });
      } else {
        // Registered or Custom operator
        const customUser: AuthUser = {
          id: `USR-${selectedRole.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
          name: fullName.trim() || email.split('@')[0].replace('.', ' ').toUpperCase(),
          email: email.trim(),
          role: selectedRole,
          roleTitle: 
            selectedRole === 'admin' 
              ? 'Plant Administrator' 
              : selectedRole === 'engineer' 
              ? 'Sensor Calibration Engineer' 
              : selectedRole === 'operator' 
              ? 'Conveyor Sort Specialist' 
              : 'Field Compliance Auditor',
          facility: 'EcoSort Reclamation Facility #4',
          badgeNumber: `${selectedRole.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
          clearanceLevel: selectedRole === 'admin' ? 3 : selectedRole === 'engineer' ? 2 : 1,
          shift: 'Day Shift A',
          lastLogin: new Date().toISOString(),
        };
        onLoginSuccess(customUser);
      }
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Top Banner */}
          <div className="bg-slate-900 text-white p-6 border-b border-slate-800 relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-3.5">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 border border-emerald-500/50 shadow-inner shrink-0">
                <img
                  src="/logo.png"
                  alt="Landfill Separation AI"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>

              <div>
                <h2 className="text-base font-bold tracking-tight text-white font-mono">
                  LANDFILL SEPARATION
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Sorting Facility Terminal Sign In
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-7 space-y-5">
            {/* Tab switch between Sign In and Register */}
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setErrorMessage(null);
                }}
                className={`flex-1 pb-3 text-xs font-bold font-mono transition-all border-b-2 text-center cursor-pointer ${
                  !isRegistering
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setErrorMessage(null);
                }}
                className={`flex-1 pb-3 text-xs font-bold font-mono transition-all border-b-2 text-center cursor-pointer ${
                  isRegistering
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Register
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name for Registration */}
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Operator Full Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jordan Smith"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white"
                  />
                </div>
              )}

              {/* Station Email / Operator ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email or Operator ID</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@recycle.ai"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white font-mono"
                />
              </div>

              {/* Password / PIN */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection for Registration only */}
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Account Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono bg-white"
                  >
                    <option value="operator">Operator</option>
                    <option value="engineer">Calibration Engineer</option>
                    <option value="admin">Plant Administrator</option>
                    <option value="guest">Field Guest</option>
                  </select>
                </div>
              )}

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 font-mono disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>{isRegistering ? 'Create Account & Sign In' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Guest / Cancel option if supported */}
            {onCancelOrGuest && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Need quick access?</span>
                <button
                  type="button"
                  onClick={onCancelOrGuest}
                  className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline font-mono cursor-pointer"
                >
                  Continue as Guest →
                </button>
              </div>
            )}
          </div>

          {/* Clean Footer */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 font-mono flex items-center justify-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>EcoSort Facility #4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
