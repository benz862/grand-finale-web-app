import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
              className={cn(
          "neumorphic-input flex min-h-[120px] w-full px-4 py-3 text-lg ring-offset-background placeholder:text-muted-foreground/90 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none",
          className
        )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }