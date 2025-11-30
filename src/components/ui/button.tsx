import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full",
        destructive: "bg-red-500 text-black hover:bg-red-500/90 rounded-full",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-blue-main rounded-full border border-blue-main hover:bg-blue-main/80 hover:shadow-md hover:shadow-blue-main/50 text-black",
        solid: "bg-blue-main rounded-full border border-blue-main text-black",
        ghost:
          "hover:bg-accent hover:text-accent-foreground text-white hover:text-gray-500",
        barberDash:
          "flex flex-col items-center justify-center rounded-xl border border-blue-main group-hover:bg-blue-main/80 group-hover:text-black",
        link: "text-primary underline-offset-4 hover:underline text-white hover:text-black",
        simple:
          "bg-transparent rounded-full border border-blue-main hover:bg-blue-main/80 hover:shadow-md hover:shadow-blue-main/50 text-white hover:text-black",
        auth: "bg-transparent rounded-full border border-blue-secondary group-hover:bg-blue-secondary/80 text-white",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 rounded-full px-1",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-md px-8 has-[>svg]:px-4",
        icon: "size-10",
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
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
