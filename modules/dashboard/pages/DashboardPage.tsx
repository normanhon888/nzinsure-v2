import PageShell from "@/core/layout/PageShell";
import AdvisoryStatusBadge from "@/modules/advisory/components/AdvisoryStatusBadge";
import type {
  GlobalStatusCounts,
  PendingTask,
  RecentActivityItem,
} from "@/modules/dashboard/services/dashboard-aggregation";
import type { Role } from "@/platform/roles";
import { ROLES } from "@/platform/roles";
import { Button, Card, Container, Heading, Section } from "@/shared/ui";

const FILTER_ROLES: readonly Role[] = [ROLES.ADMIN, ROLES.ADVISOR, ROLES.CLIENT];

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DashboardPage({
  authRole,
  selectedRole,
  statusCounts,
  pendingTasks,
  recentActivity,
}: {
  authRole: Role;
  selectedRole: Role;
  statusCounts: GlobalStatusCounts;
  pendingTasks: PendingTask[];
  recentActivity: RecentActivityItem[];
}) {
  return (
    <PageShell>
      <Section variant="default" compact>
        <Container className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Heading level={1}>Global Dashboard</Heading>
              <p className="mt-2 text-sm text-primary/70">
                Cross-module operational snapshot filtered by platform role.
              </p>
            </div>
            <Button href="/advisory/dashboard" variant="secondary">
              Open Advisory Dashboard
            </Button>
          </div>

          <Card variant="elevated" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Heading level={2}>Role Filter</Heading>
              <div className="flex flex-wrap gap-2">
                {FILTER_ROLES.map((role) => (
                  <Button
                    key={role}
                    href={`/dashboard?role=${role}`}
                    variant={selectedRole === role ? "primary" : "ghost"}
                    className="px-3 py-2 text-sm"
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>
            <p className="text-sm text-primary/70">Viewing as role: {selectedRole} (signed in as {authRole})</p>
          </Card>

          <Card variant="elevated" className="space-y-4">
            <Heading level={2}>Status Count Cards</Heading>
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
            <Heading level={2}>Pending Tasks</Heading>
            {pendingTasks.length === 0 ? (
              <p className="text-sm text-primary/70">No pending tasks for this role.</p>
            ) : (
              <ul className="space-y-2">
                {pendingTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-primary/15 p-3"
                  >
                    <div>
                      <p className="font-semibold text-primary/90">{task.title}</p>
                      <p className="text-xs text-primary/70">{task.summary}</p>
                      <p className="text-xs text-primary/70">Created {formatDateTime(task.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <AdvisoryStatusBadge status={task.status} />
                      <Button href={task.href} variant="ghost" className="px-3 py-2 text-sm underline">
                        Open
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card variant="elevated" className="space-y-4">
            <Heading level={2}>Recent Activity</Heading>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-primary/70">No activity yet.</p>
            ) : (
              <ul className="space-y-2">
                {recentActivity.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-primary/15 p-3"
                  >
                    <div>
                      <p className="font-semibold text-primary/90">{item.text}</p>
                      <p className="text-xs text-primary/70">{formatDateTime(item.occurredAt)}</p>
                    </div>
                    <Button href={item.href} variant="ghost" className="px-3 py-2 text-sm underline">
                      View
                    </Button>
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
