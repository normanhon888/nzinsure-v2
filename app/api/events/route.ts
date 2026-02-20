import { NextResponse } from "next/server"
import { evaluateState } from "@/lib/stateEngine"
import { enforceRulesGate } from "@/lib/rules"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const proposedState = evaluateState(body.event_type)
    const rules = enforceRulesGate({ proposed_state: proposedState })
    if (!rules.ok) {
      console.info("api.events.blocked", { code: rules.code })
      return NextResponse.json(
        { ok: false, code: rules.code, error: rules.message },
        { status: 422 },
      )
    }

    console.info("api.events.processed", { ok: true })

    return NextResponse.json({
      ok: true,
      proposed_state: proposedState
    })

  } catch {
    console.info("api.events.failed", { reason: "invalid_payload" })
    return NextResponse.json(
      { ok: false },
      { status: 400 }
    )
  }
}
