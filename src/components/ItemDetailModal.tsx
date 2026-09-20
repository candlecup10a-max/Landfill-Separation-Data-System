import React, { useState, useEffect } from 'react';
import { 
  X, 
  Ruler, 
  Trash2, 
  Edit3, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  Maximize2,
  Calendar,
  CheckCircle2,
  FileText,
  Radio,
  Magnet,
  Waves,
  Sparkles,
  Activity,
  RotateCw,
  Video
} from 'lucide-react';
import { WasteItem, RacurAngle } from '../types';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { Rotation360Preview } from './Rotation360Preview';

interface ItemDetailModalProps {
  item: WasteItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: WasteItem) => void;
  onDelete: (itemId: string) => void;
  onUpdateItem?: (item: WasteItem, notificationMessage?: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onUpdateItem,
}) => {
  const [activeAngleIndex, setActiveAngleIndex] = useState<number>(0);
  const [show360Preview, setShow360Preview] = useState<boolean>(false);

  // Reset 360 preview when item changes
  useEffect(() => {
    setShow360Preview(false);
    setActiveAngleIndex(0);
  }, [item?.id]);

  if (!isOpen || !item) return null;

  const categoryConfig = CATEGORIES_CONFIG.find((c) => c.id === item.categoryId) || CATEGORIES_CONFIG[0];
  const images = item.images || [];
  const currentImage = images[activeAngleIndex] || images[0];
  const telemetry = item.sensorTelemetry;

  const handlePrevImage = () => {
    setActiveAngleIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setActiveAngleIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleDeleteImage = (imgId: string) => {
    if (!item) return;
    const imgToDelete = item.images.find((img) => img.id === imgId);
    if (!imgToDelete) return;

    const isLastImage = item.images.length <= 1;
    const confirmMessage = isLastImage
      ? `This is the only remaining image for "${item.name}". Deleting it will leave the item without any registered vision racurs. Are you sure you want to delete it?`
      : `Are you sure you want to delete the "${imgToDelete.angle.toUpperCase()}" (${imgToDelete.angleLabel}) image from ${item.name}?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    const newImages = item.images.filter((img) => img.id !== imgId);
    const updatedItem: WasteItem = {
      ...item,
      images: newImages,
    };

    // Calculate new active index so it remains within bounds
    setActiveAngleIndex((prevIndex) => {
      if (prevIndex >= newImages.length) {
        return Math.max(0, newImages.length - 1);
      }
      return prevIndex;
    });

    if (onUpdateItem) {
      onUpdateItem(
        updatedItem,
        `Deleted "${imgToDelete.angle.toUpperCase()}" racur image from ${item.name}`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-mono font-bold px-2.5 py-1 rounded-md border"
              style={{
                backgroundColor: `${categoryConfig.color.primary}18`,
                color: categoryConfig.color.primary,
                borderColor: `${categoryConfig.color.primary}40`,
              }}
            >
              CHUTE #{categoryConfig.chuteNumber} • {categoryConfig.shortName.toUpperCase()}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>{item.name}</span>
                <span className="text-xs font-mono text-slate-500 font-normal">({item.id})</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Generate 360° Preview Button */}
            <button
              id="btn-header-generate-preview"
              onClick={() => setShow360Preview(!show360Preview)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-xs cursor-pointer border ${
                show360Preview
                  ? 'bg-slate-900 text-emerald-400 border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
              }`}
              title="Generate AI 360-degree rotation video preview from registered images"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{show360Preview ? '360° Preview Active' : 'Generate Preview'}</span>
            </button>

            <button
              onClick={() => onEdit(item)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors shadow-xs"
              title="Edit Item"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${item.name} (${item.id}) from the Landfill Separation catalog?`)) {
                  onDelete(item.id);
                  onClose();
                }
              }}
              className="p-2 rounded-lg text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-xs"
              title="Delete Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Top Viewport: Either AI 360 Rotation Video OR Multi-Angle Static Stage */}
          {show360Preview ? (
            <div className="space-y-2 animate-fadeIn">
              <Rotation360Preview
                item={item}
                categoryColor={categoryConfig.color.primary}
                chuteNumber={categoryConfig.chuteNumber}
                categoryName={categoryConfig.name}
                onClose={() => setShow360Preview(false)}
              />
              <div className="flex items-center justify-between px-2 pt-1 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>360-degree rotation video synthesized from {images.length} registered racurs</span>
                </span>
                <button
                  id="btn-return-to-photos"
                  onClick={() => setShow360Preview(false)}
                  className="text-emerald-700 hover:text-emerald-900 hover:underline font-semibold cursor-pointer"
                >
                  Return to photo angles
                </button>
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-3 bg-slate-50/60">
              <div className="p-3 bg-white border border-slate-200 rounded-xl w-fit mx-auto text-slate-400 shadow-2xs">
                <Trash2 className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase font-mono">No Vision Racurs Registered</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  All multi-angle vision images have been removed from this item. You can register new synthetic angles, upload files, or capture photos.
                </p>
              </div>
              <button
                id="btn-empty-add-images"
                onClick={() => onEdit(item)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Add / Generate Images</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Main Stage Image */}
              <div className="md:col-span-8 relative aspect-[4/3] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center group shadow-xs">
                {currentImage ? (
                  <img
                    src={currentImage.url}
                    alt={currentImage.angleLabel}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="text-slate-400 text-xs">No image available</div>
                )}

                {/* Top Floating Controls on Stage: Angle Tag & Delete Image Button */}
                {currentImage && (
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    <div className="bg-white/95 border border-slate-200 px-3 py-1 rounded-lg text-xs font-mono font-bold text-emerald-700 shadow-xs pointer-events-auto">
                      RACUR: {currentImage.angle.toUpperCase()} ({currentImage.angleLabel})
                    </div>

                    <button
                      id={`btn-delete-active-image-${currentImage.id}`}
                      onClick={() => handleDeleteImage(currentImage.id)}
                      className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/95 hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 hover:border-rose-300 text-xs font-mono font-semibold shadow-xs transition-all cursor-pointer group"
                      title={`Delete current ${currentImage.angle.toUpperCase()} image`}
                    >
                      <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-rose-500" />
                      <span>Delete Image</span>
                    </button>
                  </div>
                )}

                {/* Generate Preview Floating Button on Stage */}
                <button
                  id="btn-stage-generate-preview"
                  onClick={() => setShow360Preview(true)}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-950 text-white border border-slate-700 text-xs font-mono font-semibold shadow-md backdrop-blur-xs transition-transform active:scale-95 cursor-pointer"
                  title="Generate AI 360-degree rotation video"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Generate Preview</span>
                </button>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-xs transition-transform active:scale-95"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-xs transition-transform active:scale-95"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Racur Thumbnails & Multi-angle Picker */}
              <div className="md:col-span-4 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Registered Racurs ({images.length})</span>
                    <button
                      id="btn-racurs-generate-preview"
                      onClick={() => setShow360Preview(true)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs transition-colors cursor-pointer"
                      title="Use AI to simulate 360° rotation video"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Generate Preview</span>
                    </button>
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    {images.map((img, idx) => (
                      <div
                        key={img.id}
                        className={`group relative aspect-video rounded-xl border p-1 text-left transition-all overflow-hidden flex flex-col justify-between bg-slate-50 ${
                          activeAngleIndex === idx
                            ? 'border-emerald-600 ring-2 ring-emerald-600/30'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveAngleIndex(idx)}
                          className="w-full h-full flex flex-col justify-between cursor-pointer"
                          title={`View ${img.angleLabel}`}
                        >
                          <img
                            src={img.url}
                            alt={img.angleLabel}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain"
                          />
                        </button>

                        {/* Quick Delete Image button on thumbnail */}
                        <button
                          type="button"
                          id={`btn-delete-thumb-${img.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(img.id);
                          }}
                          className="absolute top-1 right-1 z-10 p-1 rounded-md bg-white/95 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                          title={`Delete ${img.angle.toUpperCase()} image`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>

                        <span className="pointer-events-none absolute bottom-1 left-1 right-1 text-[9px] font-mono uppercase px-1 py-0.2 bg-white/95 text-slate-700 font-medium rounded text-center truncate border border-slate-200">
                          {img.angle}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800">Vision Training Coverage</div>
                  <p>
                    Hover over any thumbnail to delete or click to inspect. Multi-angle diversity ensures high classification accuracy on the sorting chute.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MATERIAL SENSOR TELEMETRY SIGNATURE PANEL */}
          {telemetry && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
                    <Radio className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase font-mono">
                      Calibrated Material Sensor Signature
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Physical readings captured upon approach and touch contact
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  Primary Modality: {telemetry.dominantModality}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                {/* Inductive / Magnetic */}
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-700 text-[11px] font-bold">
                    <Magnet className="w-3.5 h-3.5" />
                    <span>Inductive Coil</span>
                  </div>
                  <div className="text-slate-900 font-bold">{telemetry.inductiveResponse} / 1023</div>
                  <div className="text-[10px] text-slate-500">
                    {telemetry.isMagnetic ? 'Magnetic (Ferrous)' : telemetry.inductiveResponse > 200 ? 'Non-Ferrous Alu' : 'Non-Metallic'}
                  </div>
                </div>

                {/* NIR Peak */}
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-bold">
                    <Waves className="w-3.5 h-3.5" />
                    <span>NIR Spectrum</span>
                  </div>
                  <div className="text-slate-900 font-bold">{telemetry.nirWavelengthNm > 0 ? `${telemetry.nirWavelengthNm} nm` : 'None'}</div>
                  <div className="text-[10px] text-slate-500">
                    {Math.round(telemetry.opticalReflectance * 100)}% Reflectance
                  </div>
                </div>

                {/* Optical UV/Vis & Dielectric */}
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-700 text-[11px] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Optical UV / ε</span>
                  </div>
                  <div className="text-slate-900 font-bold">{telemetry.uvTransmissionPercent}% Transmitted</div>
                  <div className="text-[10px] text-slate-500">
                    Dielectric ε: {telemetry.capacitiveDielectric}
                  </div>
                </div>

                {/* Contact Hardness */}
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-700 text-[11px] font-bold">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Tap Hardness</span>
                  </div>
                  <div className="text-slate-900 font-bold">{telemetry.surfaceHardnessDamping} / 100</div>
                  <div className="text-[10px] text-slate-500">
                    {telemetry.surfaceHardnessDamping < 25 ? 'Flexible / Soft' : telemetry.surfaceHardnessDamping > 80 ? 'Rigid Hard' : 'Medium'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Specifications & Sensor Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Dimensions */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <Ruler className="w-4 h-4 text-emerald-600" />
                <span>Dimensions (Size)</span>
              </div>
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Height:</span>
                  <span className="text-slate-900 font-bold">{item.heightCm} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Width:</span>
                  <span className="text-slate-900 font-bold">{item.widthCm} cm</span>
                </div>
                {item.depthCm && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Depth:</span>
                    <span className="text-slate-900 font-bold">{item.depthCm} cm</span>
                  </div>
                )}
                {item.weightGrams && (
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Weight:</span>
                    <span className="text-slate-900 font-bold">{item.weightGrams} g</span>
                  </div>
                )}
              </div>
            </div>

            {/* Material Classification */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <Tag className="w-4 h-4 text-amber-500" />
                <span>Material & Resin</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-900">{item.material}</div>
                {item.subCategory && (
                  <div className="text-[11px] text-slate-500">
                    Category: <strong className="text-slate-700">{item.subCategory}</strong>
                  </div>
                )}
                {item.industrySector && (
                  <div className="text-[11px] text-slate-500">
                    Sector: <strong className="text-slate-700">{item.industrySector}</strong>
                  </div>
                )}
                <div className="pt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-700 border border-slate-200 shadow-xs">
                    Recyclability: {item.recyclabilityRating || 'Standard'}
                  </span>
                </div>
              </div>
            </div>

            {/* Target Dataset & Source Mapping */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Dataset Target File</span>
              </div>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-emerald-700 font-bold">{categoryConfig.fileName}</div>
                <div className="text-[11px] text-slate-600 font-sans">
                  Target Chute: <strong className="text-emerald-700 font-mono font-bold">Chute #{categoryConfig.chuteNumber}</strong>
                </div>
                <div className="text-[10px] text-slate-400 font-sans pt-1">
                  Registered: {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {item.notes && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-semibold text-slate-500 block text-[11px] uppercase tracking-wider">
                Algorithm & Optical Notes
              </span>
              <p>{item.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <button
              id="btn-footer-generate-preview"
              onClick={() => setShow360Preview(!show360Preview)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{show360Preview ? 'Switch to Multi-Angle Photos' : 'Generate 360° Video Preview'}</span>
            </button>
          </div>
          <button
            id="btn-footer-close-profile"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-xs cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
