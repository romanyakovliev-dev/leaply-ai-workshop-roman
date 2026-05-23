"use client"

import { useEffect, useRef } from "react"

import { ChatMessageRow } from "@/components/game/chat-message"
import { TypingIndicator } from "@/components/game/typing-indicator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CHANNEL_NAME, STAGES, STAGE_ORDER, type StageId } from "@/lib/personas"
import type { ChatMessage } from "@/lib/stores/game-store"

type Props = {
  threads: Record<StageId, ChatMessage[]>
  currentStage: StageId
  thinking: boolean
  error: string | null
}

export function ChatThread({ threads, currentStage, thinking, error }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [threads, thinking, currentStage])

  return (
    <ScrollArea className="min-h-0 flex-1 bg-white">
      <div className="flex flex-col gap-1 py-3">
        {STAGE_ORDER.map((stage) => {
          const thread = threads[stage]
          if (thread.length === 0) return null
          return (
            <div key={stage} className="flex flex-col">
              <JoinSeparator stage={stage} />
              {thread.map((m, i) => {
                const prev = thread[i - 1]
                // Collapse repeated avatars from same author within 5 min
                const compact =
                  !!prev &&
                  prev.role === m.role &&
                  Math.abs(m.ts - prev.ts) < 5 * 60 * 1000
                return (
                  <ChatMessageRow
                    key={`${stage}-${i}`}
                    message={m}
                    stage={stage}
                    compact={compact}
                  />
                )
              })}
            </div>
          )
        })}
        {thinking && (
          <div className="px-5 py-2">
            <TypingIndicator stage={currentStage} />
          </div>
        )}
        {error && (
          <div className="mx-5 my-2">
            <div className="rounded border border-[#E01E5A]/30 bg-[#E01E5A]/5 px-3 py-2 text-[13px] text-[#A01751]">
              {error}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}

function JoinSeparator({ stage }: { stage: StageId }) {
  return (
    <div className="mb-1 flex items-center gap-2 px-5 py-2 text-[12px] text-[#616061]">
      <span className="h-px flex-1 bg-[#E1E0E1]" />
      <span>
        <span className="font-semibold text-[#1D1C1D]">
          {STAGES[stage].displayName}
        </span>{" "}
        joined #{CHANNEL_NAME}
      </span>
      <span className="h-px flex-1 bg-[#E1E0E1]" />
    </div>
  )
}
