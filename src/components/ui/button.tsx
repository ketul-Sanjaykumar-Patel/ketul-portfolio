import * as React from "react";

type Variant = "default" | "secondary" | "ghost";
type Size = "default" | "icon";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<Variant, string> = {
    default: "bg-foreground text-background hover:opacity-90",
    secondary: "bg-muted hover:bg-muted/80",
    ghost: "hover:bg-muted",
  };
  const sizes: Record<Size, string> = {
    default: "h-10 px-4",
    icon: "h-10 w-10",
  };

  if (asChild) {
    // @ts-ignore
    const Child = props.children?.type;
    return props.children;
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}