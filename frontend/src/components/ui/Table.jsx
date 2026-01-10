import React from 'react'
import { motion } from 'framer-motion'

const Table = ({
  columns,
  data,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  ...props
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {data.map((row, rowIndex) => (
            <motion.tr
              key={row.id || rowIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: rowIndex * 0.05 }}
              className={`
                ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
                transition-colors duration-150
              `}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-foreground"
                >
                  {column.render ? column.render(row[column.dataIndex], row) : row[column.dataIndex]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table