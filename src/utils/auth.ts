import { AuthUser, UserRole, SystemAuditEntry, PlantHardwareConfig } from '../types';

export const DEMO_OPERATORS: Record<UserRole, AuthUser> = {
  admin: {
    id: 'USR-ADM-01',
    name: 'Dr. Elena Vance',
    email: 'admin@landfill.io',
    role: 'admin',
    roleTitle: 'Chief Waste Systems Director',
    facility: 'EcoSort Reclamation Facility #4',
    badgeNumber: 'ADM-8821',
    clearanceLevel: 3,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    shift: 'General Operations',
    lastLogin: new Date().toISOString(),
  },
  engineer: {
    id: 'USR-ENG-04',
    name: 'Marcus Chen',
    email: 'engineer@recycle.ai',
    role: 'engineer',
    roleTitle: 'Optical & Sensor Lead Engineer',
    facility: 'EcoSort NIR Telemetry Lab',
    badgeNumber: 'ENG-4092',
    clearanceLevel: 2,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    shift: 'Day Shift A',
    lastLogin: new Date().toISOString(),
  },
  operator: {
    id: 'USR-OPR-12',
    name: 'Alex Rivera',
    email: 'operator@plant.eco',
    role: 'operator',
    roleTitle: 'Conveyor Sorting Specialist',
    facility: 'EcoSort Reclamation Facility #4',
    badgeNumber: 'OPR-1108',
    clearanceLevel: 1,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    shift: 'Morning Shift B',
    lastLogin: new Date().toISOString(),
  },
  guest: {
    id: 'USR-GST-99',
    name: 'Field Auditor (Guest)',
    email: 'visitor@auditing.gov',
    role: 'guest',
    roleTitle: 'Environmental Compliance Observer',
    facility: 'Inspection Portal',
    badgeNumber: 'GST-0099',
    clearanceLevel: 1,
    shift: 'Visitor Log',
    lastLogin: new Date().toISOString(),
  },
};

const AUTH_STORAGE_KEY = 'landfill_separation_auth_user_v1';
const REMEMBER_EMAIL_KEY = 'landfill_separation_remember_email_v1';
const OPERATORS_LIST_KEY = 'landfill_separation_operators_list_v1';
const AUDIT_LOGS_KEY = 'landfill_separation_audit_logs_v1';
const HARDWARE_CONFIG_KEY = 'landfill_separation_hardware_config_v1';

export const DEFAULT_HARDWARE_CONFIG: PlantHardwareConfig = {
  conveyorSpeedMps: 1.8,
  pneumaticPressurePsi: 92,
  opticalShutterSpeedUs: 450,
  sensorSampleRateHz: 250,
  emergencyStopEngaged: false,
  minClassificationConfidence: 82,
  autoEjectUncertainItems: true,
  laserTriggerCalibrationMm: 12.4,
};

export const INITIAL_AUDIT_LOGS: SystemAuditEntry[] = [
  {
    id: 'AUD-901',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    operatorName: 'Dr. Elena Vance',
    operatorBadge: 'ADM-8821',
    action: 'System Security Verification',
    category: 'SECURITY',
    severity: 'info',
    details: 'Verified TLS 256-bit certificates and optical chute telemetry calibration across all 6 sorting channels.',
  },
  {
    id: 'AUD-902',
    timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(),
    operatorName: 'Marcus Chen',
    operatorBadge: 'ENG-4092',
    action: 'NIR Spectrometer Calibration',
    category: 'CALIBRATION',
    severity: 'info',
    details: 'Recalibrated PET/HDPE absorption peaks at 1660nm and 1730nm with 98.4% optical reflectance baseline.',
  },
  {
    id: 'AUD-903',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    operatorName: 'Alex Rivera',
    operatorBadge: 'OPR-1108',
    action: 'Conveyor Speed Nominal Check',
    category: 'HARDWARE',
    severity: 'info',
    details: 'Conveyor belt line #4 running steady at 1.80 m/s with 92 PSI pneumatic ejector response.',
  },
];

export function getStoredAuthUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse auth user from storage', e);
  }
  return null;
}

export function saveStoredAuthUser(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to save auth user to storage', e);
  }
}

export function getRememberedEmail(): string {
  try {
    return localStorage.getItem(REMEMBER_EMAIL_KEY) || '';
  } catch {
    return '';
  }
}

export function saveRememberedEmail(email: string, remember: boolean) {
  try {
    if (remember && email) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }
  } catch {
    // ignore
  }
}

export function loadRegisteredOperators(): AuthUser[] {
  try {
    const saved = localStorage.getItem(OPERATORS_LIST_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return Object.values(DEMO_OPERATORS);
}

export function saveRegisteredOperators(operators: AuthUser[]) {
  try {
    localStorage.setItem(OPERATORS_LIST_KEY, JSON.stringify(operators));
  } catch {
    // ignore
  }
}

export function loadSystemAuditLogs(): SystemAuditEntry[] {
  try {
    const saved = localStorage.getItem(AUDIT_LOGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_AUDIT_LOGS;
}

export function saveSystemAuditLogs(logs: SystemAuditEntry[]) {
  try {
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
  } catch {
    // ignore
  }
}

export function loadPlantHardwareConfig(): PlantHardwareConfig {
  try {
    const saved = localStorage.getItem(HARDWARE_CONFIG_KEY);
    if (saved) {
      return { ...DEFAULT_HARDWARE_CONFIG, ...JSON.parse(saved) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_HARDWARE_CONFIG;
}

export function savePlantHardwareConfig(cfg: PlantHardwareConfig) {
  try {
    localStorage.setItem(HARDWARE_CONFIG_KEY, JSON.stringify(cfg));
  } catch {
    // ignore
  }
}
