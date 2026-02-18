export default function HomePage() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="inline-flex w-fit rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-slate-700">
              iCura Smart Consultation
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Insurance Advice Built Around Your Real Risk
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              We do not start just with price. We begin with your risk profile, then shape cover and cost to fit your life or business.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="/icura"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Start iCura Consultation
              </a>
              <a
                href="/advisor"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
              >
                Talk to Advisor
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold sm:text-2xl">Why iCura</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-700 sm:text-base">
              <p>1. Compare policies with context, not just headline premium.</p>
              <p>2. Balance budget, exclusions, and claim certainty.</p>
              <p>3. Keep your protection aligned as life changes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-semibold">Business</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Protect cash flow, contracts, and continuity with a risk-first plan across liability, property, and people.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700 sm:text-base">
              <li>Public & product liability review</li>
              <li>Key person and income protection options</li>
              <li>Renewal stress testing before premium negotiation</li>
            </ul>
            <a
              href="/icura"
              className="mt-6 inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
            >
              Explore Business Consultation
            </a>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-semibold">Personal</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Build confidence for family, health, and future income with cover decisions based on your actual obligations.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700 sm:text-base">
              <li>Life, trauma, and disability cover prioritization</li>
              <li>Gap checks against mortgage and family needs</li>
              <li>Clear trade-offs between premiums and certainty</li>
            </ul>
            <a
              href="/icura"
              className="mt-6 inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
            >
              Explore Personal Consultation
            </a>
          </article>
        </div>
      </section>
    </main>
  )
}
