import { redirect } from "next/navigation";
import PageShell from "@/core/layout/PageShell";
import {
  Button,
  Card,
  Container,
  Heading,
  Section,
} from "@/shared/ui";
import {
  ADVISORY_WRITE_ROLES,
  requireAdvisoryAccess,
} from "@/modules/advisory/services/access-control";
import { getAdvisoryService } from "@/modules/advisory/services/container";

async function createAdvisoryAction(formData: FormData) {
  "use server";

  await requireAdvisoryAccess(ADVISORY_WRITE_ROLES);

  const clientName = String(formData.get("clientName") ?? "").trim();
  const riskProfile = String(formData.get("riskProfile") ?? "").trim();
  const coverageNotes = String(formData.get("coverageNotes") ?? "").trim();

  if (!clientName || !riskProfile || !coverageNotes) {
    return;
  }

  const advisory = getAdvisoryService().create({
    clientName,
    riskProfile,
    coverageNotes,
    status: "draft",
  });

  redirect(`/advisory/${advisory.id}`);
}

export default async function AdvisoryNewPage() {
  await requireAdvisoryAccess(ADVISORY_WRITE_ROLES);

  return (
    <PageShell>
      <Section variant="default" compact>
        <Container className="space-y-6">
          <Heading level={1}>Create Advisory</Heading>

          <Card variant="elevated">
            <form action={createAdvisoryAction} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="clientName" className="block text-sm font-semibold">
                  Client Name
                </label>
                <input
                  id="clientName"
                  name="clientName"
                  required
                  className="w-full rounded-md border border-primary/20 bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="riskProfile" className="block text-sm font-semibold">
                  Risk Profile
                </label>
                <input
                  id="riskProfile"
                  name="riskProfile"
                  required
                  className="w-full rounded-md border border-primary/20 bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="coverageNotes" className="block text-sm font-semibold">
                  Coverage Notes
                </label>
                <textarea
                  id="coverageNotes"
                  name="coverageNotes"
                  required
                  rows={5}
                  className="w-full rounded-md border border-primary/20 bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit">Save Draft</Button>
                <Button href="/advisory" variant="secondary">
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </Container>
      </Section>
    </PageShell>
  );
}
