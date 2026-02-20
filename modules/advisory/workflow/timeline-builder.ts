import type { AdvisoryTransitionHistoryEntry } from "@/modules/advisory/types";

export type AdvisoryTimelineItem = {
  id: string;
  at: string;
  title: string;
  description: string;
};

function formatStatusLabel(status: string): string {
  return status
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildAdvisoryTimeline(
  history: AdvisoryTransitionHistoryEntry[],
): AdvisoryTimelineItem[] {
  return [...history]
    .sort((a, b) => b.at.localeCompare(a.at))
    .map((entry, index) => ({
      id: `${entry.at}-${entry.from}-${entry.to}-${index}`,
      at: entry.at,
      title: `Status changed to ${formatStatusLabel(entry.to)}`,
      description: `${entry.byRole} moved from ${formatStatusLabel(entry.from)}.`,
    }));
}
