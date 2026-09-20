import { CategoryId, SensorTelemetry } from '../types';

/**
 * Standard sensor profiles for each material type according to physical physics and industrial sorting spectrometer principles.
 */
export interface MaterialSensorPreset {
  materialName: string;
  categoryId: CategoryId;
  telemetry: SensorTelemetry;
  detectionPrinciples: string[];
}

export const MATERIAL_SENSOR_PRESETS: MaterialSensorPreset[] = [
  // 1. PLASTICS
  {
    materialName: 'PET / PETE (#1)',
    categoryId: 'plastic',
    telemetry: {
      inductiveResponse: 0,
      isMagnetic: false,
      nirWavelengthNm: 1660,
      opticalReflectance: 0.88,
      uvTransmissionPercent: 12,
      capacitiveDielectric: 3.2,
      surfaceHardnessDamping: 62,
      contactResistanceOhm: 1e12,
      temperatureDeltaC: 0.1,
      sensorConfidence: 97,
      dominantModality: 'NIR Spectrometer',
    },
    detectionPrinciples: [
      'Near-Infrared (NIR) absorption peak at 1660nm (C-H overtone stretch)',
      'Zero inductive electromagnetic response confirms non-metallic',
      'High specular optical gloss with low UV transmission',
    ],
  },
  {
    materialName: 'HDPE (#2)',
    categoryId: 'plastic',
    telemetry: {
      inductiveResponse: 0,
      isMagnetic: false,
      nirWavelengthNm: 1730,
      opticalReflectance: 0.45,
      uvTransmissionPercent: 4,
      capacitiveDielectric: 2.3,
      surfaceHardnessDamping: 58,
      contactResistanceOhm: 1e14,
      temperatureDeltaC: 0.1,
      sensorConfidence: 96,
      dominantModality: 'NIR Spectrometer',
    },
    detectionPrinciples: [
      'Strong SWIR absorption peak at 1730nm (CH2 symmetric stretch)',
      'Diffuse optical scattering characteristic of semi-crystalline opaque polymer',
    ],
  },
  {
    materialName: 'PP Polypropylene (#5)',
    categoryId: 'plastic',
    telemetry: {
      inductiveResponse: 0,
      isMagnetic: false,
      nirWavelengthNm: 1710,
      opticalReflectance: 0.52,
      uvTransmissionPercent: 8,
      capacitiveDielectric: 2.2,
      surfaceHardnessDamping: 60,
      contactResistanceOhm: 1e13,
      temperatureDeltaC: 0.1,
      sensorConfidence: 95,
      dominantModality: 'NIR Spectrometer',
    },
    detectionPrinciples: [
      'NIR absorption peak at 1710nm (Polypropylene methyl vibration band)',
      'Low dielectric constant (2.2) upon contact electrode reading',
    ],
  },

  // 2. METALS (IRON & ALUMINUM)
  {
    materialName: 'Cast Iron / Structural Steel',
    categoryId: 'iron_aluminum',
    telemetry: {
      inductiveResponse: 940,
      isMagnetic: true,
      nirWavelengthNm: 0,
      opticalReflectance: 0.35,
      uvTransmissionPercent: 0,
      capacitiveDielectric: 99.0,
      surfaceHardnessDamping: 95,
      contactResistanceOhm: 0.05,
      temperatureDeltaC: 4.8,
      sensorConfidence: 99,
      dominantModality: 'Inductive',
    },
    detectionPrinciples: [
      'High electromagnetic inductive coil saturation (>900/1023)',
      'Permanent magnetic reed switch positive closure',
      'Ultra-high acoustic tap hardness (>90) with high thermal dissipation',
    ],
  },
  {
    materialName: 'Aluminum 6061 / Can Foil',
    categoryId: 'iron_aluminum',
    telemetry: {
      inductiveResponse: 480,
      isMagnetic: false,
      nirWavelengthNm: 0,
      opticalReflectance: 0.82,
      uvTransmissionPercent: 0,
      capacitiveDielectric: 99.0,
      surfaceHardnessDamping: 88,
      contactResistanceOhm: 0.02,
      temperatureDeltaC: 6.2,
      sensorConfidence: 98,
      dominantModality: 'Inductive',
    },
    detectionPrinciples: [
      'High-frequency Eddy Current phase shift without ferromagnetic attraction',
      'Near-zero electrical contact resistance (<0.05 Ohm)',
      'High metallic optical luster with zero light transmission',
    ],
  },

  // 3. GLASS
  {
    materialName: 'Soda-Lime Container Glass',
    categoryId: 'glass',
    telemetry: {
      inductiveResponse: 0,
      isMagnetic: false,
      nirWavelengthNm: 2200,
      opticalReflectance: 0.94,
      uvTransmissionPercent: 88,
      capacitiveDielectric: 7.2,
      surfaceHardnessDamping: 92,
      contactResistanceOhm: 1e11,
      temperatureDeltaC: 1.8,
      sensorConfidence: 96,
      dominantModality: 'Optical UV/Vis',
    },
    detectionPrinciples: [
      'High UV/Visible light transmission (>85%) with 1.52 refractive index',
      'High capacitive dielectric constant (7.2) distinguishing from clear PET (3.2)',
      'Brittle acoustic impact profile on contact plate landing',
    ],
  },
  {
    materialName: 'Borosilicate Glass',
    categoryId: 'glass',
    telemetry: {
      inductiveResponse: 0,
      isMagnetic: false,
      nirWavelengthNm: 2250,
      opticalReflectance: 0.92,
      uvTransmissionPercent: 91,
      capacitiveDielectric: 4.6,
      surfaceHardnessDamping: 94,
      contactResistanceOhm: 1e12,
      temperatureDeltaC: 1.2,
      sensorConfidence: 95,
      dominantModality: 'Optical UV/Vis',
    },
    detectionPrinciples: [
      'High transparency with characteristic silica-boron SWIR absorption beyond 2200nm',
      'Non-conductive, non-inductive dielectric signature',
    ],
  },

  // 4. PAPER, CARDBOARD & WOOD
  {
    materialName: 'Corrugated Cardboard / Kraft Paper',
    categoryId: 'paper_cardboard',
    telemetry: {
      inductiveResponse: 0,
      isMagnetic: false,
      nirWavelengthNm: 1450,
      opticalReflectance: 0.28,
      uvTransmissionPercent: 0,
      capacitiveDielectric: 1.8,
      surfaceHardnessDamping: 42,
      contactResistanceOhm: 5e7,
      temperatureDeltaC: 0.4,
      sensorConfidence: 96,
      dominantModality: 'Capacitive/Cellulose',
    },
    detectionPrinciples: [
      'Dual cellulose moisture & O-H molecular absorption peaks at 1450nm and 1940nm',
      'Low capacitive dielectric constant (1.8) and matte diffuse reflection',
      'Damped contact landing sound with moderate surface friction',
    ],
  },
  {
    materialName: 'Solid Wood (Timber / Plywood)',
    categoryId: 'paper_cardboard',
    telemetry: {
      inductiveResponse: 0,
      isMagnetic: false,
      nirWavelengthNm: 1470,
      opticalReflectance: 0.32,
      uvTransmissionPercent: 0,
      capacitiveDielectric: 3.6,
      surfaceHardnessDamping: 68,
      contactResistanceOhm: 1e8,
      temperatureDeltaC: 0.8,
      sensorConfidence: 94,
      dominantModality: 'Capacitive/Cellulose',
    },
    detectionPrinciples: [
      'Lignin & cellulose SWIR absorption signature',
      'Moderate acoustic damping and non-metallic dielectric response',
    ],
  },

  // 5. TEXTILES & FABRICS
  {
    materialName: '100% Cotton / Denim Fabric',
    categoryId: 'textile',
    telemetry: {
      inductiveResponse: 0,
      isMagnetic: false,
      nirWavelengthNm: 1480,
      opticalReflectance: 0.18,
      uvTransmissionPercent: 2,
      capacitiveDielectric: 2.1,
      surfaceHardnessDamping: 14,
      contactResistanceOhm: 1e9,
      temperatureDeltaC: 0.3,
      sensorConfidence: 95,
      dominantModality: 'Tactile/Damping',
    },
    detectionPrinciples: [
      'Ultra-low contact hardness & high vibration damping (<20/100)',
      'Natural cotton cellulose fiber NIR absorption pattern',
      'Micro-texture optical surface scatter with low specular gloss',
    ],
  },
  {
    materialName: 'Polyester / Synthetic Fiber Tarp',
    categoryId: 'textile',
    telemetry: {
      inductiveResponse: 0,
      isMagnetic: false,
      nirWavelengthNm: 1660,
      opticalReflectance: 0.22,
      uvTransmissionPercent: 3,
      capacitiveDielectric: 2.8,
      surfaceHardnessDamping: 18,
      contactResistanceOhm: 1e11,
      temperatureDeltaC: 0.2,
      sensorConfidence: 93,
      dominantModality: 'Tactile/Damping',
    },
    detectionPrinciples: [
      'High mechanical flexibility with low contact acoustic resistance',
      'Synthetic ester polymer NIR peak combined with woven textile profile',
    ],
  },

  // 6. GENERAL WASTE / COMPOSITE
  {
    materialName: 'Mixed Multi-layer Composite (Foil + Plastic)',
    categoryId: 'general_waste',
    telemetry: {
      inductiveResponse: 110,
      isMagnetic: false,
      nirWavelengthNm: 1680,
      opticalReflectance: 0.65,
      uvTransmissionPercent: 0,
      capacitiveDielectric: 4.2,
      surfaceHardnessDamping: 25,
      contactResistanceOhm: 1e4,
      temperatureDeltaC: 0.9,
      sensorConfidence: 88,
      dominantModality: 'NIR Spectrometer',
    },
    detectionPrinciples: [
      'Contradictory sensor readings: weak eddy-current response (110) beneath polymer layer',
      'Multi-layer optical interference prevents clean single-resin classification',
      'Automatically diverted to Chute #6 (Landfill General Waste)',
    ],
  },
];

