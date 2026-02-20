import Link from "next/link";
import PageShell from "@/core/layout/PageShell";
import AdvisoryStatusBadge from "@/modules/advisory/components/AdvisoryStatusBadge";
import type { AdvisoryStatusCounts } from "@/modules/advisory/services/advisory-aggregation";
import type { Advisory } from "@/modules/advisory/types";
import { Button, Card, Container, Heading, Section } from "@/shared/ui";
import type { Role } from "@/platform/roles";
import { ROLES } from "@/platform/roles";

const FILTER_ROLES: readonly Role[] = [ROLES.ADMIN, ROLES.ADVISOR, ROLES.CLIENT];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DashboardPage({
  authRole,
  selectedRole,
  statusCounts,
  recentAdvisories,
  roleFilteredAdvisories,
}: {
  authRole: Role;
  selectedRole: Role;
  statusCounts: AdvisoryStatusCounts;
  recentAdvisories: Advisory[];
  roleFilteredAdvisories: Advisory[];
}) {
  return (
    <PageShell>
      <Section variant="default" compact>
        <Container className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Heading level={1}>Advisory Dashboard</Heading>
              <p className="mt-2 text-sm text-primary/70">
                Aggregated advisory status and role-based case visibility.
              </p>
            </div>
            <Button href="/advisory" variant="secondary">
              Open Advisory List
            </Button>
          </div>

          <Card variant="elevated" className="space-y-4">
            <Heading level={2}>Status Counts</Heading>
            <div className="grid gap-3 sm:grid-cols-3">
              <Card variant="flat" className="rounded-md border border-primary/15 p-4">
                <p className="text-xs uppercase tracking-wide text-primary/60">draft</p>
                <p className="mt-1 text-2xl font-semibold">{statusCounts.draft}</p>
              </Card>
              <Card variant="flat" className="rounded-md border border-primary/15 p-4">
                <p className="text-xs uppercase tracking-wide text-primary/60">in-review</p>
                <p className="mt-1 text-2xl font-semibold">{statusCounts["in-review"]}</p>
              </Card>
              <Card variant="flat" className="rounded-md border border-primary/15 p-4">
                <p className="text-xs uppercase tracking-wide text-primary/60">approved</p>
                <p className="mt-1 text-2xl font-semibold">{statusCounts.approved}</p>
              </Card>
            </div>
          </Card>

          <Card variant="elevated" className="space-y-4">
            <Heading level={2}>Recent Advisories</Heading>
            {recentAdvisories.length === 0 ? (
              <p className="text-sm text-primary/70">No advisory records yet.</p>
            ) : (
              <ul className="space-y-2">
                {recentAdvisories.map((advisory) => (
                  <li
                    key={advisory.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-primary/15 p-3"
                  >
                    <div>
                      <p className="font-semibold text-primary/90">{advisory.clientName}</p>
                      <p className="text-xs text-primary/70">{formatDate(advisory.createdAt)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <AdvisoryStatusBadge status={advisory.status} />
                      <Link href={`/advisory/${advisory.id}`} className="text-sm font-semibold underline">
                        View details
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card variant="elevated" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Heading level={2}>Role Filtered Advisories</Heading>
              <div className="flex flex-wrap gap-2">
                {FILTER_ROLES.map((role) => (
                  <Button
                    key={role}
                    href={`/advisory/dashboard?role=${role}`}
                    variant={selectedRole === role ? "primary" : "ghost"}
                    className="px-3 py-2 text-sm"
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>
            <p className="text-sm text-primary/70">Viewing as role: {selectedRole} (signed in as {authRole})</p>
            {roleFilteredAdvisories.length === 0 ? (
              <p className="text-sm text-primary/70">No advisories match this role view.</p>
            ) : (
              <ul className="space-y-2">
                {roleFilteredAdvisories.map((advisory) => (
                  <li
                    key={advisory.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-primary/15 p-3"
                  >
                    <div>
                      <p className="font-semibold text-primary/90">{advisory.clientName}</p>
                      <p className="text-xs text-primary/70">{advisory.riskProfile}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <AdvisoryStatusBadge status={advisory.status} />
                      <Link href={`/advisory/${advisory.id}`} className="text-sm font-semibold underline">
                        Open advisory
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </Container>
      </Section>
    </PageShell>
  );
}
