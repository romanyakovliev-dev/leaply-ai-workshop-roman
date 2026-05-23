"use client"

import { Button } from "@/components/ui/button"
import { PersonaAvatar } from "@/components/game/persona-avatar"
import { useGameStore } from "@/lib/stores/game-store"
import { STAGE_ORDER, STAGES } from "@/lib/personas"

type Props = {
  keyConfigured: boolean
}

export function StartScreen({ keyConfigured }: Props) {
  const start = useGameStore((s) => s.start)
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          💼 Pitch Gauntlet
        </h1>
        <p className="text-muted-foreground">
          Ви подали заявку на фінансування у фонд Mark C. Зараз вас додадуть до
          закритого Slack-каналу{" "}
          <code className="text-foreground">#funding-screening</code>, де треба
          буде по черзі переконати трьох людей. У кожного — свій фокус і
          обмежений бюджет повідомлень.
        </p>
      </header>

      <ol className="flex flex-col gap-4 rounded-lg border bg-muted/40 p-5">
        {STAGE_ORDER.map((id, i) => {
          const s = STAGES[id]
          return (
            <li key={id} className="flex items-start gap-3">
              <PersonaAvatar stage={id} size="default" />
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-medium">{s.displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    {s.title}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Бюджет: {s.budget} повідомлень
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{i + 1}</span>
            </li>
          )
        })}
      </ol>

      <div className="flex flex-col items-start gap-3">
        <Button size="lg" onClick={start} className="text-base">
          Зайти в #funding-screening →
        </Button>
        {!keyConfigured && (
          <p className="rounded-md border border-amber-400/40 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            <strong>Demo-режим.</strong> API-ключ не знайдено — відповіді
            персонажів сценарні (не реагують на зміст). Щоб увімкнути справжніх
            AI-суддів, додайте{" "}
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
