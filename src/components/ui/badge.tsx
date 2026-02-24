function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" }) {
  const base =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground";
  const variants = {
    default: "bg-background",
    secondary: "bg-muted border-transparent text-foreground/70",
  };
  return <span className={cn(base, variants[variant], className)} {...props} />;
}