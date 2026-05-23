"use client"

import { CHANNEL_NAME, STAGES, type StageId } from "@/lib/personas"
import { cn } from "@/lib/utils"

type Props = {
  currentStage: StageId
  messagesUsed: number
  reachedStagesCount: number
}

export function ChatHeader({
  currentStage,
  messagesUsed,
  reachedStagesCount,
}: Props) {
  const s = STAGES[currentStage]
  const remaining = Math.max(0, s.budget - messagesUsed)
  const urgent = remaining <= 2
  return (
    <header className="flex items-center justify-between gap-3 border-b border-[#E1E0E1] bg-white px-5 py-2.5">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-bold text-[#1D1C1D]">
            <span className="text-[#1D1C1D]/60">#</span> {CHANNEL_NAME}
          </span>
          <span className="text-[12px] text-[#616061]">
            · {reachedStagesCount + 1} members
          </span>
        </div>
        <div className="text-[12px] text-[#616061]">
          {s.displayName} · {s.title}
        </div>
      </div>
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
          urgent
            ? "border-[#E01E5A]/30 bg-[#E01E5A]/10 text-[#E01E5A]"
            : "border-[#E1E0E1] bg-[#F8F8F8] text-[#616061]"
        )}
      >
        <svg viewBox="0 0 16 16" className="size-3 fill-current">
          <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.5 4a.5.5 0 00-1 0v4.3l-2.6 1.5a.5.5 0 00.5.86l2.9-1.6.2-.2V4z" />
        </svg>
        {s.displayName.split(" ")[0]} йде через ~{remaining} хв
      </div>
    </header>
  )
}
