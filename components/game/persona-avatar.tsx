import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { STAGES, getAvatarUrl, type StageId } from "@/lib/personas"
import { cn } from "@/lib/utils"

type Props = {
  stage: StageId
  size?: "sm" | "default" | "lg"
  muted?: boolean
}

export function PersonaAvatar({ stage, size = "default", muted }: Props) {
  const persona = STAGES[stage]
  return (
    <Avatar size={size} className={cn(muted && "opacity-40 grayscale")}>
      <AvatarImage
        src={getAvatarUrl(persona.avatarSeed)}
        alt={persona.displayName}
      />
      <AvatarFallback>{persona.displayName.slice(0, 2)}</AvatarFallback>
    </Avatar>
  )
}
