export type CategoryId = 
  | 'plastic'
  | 'iron_aluminum'
  | 'glass'
  | 'paper_cardboard'
  | 'textile'
  | 'general_waste';

export interface CategoryDefinition {
  id: CategoryId;
  name: string;
  shortName: string;
  fileName: string;
  fileType: 'json' | 'csv' | 'empty';
  color: {
    primary: string;
    badge: string;
    bg: string;
    border: string;
    glow: string;
    accent: string;
    text: string;
  };
  description: string;
  chuteNumber: number;
  iconName: string;
  materialsList: string[];
}

export type RacurAngle = 
  | 'front'       // 0°
  | 'side'        // 90°
  | 'top'         // Overhead
  | 'isometric'   // 45°
  | 'bottom'      // Base
  | 'back'        // 180°
  | 'detail';     // Close-up texture / barcode

export interface ItemImage {
  id: string;
  angle: RacurAngle;
  angleLabel: string;
  url: string;
  isCustomUpload?: boolean;
  timestamp: string;
  caption?: string;
}

export interface SensorTelemetry {
  // Inductive & Electromagnetic (Metals / Ferrous / Non-ferrous)
  inductiveResponse: number;       // 0 to 1023 (0 = non-metallic, 300-600 = Aluminum/non-ferrous, 700-1023 = Iron/Steel)
  isMagnetic: boolean;             // true if attracted by permanent/electromagnet
  
  // Optical & Near-Infrared Spectrometry (NIR / SWIR)
  nirWavelengthNm: number;         // Peak absorption band (e.g. 1660nm for PET, 1730nm for PP, 1450nm for Cellulose)
  opticalReflectance: number;      // 0.0 to 1.0 (Gloss/Specular vs Diffuse)
  uvTransmissionPercent: number;   // 0 to 100% (Glass passes high UV/Vis, plastics absorb/scatter)
  
  // Physical Contact, Surface & Capacitive Touch
  capacitiveDielectric: number;    // Dielectric constant (e.g. 1.5 for foam/cardboard, 3-4 for dry wood/plastics, 6-8 for glass)
  surfaceHardnessDamping: number;  // 0 to 100 (Acoustic/tap damping on contact: <20 = textiles/soft, 40-70 = plastics/wood, >80 = glass/metal)
  contactResistanceOhm?: number;   // Surface conductivity on physical touch
  temperatureDeltaC?: number;      // Thermal conductivity probe delta (°C)
  
  // Multi-Sensor Ingestion Status
  sensorConfidence: number;        // Sensor fusion match confidence 0-100%
  dominantModality: 'Inductive' | 'NIR Spectrometer' | 'Optical UV/Vis' | 'Capacitive/Cellulose' | 'Tactile/Damping';
}

export interface WasteItem {
  id: string;                      // e.g. "PLS-001"
  name: string;                    // e.g. "Water Bottle 500ml"
  categoryId: CategoryId;          // plastic, iron_aluminum, etc.
  barcode?: string;                // e.g. "793573194028" or "EAN-13 / UPC / SKU"
  material: string;                // e.g. "PET (Resin #1)", "Aluminum", "Borosilicate Glass"
  heightCm: number;                // Height in cm
  widthCm: number;                 // Width in cm
  depthCm?: number;                // Depth / Thickness in cm
  weightGrams?: number;            // Weight in grams
  subCategory?: string;            // e.g. "Beverage Containers", "Kitchenware"
  industrySector?: string;         // e.g. "Rigid Packaging", "Apparel"
  recyclabilityRating?: 'High' | 'Moderate' | 'Low' | 'Non-Recyclable';
  sensorTelemetry?: SensorTelemetry; // Material sensor signature when placed on device
  images: ItemImage[];             // Multi-racur images
  notes?: string;
  sourceDatasetRowId?: string | number;
  createdAt: string;
  updatedAt: string;
}

export interface RawDatasetEntry {
  id: string | number;
  [key: string]: any;
}

export interface CategoryDataset {
  categoryId: CategoryId;
  fileName: string;
  fileFormat: 'json' | 'csv' | 'empty';
  rawText: string;
  parsedRows: RawDatasetEntry[];
  lastModified: string;
}

export interface MachineSortResult {
  detectedCategory: CategoryId;
  targetChute: number;
  confidence: number;
  matchedItemId?: string;
  matchedItemName?: string;
  matchedMaterial?: string;
  detectedDimensions?: {
    heightCm: number;
    widthCm: number;
  };
  classificationReason: string;
  spectralFeatures: {
    reflectivity: number;
    density: number;
    transparency: boolean;
    magnetic: boolean;
    flexibility: 'Rigid' | 'Flexible' | 'Deformable' | 'Brittle';
  };
  sensorTelemetry?: SensorTelemetry;
  sortedAt: string;
}

export interface TrainingExportStats {
  totalItems: number;
  totalImages: number;
  classBreakdown: Record<CategoryId, number>;
  angleCoverage: Record<RacurAngle, number>;
  averageAnglesPerItem: number;
}

export type UserRole = 'admin' | 'engineer' | 'operator' | 'guest';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  facility: string;
  badgeNumber: string;
  clearanceLevel: number; // 1 = Operator, 2 = Calibration Engineer, 3 = Plant Admin
  avatarUrl?: string;
  shift: string;
  lastLogin: string;
}

export interface SystemAuditEntry {
  id: string;
  timestamp: string;
  operatorName: string;
  operatorBadge: string;
  action: string;
  category: 'SECURITY' | 'CALIBRATION' | 'DATASET' | 'HARDWARE' | 'OVERRIDE';
  severity: 'info' | 'warning' | 'critical';
  details: string;
}

export interface PlantHardwareConfig {
  conveyorSpeedMps: number;
  pneumaticPressurePsi: number;
  opticalShutterSpeedUs: number;
  sensorSampleRateHz: number;
  emergencyStopEngaged: boolean;
  minClassificationConfidence: number;
  autoEjectUncertainItems: boolean;
  laserTriggerCalibrationMm: number;
}
