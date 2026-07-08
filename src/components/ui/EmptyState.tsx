export function EmptyState({
  icon = "📭",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
      <span className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
        {icon}
      </span>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
