import { create } from "zustand"

import { STAGES, STAGE_ORDER, type StageId } from "@/lib/personas"
import type { ChatMessageT, ChatTurnReplyT } from "@/lib/schemas/chat-schema"

export type ChatMessage = ChatMessageT & { ts: number }

export type Outcome =
  | { kind: "won" }
  | { kind: "lost"; atStage: StageId; finalMessage: string }

type Status = "idle" | "playing" | "thinking" | "done"

type EmptyThreads = Record<StageId, ChatMessage[]>
type EmptyCounts = Record<StageId, number>

function emptyThreads(): EmptyThreads {
  return { steve: [], alan: [], mark: [] }
}

function emptyCounts(): EmptyCounts {
  return { steve: 0, alan: 0, mark: 0 }
}

type GameState = {
  status: Status
  currentStage: StageId
  threads: EmptyThreads
  messagesUsed: EmptyCounts
  outcome: Outcome | null
  error: string | null

  start: () => void
  sendUserMessage: (text: string) => Promise<void>
  reset: () => void
}

function stripTs(thread: ChatMessage[]): ChatMessageT[] {
  return thread.map(({ role, content }) => ({ role, content }))
}

function seedOpening(stage: StageId): ChatMessage {
  return {
    role: "assistant",
    content: STAGES[stage].openingMessage,
    ts: Date.now(),
  }
}

export const useGameStore = create<GameState>()((set, get) => ({
  status: "idle",
  currentStage: "steve",
  threads: emptyThreads(),
  messagesUsed: emptyCounts(),
  outcome: null,
  error: null,

  start: () => {
    const fresh = emptyThreads()
    fresh.steve = [seedOpening("steve")]
    set({
      status: "playing",
      currentStage: "steve",
      threads: fresh,
      messagesUsed: emptyCounts(),
      outcome: null,
      error: null,
    })
  },

  reset: () => {
    set({
      status: "idle",
      currentStage: "steve",
      threads: emptyThreads(),
      messagesUsed: emptyCounts(),
      outcome: null,
      error: null,
    })
  },

  sendUserMessage: async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const state = get()
    if (state.status !== "playing") return

    const stage = state.currentStage
    const userMsg: ChatMessage = {
      role: "user",
      content: trimmed,
      ts: Date.now(),
    }

    const nextThread = [...state.threads[stage], userMsg]
    const nextUsed = state.messagesUsed[stage] + 1

    set({
      status: "thinking",
      threads: { ...state.threads, [stage]: nextThread },
      messagesUsed: { ...state.messagesUsed, [stage]: nextUsed },
      error: null,
    })

    const priorTranscripts: Partial<Record<StageId, ChatMessageT[]>> = {}
    for (const s of STAGE_ORDER) {
      if (s === stage) break
      const t = get().threads[s]
      if (t.length > 0) priorTranscripts[s] = stripTs(t)
    }

    let reply: ChatTurnReplyT
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          stage,
          thread: stripTs(nextThread),
          priorTranscripts,
        }),
      })
      const json: unknown = await res.json()
      if (!res.ok) {
        const message = (json as { error?: string }).error ?? "Помилка сервера"
        throw new Error(message)
      }
      reply = json as ChatTurnReplyT
    } catch (err) {
      const message = err instanceof Error ? err.message : "Невідома помилка"
      const rolled = get()
      set({
        status: "playing",
        error: message,
        threads: {
          ...rolled.threads,
          [stage]: rolled.threads[stage].slice(0, -1),
        },
        messagesUsed: {
          ...rolled.messagesUsed,
          [stage]: rolled.messagesUsed[stage] - 1,
        },
      })
      return
    }

    const assistantMsg: ChatMessage = {
      role: "assistant",
      content: reply.reply,
      ts: Date.now(),
    }

    const after = get()
    const threadWithReply = [...after.threads[stage], assistantMsg]
    const budget = STAGES[stage].budget
    const used = after.messagesUsed[stage]

    if (reply.convinced) {
      const next = STAGES[stage].nextStage
      if (!next) {
        set({
          status: "done",
          threads: { ...after.threads, [stage]: threadWithReply },
          outcome: { kind: "won" },
        })
        return
      }
      const seeded = seedOpening(next)
      set({
        status: "playing",
        currentStage: next,
        threads: {
          ...after.threads,
          [stage]: threadWithReply,
          [next]: [seeded],
        },
      })
      return
    }

    if (used >= budget) {
      set({
        status: "done",
        threads: { ...after.threads, [stage]: threadWithReply },
        outcome: {
          kind: "lost",
          atStage: stage,
          finalMessage: reply.reply,
        },
      })
      return
    }

    set({
      status: "playing",
      threads: { ...after.threads, [stage]: threadWithReply },
    })
  },
}))
