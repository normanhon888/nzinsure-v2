export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-3xl font-semibold tracking-tight">
        NZ Insure v2 (Internal Preview)
      </h1>

      <p className="mt-4 text-gray-600 text-center max-w-lg">
        iCura Architecture Sandbox – Dual-Track Development Environment
      </p>

      <div className="mt-8 flex gap-4">
        <a
          href="/icura"
          className="px-5 py-3 bg-black text-white rounded-lg hover:opacity-90 transition"
        >
          Smart Consultation
        </a>

        <a
          href="/advisor"
          className="px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          Talk to Advisor
        </a>

        <a
          href="/claims"
          className="px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          Claims Support
        </a>
      </div>
    </main>
  )
}