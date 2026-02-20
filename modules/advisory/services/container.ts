import { getServiceContainer } from "@/platform/services/container";
import {
  createAdvisoryService,
  type AdvisoryService,
} from "@/modules/advisory/services/advisory-service";

type AdvisoryServices = {
  advisoryService: AdvisoryService;
};

const serviceContainer = getServiceContainer<AdvisoryServices>();
let initialized = false;

function ensureAdvisoryServicesRegistered() {
  if (initialized) return;

  if (!serviceContainer.has("advisoryService")) {
    serviceContainer.register("advisoryService", () => createAdvisoryService());
  }

  initialized = true;
}

export function getAdvisoryService() {
  ensureAdvisoryServicesRegistered();
  return serviceContainer.get("advisoryService");
}
