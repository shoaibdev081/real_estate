export default function ResourceTable({ columns, rows, loading, emptyLabel = 'No data yet', onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl border border-(--border-subtle) bg-(--surface-card) shadow">
      <div className="max-h-120 overflow-auto scrollbar-hidden">
        <table className="min-w-full divide-y divide-(--border-subtle) text-sm">
          <thead className="bg-(--surface-elevated)/80 sticky top-0 z-10 backdrop-blur">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)"
                >
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-(--text-muted)">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border-subtle)">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="px-3 py-6 text-center text-xs text-(--text-muted)"
                >
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="px-3 py-6 text-center text-xs text-(--text-muted)"
                >
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row._id || row.id} id={row._id || row.id}>
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-3 py-2 text-xs text-(--text-primary)">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-3 py-2 text-right text-xs">
                      <div className="inline-flex gap-1">
                        {onEdit && (
                          <button
                            type="button"
                            className="rounded-full bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-400 hover:bg-amber-500/20"
                            onClick={() => onEdit(row)}
                          >
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            className="rounded-full bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-400 hover:bg-red-500/20"
                            onClick={() => onDelete(row)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