/**
 * Generate default sensor telemetry based on category & material name
 */
export function generateDefaultSensorTelemetry(
  categoryId: CategoryId,
  materialName: string
): SensorTelemetry {
  const match = MATERIAL_SENSOR_PRESETS.find(
    (p) =>
      p.materialName.toLowerCase().includes(materialName.toLowerCase()) ||
      materialName.toLowerCase().includes(p.materialName.toLowerCase()) ||
      p.categoryId === categoryId
  );

  if (match) {
    // Add minor realistic measurement variance (±2%)
    const base = match.telemetry;
    const jitter = () => (Math.random() - 0.5) * 0.04;

    return {
      ...base,
      inductiveResponse: Math.max(0, Math.min(1023, Math.round(base.inductiveResponse * (1 + jitter())))),
      nirWavelengthNm: base.nirWavelengthNm ? Math.round(base.nirWavelengthNm * (1 + jitter() * 0.5)) : 0,
      opticalReflectance: Math.min(1, Math.max(0, Number((base.opticalReflectance * (1 + jitter())).toFixed(2)))),
      uvTransmissionPercent: Math.min(100, Math.max(0, Math.round(base.uvTransmissionPercent * (1 + jitter())))),
      capacitiveDielectric: Number((base.capacitiveDielectric * (1 + jitter())).toFixed(1)),
      surfaceHardnessDamping: Math.min(100, Math.max(0, Math.round(base.surfaceHardnessDamping * (1 + jitter())))),
      sensorConfidence: Math.min(99, Math.max(85, Math.round(base.sensorConfidence * (1 + jitter())))),
    };
  }

  // Fallback generic telemetry
  return {
    inductiveResponse: 0,
    isMagnetic: false,
    nirWavelengthNm: 1650,
    opticalReflectance: 0.5,
    uvTransmissionPercent: 10,
    capacitiveDielectric: 3.0,
    surfaceHardnessDamping: 50,
    contactResistanceOhm: 1e9,
    temperatureDeltaC: 0.5,
    sensorConfidence: 90,
    dominantModality: 'NIR Spectrometer',
  };
}
