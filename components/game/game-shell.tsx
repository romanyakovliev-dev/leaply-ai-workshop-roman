"use client"

import { useMemo } from "react"

import { ChatHeader } from "@/components/game/chat-header"
import { ChatInput } from "@/components/game/chat-input"
import { ChatSidebar } from "@/components/game/chat-sidebar"
import { ChatThread } from "@/components/game/chat-thread"
import { STAGE_ORDER, type StageId } from "@/lib/personas"
import { useGameStore } from "@/lib/stores/game-store"

export function GameShell() {
  const status = useGameStore((s) => s.status)
  const currentStage = useGameStore((s) => s.currentStage)
  const threads = useGameStore((s) => s.threads)
  const messagesUsed = useGameStore((s) => s.messagesUsed)
  const error = useGameStore((s) => s.error)
  const sendUserMessage = useGameStore((s) => s.sendUserMessage)

  const reachedStages = useMemo(() => {
    const set = new Set<StageId>()
    for (const id of STAGE_ORDER) {
      if (threads[id].length > 0) set.add(id)
    }
    return set
  }, [threads])

  const disabled = status !== "playing"

  return (
    <div className="flex h-[100svh] w-full overflow-hidden bg-background">
      <ChatSidebar currentStage={currentStage} reachedStages={reachedStages} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <ChatHeader
          currentStage={currentStage}
          messagesUsed={messagesUsed[currentStage]}
        />
        <ChatThread
          threads={threads}
          currentStage={currentStage}
          thinking={status === "thinking"}
          error={error}
        />
        <ChatInput disabled={disabled} onSend={sendUserMessage} />
      </div>
    </div>
  )
}
