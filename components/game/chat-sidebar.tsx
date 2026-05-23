"use client"

import { PersonaAvatar } from "@/components/game/persona-avatar"
import { STAGE_ORDER, STAGES, type StageId } from "@/lib/personas"
import { cn } from "@/lib/utils"

type Props = {
  currentStage: StageId
  reachedStages: Set<StageId>
}

export function ChatSidebar({ currentStage, reachedStages }: Props) {
  return (
    <aside className="hidden h-full w-64 flex-col gap-1 bg-[#3F0E40] p-3 text-white md:flex">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <div className="text-base font-bold">Acme Capital</div>
          <div className="flex items-center gap-1.5 text-xs text-white/60">
            <span className="size-2 rounded-full bg-green-400" />
            you (online)
          </div>
        </div>
      </div>

      <div className="mt-3 px-2 text-xs font-semibold tracking-wider text-white/50 uppercase">
        Channels
      </div>
      <div className="flex items-center gap-2 rounded-md bg-white/20 px-2 py-1.5 text-sm font-medium">
        <span className="text-white/70"># </span>
        funding-screening
      </div>

      <div className="mt-4 px-2 text-xs font-semibold tracking-wider text-white/50 uppercase">
        Members ({reachedStages.size + 1})
      </div>
      <ul className="flex flex-col gap-0.5">
        <li className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm">
          <span className="inline-flex size-6 items-center justify-center rounded bg-white/10 text-xs font-semibold">
            R
          </span>
          <span className="flex-1 truncate font-medium">you</span>
          <span className="size-2 rounded-full bg-green-400" />
        </li>
        {STAGE_ORDER.map((id) => {
          const s = STAGES[id]
          const present = reachedStages.has(id)
          const isCurrent = currentStage === id && present
          return (
            <li
              key={id}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                isCurrent && "bg-white/10"
              )}
            >
              <PersonaAvatar stage={id} size="sm" muted={!present} />
              <div
                className={cn(
                  "flex-1 truncate",
                  !present && "text-white/40 italic"
                )}
              >
                {s.displayName}
              </div>
              {present && (
                <span
                  className={cn(
                    "size-2 rounded-full",
                    isCurrent ? "bg-green-400" : "bg-white/30"
                  )}
                />
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
