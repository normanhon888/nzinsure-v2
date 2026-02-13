'use client'

import { useEffect, useState } from 'react'

type Mode = 'healthy' | 'degraded' | 'outage'

export default function IcuraPage() {
  const [mode, setMode] = useState<Mode>('healthy')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMode('degraded')
    }, 3000)

    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (!data.ok) setMode('degraded')
        clearTimeout(timeout)
      })
      .catch(() => setMode('outage'))
  }, [])

  if (mode === 'outage') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-semibold">System Temporarily Unavailable</h1>
        <a href="/advisor" className="mt-6 px-5 py-3 bg-black text-white rounded-lg">
          Talk to Advisor
        </a>
      </main>
    )
  }

  if (mode === 'degraded') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-semibold">Smart Consultation Limited</h1>
        <a href="/advisor" className="mt-6 px-5 py-3 bg-black text-white rounded-lg">
          Talk to Advisor
        </a>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-2xl font-semibold mb-6">
        Smart Consultation
      </h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault()

          const form = e.currentTarget
          const formData = new FormData(form)

          const payload = {
            name: formData.get('name'),
            email: formData.get('email'),
            type: formData.get('type'),
            message: formData.get('message')
          }

          try {
            const res = await fetch('/api/lead', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            })

            const result = await res.json()

            if (result.success) {
              form.reset()
              alert('Consultation submitted successfully.')
            } else {
              alert('Submission failed.')
            }

          } catch (error) {
            alert('Network error.')
          }
        }}
        className="w-full max-w-md space-y-4"
      >
        <input name="name" placeholder="Your Name" required className="w-full border px-4 py-2 rounded" />
        <input name="email" placeholder="Email" required className="w-full border px-4 py-2 rounded" />

        <select name="type" required className="w-full border px-4 py-2 rounded">
          <option value="">Select Type</option>
          <option value="personal">Personal</option>
          <option value="business">Business</option>
          <option value="project">Project</option>
        </select>

        <textarea name="message" placeholder="Brief description" className="w-full border px-4 py-2 rounded" />

        <button type="submit" className="w-full bg-black text-white py-3 rounded">
          Submit Consultation
        </button>
      </form>
    </main>
  )
}
