import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tailwind color classes (bg/text/ring) supplied by the caller. */
  tone?: string;
}

export function Badge({ tone, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        tone ?? "bg-slate-100 text-slate-700 ring-slate-200",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
