import type { ModulePlugin } from "./types";
import { traceDependencyGraph } from "@/platform/telemetry/dependency-trace";

type DependencyGraph = {
  byId: Map<string, ModulePlugin>;
  edgesByModule: Map<string, string[]>;
};

function buildDependencyGraph(modules: readonly ModulePlugin[]): DependencyGraph {
  const byId = new Map<string, ModulePlugin>();
  const edgesByModule = new Map<string, string[]>();

  modules.forEach((modulePlugin) => {
    byId.set(modulePlugin.id, modulePlugin);
    edgesByModule.set(modulePlugin.id, [...(modulePlugin.dependsOn ?? [])]);
  });

  return { byId, edgesByModule };
}

function validateMissingDependencies(graph: DependencyGraph) {
  graph.edgesByModule.forEach((dependencies, moduleId) => {
    dependencies.forEach((dependencyId) => {
      if (graph.byId.has(dependencyId)) return;
      throw new Error(
        `Module dependency error: "${moduleId}" depends on missing module "${dependencyId}".`,
      );
    });
  });
}

function findCircularDependency(
  graph: DependencyGraph,
): readonly string[] | null {
  const visited = new Set<string>();
  const inProgress = new Set<string>();
  const path: string[] = [];

  function visit(moduleId: string): readonly string[] | null {
    if (inProgress.has(moduleId)) {
      const cycleStart = path.indexOf(moduleId);
      const cyclePath = path.slice(cycleStart);
      return [...cyclePath, moduleId];
    }

    if (visited.has(moduleId)) return null;

    visited.add(moduleId);
    inProgress.add(moduleId);
    path.push(moduleId);

    const dependencies = graph.edgesByModule.get(moduleId) ?? [];
    for (const dependencyId of dependencies) {
      const cyclePath = visit(dependencyId);
      if (cyclePath) return cyclePath;
    }

    inProgress.delete(moduleId);
    path.pop();
    return null;
  }

  for (const moduleId of graph.byId.keys()) {
    const cyclePath = visit(moduleId);
    if (cyclePath) return cyclePath;
  }

  return null;
}

function validateCircularDependencies(graph: DependencyGraph) {
  const cyclePath = findCircularDependency(graph);
  if (!cyclePath) return;

  throw new Error(
    `Module dependency error: circular dependency detected (${cyclePath.join(" -> ")}).`,
  );
}

export function validateDependencyGraph(modules: readonly ModulePlugin[]) {
  const graph = buildDependencyGraph(modules);
  validateMissingDependencies(graph);
  validateCircularDependencies(graph);
}

export function topologicalSort(
  modules: readonly ModulePlugin[],
): readonly ModulePlugin[] {
  const graph = buildDependencyGraph(modules);
  validateMissingDependencies(graph);
  validateCircularDependencies(graph);

  const indegreeByModule = new Map<string, number>();
  const dependentsByModule = new Map<string, string[]>();

  modules.forEach((modulePlugin) => {
    indegreeByModule.set(modulePlugin.id, 0);
    dependentsByModule.set(modulePlugin.id, []);
  });

  graph.edgesByModule.forEach((dependencies, moduleId) => {
    indegreeByModule.set(moduleId, dependencies.length);
    dependencies.forEach((dependencyId) => {
      const dependents = dependentsByModule.get(dependencyId);
      if (!dependents) return;
      dependents.push(moduleId);
    });
  });

  const moduleOrder = new Map<string, number>(
    modules.map((modulePlugin, index) => [modulePlugin.id, index]),
  );

  const ready: string[] = modules
    .filter((modulePlugin) => (indegreeByModule.get(modulePlugin.id) ?? 0) === 0)
    .map((modulePlugin) => modulePlugin.id);

  const sortedIds: string[] = [];

  while (ready.length > 0) {
    ready.sort(
      (a, b) => (moduleOrder.get(a) ?? Number.MAX_SAFE_INTEGER) - (moduleOrder.get(b) ?? Number.MAX_SAFE_INTEGER),
    );

    const nextId = ready.shift();
    if (!nextId) continue;
    sortedIds.push(nextId);

    const dependents = dependentsByModule.get(nextId) ?? [];
    dependents.forEach((dependentId) => {
      const currentIndegree = indegreeByModule.get(dependentId) ?? 0;
      const nextIndegree = currentIndegree - 1;
      indegreeByModule.set(dependentId, nextIndegree);
      if (nextIndegree === 0) ready.push(dependentId);
    });
  }

  if (sortedIds.length !== modules.length) {
    throw new Error(
      "Module dependency error: circular dependency detected while ordering modules.",
    );
  }

  traceDependencyGraph(modules, sortedIds);

  return sortedIds.map((moduleId) => {
    const modulePlugin = graph.byId.get(moduleId);
    if (!modulePlugin) {
      throw new Error(
        `Module dependency error: failed to resolve module "${moduleId}" after ordering.`,
      );
    }
    return modulePlugin;
  });
}
