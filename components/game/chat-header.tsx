"use client"

import { Badge } from "@/components/ui/badge"
import { STAGES, type StageId } from "@/lib/personas"

type Props = {
  currentStage: StageId
  messagesUsed: number
}

export function ChatHeader({ currentStage, messagesUsed }: Props) {
  const s = STAGES[currentStage]
  const remaining = Math.max(0, s.budget - messagesUsed)
  return (
    <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-muted-foreground">#</span>
          <span className="text-base font-bold">funding-screening</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Зараз говорить: <span className="font-medium">{s.displayName}</span> ·{" "}
          {s.title}
        </div>
      </div>
      <Badge variant={remaining <= 2 ? "destructive" : "secondary"}>
        {remaining} / {s.budget} ходів
      </Badge>
    </header>
  )
}
