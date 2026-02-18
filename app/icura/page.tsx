'use client'

import { type FormEvent, useEffect, useMemo, useState } from 'react'

type Mode = 'healthy' | 'degraded' | 'outage'
type LeadType = 'personal' | 'business' | 'project'

type LeadApiResponse = {
  success: boolean
  code: string
  message: string
  data: Record<string, unknown> | null
}

type FormValues = {
  name: string
  email: string
  phone: string
  type: LeadType | ''
  message: string
}

type FieldErrors = Partial<Record<keyof FormValues, string>>

const initialForm: FormValues = {
  name: '',
  email: '',
  phone: '',
  type: '',
  message: ''
}

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {}

  if (!values.name.trim()) errors.name = 'Name is required.'

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!values.type) errors.type = 'Please select a consultation type.'

  if (values.phone.trim() && !/^[+()\-\s0-9]{6,20}$/.test(values.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.'
  }

  if (values.message.trim().length > 1200) {
    errors.message = 'Message must be 1200 characters or fewer.'
  }

  return errors
}

export default function IcuraPage() {
  const [mode, setMode] = useState<Mode>('healthy')
  const [formValues, setFormValues] = useState<FormValues>(initialForm)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMode('degraded')
    }, 3000)

    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) setMode('degraded')
        clearTimeout(timeout)
      })
      .catch(() => setMode('outage'))

    return () => clearTimeout(timeout)
  }, [])

  const messageCount = useMemo(() => formValues.message.length, [formValues.message])

  if (mode === 'outage') {
    return (
      <main className="min-h-screen bg-white px-4 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">System Temporarily Unavailable</h1>
          <a href="/advisor" className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white">
            Talk to Advisor
          </a>
        </div>
      </main>
    )
  }

  if (mode === 'degraded') {
    return (
      <main className="min-h-screen bg-white px-4 py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Smart Consultation Limited</h1>
          <a href="/advisor" className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white">
            Talk to Advisor
          </a>
        </div>
      </main>
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors = validate(formValues)
    setFieldErrors(errors)
    setFeedback(null)

    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formValues.name.trim(),
          email: formValues.email.trim(),
          phone: formValues.phone.trim() || undefined,
          type: formValues.type,
          message: formValues.message.trim() || undefined
        })
      })

      const result = (await res.json()) as LeadApiResponse

      if (result.success) {
        setFormValues(initialForm)
        setFieldErrors({})
        setFeedback({ type: 'success', text: result.message || 'Consultation submitted successfully.' })
      } else {
        setFeedback({ type: 'error', text: result.message || 'Submission failed. Please try again.' })
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleFieldChange<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setFormValues((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }))
    setFeedback(null)
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-600">iCura Consultation</p>
          <h1 className="text-3xl font-semibold text-slate-900">We do not start just with price</h1>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Submit your details and we will assess risk context first, then provide tailored options.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={formValues.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none ring-slate-900 transition focus:ring-2"
              aria-invalid={!!fieldErrors.name}
            />
            {fieldErrors.name && <p className="text-sm text-red-600">{fieldErrors.name}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                value={formValues.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none ring-slate-900 transition focus:ring-2"
                aria-invalid={!!fieldErrors.email}
              />
              {fieldErrors.email && <p className="text-sm text-red-600">{fieldErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Phone (optional)
              </label>
              <input
                id="phone"
                name="phone"
                value={formValues.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none ring-slate-900 transition focus:ring-2"
                aria-invalid={!!fieldErrors.phone}
              />
              {fieldErrors.phone && <p className="text-sm text-red-600">{fieldErrors.phone}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium text-slate-700">
              Consultation Type
            </label>
            <select
              id="type"
              name="type"
              value={formValues.type}
              onChange={(e) => handleFieldChange('type', e.target.value as FormValues['type'])}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none ring-slate-900 transition focus:ring-2"
              aria-invalid={!!fieldErrors.type}
            >
              <option value="">Select type</option>
              <option value="personal">Personal</option>
              <option value="business">Business</option>
              <option value="project">Project</option>
            </select>
            {fieldErrors.type && <p className="text-sm text-red-600">{fieldErrors.type}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-slate-700">
              Brief Description (optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formValues.message}
              onChange={(e) => handleFieldChange('message', e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none ring-slate-900 transition focus:ring-2"
              aria-invalid={!!fieldErrors.message}
            />
            <div className="flex items-center justify-between">
              {fieldErrors.message ? <p className="text-sm text-red-600">{fieldErrors.message}</p> : <span />}
              <p className="text-xs text-slate-500">{messageCount}/1200</p>
            </div>
          </div>

          {feedback && (
            <div
              className={
                feedback.type === 'success'
                  ? 'rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800'
                  : 'rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
              }
            >
              {feedback.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Consultation'}
          </button>
        </form>
      </div>
    </main>
  )
}
