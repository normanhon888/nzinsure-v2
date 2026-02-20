export const FEATURE_FLAGS = {
  advisoryModule: "advisoryModule",
  clientPortalModule: "clientPortalModule",
  advisorWorkbenchModule: "advisorWorkbenchModule",
  adminConsoleModule: "adminConsoleModule",
  ENABLE_DASHBOARD: "ENABLE_DASHBOARD",
} as const;

export type FeatureFlag = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

const DEFAULT_FEATURE_FLAG_STATE: Readonly<Record<FeatureFlag, boolean>> = {
  advisoryModule: true,
  clientPortalModule: true,
  advisorWorkbenchModule: true,
  adminConsoleModule: true,
  ENABLE_DASHBOARD: true,
};

const FEATURE_ENV_MAP: Readonly<Record<FeatureFlag, string>> = {
  advisoryModule: "FEATURE_ADVISORY_MODULE",
  clientPortalModule: "FEATURE_CLIENT_PORTAL_MODULE",
  advisorWorkbenchModule: "FEATURE_ADVISOR_WORKBENCH_MODULE",
  adminConsoleModule: "FEATURE_ADMIN_CONSOLE_MODULE",
  ENABLE_DASHBOARD: "ENABLE_DASHBOARD",
};

function parseBooleanFlag(value: string | undefined): boolean | null {
  if (!value) return null;

  const normalized = value.trim().toLowerCase();
  if (normalized === "1" || normalized === "true") return true;
  if (normalized === "0" || normalized === "false") return false;
  return null;
}

function loadFeatureFlags(): Record<FeatureFlag, boolean> {
  const features: Record<FeatureFlag, boolean> = {
    ...DEFAULT_FEATURE_FLAG_STATE,
  };

  for (const flag of Object.values(FEATURE_FLAGS)) {
    const parsedValue = parseBooleanFlag(process.env[FEATURE_ENV_MAP[flag]]);
    if (parsedValue !== null) {
      features[flag] = parsedValue;
    }
  }

  return features;
}

const featureState = loadFeatureFlags();

export function isFeatureEnabled(flag: FeatureFlag | undefined): boolean {
  if (!flag) return true;
  return featureState[flag];
}

export function getFeatureFlagSnapshot(): Readonly<Record<FeatureFlag, boolean>> {
  return { ...featureState };
}
