
"use client";

import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useVoiceAvatar } from "./use-voice-avatar";

interface VoiceAvatarProps {
  seed: string;
  name: string;
  className?: string;
};

export function VoiceAvatar({ 
  seed, 
  name, 
  className
}: VoiceAvatarProps) {
  // Generate the avatar URL using the custom hook based on the provided seed
  const avatarUrl = useVoiceAvatar(seed);

  return (
    <Avatar
      className={cn("size-4 border-white shadow-xs", className)}
    >
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className="text-[8px]">
        {name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
