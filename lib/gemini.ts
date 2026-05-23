import { env } from "@/lib/env"

const MODEL = "gemini-2.5-flash"
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

export type ChatTurn = {
  role: "user" | "assistant"
  content: string
}

type ChatOptions = {
  system: string
  messages: ChatTurn[]
  maxTokens?: number
}

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    reply: { type: "STRING" },
    convinced: { type: "BOOLEAN" },
  },
  required: ["reply", "convinced"],
} as const

export async function callGeminiChat({
  system,
  messages,
  maxTokens = 500,
}: ChatOptions): Promise<string> {
  if (!env.GEMINI_API_KEY) {
    throw new Error(
      "Не задано GEMINI_API_KEY. Додайте ключ у файл .env.local і перезапустіть dev-сервер."
    )
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents,
      generationConfig: {
        maxOutputTokens: maxTokens,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.7,
        // Disable internal "thinking" so all tokens go to the actual reply.
        // Gemini 2.5 Flash otherwise burns 500-1000 thinking tokens before
        // emitting the first character of output.
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gemini API ${res.status}: ${text.slice(0, 300)}`)
  }

  const data: unknown = await res.json()
  const text = extractText(data)
  if (!text) {
    throw new Error("Порожня відповідь від моделі")
  }
  return text
}

function extractText(data: unknown): string | null {
  if (!data || typeof data !== "object") return null
  const candidates = (data as { candidates?: unknown }).candidates
  if (!Array.isArray(candidates) || candidates.length === 0) return null
  const first = candidates[0]
  if (!first || typeof first !== "object") return null
  const content = (first as { content?: unknown }).content
  if (!content || typeof content !== "object") return null
  const parts = (content as { parts?: unknown }).parts
  if (!Array.isArray(parts)) return null
  const out: string[] = []
  for (const p of parts) {
    if (
      p &&
      typeof p === "object" &&
      typeof (p as { text?: unknown }).text === "string"
    ) {
      out.push((p as { text: string }).text)
    }
  }
  return out.join("\n").trim() || null
}
