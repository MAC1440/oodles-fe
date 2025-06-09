import React from "react";

export interface Column<T> {
  header: string;
  accessor?: keyof T; // optional if using render
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
}: TableProps<T>) => {
  return (
    <div className="p-5 overflow-x-auto">
      <table className="table-auto md:table-fixed border-collapse border border-gray-800 w-full">
        <thead className="bg-emerald-800 text-white">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="border border-gray-800 p-2">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="border border-gray-800 p-2">
                    {col.render
                      ? col.render(row)
                      : col.accessor
                      ? String(row[col.accessor] ?? "")
                      : ""}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="border border-gray-800 p-4 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
