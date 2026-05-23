"use client"

import { PersonaAvatar } from "@/components/game/persona-avatar"
import { STAGES, type StageId } from "@/lib/personas"
import type { ChatMessage } from "@/lib/stores/game-store"

type Props = {
  message: ChatMessage
  stage: StageId
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ChatMessageRow({ message, stage }: Props) {
  const isUser = message.role === "user"
  if (isUser) {
    return (
      <div className="group flex gap-3 rounded px-3 py-1.5 hover:bg-muted/40">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded bg-primary text-sm font-semibold text-primary-foreground">
          R
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold">you</span>
            <span className="text-[11px] text-muted-foreground">
              {formatTime(message.ts)}
            </span>
          </div>
          <div className="mt-0.5 text-sm whitespace-pre-wrap text-foreground">
            {message.content}
          </div>
        </div>
      </div>
    )
  }
  const persona = STAGES[stage]
  return (
    <div className="group flex gap-3 rounded px-3 py-1.5 hover:bg-muted/40">
      <PersonaAvatar stage={stage} size="default" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold">{persona.displayName}</span>
          <span className="text-[11px] text-muted-foreground">
            {persona.title} · {formatTime(message.ts)}
          </span>
        </div>
        <div className="mt-0.5 text-sm whitespace-pre-wrap text-foreground">
          {message.content}
        </div>
      </div>
    </div>
  )
}
