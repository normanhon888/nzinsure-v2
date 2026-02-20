import PageShell from "@/core/layout/PageShell";
import { Button, Card, Container, Heading, Section } from "@/shared/ui";

export default function HomePage() {
  return (
    <PageShell>
      <Section variant="default">
        <Container>
          <Card variant="elevated" className="mx-auto max-w-2xl text-center">
            <Heading level={1}>iCura Platform</Heading>
            <p className="mt-4 text-primary/70">
              Welcome. Continue to the iCura consultation flow.
            </p>
            <div className="mt-8">
              <Button href="/icura">Go to iCura</Button>
            </div>
          </Card>
        </Container>
      </Section>
    </PageShell>
  );
}
