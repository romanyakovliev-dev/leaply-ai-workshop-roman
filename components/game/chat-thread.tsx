"use client"

import { useEffect, useRef } from "react"

import { ChatMessageRow } from "@/components/game/chat-message"
import { TypingIndicator } from "@/components/game/typing-indicator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { STAGES, STAGE_ORDER, type StageId } from "@/lib/personas"
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
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex flex-col gap-1 py-3">
        {STAGE_ORDER.map((stage) => {
          const thread = threads[stage]
          if (thread.length === 0) return null
          return (
            <div key={stage} className="flex flex-col gap-1">
              <JoinSeparator stage={stage} />
              {thread.map((m, i) => (
                <ChatMessageRow
                  key={`${stage}-${i}`}
                  message={m}
                  stage={stage}
                />
              ))}
            </div>
          )
        })}
        {thinking && (
          <div className="px-3 py-2">
            <TypingIndicator stage={currentStage} />
          </div>
        )}
        {error && (
          <div className="mx-3 my-2">
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
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
    <div className="flex items-center gap-2 px-3 py-2 text-xs">
      <span className="h-px flex-1 bg-border" />
      <span className="text-muted-foreground">
        <span className="font-medium">{STAGES[stage].displayName}</span>{" "}
        приєднався до #funding-screening
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
