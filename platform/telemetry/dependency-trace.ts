import type { ModulePlugin } from "@/platform/registry/types";
import { platformLogger } from "./logger";

type DependencyEdge = {
  from: string;
  to: string;
};

type DependencyGraphSnapshot = {
  topologicalOrder: readonly string[];
  edges: readonly DependencyEdge[];
};

let dependencyGraphSnapshot: DependencyGraphSnapshot = {
  topologicalOrder: [],
  edges: [],
};

function buildDependencyEdges(modules: readonly ModulePlugin[]): readonly DependencyEdge[] {
  return modules.flatMap((modulePlugin) =>
    (modulePlugin.dependsOn ?? []).map((dependencyId) => ({
      from: modulePlugin.id,
      to: dependencyId,
    })),
  );
}

export function traceDependencyGraph(
  modules: readonly ModulePlugin[],
  topologicalOrder: readonly string[],
) {
  const edges = buildDependencyEdges(modules);
  dependencyGraphSnapshot = {
    topologicalOrder: [...topologicalOrder],
    edges,
  };

  if (!platformLogger.isEnabled) return;

  platformLogger.info("dependency.graph.edges", { edges });
  platformLogger.info("dependency.graph.order", { topologicalOrder });
}

export function getDependencyGraphSnapshot() {
  return {
    topologicalOrder: [...dependencyGraphSnapshot.topologicalOrder],
    edges: dependencyGraphSnapshot.edges.map((edge) => ({ ...edge })),
  };
}

