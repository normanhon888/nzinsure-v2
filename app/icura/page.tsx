'use client'

import { useEffect, useState } from 'react'

type Mode = 'healthy' | 'degraded' | 'outage'

export default function IcuraPage() {
  const [mode, setMode] = useState<Mode>('healthy')
  const [result, setResult] = useState<string | null>(null)

  async function handleChoice(type: string) {
    let eventType = ''

    if (type === 'no_change') {
      eventType = 'CLIENT_NO_CHANGE'
    } else if (type === 'major_change') {
      eventType = 'CLIENT_MAJOR_CHANGE'
    } else {
      eventType = 'CLIENT_UNCERTAIN'
    }

    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: 'anonymous',
        event_type: eventType
      })
    })

    setResult(eventType)
  }

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
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <h1 className="text-3xl font-semibold mb-10">
        iCura 判断入口
      </h1>

      <div className="space-y-6 text-center max-w-xl">
        <p className="text-lg">
          你的风险结构是否发生变化？
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleChoice('no_change')}
            className="px-6 py-3 border rounded-lg"
          >
            没有明显变化
          </button>

          <button
            onClick={() => handleChoice('major_change')}
            className="px-6 py-3 border rounded-lg"
          >
            有重要变化
          </button>

          <button
            onClick={() => handleChoice('uncertain')}
            className="px-6 py-3 border rounded-lg"
          >
            不确定
          </button>
        </div>

        {result && (
          <div className="mt-8 text-lg font-medium">
            判断结果：{result}
          </div>
        )}
      </div>
    </main>
  )
}