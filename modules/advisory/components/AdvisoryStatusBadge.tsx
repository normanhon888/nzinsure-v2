import type { AdvisoryStatus } from "@/modules/advisory/types";

const STATUS_STYLES: Record<AdvisoryStatus, string> = {
  draft: "border border-primary/20 bg-surface text-primary/80",
  "in-review": "border border-accent/50 bg-accent/10 text-primary",
  approved: "border border-emerald-500/40 bg-emerald-500/10 text-primary",
};

export default function AdvisoryStatusBadge({ status }: { status: AdvisoryStatus }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        STATUS_STYLES[status],
      ].join(" ")}
    >
      {status}
    </span>
  );
}
