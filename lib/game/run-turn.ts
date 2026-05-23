import { env } from "@/lib/env"
import { buildScriptedReply } from "@/lib/game/demo-script"
import { callGeminiChat } from "@/lib/gemini"
import { parseJsonObject } from "@/lib/json-extract"
import { STAGES, buildPriorContext, type StageId } from "@/lib/personas"
import {
  ChatTurnReplySchema,
  type ChatMessageT,
  type ChatTurnReplyT,
} from "@/lib/schemas/chat-schema"

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

  const stageConfig = STAGES[stage]
  const system =
    stageConfig.systemPrompt + buildPriorContext(priorTranscripts ?? {})

  const raw = await callGeminiChat({
    system,
    messages: thread,
    maxTokens: 1024,
  })

  let json: unknown
  try {
    json = parseJsonObject(raw)
  } catch {
    console.error("[runConversationTurn] non-JSON reply:", raw.slice(0, 500))
    throw new Error(`Модель повернула не-JSON. Початок: ${raw.slice(0, 120)}`)
  }
  const parsed = ChatTurnReplySchema.safeParse(json)
  if (!parsed.success) {
    console.error(
      "[runConversationTurn] schema mismatch:",
      JSON.stringify(json).slice(0, 500)
    )
    throw new Error("Модель повернула неочікуваний формат відповіді")
  }
  return parsed.data
}
