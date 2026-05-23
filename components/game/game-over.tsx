"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { STAGES } from "@/lib/personas"
import { useGameStore, type Outcome } from "@/lib/stores/game-store"

type Props = {
  outcome: Outcome
}

export function GameOver({ outcome }: Props) {
  const reset = useGameStore((s) => s.reset)

  if (outcome.kind === "won") {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🎉 Чек на дорозі</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>
              Ви провели через скринінг трьох людей і переконали особисто Mark
              C. Зустріч у понеділок на 15 хвилин — у вашому календарі.
            </p>
            <Button onClick={reset} variant="outline" size="lg">
              Спробувати ще раз з іншою ідеєю
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const persona = STAGES[outcome.atStage]
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Заявку відхилено на етапі {persona.displayName}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-md border bg-muted/40 p-3 text-sm italic">
            «{outcome.finalMessage}»
          </div>
          <p className="text-sm text-muted-foreground">
            Бюджет повідомлень для {persona.displayName} вичерпано. Спробуйте
            переформулювати пітч і зайти знову.
          </p>
          <Button onClick={reset} size="lg">
            Зайти знову
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
