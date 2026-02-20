type LogFields = Record<string, unknown>;

const IS_TELEMETRY_ENABLED = process.env.NODE_ENV === "development";
const PLATFORM_PREFIX = "[Platform]";

function writeLog(
  level: "info" | "warn" | "error",
  event: string,
  fields?: LogFields,
) {
  if (!IS_TELEMETRY_ENABLED) return;

  if (fields) {
    console[level](`${PLATFORM_PREFIX} ${event}`, fields);
    return;
  }

  console[level](`${PLATFORM_PREFIX} ${event}`);
}

export const platformLogger = {
  isEnabled: IS_TELEMETRY_ENABLED,
  info(event: string, fields?: LogFields) {
    writeLog("info", event, fields);
  },
  warn(event: string, fields?: LogFields) {
    writeLog("warn", event, fields);
  },
  error(event: string, fields?: LogFields) {
    writeLog("error", event, fields);
  },
};
