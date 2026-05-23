import type { StageId } from "@/lib/personas"
import type { ChatMessageT, ChatTurnReplyT } from "@/lib/schemas/chat-schema"

const SUBSTANTIVE_MIN_CHARS = 20

const STAGE_THRESHOLD: Record<StageId, number> = {
  steve: 2,
  alan: 2,
  mark: 3,
}

const PROBES: Record<StageId, string[]> = {
  steve: [
    "Дякую! 🙂 А розкажіть, будь ласка, у чому суть ідеї простими словами?",
    "Хм, цікаво. А для кого це? Хто буде цим користуватись?",
    "Зрозумів. А як ви це знайшли? Чи це безпечно?",
    "Окей-окей… а скільки це коштуватиме звичайній людині?",
  ],
  alan: [
    "Зрозуміло. Дайте, будь ласка, одне конкретне число: TAM у доларах або очікуваний CAC.",
    "Без цифри ми не рухаємось далі. Скільки коштуватиме залучити одного клієнта?",
    "Потрібен retention за 30 днів. У відсотках, з методологією.",
    "Знову якісно. Конкретна цифра, прошу.",
  ],
  mark: [
    "Хто платить? І чому це не зробить Google за тиждень?",
    "Де ваш моат? Чим ви захищені від копіювання?",
    "Який exit ви бачите? Хто покупець через 5 років?",
    "Чому ми, а не якийсь інший фонд?",
    "Ще раз: де я тут бачу 10x?",
  ],
}

const TRANSITIONS: Record<StageId, string> = {
  steve:
    "Класно, я вловив суть! 👍 Зараз додам у чат пана Алана, нашого аналітика — він допоможе по цифрах 📊",
  alan: "Цифри виглядають правдоподібно. Підключаю до чату пана Mark C. Він прийматиме фінальне рішення.",
  mark: "Окей. Цікаво. Передам команді, зідзвонимось у понеділок. Зустріч на 15 хв.",
}

const REJECTIONS: Record<StageId, string> = {
  steve:
    "Слухайте, я чесно намагаюсь зрозуміти, але виходить плутано. Спробуйте ще раз потім, ок? 🙏",
  alan: "Без конкретних чисел далі немає сенсу говорити. Дякую за час.",
  mark: "Дякую за час. Ідея не для нашого фонду.",
}

export function buildScriptedReply(
  stage: StageId,
  thread: ChatMessageT[]
): ChatTurnReplyT {
  const userMessages = thread.filter((m) => m.role === "user")
  const substantive = userMessages.filter(
    (m) => m.content.trim().length >= SUBSTANTIVE_MIN_CHARS
  )
  const threshold = STAGE_THRESHOLD[stage]

  if (substantive.length >= threshold) {
    return { reply: TRANSITIONS[stage], convinced: true }
  }

  const turnIndex = Math.max(0, userMessages.length - 1)
  const probes = PROBES[stage]

  if (userMessages.length === 0) {
    return { reply: probes[0], convinced: false }
  }

  const lastWasShort =
    userMessages[userMessages.length - 1]?.content.trim().length <
    SUBSTANTIVE_MIN_CHARS

  if (lastWasShort && turnIndex >= probes.length - 1) {
    return { reply: REJECTIONS[stage], convinced: false }
  }

  const probe = probes[Math.min(turnIndex, probes.length - 1)]
  return { reply: probe, convinced: false }
}
