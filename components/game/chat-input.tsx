"use client"

import { useState, type KeyboardEvent } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  disabled: boolean
  onSend: (text: string) => void
}

export function ChatInput({ disabled, onSend }: Props) {
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

  return (
    <div className="bg-background px-3 pb-3">
      <div className="rounded-lg border focus-within:border-foreground/40">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Напишіть у #funding-screening… (Enter — надіслати, Shift+Enter — новий рядок)"
          rows={2}
          disabled={disabled}
          className="resize-none border-0 focus-visible:ring-0"
        />
        <div className="flex items-center justify-between gap-2 border-t px-2 py-1.5">
          <span className="text-xs text-muted-foreground">
            Enter — надіслати · Shift+Enter — новий рядок
          </span>
          <Button
            onClick={submit}
            disabled={disabled || !draft.trim()}
            size="sm"
          >
            Надіслати
          </Button>
        </div>
      </div>
    </div>
  )
}
