import { NextResponse } from "next/server"

import { runConversationTurn } from "@/lib/game/run-turn"
import { ChatRequestSchema } from "@/lib/schemas/chat-schema"

export const runtime = "nodejs"

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Невалідний JSON" }, { status: 400 })
  }

  const parsed = ChatRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Невалідні дані" },
      { status: 400 }
    )
  }

  try {
    const result = await runConversationTurn(parsed.data)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Невідома помилка"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
