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

export const ChatTurnReplySchema = z.object({
  reply: z.string().min(1).max(2000),
  convinced: z.boolean(),
})
export type ChatTurnReplyT = z.infer<typeof ChatTurnReplySchema>
