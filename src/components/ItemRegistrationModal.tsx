import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Upload, 
  Camera, 
  Sparkles, 
  Trash2, 
  Link2, 
  Ruler, 
  Layers, 
  Check, 
  Image as ImageIcon,
  HelpCircle,
  Eye,
  Radio,
  Barcode
} from 'lucide-react';
import { CategoryId, WasteItem, ItemImage, RacurAngle, SensorTelemetry } from '../types';
import { CATEGORIES_CONFIG, createStandardRacurSet, generateRacurSvgUrl } from '../data/initialData';
import { generateDefaultSensorTelemetry } from '../utils/sensorPresets';
import { MaterialSensorWorkbench } from './MaterialSensorWorkbench';
import { CameraCaptureModal } from './CameraCaptureModal';
import { BarcodeCell } from './BarcodeCell';

interface ItemRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveItem: (item: WasteItem) => void;
  editItem?: WasteItem | null;
  defaultCategoryId?: CategoryId;
  existingItems: WasteItem[];
}

const RACUR_OPTIONS: { angle: RacurAngle; label: string; desc: string }[] = [
  { angle: 'front', label: 'Front Angle (0°)', desc: 'Primary front-facing optical profile' },
  { angle: 'side', label: 'Side Profile (90°)', desc: 'Lateral elevation & depth' },
  { angle: 'top', label: 'Overhead Top-Down (90°)', desc: 'Chute conveyor top-down footprint' },
  { angle: 'isometric', label: 'Isometric (45°)', desc: 'Three-dimensional corner perspective' },
  { angle: 'bottom', label: 'Base / Underside', desc: 'Bottom rim, puncture, or mold marking' },
  { angle: 'back', label: 'Rear Angle (180°)', desc: 'Back label or seam' },
  { angle: 'detail', label: 'Texture / Detail', desc: 'Resin code, barcode, or material close-up' },
];

