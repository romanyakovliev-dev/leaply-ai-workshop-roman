import { z } from "zod"

export const StageIdSchema = z.enum(["steve", "alan", "mark"])
export type StageIdT = z.infer<typeof StageIdSchema>

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
})
export type ChatMessageT = z.infer<typeof ChatMessageSchema>

export const ChatRequestSchema = z.object({
  stage: StageIdSchema,
  thread: z.array(ChatMessageSchema).max(50),
  priorTranscripts: z
    .record(z.string(), z.array(ChatMessageSchema).max(50))
    .optional(),
})
export type ChatRequestT = z.infer<typeof ChatRequestSchema>

// Tolerant of common model drift: accepts string/number for `reply`,
// boolean OR boolean-y string for `convinced`.
const BoolFromAnything = z.union([
  z.boolean(),
  z.string().transform((s) => s.toLowerCase() === "true"),
  z.number().transform((n) => n !== 0),
])

export const ChatTurnReplySchema = z
  .object({
    reply: z
      .union([z.string(), z.number()])
      .transform((v) => String(v))
      .pipe(z.string().min(1).max(4000)),
    convinced: BoolFromAnything,
  })
  .or(
    // Common drift aliases the model sometimes uses.
    z
      .object({
        response: z.union([z.string(), z.number()]).transform((v) => String(v)),
        convinced: BoolFromAnything,
      })
      .transform((o) => ({ reply: o.response, convinced: o.convinced }))
  )
  .or(
    z
      .object({
        reply: z.union([z.string(), z.number()]).transform((v) => String(v)),
        agreed: BoolFromAnything,
      })
      .transform((o) => ({ reply: o.reply, convinced: o.agreed }))
  )

export type ChatTurnReplyT = { reply: string; convinced: boolean }
