"use client"

import { Bot } from 'lucide-react'
import { cn } from "@/lib/utils"

interface AnimatedBotProps {
  className?: string
  size?: "sm" | "md" | "lg"
  color?: string
}

export function AnimatedBot({ 
  className,
  size = "md",
  color = "#3b82f6" // blue-500
}: AnimatedBotProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  }

  return (
    <div className={cn(
      "relative flex items-center justify-center rounded-xl bg-[#1a1a1a] overflow-hidden",
      sizes[size],
      className
    )}>
      {/* Glowing background effect */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundColor: color }}
      />
      
      {/* Bot icon with blinking animation */}
      <Bot 
        style={{ color }}
        className={cn(
          "relative z-10 animate-bot",
          size === "sm" ? "w-5 h-5" : size === "md" ? "w-7 h-7" : "w-10 h-10"
        )}
      />
    </div>
  )
}

