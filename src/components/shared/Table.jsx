import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  flexRender, 
  getFilteredRowModel 
} from '@tanstack/react-table';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState, useEffect } from 'react';

import { TableSkeleton } from '../TableSkeleton';

const TableComponent = ({ columns, data, refetch, isFetching, isLoading }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  
  const tableInstance = useReactTable({
    columns,
    data,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), 
    onGlobalFilterChange: setGlobalFilter,
  });

  const { getHeaderGroups, getRowModel, getPageCount, getState, setPageIndex } = tableInstance;

  const handleGlobalSearch = (e) => {
    setGlobalFilter(e.target.value);
  };

  useEffect(() => {
    refetch();
  }, [globalFilter, refetch]);



  return (
    <TableSkeleton isLoading={isLoading}>
      <section className="w-full sm:p-8 p-4 my-8">

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={globalFilter || ''}
          onChange={handleGlobalSearch}
          className="px-4 py-2 border rounded-md shadow-sm text-dark dark:text-black"
        />

      </div>


      {data?.length === 0 ? (
        <div>No data available</div>
      ) : (
            <div className='w-full overflow-x-scroll no-scrollbar border dark:border-none border-gray-400 rounded-lg shadow-sm'>
              <table className="w-full shadow-lg rounded-md border-collapse bg-gray-100">
                <thead className="bg-gray-300 dark:text-white dark:bg-black text-gray-800 rounded-t-lg">
                  {getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          className="text-center py-3 px-6 border-b border-gray-400 font-semibold"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className='bg-white'>
                  {getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-200 transition-colors duration-200">
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="py-3 px-6 border-b border-gray-300 text-sm text-center"
                        >
                          <CopyToClipboard
                            text={cell.getValue()}
                            onCopy={() => alert(`Copied: ${cell.getValue()}`)}
                          >
                            <button className="text-blue-600 hover:underline">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </button>
                          </CopyToClipboard>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>



      )}

      {isFetching && <div className="mt-4">Updating data...</div>}

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPageIndex(Math.max(0, getState().pagination.pageIndex - 1))}
          disabled={getState().pagination.pageIndex === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-md cursor-pointer"
        >
          Previous
        </button>

        <span>
          Page {getState().pagination.pageIndex + 1} of {getPageCount()}
        </span>

        <button
          onClick={() => setPageIndex(Math.min(getPageCount() - 1, getState().pagination.pageIndex + 1))}
          disabled={getState().pagination.pageIndex === getPageCount() - 1}
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </section></TableSkeleton>

    
  );
};

export default TableComponent;
