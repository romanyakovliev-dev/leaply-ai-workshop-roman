import { env } from "@/lib/env"
import { buildScriptedReply } from "@/lib/game/demo-script"
import { callGeminiChat } from "@/lib/gemini"
import { parseJsonObject } from "@/lib/json-extract"
import { STAGES, buildSystemPrompt, type StageId } from "@/lib/personas"
import type { ChatMessageT, ChatTurnReplyT } from "@/lib/schemas/chat-schema"

type RunTurnInput = {
  stage: StageId
  thread: ChatMessageT[]
  priorTranscripts?: Partial<Record<StageId, ChatMessageT[]>>
}

export async function runConversationTurn({
  stage,
  thread,
  priorTranscripts,
}: RunTurnInput): Promise<ChatTurnReplyT> {
  if (!env.GEMINI_API_KEY) {
    return buildScriptedReply(stage, thread)
  }

  const userMessagesSoFar = thread.filter((m) => m.role === "user").length
  const turnsLeft = Math.max(0, STAGES[stage].budget - userMessagesSoFar)
  const system = buildSystemPrompt(stage, turnsLeft, priorTranscripts ?? {})

  const raw = await callGeminiChat({
    system,
    messages: thread,
    maxTokens: 1500,
  })

  // Try to parse JSON, then extract reply/convinced from whatever shape we got.
  let parsed: unknown
  try {
    parsed = parseJsonObject(raw)
  } catch {
    // Last resort — treat the raw text as the reply.
    const text = raw.trim().slice(0, 4000)
    if (text.length === 0) {
      throw new Error("Модель повернула порожню відповідь.")
    }
    return { reply: text, convinced: false }
  }

  const extracted = extractReply(parsed)
  if (extracted) return extracted

  console.error(
    "[runConversationTurn] unrecognised shape:",
    JSON.stringify(parsed).slice(0, 500)
  )
  // Last resort — try to stringify whatever we got into a reply.
  if (typeof parsed === "string") {
    return { reply: parsed.slice(0, 4000), convinced: false }
  }
  throw new Error("Модель повернула неочікуваний формат відповіді.")
}

/**
 * Pull `reply` (any of several common keys) and `convinced` (any of several
 * common keys, coerced to boolean) out of arbitrary parsed JSON.
 */
function extractReply(parsed: unknown): ChatTurnReplyT | null {
  if (!parsed || typeof parsed !== "object") return null
  const obj = parsed as Record<string, unknown>

  // Pick the first string-ish value among likely keys.
  const replyKeys = [
    "reply",
    "response",
    "message",
    "text",
    "content",
    "answer",
  ]
  let reply: string | null = null
  for (const k of replyKeys) {
    const v = obj[k]
    if (typeof v === "string" && v.trim().length > 0) {
      reply = v
      break
    }
    if (typeof v === "number") {
      reply = String(v)
      break
    }
  }
  if (!reply) return null

  // Pick `convinced` from likely keys; coerce non-bool to bool.
  const convincedKeys = ["convinced", "agreed", "approved", "satisfied", "pass"]
  let convinced = false
  for (const k of convincedKeys) {
    const v = obj[k]
    if (v === undefined) continue
    if (typeof v === "boolean") {
      convinced = v
      break
    }
    if (typeof v === "string") {
      convinced = v.toLowerCase().trim() === "true"
      break
    }
    if (typeof v === "number") {
      convinced = v !== 0
      break
    }
  }

  return { reply: reply.slice(0, 4000), convinced }
}