export const ItemRegistrationModal: React.FC<ItemRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSaveItem,
  editItem,
  defaultCategoryId = 'plastic',
  existingItems,
}) => {
  const initialCategory: CategoryId = (defaultCategoryId as CategoryId) || 'plastic';
  const [categoryId, setCategoryId] = useState<CategoryId>(initialCategory);
  const [itemId, setItemId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [barcode, setBarcode] = useState<string>('');
  const [material, setMaterial] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('20');
  const [widthCm, setWidthCm] = useState<string>('8');
  const [depthCm, setDepthCm] = useState<string>('8');
  const [weightGrams, setWeightGrams] = useState<string>('50');
  const [subCategory, setSubCategory] = useState<string>('');
  const [industrySector, setIndustrySector] = useState<string>('');
  const [recyclability, setRecyclability] = useState<'High' | 'Moderate' | 'Low' | 'Non-Recyclable'>('High');
  const [notes, setNotes] = useState<string>('');
  const [images, setImages] = useState<ItemImage[]>([]);
  const [sensorTelemetry, setSensorTelemetry] = useState<SensorTelemetry>(() => 
    generateDefaultSensorTelemetry(initialCategory, 'PET')
  );

  // State for image inputs
  const [urlInput, setUrlInput] = useState<string>('');
  const [urlAngle, setUrlAngle] = useState<RacurAngle>('front');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [cameraAngle, setCameraAngle] = useState<RacurAngle>('front');
  const [previewImage, setPreviewImage] = useState<ItemImage | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const currentCategoryConfig = CATEGORIES_CONFIG.find((c) => c.id === categoryId) || CATEGORIES_CONFIG[0];

  // Helper to generate next unique ID based on category prefix
  const generateNextId = (cat: CategoryId): string => {
    const prefixes: Record<CategoryId, string> = {
      plastic: 'PLS',
      iron_aluminum: 'MET',
      glass: 'GLS',
      paper_cardboard: 'WOD',
      textile: 'TEX',
      general_waste: 'WST',
    };
    const prefix = prefixes[cat] || 'ITM';
    const catItems = existingItems.filter((i) => i.id.startsWith(prefix));
    const highestNum = catItems.reduce((max, it) => {
      const match = it.id.match(/\d+/);
      const num = match ? parseInt(match[0], 10) : 0;
      return num > max ? num : max;
    }, 0);
    return `${prefix}-${String(highestNum + 1).padStart(3, '0')}`;
  };

  useEffect(() => {
    if (editItem) {
      setCategoryId(editItem.categoryId);
      setItemId(editItem.id);
      setName(editItem.name);
      setBarcode(editItem.barcode || '');
      setMaterial(editItem.material);
      setHeightCm(String(editItem.heightCm));
      setWidthCm(String(editItem.widthCm));
      setDepthCm(editItem.depthCm ? String(editItem.depthCm) : '');
      setWeightGrams(editItem.weightGrams ? String(editItem.weightGrams) : '');
      setSubCategory(editItem.subCategory || '');
      setIndustrySector(editItem.industrySector || '');
      setRecyclability(editItem.recyclabilityRating || 'High');
      setNotes(editItem.notes || '');
      setImages(editItem.images || []);
      setSensorTelemetry(
        editItem.sensorTelemetry || generateDefaultSensorTelemetry(editItem.categoryId, editItem.material)
      );
    } else {
      const initCat: CategoryId = (defaultCategoryId || 'plastic') as CategoryId;
      setCategoryId(initCat);
      setItemId(generateNextId(initCat));
      setName('');
      setBarcode('');
      const defaultMat = currentCategoryConfig.materialsList[0] || '';
      setMaterial(defaultMat);
      setHeightCm('20');
      setWidthCm('8');
      setDepthCm('8');
      setWeightGrams('50');
      setSubCategory('');
      setIndustrySector('');
      setRecyclability(initCat === 'general_waste' ? 'Non-Recyclable' : 'High');
      setNotes('');
      setImages([]);
      setSensorTelemetry(generateDefaultSensorTelemetry(initCat, defaultMat));
    }
    setFormErrors({});
  }, [isOpen, editItem, defaultCategoryId]);

  // When category changes in "new" mode, update default prefix & materials & sensor defaults
  const handleCategoryChange = (newCat: CategoryId) => {
    setCategoryId(newCat);
    if (!editItem) {
      setItemId(generateNextId(newCat));
      const config = CATEGORIES_CONFIG.find((c) => c.id === newCat);
      let newMat = '';
      if (config && config.materialsList.length > 0) {
        newMat = config.materialsList[0];
        setMaterial(newMat);
      }
      if (newCat === 'general_waste') {
        setRecyclability('Non-Recyclable');
      } else {
        setRecyclability('High');
      }
      setSensorTelemetry(generateDefaultSensorTelemetry(newCat, newMat));
    }
  };

  // Generate synthetic multi-angle racur images
  const handleGenerateSyntheticRacurs = () => {
    const shape = categoryId === 'plastic' || categoryId === 'glass' 
      ? 'bottle' 
      : categoryId === 'iron_aluminum' 
      ? 'can' 
      : categoryId === 'paper_cardboard' 
      ? 'box' 
      : categoryId === 'textile' 
      ? 'garment' 
      : 'custom';

    const racurs = createStandardRacurSet(
      name.trim() || `${currentCategoryConfig.shortName} Product`,
      currentCategoryConfig.color.primary,
      shape
    );
    setImages(racurs);
  };

  // Add custom URL image
  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    const angleObj = RACUR_OPTIONS.find((r) => r.angle === urlAngle);
    const newImg: ItemImage = {
      id: `img_url_${Date.now()}`,
      angle: urlAngle,
      angleLabel: angleObj?.label || 'Custom Angle',
      url: urlInput.trim(),
      isCustomUpload: true,
      timestamp: new Date().toISOString(),
      caption: `${urlAngle.toUpperCase()} optical capture`,
    };
    setImages((prev) => [...prev, newImg]);
    setUrlInput('');
  };

  // Handle local file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const angleOrder: RacurAngle[] = ['front', 'side', 'top', 'isometric', 'bottom', 'back', 'detail'];
    
    Array.from(files).forEach((file: File, idx: number) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const currentCount = images.length + idx;
          const assignedAngle = angleOrder[currentCount % angleOrder.length];
          const angleObj = RACUR_OPTIONS.find((r) => r.angle === assignedAngle);

          const newImg: ItemImage = {
            id: `img_file_${Date.now()}_${idx}`,
            angle: assignedAngle,
            angleLabel: angleObj?.label || 'Uploaded Angle',
            url: event.target.result as string,
            isCustomUpload: true,
            timestamp: new Date().toISOString(),
            caption: file.name,
          };
          setImages((prev) => [...prev, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Camera capture callback
  const handleCameraCapture = (dataUrl: string, angle: RacurAngle) => {
    const angleObj = RACUR_OPTIONS.find((r) => r.angle === angle);
    const newImg: ItemImage = {
      id: `img_cam_${Date.now()}`,
      angle,
      angleLabel: angleObj?.label || `${angle.toUpperCase()} Angle`,
      url: dataUrl,
      isCustomUpload: true,
      timestamp: new Date().toISOString(),
      caption: `Camera snapshot (${angle})`,
    };
    setImages((prev) => [...prev, newImg]);
  };

  const handleRemoveImage = (imgId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  const handleUpdateImageAngle = (imgId: string, newAngle: RacurAngle) => {
    const angleObj = RACUR_OPTIONS.find((r) => r.angle === newAngle);
    setImages((prev) =>
      prev.map((img) =>
        img.id === imgId
          ? { ...img, angle: newAngle, angleLabel: angleObj?.label || `${newAngle.toUpperCase()} Angle` }
          : img
      )
    );
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!itemId.trim()) errors.itemId = 'Item ID is required';
    if (!name.trim()) errors.name = 'Item Name is required';
    if (!material.trim()) errors.material = 'Material specification is required';

    const h = parseFloat(heightCm);
    const w = parseFloat(widthCm);
    if (isNaN(h) || h <= 0) errors.height = 'Height must be a positive number';
    if (isNaN(w) || w <= 0) errors.width = 'Width must be a positive number';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    // Ensure at least one image exists, generate one if empty
    let finalImages = [...images];
    if (finalImages.length === 0) {
      finalImages = [
        {
          id: `img_auto_${Date.now()}`,
          angle: 'front',
          angleLabel: 'Front Angle (0°)',
          url: generateRacurSvgUrl(
            name.trim(),
            'front',
            currentCategoryConfig.color.primary
          ),
          isCustomUpload: false,
          timestamp: new Date().toISOString(),
          caption: 'Auto-generated Front Angle optical preview',
        },
      ];
    }

    const itemToSave: WasteItem = {
      id: itemId.trim().toUpperCase(),
      name: name.trim(),
      categoryId,
      barcode: barcode.trim() || undefined,
      material: material.trim(),
      heightCm: parseFloat(heightCm),
      widthCm: parseFloat(widthCm),
      depthCm: depthCm ? parseFloat(depthCm) : undefined,
      weightGrams: weightGrams ? parseFloat(weightGrams) : undefined,
      subCategory: subCategory.trim() || undefined,
      industrySector: industrySector.trim() || undefined,
      recyclabilityRating: recyclability,
      sensorTelemetry: sensorTelemetry,
      images: finalImages,
      notes: notes.trim() || undefined,
      createdAt: editItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveItem(itemToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/90">
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2 rounded-lg border flex items-center justify-center"
              style={{
                backgroundColor: `${currentCategoryConfig.color.primary}15`,
                color: currentCategoryConfig.color.primary,
                borderColor: `${currentCategoryConfig.color.primary}40`,
              }}
            >
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {editItem ? 'Edit Registered Item' : 'Register New Material Item'}
                <span 
                  className="text-[10px] px-1.5 py-0.2 rounded font-mono font-medium border"
                  style={{
                    backgroundColor: `${currentCategoryConfig.color.primary}18`,
                    color: currentCategoryConfig.color.primary,
                    borderColor: `${currentCategoryConfig.color.primary}40`,
                  }}
                >
                  CHUTE #{currentCategoryConfig.chuteNumber}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Landfill separation AI algorithm training dataset input
              </p>
            </div>
          </div>

          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Category Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Target Separation Category</span>
              <span className="text-[11px] font-normal text-slate-500">
                (Assigns file: {currentCategoryConfig.fileName})
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {CATEGORIES_CONFIG.map((cat) => {
                const active = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      active
                        ? 'bg-slate-50 text-slate-900 shadow-xs border-emerald-600 ring-2 ring-emerald-600/30'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span style={{ color: cat.color.primary }} className="font-bold">CHUTE #{cat.chuteNumber}</span>
                    </div>
                    <div className="text-xs font-bold truncate">{cat.shortName}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{cat.fileName}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Item ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Item ID (Unique Identification) *</span>
                <span className="text-[10px] text-slate-400 font-mono">e.g. PLS-001, MET-050</span>
              </label>
              <input
                type="text"
                id="input-item-id"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                placeholder="e.g. PLS-005"
                className={`w-full px-3.5 py-2 rounded-xl bg-slate-50 border text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  formErrors.itemId ? 'border-rose-500' : 'border-slate-200'
                }`}
              />
              {formErrors.itemId && <p className="text-[11px] text-rose-500 font-medium">{formErrors.itemId}</p>}
            </div>

            {/* Item Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Item Name (Product Description) *
              </label>
              <input
                type="text"
                id="input-item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. PET Mineral Water Bottle 500ml"
                className={`w-full px-3.5 py-2 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  formErrors.name ? 'border-rose-500' : 'border-slate-200'
                }`}
              />
              {formErrors.name && <p className="text-[11px] text-rose-500 font-medium">{formErrors.name}</p>}
            </div>

            {/* Material Specifics */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Material / Resin / Alloy *</span>
                <span className="text-[10px] text-slate-400">Chemical or alloy classification</span>
              </label>
              <div className="space-y-1.5">
                <input
                  type="text"
                  id="input-item-material"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. PET / PETE (#1) or 6061 Aluminum"
                  className={`w-full px-3.5 py-2 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    formErrors.material ? 'border-rose-500' : 'border-slate-200'
                  }`}
                />
                {/* Suggestions Pills */}
                <div className="flex flex-wrap gap-1">
                  {currentCategoryConfig.materialsList.slice(0, 4).map((mat) => (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => setMaterial(mat)}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
              {formErrors.material && <p className="text-[11px] text-rose-500 font-medium">{formErrors.material}</p>}
            </div>

            {/* Sub-Category / Sector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Sub-Category / Sector</span>
                <span className="text-[10px] text-slate-400">Optional dataset mapping</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  placeholder="Subcategory (e.g. Bottles)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  value={industrySector}
                  onChange={(e) => setIndustrySector(e.target.value)}
                  placeholder="Sector (e.g. Packaging)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Barcode & Packaging Code */}
            <div className="md:col-span-2 space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Barcode className="w-4 h-4 text-emerald-600" />
                  <span>Item Barcode / GTIN / UPC / SKU</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Optical or laser scanner barcode</span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="input-item-barcode"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="e.g. 079357319402 or EAN-13 / SKU"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                {barcode.trim() ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Preview:</span>
                    <BarcodeCell code={barcode.trim()} size="standard" showCodeText={true} />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const rand = Math.floor(100000000000 + Math.random() * 900000000000).toString();
                      setBarcode(rand);
                    }}
                    className="px-3 py-2 rounded-xl text-[11px] font-mono font-medium text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-colors shrink-0"
                  >
                    + Generate Barcode
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Size & Physical Dimensions (Height, Width, Depth, Weight) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <Ruler className="w-4 h-4 text-emerald-600" />
                <span>Physical Dimensions & Sensor Calibrations (Height, Width)</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Unit: Centimeters (cm)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Height */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 font-medium">Height (cm) *</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    id="input-height"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="20"
                    className={`w-full px-3 py-2 rounded-lg bg-white border text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      formErrors.height ? 'border-rose-500' : 'border-slate-200'
                    }`}
                  />
                  <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">cm</span>
                </div>
              </div>

              {/* Width */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 font-medium">Width (cm) *</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    id="input-width"
                    value={widthCm}
                    onChange={(e) => setWidthCm(e.target.value)}
                    placeholder="8"
                    className={`w-full px-3 py-2 rounded-lg bg-white border text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      formErrors.width ? 'border-rose-500' : 'border-slate-200'
                    }`}
                  />
                  <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">cm</span>
                </div>
              </div>

              {/* Depth */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 font-medium">Depth / Caliber (cm)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={depthCm}
                    onChange={(e) => setDepthCm(e.target.value)}
                    placeholder="8"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">cm</span>
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 font-medium">Weight (grams)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">g</span>
                </div>
              </div>
            </div>
          </div>

          {/* MATERIAL SENSOR TELEMETRY WORKBENCH */}
          <MaterialSensorWorkbench
            telemetry={sensorTelemetry}
            onChange={setSensorTelemetry}
            categoryId={categoryId}
            materialName={material}
          />

          {/* MULTI-RACUR IMAGES SECTION */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Multi-Angle Optical Training Images (Racurs)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    {images.length} Angles Registered
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Multiple camera angles (Front, Side, Top, Isometric, Bottom) train the Landfill Vision System.
                </p>
              </div>

              {/* Quick Actions for adding angles */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-generate-synthetic-racurs"
                  onClick={handleGenerateSyntheticRacurs}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Auto-Generate 5 Angles</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Camera</span>
                </button>
              </div>
            </div>

            {/* Add Image Controls Bar */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* File Upload Drop Area */}
                <div className="md:col-span-6 relative border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-3 text-center transition-colors bg-white group cursor-pointer shadow-xs">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-1 text-slate-500 group-hover:text-slate-800">
                    <Upload className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-slate-700">Upload Image Files (Multi-file select)</span>
                    <span className="text-[10px] text-slate-400">Drag & drop PNG, JPG, WebP</span>
                  </div>
                </div>

                {/* URL input */}
                <div className="md:col-span-6 flex flex-col justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={urlAngle}
                      onChange={(e) => setUrlAngle(e.target.value as RacurAngle)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-700 focus:outline-none"
                    >
                      {RACUR_OPTIONS.map((r) => (
                        <option key={r.angle} value={r.angle}>
                          {r.angle.toUpperCase()} Angle
                        </option>
                      ))}
                    </select>

                    <div className="relative flex-1">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://... or paste image URL"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddUrlImage}
                      disabled={!urlInput.trim()}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white shrink-0"
                    >
                      Add URL
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500">
                    Register several racurs (camera angles) per product so the sorting machine algorithm recognizes items in any orientation on the conveyor belt.
                  </p>
                </div>
              </div>
            </div>

            {/* Racur Gallery Grid */}
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    {/* Angle Tag Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <select
                        value={img.angle}
                        onChange={(e) => handleUpdateImageAngle(img.id, e.target.value as RacurAngle)}
                        className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/95 text-emerald-700 border border-slate-200 focus:outline-none cursor-pointer shadow-xs"
                      >
                        {RACUR_OPTIONS.map((r) => (
                          <option key={r.angle} value={r.angle}>
                            {r.angle.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      id={`btn-reg-delete-image-${img.id}`}
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-white/95 hover:bg-rose-50 text-rose-500 hover:text-rose-700 border border-slate-200 transition-colors shadow-xs cursor-pointer"
                      title={`Delete ${img.angle.toUpperCase()} image`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Image Preview Container */}
                    <div 
                      className="aspect-[4/3] bg-slate-50 flex items-center justify-center p-2 cursor-pointer overflow-hidden border-b border-slate-100"
                      onClick={() => setPreviewImage(img)}
                    >
                      <img
                        src={img.url}
                        alt={img.angleLabel}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Footer caption */}
                    <div className="p-2 bg-slate-50 text-[10px] text-slate-600 truncate flex items-center justify-between">
                      <span className="truncate">{img.angleLabel}</span>
                      <button
                        type="button"
                        onClick={() => setPreviewImage(img)}
                        className="text-slate-400 hover:text-slate-700"
                        title="Enlarge"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center space-y-2 bg-slate-50/50">
                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600">No racur images added yet.</p>
                <p className="text-[11px] text-slate-500">
                  Click "Auto-Generate 5 Angles", upload image files, or take snapshots with your camera.
                </p>
              </div>
            )}
          </div>

          {/* Notes & Recyclability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Recyclability Rating
              </label>
              <select
                value={recyclability}
                onChange={(e) => setRecyclability(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="High">High (Standard High-Yield Chute)</option>
                <option value="Moderate">Moderate (Conditional Sorting)</option>
                <option value="Low">Low (Special Processing Required)</option>
                <option value="Non-Recyclable">Non-Recyclable (Landfill Chute #6)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Landfill Algorithm Notes & Optical Characteristics
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Spectral NIR peak at 1660nm, translucent body"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/90">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-xs"
          >
            Cancel
          </button>

          <button
            type="button"
            id="btn-save-item-submit"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md active:scale-95 transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{editItem ? 'Update Registered Item' : 'Register Item into Machine'}</span>
          </button>
        </div>
      </div>

      {/* Camera Capture Sub-Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        targetAngle={cameraAngle}
      />

      {/* Image Lightbox Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase">
                {previewImage.angleLabel}
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100">
              <img
                src={previewImage.url}
                alt={previewImage.angleLabel}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
