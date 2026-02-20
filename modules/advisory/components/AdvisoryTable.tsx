import { Button, Card } from "@/shared/ui";
import type { Advisory } from "@/modules/advisory/types";
import AdvisoryStatusBadge from "@/modules/advisory/components/AdvisoryStatusBadge";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdvisoryTable({ advisories }: { advisories: Advisory[] }) {
  if (advisories.length === 0) {
    return (
      <Card variant="elevated">
        <p className="text-sm text-primary/70">No advisory records yet.</p>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-primary/15">
            <th className="px-2 py-2 font-semibold text-primary/80">Client</th>
            <th className="px-2 py-2 font-semibold text-primary/80">Risk</th>
            <th className="px-2 py-2 font-semibold text-primary/80">Status</th>
            <th className="px-2 py-2 font-semibold text-primary/80">Created</th>
            <th className="px-2 py-2 font-semibold text-primary/80">Action</th>
          </tr>
        </thead>
        <tbody>
          {advisories.map((advisory) => (
            <tr key={advisory.id} className="border-b border-primary/10">
              <td className="px-2 py-2">{advisory.clientName}</td>
              <td className="px-2 py-2">{advisory.riskProfile}</td>
              <td className="px-2 py-2">
                <AdvisoryStatusBadge status={advisory.status} />
              </td>
              <td className="px-2 py-2">{formatDate(advisory.createdAt)}</td>
              <td className="px-2 py-2">
                <Button href={`/advisory/${advisory.id}`} variant="ghost" className="px-3 py-1">
                  Open
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
