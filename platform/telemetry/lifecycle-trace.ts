import { platformLogger } from "./logger";

type TracedLifecycleHook = "onRegister" | "onServerInit" | "onClientInit";

type LifecycleExecutionRecord = {
  moduleId: string;
  hook: TracedLifecycleHook;
  durationMs: number;
};

let latestLifecycleExecutions: readonly LifecycleExecutionRecord[] = [];

function getTimestamp() {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

export function traceLifecycleExecution<T>(
  moduleId: string,
  hook: TracedLifecycleHook,
  fn: () => T,
): T {
  const startedAt = getTimestamp();
  try {
    return fn();
  } finally {
    const durationMs = Math.round((getTimestamp() - startedAt) * 1000) / 1000;
    latestLifecycleExecutions = [
      ...latestLifecycleExecutions.filter(
        (entry) => !(entry.moduleId === moduleId && entry.hook === hook),
      ),
      { moduleId, hook, durationMs },
    ];

    if (platformLogger.isEnabled) {
      platformLogger.info("lifecycle.hook.duration", { moduleId, hook, durationMs });
    }
  }
}

export function getLifecycleExecutionSnapshot(): readonly LifecycleExecutionRecord[] {
  return latestLifecycleExecutions.map((entry) => ({ ...entry }));
}
