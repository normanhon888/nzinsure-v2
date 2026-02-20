import { notFound, redirect } from "next/navigation";
import PageShell from "@/core/layout/PageShell";
import {
  Button,
  Card,
  Container,
  Heading,
  Section,
} from "@/shared/ui";
import AdvisoryStatusBadge from "@/modules/advisory/components/AdvisoryStatusBadge";
import {
  ADVISORY_READ_ROLES,
  ADVISORY_WRITE_ROLES,
  requireAdvisoryAccess,
} from "@/modules/advisory/services/access-control";
import { getAdvisoryService } from "@/modules/advisory/services/container";
import { isAdvisoryStatus } from "@/modules/advisory/types";
import { canAccess } from "@/platform/roles/permissions";
import { getRoleAllowedTransitions } from "@/modules/advisory/workflow/transitions";
import { buildAdvisoryTimeline } from "@/modules/advisory/workflow/timeline-builder";

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function updateStatusAction(id: string, formData: FormData) {
  "use server";

  const auth = await requireAdvisoryAccess(ADVISORY_WRITE_ROLES);

  const nextStatus = String(formData.get("status") ?? "");
  if (!isAdvisoryStatus(nextStatus)) {
    return;
  }

  getAdvisoryService().transitionStatus(id, nextStatus, auth.role);
  redirect(`/advisory/${id}`);
}

export default async function AdvisoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const auth = await requireAdvisoryAccess(ADVISORY_READ_ROLES);
  const advisory = getAdvisoryService().getById(params.id);
  const canWrite = canAccess(auth.role, ADVISORY_WRITE_ROLES);

  if (!advisory) {
    notFound();
  }

  const boundUpdateStatusAction = updateStatusAction.bind(null, advisory.id);
  const allowedTransitions = getRoleAllowedTransitions(auth.role, advisory.status);
  const timelineItems = buildAdvisoryTimeline(advisory.history);

  return (
    <PageShell>
      <Section variant="default" compact>
        <Container className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Heading level={1}>{advisory.clientName}</Heading>
              <AdvisoryStatusBadge status={advisory.status} />
          </div>

          <Card variant="elevated" className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary/60">Risk Profile</p>
              <p className="text-primary/90">{advisory.riskProfile}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-primary/60">Coverage Notes</p>
              <p className="whitespace-pre-wrap text-primary/90">{advisory.coverageNotes}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-primary/60">Current Status</p>
              <p className="mt-1">
                <AdvisoryStatusBadge status={advisory.status} />
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-primary/60">Created</p>
              <p className="text-primary/90">{formatTimestamp(advisory.createdAt)}</p>
            </div>
          </Card>

          <Card variant="elevated" className="space-y-4">
            <div>
              <p className="text-sm font-semibold">Allowed Transitions ({auth.role})</p>
              {allowedTransitions.length > 0 ? (
                <p className="text-sm text-primary/80">{allowedTransitions.join(", ")}</p>
              ) : (
                <p className="text-sm text-primary/70">No transitions available from this state.</p>
              )}
            </div>

            {canWrite && allowedTransitions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allowedTransitions.map((status) => (
                  <form key={status} action={boundUpdateStatusAction}>
                    <input type="hidden" name="status" value={status} />
                    <Button type="submit">{status}</Button>
                  </form>
                ))}
              </div>
            ) : null}
          </Card>

          <Card variant="elevated" className="space-y-3">
            <p className="text-sm font-semibold">Status Timeline</p>
            {timelineItems.length === 0 ? (
              <p className="text-sm text-primary/70">No status transitions yet.</p>
            ) : (
              <ul className="space-y-3">
                {timelineItems.map((item) => (
                  <li key={item.id} className="rounded-md border border-primary/15 p-3">
                    <p className="text-sm font-semibold text-primary/90">{item.title}</p>
                    <p className="text-xs text-primary/70">{item.description}</p>
                    <p className="mt-1 text-xs text-primary/60">{formatTimestamp(item.at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {canWrite && allowedTransitions.length === 0 ? (
            <Card variant="elevated">
              <p className="text-sm text-primary/70">
                This advisory cannot be moved to another status from its current state.
              </p>
            </Card>
          ) : null}

          <Button href="/advisory" variant="secondary">
            Back To List
          </Button>
        </Container>
      </Section>
    </PageShell>
  );
}
