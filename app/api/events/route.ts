import { NextResponse } from "next/server"
import { evaluateState } from "@/lib/stateEngine"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const proposedState = evaluateState(body.event_type)

    console.log("Event received:", body)
    console.log("Proposed State:", proposedState)

    return NextResponse.json({
      ok: true,
      proposed_state: proposedState
    })

  } catch (error) {
    return NextResponse.json(
      { ok: false },
      { status: 400 }
    )
  }
}