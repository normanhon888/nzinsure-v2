"use client";

import { useMemo } from "react";
import { getService, type PlatformServices } from "./registry";

export function useService<TName extends keyof PlatformServices>(name: TName) {
  return useMemo(() => getService(name), [name]);
}
