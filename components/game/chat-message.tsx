"use client"

import { PersonaAvatar } from "@/components/game/persona-avatar"
import { STAGES, type StageId } from "@/lib/personas"
import type { ChatMessage } from "@/lib/stores/game-store"

type Props = {
  message: ChatMessage
  stage: StageId
  /** When true, render compact (without avatar/name — same-author streak). */
  compact?: boolean
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ChatMessageRow({ message, stage, compact }: Props) {
  const isUser = message.role === "user"
  if (isUser) {
    return (
      <MessageShell
        compact={compact}
        avatar={
          <div className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-[#611F69] text-[13px] font-bold text-white">
            R
          </div>
        }
        name="you"
        meta={formatTime(message.ts)}
        body={message.content}
      />
    )
  }
  const persona = STAGES[stage]
  return (
    <MessageShell
      compact={compact}
      avatar={<PersonaAvatar stage={stage} size="default" square />}
      name={persona.displayName}
      meta={`${persona.title} · ${formatTime(message.ts)}`}
      body={message.content}
    />
  )
}

function MessageShell({
  avatar,
  name,
  meta,
  body,
  compact,
}: {
  avatar: React.ReactNode
  name: string
  meta: string
  body: string
  compact?: boolean
}) {
  return (
    <div className="group flex gap-2 px-5 py-1 hover:bg-[#F8F8F8]">
      <div className="w-9 shrink-0">
        {compact ? (
          <span className="invisible block text-[10px] text-[#616061] group-hover:visible">
            {meta.split(" · ").pop()}
          </span>
        ) : (
          avatar
        )}
      </div>
      <div className="min-w-0 flex-1">
        {!compact && (
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold text-[#1D1C1D]">{name}</span>
            <span className="text-[12px] text-[#616061]">{meta}</span>
          </div>
        )}
        <div className="text-[15px] leading-[1.46] whitespace-pre-wrap text-[#1D1C1D]">
          {body}
        </div>
      </div>
    </div>
  )
}
