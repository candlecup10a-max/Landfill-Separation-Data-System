import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Layers, 
  LayoutList,
  FileCode2, 
  Sparkles, 
  Download, 
  Plus, 
  RotateCcw, 
  Zap,
  User,
  LogIn,
  LogOut,
  KeyRound,
  Sliders,
  Maximize2,
  Minimize2,
  BookOpen
} from 'lucide-react';
import { CategoryId, AuthUser } from '../types';

interface NavbarProps {
  activeTab: 'catalog' | 'datacells' | 'simulator' | 'exporter' | 'admin';
  setActiveTab: (tab: 'catalog' | 'datacells' | 'simulator' | 'exporter' | 'admin') => void;
  totalItems: number;
  totalImages: number;
  onOpenAddItem?: () => void;
  onResetData: () => void;
  selectedCategory: CategoryId | 'all';
  setSelectedCategory: (cat: CategoryId | 'all') => void;
  currentUser: AuthUser | null;
  onOpenProfile: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  totalItems,
  totalImages,
  onOpenAddItem,
  onResetData,
  currentUser,
  onOpenProfile,
  onOpenLogin,
  onLogout,
  onOpenGuide,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return !!document.fullscreenElement;
    }
    return false;
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn('Unable to enter fullscreen mode:', err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn('Unable to exit fullscreen mode:', err);
        });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] w-full">
      <div className="w-full px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-13 gap-2.5">
          {/* Machine Brand / Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 border border-emerald-500/40 overflow-hidden shadow-xs shrink-0">
              <img
                src="/logo.png"
                alt="Landfill Separation Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
            </div>

            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                LANDFILL AI <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">v2.5 COMPACT</span>
              </h1>
              <span className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                6-CHUTE ONLINE
              </span>
            </div>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="flex items-center gap-0.5 bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/80 overflow-x-auto scrollbar-none max-w-full">
            <button
              id="nav-tab-catalog"
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all shrink-0 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-white text-emerald-700 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5 text-emerald-600" />
              <span>Catalog</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'catalog'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200/80 text-slate-600'
              }`}>
                {totalItems}
              </span>
            </button>

            <button
              id="nav-tab-datacells"
              onClick={() => setActiveTab('datacells')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all shrink-0 cursor-pointer ${
                activeTab === 'datacells'
                  ? 'bg-white text-emerald-700 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>Raw Data</span>
              <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1 rounded border border-amber-200/60 hidden lg:inline">
                6 Files
              </span>
            </button>

            <button
              id="nav-tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all shrink-0 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-white text-emerald-700 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulator</span>
            </button>

            <button
              id="nav-tab-exporter"
              onClick={() => setActiveTab('exporter')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all shrink-0 cursor-pointer ${
                activeTab === 'exporter'
                  ? 'bg-white text-emerald-700 font-semibold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">ML Export</span>
              <span className="sm:hidden">Export</span>
            </button>

            <button
              id="nav-tab-admin"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all shrink-0 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-purple-700 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/70'
              }`}
              title="Central Plant Admin & Telemetry"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* System Machine Compatibility Guide */}
            {onOpenGuide && (
              <button
                id="btn-navbar-system-guide"
                onClick={onOpenGuide}
                title="View Machine Compatibility & System Integration Guide (SYSTEM_GUIDE.md)"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-2xs transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Guide</span>
              </button>
            )}

            {/* Fullscreen Mode Toggle */}
            <button
              id="btn-toggle-fullscreen"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 font-mono text-xs transition-all shadow-2xs"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>

            {/* Combined User Profile & Logout Capsule */}
            {currentUser ? (
              <div 
                id="container-user-profile"
                className="flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs transition-all divide-x divide-slate-100"
              >
                {/* Profile Badge Trigger */}
                <button
                  id="btn-operator-profile"
                  onClick={onOpenProfile}
                  className="flex items-center gap-1.5 py-1 px-2 rounded-l-lg hover:bg-slate-50 transition-all text-xs group cursor-pointer text-left"
                  title="View Operator Clearance & Badge details"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-5 h-5 rounded-full object-cover border border-emerald-500 shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left hidden sm:block leading-tight">
                    <div className="text-[11px] font-bold text-slate-800 font-mono truncate max-w-[85px]">
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <div className="text-[9px] font-mono text-emerald-700 font-semibold">
                      LVL {currentUser.clearanceLevel}
                    </div>
                  </div>
                </button>

                {/* Integrated Logout Action */}
                <button
                  id="btn-navbar-logout"
                  onClick={onLogout}
                  className="p-1.5 rounded-r-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Sign out operator"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="btn-operator-login"
                onClick={onOpenLogin}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all border bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                <span>Login</span>
              </button>
            )}

            <button
              id="btn-reset-default-data"
              onClick={onResetData}
              title="Reset datasets to initial factory standards"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-all text-xs cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slim Modern Machine Telemetry Strip */}
      <div className="bg-slate-50/80 border-t border-slate-200/60 px-3 sm:px-5 lg:px-6 py-1 text-[10px] text-slate-500 font-mono flex items-center justify-between overflow-x-auto w-full">
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SCANNER: OPTICAL RGB + 3D
          </span>
          <span className="text-slate-300">/</span>
          <span>CHUTES: <strong className="text-slate-800 font-semibold">6 ACTIVE</strong></span>
          {currentUser && (
            <>
              <span className="text-slate-300">/</span>
              <span className="hidden md:inline text-slate-600">
                OP: <strong className="text-slate-800">{currentUser.badgeNumber}</strong>
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0 ml-3">
          <span>CATALOG: <strong className="text-slate-900 font-bold">{totalItems}</strong></span>
          <span className="text-slate-300">/</span>
          <span>RACURS: <strong className="text-emerald-700 font-bold">{totalImages}</strong></span>
        </div>
      </div>
    </header>
  );
};
