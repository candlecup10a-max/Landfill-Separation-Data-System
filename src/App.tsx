import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Layers, 
  FileCode2, 
  Zap, 
  Download, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Info,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { CategoryId, WasteItem, CategoryDataset, AuthUser } from './types';
import { CATEGORIES_CONFIG } from './data/initialData';
import { 
  loadRegisteredItems, 
  saveRegisteredItems, 
  loadAllDatasets, 
  saveAllDatasets, 
  resetSystemToDefault 
} from './utils/storage';
import { getStoredAuthUser, saveStoredAuthUser, DEMO_OPERATORS } from './utils/auth';
import { Navbar } from './components/Navbar';
import { CategoryHeader } from './components/CategoryHeader';
import { ItemGrid } from './components/ItemGrid';
import { ItemRegistrationModal } from './components/ItemRegistrationModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { RawDataScrollCell } from './components/RawDataScrollCell';
import { AISortingSimulator } from './components/AISortingSimulator';
import { DatasetExporter } from './components/DatasetExporter';
import { LoginPage } from './components/LoginPage';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminDashboard } from './components/AdminDashboard';
import { SystemGuideModal } from './components/SystemGuideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'datacells' | 'simulator' | 'exporter' | 'admin'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  
  // Auth State (Persistent operator session)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredAuthUser());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Data State
  const [items, setItems] = useState<WasteItem[]>(() => loadRegisteredItems());
  const [datasets, setDatasets] = useState<Record<CategoryId, CategoryDataset>>(() => loadAllDatasets());

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<WasteItem | null>(null);
  const [inspectingItem, setInspectingItem] = useState<WasteItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync to persistence
  useEffect(() => {
    saveRegisteredItems(items);
  }, [items]);

  useEffect(() => {
    saveAllDatasets(datasets);
  }, [datasets]);

  useEffect(() => {
    saveStoredAuthUser(currentUser);
  }, [currentUser]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    saveStoredAuthUser(user);
    setActiveTab('catalog');
    showNotification(`Authenticated as ${user.name} (${user.roleTitle})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveStoredAuthUser(null);
    showNotification('Operator signed out. Switched to guest mode.');
  };

  // Add / Edit Registered Item
  const handleSaveItem = (savedItem: WasteItem, customNotification?: string) => {
    setItems((prev) => {
      const existsIndex = prev.findIndex((i) => i.id === savedItem.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = savedItem;
        return updated;
      }
      return [savedItem, ...prev];
    });

    // Also update if inspecting
    if (inspectingItem && inspectingItem.id === savedItem.id) {
      setInspectingItem(savedItem);
    }

    showNotification(customNotification || `Successfully updated product ${savedItem.name} (${savedItem.id})`);
  };

  // Delete Item
  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    if (inspectingItem?.id === itemId) {
      setInspectingItem(null);
    }
    showNotification(`Deleted product ${itemId}`);
  };

  // Batch Delete Items
  const handleBatchDelete = (itemIds: string[]) => {
    const idSet = new Set(itemIds);
    setItems((prev) => prev.filter((i) => !idSet.has(i.id)));
    showNotification(`Deleted ${itemIds.length} registered products`);
  };

  // Update Raw Dataset File
  const handleUpdateDataset = (catId: CategoryId, updated: CategoryDataset) => {
    setDatasets((prev) => ({
      ...prev,
      [catId]: updated,
    }));
  };

  // Reset to Default Factory State
  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all 6 category files and registered items to standard factory presets?'
      )
    ) {
      const reset = resetSystemToDefault();
      setItems(reset.items);
      setDatasets(reset.datasets);
      showNotification('System datasets and registered products reset to defaults.');
    }
  };

  // Compute total images across all registered items
  const totalImages = React.useMemo(() => {
    return items.reduce((sum, it) => sum + (it.images?.length || 0), 0);
  }, [items]);

  // MANDATORY LOGIN GATE: User cannot enter any page of the program without logging in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white">
        {notification && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-xl border border-emerald-500 font-mono animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{notification}</span>
          </div>
        )}
        <div className="w-full max-w-5xl">
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            initialRole="operator"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalItems={items.length}
        totalImages={totalImages}
        onOpenAddItem={() => {
          setEditingItem(null);
          setIsAddModalOpen(true);
        }}
        onResetData={handleResetData}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenLogin={() => {}}
        onLogout={handleLogout}
        onOpenGuide={() => setIsGuideModalOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-6 space-y-5">
        {/* Floating Toast Notification */}
        {notification && (
          <div className="fixed bottom-12 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-xl border border-emerald-500 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{notification}</span>
          </div>
        )}

        {/* Global 6-Category Bar (Visible across catalog/datacell views) */}
        {(activeTab === 'catalog' || activeTab === 'datacells') && (
          <CategoryHeader
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            items={items}
          />
        )}

        {/* View Switcher based on Active Tab */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <ItemGrid
              items={items}
              selectedCategory={selectedCategory}
              onSelectItem={(item) => setInspectingItem(item)}
              onEditItem={(item) => {
                setEditingItem(item);
                setIsAddModalOpen(true);
              }}
              onDeleteItem={handleDeleteItem}
              onBatchDelete={handleBatchDelete}
              onAddNew={() => {
                setEditingItem(null);
                setIsAddModalOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === 'datacells' && (
          <div className="space-y-4">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200 shrink-0">
                  <FileCode2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    6-Category Source Data Files & Scroll-Down Cells
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Inspect, add, and delete records directly within each category's standard file (<code className="text-emerald-700 font-mono text-[11px] bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">plastic.json</code>, <code className="text-amber-700 font-mono text-[11px] bg-amber-50 px-1 py-0.5 rounded border border-amber-200">iron-aluminium.csv</code>, <code className="text-cyan-700 font-mono text-[11px] bg-cyan-50 px-1 py-0.5 rounded border border-cyan-200">glass.csv</code>, <code className="text-yellow-700 font-mono text-[11px] bg-yellow-50 px-1 py-0.5 rounded border border-yellow-200">wood.csv</code>, <code className="text-purple-700 font-mono text-[11px] bg-purple-50 px-1 py-0.5 rounded border border-purple-200">textile.csv</code>, and <code className="text-slate-700 font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded border border-slate-200">empty</code>).
                  </p>
                </div>
              </div>
            </div>

            <RawDataScrollCell
              datasets={datasets}
              onUpdateDataset={handleUpdateDataset}
              activeCategoryId={selectedCategory === 'all' ? 'plastic' : selectedCategory}
            />
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="space-y-4">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Landfill Separation Machine Simulator
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Test how the AI separation algorithms process collected products. Registered products are recognized and sorted into 5 material chutes, while unrecognized/mixed products are classified into the 6th chute (<span className="text-slate-800 font-semibold">General Waste</span>).
                  </p>
                </div>
              </div>
            </div>

            <AISortingSimulator
              items={items}
              onOpenAddItem={() => {
                setEditingItem(null);
                setIsAddModalOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === 'exporter' && (
          <div className="space-y-4">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    AI Machine Training Dataset Exporter
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Package all registered products, multi-angle racur images, and dimensional specs into YOLOv8, COCO, JSON manifest, and CSV formats ready for training computer vision models.
                  </p>
                </div>
              </div>
            </div>

            <DatasetExporter
              items={items}
              datasets={datasets}
            />
          </div>
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            items={items}
            datasets={datasets}
            onSwitchUser={(user) => {
              setCurrentUser(user);
              saveStoredAuthUser(user);
              showNotification(`Switched active terminal operator to ${user.name}`);
            }}
            onResetSystem={handleResetData}
            onNotify={showNotification}
          />
        )}
      </main>

      {/* Item Registration Modal (Add / Edit) */}
      <ItemRegistrationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onSaveItem={handleSaveItem}
        editItem={editingItem}
        defaultCategoryId={selectedCategory === 'all' ? 'plastic' : selectedCategory}
        existingItems={items}
      />

      {/* Item Detail / Multi-Racur Inspection Modal */}
      <ItemDetailModal
        item={inspectingItem}
        isOpen={!!inspectingItem}
        onClose={() => setInspectingItem(null)}
        onEdit={(item) => {
          setInspectingItem(null);
          setEditingItem(item);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDeleteItem}
        onUpdateItem={handleSaveItem}
      />

      {/* Operator User Profile & Clearance Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
          onLogout={handleLogout}
          onSwitchUser={(newUser) => {
            setCurrentUser(newUser);
            saveStoredAuthUser(newUser);
            showNotification(`Switched operator profile to ${newUser.name}`);
          }}
        />
      )}

      {/* Industrial Machine Compatibility & System Guide Modal */}
      <SystemGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* High Density Footer Telemetry */}
      <footer className="h-10 bg-white border-t border-slate-200 flex items-center px-4 sm:px-6 lg:px-8 xl:px-10 justify-between text-[10px] text-slate-500 font-mono mt-auto shrink-0 overflow-x-auto shadow-sm w-full">
        <div className="flex items-center gap-4 shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM READY
          </span>
          <span className="text-slate-300">|</span>
          <span>SRV_PORT: <strong className="text-slate-700">8080</strong></span>
          <span className="text-slate-300">|</span>
          <span>LATENCY: <strong className="text-slate-700">14ms</strong></span>
          <span className="text-slate-300">|</span>
          <span>FILE_STREAM: <strong className="text-emerald-600 font-semibold">OK</strong></span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="text-slate-600 hover:text-slate-900 font-bold hover:underline flex items-center gap-1"
            title="Read SYSTEM_GUIDE.md"
          >
            SYSTEM_GUIDE.md
          </button>
          <span className="text-slate-300">|</span>
          <span>AI Sorter v2.5 (LANDFILL-SEP-800)</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-700 font-bold">6 CHANNELS ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
