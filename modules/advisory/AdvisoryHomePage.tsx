import PageShell from "@/core/layout/PageShell";
import {
  Button,
  Card,
  Container,
  Heading,
  Section,
} from "@/shared/ui";
import {
  bodyText,
  businessPoints,
  listText,
  methodSteps,
  personalPoints,
} from "./content";
import RoleAwareModulePanel from "./RoleAwareModulePanel";

function AdvisoryList({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <Card variant="flat">
      <Heading level={2}>{title}</Heading>
      <ul className={listText}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}

export default function AdvisoryHomePage() {
  return (
    <PageShell>
      <Section variant="default">
        <Container>
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <Heading level={1}>
                Structured advice for complex risk and long-term resilience.
              </Heading>

              <p className={`max-w-xl ${bodyText}`}>
                We advise business leaders and families through disciplined risk
                assessment, policy architecture, and annual governance. Every
                recommendation is built for clarity, continuity, and measurable
                protection outcomes.
              </p>

              <div className="flex gap-4">
                <Button href="/advisor">Schedule Advisory Review</Button>
                <Button href="/icura" variant="secondary">
                  View Advisory Process
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <Card variant="elevated">
                <Heading level={2}>Advisory Mandate</Heading>
                <ul className={listText}>
                  <li>
                    Risk-led coverage design across liability, property, and
                    people.
                  </li>
                  <li>Policy decisions grounded in operational realities.</li>
                  <li>
                    Governance cadence that keeps protection aligned year-round.
                  </li>
                </ul>
              </Card>

              <RoleAwareModulePanel />
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <div className="space-y-12">
            <Heading level={2}>Our Structured Method</Heading>

            <div className="grid gap-8 md:grid-cols-3">
              {methodSteps.map((step) => (
                <Card key={step.title} variant="flat">
                  <Heading level={2}>{step.title}</Heading>
                  <p className={`mt-3 ${bodyText}`}>{step.copy}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="default">
        <Container>
          <AdvisoryList title="Business Advisory" items={businessPoints} />
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <AdvisoryList title="Personal Advisory" items={personalPoints} />
        </Container>
      </Section>

      <Section variant="dark">
        <Container>
          <div className="space-y-6">
            <Heading level={2}>
              Begin With A Structured Advisory Conversation
            </Heading>

            <p className="max-w-2xl text-surface/80">
              Engage our team for a focused review of your current portfolio and
              a roadmap for resilient coverage decisions.
            </p>

            <div className="flex gap-4">
              <Button href="/advisor">Request Consultation</Button>
              <Button
                href="/icura"
                variant="secondary"
                className="border-surface/30 bg-transparent text-surface hover:border-accent"
              >
                Review Service Scope
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
