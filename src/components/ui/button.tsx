import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-md hover:shadow-lg",
        destructive:
          "bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 shadow-md hover:shadow-lg",
        outline:
          "bg-white text-gray-800 border-gray-400 hover:bg-gray-50 hover:border-gray-500 shadow-md hover:shadow-lg",
        secondary:
          "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg",
        ghost: "bg-transparent text-gray-700 border-transparent hover:bg-gray-100 hover:text-gray-900 hover:border-gray-200 shadow-sm hover:shadow-md",
        link: "text-blue-600 underline-offset-4 hover:underline font-semibold border-transparent hover:text-blue-800",
        success: "bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700 shadow-md hover:shadow-lg",
        primary: "bg-yellow-500 text-gray-900 border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600 shadow-md hover:shadow-lg font-bold",
        accent: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 shadow-md hover:shadow-lg",
        skillbinder: "text-white border-2 shadow-lg hover:shadow-xl font-bold",
        skillbinder_yellow: "text-black border-2 shadow-lg hover:shadow-xl font-bold",
        skillbinder_outline: "bg-white border-2 shadow-md hover:shadow-lg font-semibold"
      },
      size: {
        default: "h-11 px-6 py-2 text-base",
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-3 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }