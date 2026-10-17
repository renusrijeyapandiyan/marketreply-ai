export default function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      {Icon && (
        <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Icon className="h-7 w-7" />
        </span>
      )}
      <h3 className="text-lg font-bold">{title}</h3>
      {children && <p className="mt-1.5 max-w-sm text-sm text-ink-500">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
