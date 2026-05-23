import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { STAGES, getAvatarUrl, type StageId } from "@/lib/personas"
import { cn } from "@/lib/utils"

type Props = {
  stage: StageId
  size?: "sm" | "default" | "lg"
  muted?: boolean
  // Slack uses rounded-md, not full circle.
  square?: boolean
}

const SIZE_CLASS = {
  sm: "size-5",
  default: "size-9",
  lg: "size-12",
} as const

export function PersonaAvatar({
  stage,
  size = "default",
  muted,
  square = true,
}: Props) {
  const persona = STAGES[stage]
  return (
    <Avatar
      className={cn(
        SIZE_CLASS[size],
        square ? "rounded-md" : "",
        "shrink-0",
        muted && "opacity-40 grayscale"
      )}
    >
      <AvatarImage
        src={getAvatarUrl(persona.photoId)}
        alt={persona.displayName}
        className={cn(square && "rounded-md")}
      />
      <AvatarFallback className={cn(square && "rounded-md")}>
        {persona.displayName.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  )
}
