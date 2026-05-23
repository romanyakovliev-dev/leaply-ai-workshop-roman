"use client"

import { PersonaAvatar } from "@/components/game/persona-avatar"
import { STAGES, type StageId } from "@/lib/personas"

type Props = {
  stage: StageId
}

export function TypingIndicator({ stage }: Props) {
  return (
    <div className="flex items-center gap-3">
      <PersonaAvatar stage={stage} size="default" square />
      <div className="flex items-center gap-1.5 text-[13px] text-[#616061]">
        <span>{STAGES[stage].displayName} is typing</span>
        <span className="flex gap-0.5">
          <Dot delay={0} />
          <Dot delay={150} />
          <Dot delay={300} />
        </span>
      </div>
    </div>
  )
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block size-1 animate-bounce rounded-full bg-[#616061]"
      style={{ animationDelay: `${delay}ms` }}
    />
  )
}
