"use client"

import { GameOver } from "@/components/game/game-over"
import { GameShell } from "@/components/game/game-shell"
import { StartScreen } from "@/components/game/start-screen"
import { useGameStore } from "@/lib/stores/game-store"

type Props = {
  keyConfigured: boolean
}

export function GameApp({ keyConfigured }: Props) {
  const status = useGameStore((s) => s.status)
  const outcome = useGameStore((s) => s.outcome)

  if (status === "idle") {
    return <StartScreen keyConfigured={keyConfigured} />
  }

  if (status === "done" && outcome) {
    return <GameOver outcome={outcome} />
  }

  return <GameShell />
}
