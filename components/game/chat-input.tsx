"use client"

import { useState, type KeyboardEvent } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CHANNEL_NAME, STAGES, type StageId } from "@/lib/personas"

type Props = {
  disabled: boolean
  currentStage: StageId
  onSend: (text: string) => void
}

export function ChatInput({ disabled, currentStage, onSend }: Props) {
  const [draft, setDraft] = useState("")

  function submit() {
    const trimmed = draft.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setDraft("")
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const persona = STAGES[currentStage]

  return (
    <div className="bg-white px-5 pt-1 pb-4">
      <div className="rounded-lg border border-[#8D8D8E] focus-within:border-[#1D1C1D] focus-within:shadow-[0_0_0_1px_#1D1C1D]">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder={`Message ${persona.displayName}`}
          rows={2}
          disabled={disabled}
          className="resize-none border-0 px-3 py-2.5 text-[15px] shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center justify-between gap-2 px-2 py-1.5">
          <span className="text-[11px] text-[#616061]">
            #{CHANNEL_NAME} · Enter — send · Shift+Enter — new line
          </span>
          <Button
            onClick={submit}
            disabled={disabled || !draft.trim()}
            size="sm"
            className="h-7 bg-[#007A5A] px-3 text-[13px] font-bold hover:bg-[#148567]"
          >
            ↑
          </Button>
        </div>
      </div>
    </div>
  )
}
