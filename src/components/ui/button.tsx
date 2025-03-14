import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "flex gap-1 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full",
        destructive: "bg-red-500 text-white hover:bg-red-500/90 rounded-full",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-blue-main rounded-full border border-blue-main hover:bg-blue-main/80 hover:shadow-md hover:shadow-blue-main/50",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        barberDash:
          "flex flex-col items-center justify-center rounded-xl border border-blue-main group-hover:bg-blue-main/80 group-hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        simple:
          "bg-transparent rounded-full border border-blue-main hover:bg-blue-main/80 hover:shadow-md hover:shadow-blue-main/50 text-white",
        auth: "bg-transparent rounded-full border border-blue-secondary group-hover:bg-blue-secondary/80 text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        xs: "h-6 rounded-full px-1",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        barberDash: "size-48",
        rounded: "size-12 rounded-full",
        smallRounded: "px-2 py-1 rounded-full text-xs",
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
