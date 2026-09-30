import { clsx } from 'clsx';

const DataTable = ({
  columns,
  data,
  rowKey = 'id',
  emptyState = 'No records found.',
  renderActions,
  dense = false,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className={clsx('min-w-full divide-y divide-slate-200', dense ? 'text-sm' : 'text-base')}>
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor || column.id}
                  scope="col"
                  className={clsx(
                    'px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500',
                    column.headerClassName,
                  )}
                >
                  {column.Header || column.header}
                </th>
              ))}
              {renderActions ? <th className="px-5 py-3" /> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-5 py-12 text-center text-sm text-muted">
                  {emptyState}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item[rowKey] || JSON.stringify(item)} className="transition hover:bg-primary-50/30">
                  {columns.map((column) => (
                    <td
                      key={`${column.accessor || column.id}-${item[rowKey]}`}
                      className={clsx('whitespace-nowrap px-5 py-4 text-sm text-slate-700', column.cellClassName)}
                    >
                      {column.Cell ? column.Cell(item) : item[column.accessor] ?? '—'}
                    </td>
                  ))}
                  {renderActions ? <td className="px-5 py-4 text-right text-sm">{renderActions(item)}</td> : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
