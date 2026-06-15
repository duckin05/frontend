export function EmptyState({ icon = "📭", title, description, action }: {
  icon?: string
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-base-content/70 mb-2">{title}</h3>
      {description && <p className="text-sm text-base-content/40 max-w-sm">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="btn btn-primary btn-sm mt-4">
          {action.label}
        </button>
      )}
    </div>
  )
}
