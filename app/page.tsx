import { GameApp } from "@/components/game/game-app"
import { env } from "@/lib/env"

export default function Page() {
  return <GameApp keyConfigured={Boolean(env.GEMINI_API_KEY)} />
}
