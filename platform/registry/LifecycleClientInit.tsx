"use client";

import { useEffect } from "react";
import { useService } from "@/platform/services/useService";

export function LifecycleClientInit() {
  const moduleService = useService("moduleService");

  useEffect(() => {
    moduleService.runClientModuleInit();
  }, [moduleService]);

  return null;
}
