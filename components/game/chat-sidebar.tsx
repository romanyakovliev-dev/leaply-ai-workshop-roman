"use client"

import { PersonaAvatar } from "@/components/game/persona-avatar"
import {
  CHANNEL_NAME,
  STAGE_ORDER,
  STAGES,
  WORKSPACE_NAME,
  type StageId,
} from "@/lib/personas"
import { cn } from "@/lib/utils"

type Props = {
  currentStage: StageId
  reachedStages: Set<StageId>
  messagesUsed: Record<StageId, number>
}

export function ChatSidebar({
  currentStage,
  reachedStages,
  messagesUsed,
}: Props) {
  return (
    <aside className="hidden h-full w-[260px] flex-col bg-[#3F0E40] text-white md:flex">
      {/* Workspace header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="text-[15px] font-extrabold tracking-tight">
            {WORKSPACE_NAME}
          </div>
        </div>
        <button className="size-6 rounded text-white/60 hover:bg-white/10">
          <svg viewBox="0 0 20 20" className="m-auto size-4 fill-current">
            <path d="M3 7a1 1 0 100 2h14a1 1 0 100-2H3zm0 4a1 1 0 100 2h14a1 1 0 100-2H3z" />
          </svg>
        </button>
      </div>

      {/* You */}
      <div className="flex items-center gap-2 px-4 py-2 text-[13px]">
        <span className="size-2 rounded-full bg-[#2EB67D]" />
        <span className="text-white/90">you</span>
      </div>

      {/* Channels section */}
      <div className="mt-2 px-2">
        <div className="px-2 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-white/50 uppercase">
          Channels
        </div>
        <div className="flex items-center gap-2 rounded bg-[#1164A3] px-2 py-1 text-[14px] font-medium text-white">
          <span className="text-white/80">#</span>
          {CHANNEL_NAME}
        </div>
      </div>

      {/* Direct messages section */}
      <div className="mt-3 px-2">
        <div className="px-2 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-white/50 uppercase">
          Direct messages
        </div>
        <ul className="flex flex-col">
          {STAGE_ORDER.map((id) => {
            const s = STAGES[id]
            const present = reachedStages.has(id)
            const isCurrent = currentStage === id && present
            const turnsLeft = Math.max(0, s.budget - (messagesUsed[id] ?? 0))
            return (
              <li
                key={id}
                className={cn(
                  "flex items-center gap-2 rounded px-2 py-1 text-[14px]",
                  isCurrent && "bg-[#1164A3] text-white",
                  !isCurrent && "text-white/80 hover:bg-white/5"
                )}
              >
                <PersonaAvatar stage={id} size="sm" square muted={!present} />
                <span
                  className={cn(
                    "flex-1 truncate",
                    !present && "text-white/40 italic"
                  )}
                >
                  {s.displayName.split(" ")[0]}
                </span>
                {present && (
                  <span className="text-[11px] text-white/50">
                    {turnsLeft}m
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
