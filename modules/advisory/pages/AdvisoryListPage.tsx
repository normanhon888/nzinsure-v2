import PageShell from "@/core/layout/PageShell";
import {
  Button,
  Container,
  Heading,
  Section,
} from "@/shared/ui";
import AdvisoryTable from "@/modules/advisory/components/AdvisoryTable";
import {
  ADVISORY_READ_ROLES,
  ADVISORY_WRITE_ROLES,
  requireAdvisoryAccess,
} from "@/modules/advisory/services/access-control";
import { getAdvisoryService } from "@/modules/advisory/services/container";
import { canAccess } from "@/platform/roles/permissions";

export default async function AdvisoryListPage() {
  const auth = await requireAdvisoryAccess(ADVISORY_READ_ROLES);
  const advisoryService = getAdvisoryService();
  const advisories = advisoryService.list();
  const canCreate = canAccess(auth.role, ADVISORY_WRITE_ROLES);

  return (
    <PageShell>
      <Section variant="default" compact>
        <Container className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Heading level={1}>Advisory Cases</Heading>
              <p className="mt-2 text-sm text-primary/70">
                Core advisory records and status tracking.
              </p>
            </div>

            {canCreate ? (
              <Button href="/advisory/new">Create Advisory</Button>
            ) : null}
          </div>

          <AdvisoryTable advisories={advisories} />
        </Container>
      </Section>
    </PageShell>
  );
}
