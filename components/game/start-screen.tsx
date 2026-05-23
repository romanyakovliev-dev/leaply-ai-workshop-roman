"use client"

import { Button } from "@/components/ui/button"
import { PersonaAvatar } from "@/components/game/persona-avatar"
import {
  APP_NAME,
  CHANNEL_NAME,
  STAGE_ORDER,
  STAGES,
  WORKSPACE_NAME,
} from "@/lib/personas"
import { useGameStore } from "@/lib/stores/game-store"

type Props = {
  keyConfigured: boolean
}

export function StartScreen({ keyConfigured }: Props) {
  const start = useGameStore((s) => s.start)
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-[44px] leading-none font-black tracking-tight text-[#1D1C1D]">
          {APP_NAME}
        </h1>
        <p className="text-[16px] leading-relaxed text-[#616061]">
          Вас додали до закритого Slack-каналу{" "}
          <code className="text-[#1D1C1D]">#{CHANNEL_NAME}</code> у{" "}
          <strong>{WORKSPACE_NAME}</strong>. По черзі троє людей з фонду
          поговорять із вами — кожен має обмежений час і свій кут зору. Ваше
          завдання: переконати всіх трьох.
        </p>
      </header>

      <ol className="flex flex-col gap-3 rounded-lg border border-[#E1E0E1] bg-[#FAFAFA] p-5">
        {STAGE_ORDER.map((id, i) => {
          const s = STAGES[id]
          return (
            <li key={id} className="flex items-start gap-3">
              <PersonaAvatar stage={id} size="default" square />
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[15px] font-bold text-[#1D1C1D]">
                    {s.displayName}
                  </span>
                  <span className="text-[12px] text-[#616061]">{s.title}</span>
                </div>
                <div className="text-[12px] text-[#616061]">
                  Дає ~{s.budget} хвилин
                </div>
              </div>
              <span className="font-mono text-[12px] text-[#A4A4A4]">
                {i + 1}/3
              </span>
            </li>
          )
        })}
      </ol>

      <div className="flex flex-col items-start gap-3">
        <Button
          size="lg"
          onClick={start}
          className="bg-[#007A5A] text-[15px] font-bold hover:bg-[#148567]"
        >
          Join #{CHANNEL_NAME} →
        </Button>
        {!keyConfigured && (
          <p className="rounded-md border border-amber-400/40 bg-amber-50 px-3 py-2 text-[13px] text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            <strong>Demo mode.</strong> API-ключ не знайдено — відповіді
            персонажів сценарні (не реагують на зміст). Щоб увімкнути живі
            діалоги, додайте{" "}
            <code className="rounded bg-amber-100/60 px-1 dark:bg-amber-900/60">
              GEMINI_API_KEY
            </code>{" "}
            у <code>.env.local</code>.
          </p>
        )}
      </div>
    </div>
  )
}
