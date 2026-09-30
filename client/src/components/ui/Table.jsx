import { Loader2 } from "lucide-react";

export default function Table({ tableHeading, tableBody, loading }) {
  return (
    <div className="w-full overflow-hidden rounded-md border border-light-border-primary dark:border-dark-border-primary bg-light-bg-primary dark:bg-dark-bg-tertiary shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-light-text-primary dark:text-dark-text-primary">
          {/* Header */}
          <thead className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-light-border-primary dark:border-dark-border-primary">
            <tr>
              {tableHeading?.map((h, index) => (
                <th
                  key={h?.label || index}
                  className="px-5 py-4 text-left font-semibold text-light-text-secondary dark:text-dark-text-secondary whitespace-nowrap"
                >
                  {h?.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-light-border-primary dark:divide-dark-border-primary">
            {/* 🔄 Loading State */}
            {loading ? (
              <tr>
                <td
                  colSpan={tableHeading?.length}
                  className="py-12 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-light-text-tertiary dark:text-dark-text-tertiary">
                    <Loader2 size={20} className="animate-spin" />
                    Loading data...
                  </div>
                </td>
              </tr>
            ) : tableBody?.length > 0 ? (
              tableBody.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover transition-colors"
                >
                  {row?.cells?.map((c, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-5 py-4 text-left whitespace-nowrap"
                    >
                      {c ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              /* 📭 Empty State */
              <tr>
                <td
                  colSpan={tableHeading?.length}
                  className="text-center py-12 text-light-text-tertiary dark:text-dark-text-tertiary"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
