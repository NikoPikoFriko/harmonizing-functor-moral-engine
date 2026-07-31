import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary)] text-[var(--color-primary-fg)] hover:brightness-110",
        secondary:
          "bg-[var(--color-elevated)] text-[var(--color-fg)] border border-[var(--color-border-strong)] hover:bg-[var(--color-border)]",
        outline:
          "border border-[var(--color-border-strong)] bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-elevated)]",
        ghost: "text-[var(--color-muted)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-fg)]",
        danger: "bg-[var(--color-danger)] text-[var(--color-bg)] hover:brightness-110",
        hive: "bg-[var(--color-hive)] text-[var(--color-bg)] hover:brightness-110",
        self: "bg-[var(--color-self)] text-[var(--color-bg)] hover:brightness-110",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";
