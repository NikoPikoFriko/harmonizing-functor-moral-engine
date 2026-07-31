import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--color-primary)]/20 text-[var(--color-primary)]",
        muted: "border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-muted)]",
        hive: "border-transparent bg-[var(--color-hive)]/15 text-[var(--color-hive)]",
        self: "border-transparent bg-[var(--color-self)]/15 text-[var(--color-self)]",
        accent: "border-transparent bg-[var(--color-accent)]/15 text-[var(--color-accent)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
