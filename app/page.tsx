import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Body, H1, H2, Label } from "@/components/ui/Typography";

export default function HomePage() {
  return (
    <main className="bg-background text-primary">
      <Section className="max-w-[1400px] py-32">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div className="space-y-8">
            <p className="inline-flex rounded-full border border-accent/40 bg-surface px-4 py-1.5 text-sm font-medium text-primary">
              Strategic Insurance Advisory
            </p>
            <H1>Structured advice for complex risk and long-term resilience.</H1>
            <Body className="mt-10 max-w-2xl">
              We advise business leaders and families through disciplined risk assessment, policy architecture, and annual governance.
              Every recommendation is built for clarity, continuity, and measurable protection outcomes.
            </Body>
            <div className="mt-2 flex flex-wrap gap-4">
              <Button href="/advisor" variant="dark">
                Schedule Advisory Review
              </Button>
              <Button href="/icura" variant="secondary">
                View Advisory Process
              </Button>
            </div>
          </div>

          <Card className="flex h-full flex-col justify-center">
            <H2>Advisory Mandate</H2>
            <ul className="mt-6 space-y-4 text-base leading-relaxed text-primary/80">
              <li>Risk-led coverage design across liability, property, and people.</li>
              <li>Policy decisions grounded in operational and household realities.</li>
              <li>Governance cadence that keeps protection aligned year-round.</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="space-y-16">
          <div className="max-w-3xl space-y-4">
            <H2>Our Structured Method</H2>
            <Body>A disciplined framework to ensure coverage quality, financial efficiency, and decision confidence.</Body>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <Card as="article" className="p-7">
              <Label>01</Label>
              <h3 className="mt-3 text-2xl font-semibold">Risk Discovery</h3>
              <Body className="mt-4 text-base lg:text-base">
                We map exposures, obligations, and dependency points to establish a clear protection baseline.
              </Body>
            </Card>
            <Card as="article" className="p-7">
              <Label>02</Label>
              <h3 className="mt-3 text-2xl font-semibold">Coverage Structuring</h3>
              <Body className="mt-4 text-base lg:text-base">
                We evaluate policy architecture, exclusions, and limits to align protection with material risks.
              </Body>
            </Card>
            <Card as="article" className="p-7">
              <Label>03</Label>
              <h3 className="mt-3 text-2xl font-semibold">Governance & Review</h3>
              <Body className="mt-4 text-base lg:text-base">
                We set an annual advisory rhythm so your portfolio evolves with strategic and personal change.
              </Body>
            </Card>
          </div>
        </div>
      </Section>

      <Section>
        <Card className="grid min-h-[280px] gap-12 md:grid-cols-2">
          <div className="space-y-7">
            <H2>Business Advisory</H2>
            <Body>For owners and executive teams requiring continuity-focused insurance governance.</Body>
          </div>
          <ul className="space-y-4 text-base leading-relaxed text-primary/80">
            <li>Liability and contract exposure analysis.</li>
            <li>Property, interruption, and cash-flow resilience design.</li>
            <li>Leadership and key-person protection alignment.</li>
            <li>Structured renewal preparation and insurer negotiation support.</li>
          </ul>
        </Card>
      </Section>

      <Section>
        <Card className="grid min-h-[280px] gap-12 md:grid-cols-2">
          <div className="space-y-7">
            <H2>Personal Advisory</H2>
            <Body>
              For households seeking clear coverage decisions across income, health, and intergenerational obligations.
            </Body>
          </div>
          <ul className="space-y-4 text-base leading-relaxed text-primary/80">
            <li>Life, disability, and trauma cover prioritization.</li>
            <li>Mortgage and family dependency gap analysis.</li>
            <li>Premium-to-benefit trade-off modelling.</li>
            <li>Ongoing policy suitability reviews as circumstances shift.</li>
          </ul>
        </Card>
      </Section>

      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <Card className="flex min-h-[240px] flex-col justify-between p-8">
            <H2>Why Structured Advice</H2>
            <Body className="mt-5">
              Insurance outcomes improve when decision quality is managed with the same rigor as financial and operational planning.
            </Body>
          </Card>
          <Card className="flex min-h-[240px] flex-col justify-between p-8">
            <ul className="space-y-4 text-base leading-relaxed text-primary/80">
              <li>Reduced coverage blind spots across high-impact scenarios.</li>
              <li>More stable premium trajectory through disciplined portfolio design.</li>
              <li>Clear internal and household decision accountability.</li>
              <li>Consistent advisory documentation for future review cycles.</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="rounded-card bg-primary p-14 text-surface">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <H2>Begin With A Structured Advisory Conversation</H2>
              <p className="mt-4 text-lg leading-relaxed text-surface/85">
                Engage our team for a focused review of your current portfolio and a roadmap for resilient coverage decisions.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Button href="/advisor" variant="primary">
                Request Consultation
              </Button>
              <Button href="/icura" variant="secondary" className="border-surface/30 bg-transparent text-surface hover:border-accent">
                Review Service Scope
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
