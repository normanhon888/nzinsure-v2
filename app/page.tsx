export default function HomePage() {
  return (
    <main className="bg-[#F5F7FA] text-[#0E1A2B]">
      <section className="mx-auto max-w-[1400px] px-6 py-32 lg:px-12">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div className="space-y-8">
            <p className="inline-flex rounded-full border border-[#C8A75E]/40 bg-white px-4 py-1.5 text-sm font-medium text-[#0E1A2B]">
              Strategic Insurance Advisory
            </p>
            <h1 className="text-5xl font-semibold leading-[1.2] lg:text-6xl">
              Structured advice for complex risk and long-term resilience.
            </h1>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-[#0E1A2B]/80">
              We advise business leaders and families through disciplined risk assessment, policy architecture, and annual governance.
              Every recommendation is built for clarity, continuity, and measurable protection outcomes.
            </p>
            <div className="mt-2 flex flex-wrap gap-4">
              <a
                href="/advisor"
                className="inline-flex items-center justify-center rounded-xl bg-[#0E1A2B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#15263F]"
              >
                Schedule Advisory Review
              </a>
              <a
                href="/icura"
                className="inline-flex items-center justify-center rounded-xl border border-[#0E1A2B]/20 bg-white px-6 py-3 text-sm font-semibold text-[#0E1A2B] transition-colors hover:border-[#C8A75E] hover:text-[#0E1A2B]"
              >
                View Advisory Process
              </a>
            </div>
          </div>

          <div className="flex h-full flex-col justify-center rounded-2xl border border-[#0E1A2B]/10 bg-white p-10">
            <h2 className="text-3xl font-semibold">Advisory Mandate</h2>
            <ul className="mt-6 space-y-4 text-base leading-relaxed text-[#0E1A2B]/80">
              <li>Risk-led coverage design across liability, property, and people.</li>
              <li>Policy decisions grounded in operational and household realities.</li>
              <li>Governance cadence that keeps protection aligned year-round.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-12">
        <div className="space-y-16">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold">Our Structured Method</h2>
            <p className="text-lg leading-relaxed text-[#0E1A2B]/80">
              A disciplined framework to ensure coverage quality, financial efficiency, and decision confidence.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <article className="rounded-2xl border border-[#0E1A2B]/10 bg-white p-7">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#C8A75E]">01</p>
              <h3 className="mt-3 text-2xl font-semibold">Risk Discovery</h3>
              <p className="mt-4 text-base leading-relaxed text-[#0E1A2B]/80">
                We map exposures, obligations, and dependency points to establish a clear protection baseline.
              </p>
            </article>
            <article className="rounded-2xl border border-[#0E1A2B]/10 bg-white p-7">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#C8A75E]">02</p>
              <h3 className="mt-3 text-2xl font-semibold">Coverage Structuring</h3>
              <p className="mt-4 text-base leading-relaxed text-[#0E1A2B]/80">
                We evaluate policy architecture, exclusions, and limits to align protection with material risks.
              </p>
            </article>
            <article className="rounded-2xl border border-[#0E1A2B]/10 bg-white p-7">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#C8A75E]">03</p>
              <h3 className="mt-3 text-2xl font-semibold">Governance & Review</h3>
              <p className="mt-4 text-base leading-relaxed text-[#0E1A2B]/80">
                We set an annual advisory rhythm so your portfolio evolves with strategic and personal change.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-12">
        <div className="grid min-h-[280px] gap-12 rounded-2xl border border-[#0E1A2B]/10 bg-white p-10 md:grid-cols-2">
          <div className="space-y-7">
            <h2 className="text-3xl font-semibold">Business Advisory</h2>
            <p className="text-lg leading-relaxed text-[#0E1A2B]/80">
              For owners and executive teams requiring continuity-focused insurance governance.
            </p>
          </div>
          <ul className="space-y-4 text-base leading-relaxed text-[#0E1A2B]/80">
            <li>Liability and contract exposure analysis.</li>
            <li>Property, interruption, and cash-flow resilience design.</li>
            <li>Leadership and key-person protection alignment.</li>
            <li>Structured renewal preparation and insurer negotiation support.</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-12">
        <div className="grid min-h-[280px] gap-12 rounded-2xl border border-[#0E1A2B]/10 bg-white p-10 md:grid-cols-2">
          <div className="space-y-7">
            <h2 className="text-3xl font-semibold">Personal Advisory</h2>
            <p className="text-lg leading-relaxed text-[#0E1A2B]/80">
              For households seeking clear coverage decisions across income, health, and intergenerational obligations.
            </p>
          </div>
          <ul className="space-y-4 text-base leading-relaxed text-[#0E1A2B]/80">
            <li>Life, disability, and trauma cover prioritization.</li>
            <li>Mortgage and family dependency gap analysis.</li>
            <li>Premium-to-benefit trade-off modelling.</li>
            <li>Ongoing policy suitability reviews as circumstances shift.</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex min-h-[240px] flex-col justify-between rounded-2xl border border-[#0E1A2B]/10 bg-white p-8">
            <h2 className="text-3xl font-semibold">Why Structured Advice</h2>
            <p className="mt-5 text-lg leading-relaxed text-[#0E1A2B]/80">
              Insurance outcomes improve when decision quality is managed with the same rigor as financial and operational planning.
            </p>
          </div>
          <div className="flex min-h-[240px] flex-col justify-between rounded-2xl border border-[#0E1A2B]/10 bg-white p-8">
            <ul className="space-y-4 text-base leading-relaxed text-[#0E1A2B]/80">
              <li>Reduced coverage blind spots across high-impact scenarios.</li>
              <li>More stable premium trajectory through disciplined portfolio design.</li>
              <li>Clear internal and household decision accountability.</li>
              <li>Consistent advisory documentation for future review cycles.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-12">
        <div className="rounded-2xl bg-[#0E1A2B] p-14 text-white">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold">Begin With A Structured Advisory Conversation</h2>
              <p className="mt-4 text-lg leading-relaxed text-white/85">
                Engage our team for a focused review of your current portfolio and a roadmap for resilient coverage decisions.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <a
                href="/advisor"
                className="inline-flex items-center justify-center rounded-xl bg-[#C8A75E] px-6 py-3 text-sm font-semibold text-[#0E1A2B] transition-colors hover:bg-[#D5B777]"
              >
                Request Consultation
              </a>
              <a
                href="/icura"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-[#C8A75E]"
              >
                Review Service Scope
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
