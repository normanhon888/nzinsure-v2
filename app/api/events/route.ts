import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log('Event received:', body)

    return NextResponse.json({
      ok: true,
      received: body,
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Invalid request' },
      { status: 400 }
    )
  }
}