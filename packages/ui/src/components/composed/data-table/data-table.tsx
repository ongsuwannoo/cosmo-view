import { useState } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '../../base/button';
import { Input } from '../../base/input';
import { ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  showColumnToggle?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  showColumnToggle = true,
  showPagination = true,
  pageSize = 10,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with Search and Column Toggle */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          {searchKey && (
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
              className='max-w-sm'
            />
          )}
        </div>
        {showColumnToggle && (
          <div className='relative'>
            <Button
              variant='outline'
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className='ml-auto'
            >
              <Settings2 className='mr-2 h-4 w-4' />
              Columns
            </Button>
            {showColumnSelector && (
              <div className='absolute right-0 top-full mt-2 w-48 rounded-md border bg-white p-2 shadow-lg z-50'>
                <div className='space-y-2'>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <div key={column.id} className='flex items-center space-x-2'>
                          <input
                            type='checkbox'
                            id={column.id}
                            checked={column.getIsVisible()}
                            onChange={(e) => column.toggleVisibility(e.target.checked)}
                            className='rounded border-gray-300'
                          />
                          <label
                            htmlFor={column.id}
                            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                          >
                            {column.id}
                          </label>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className='rounded-md border'>
        <table className='w-full'>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className='border-b bg-gray-50/50'>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='h-12 px-4 text-left align-middle font-medium text-gray-900'
                    style={{
                      width: header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          'flex items-center space-x-2',
                          header.column.getCanSort() &&
                            'cursor-pointer select-none hover:text-gray-700'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()?.(e);
                          }
                        }}
                        role={header.column.getCanSort() ? 'button' : undefined}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getCanSort() && (
                          <div className='flex flex-col'>
                            {header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp className='h-3 w-3' />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown className='h-3 w-3' />
                            ) : (
                              <div className='flex flex-col'>
                                <ChevronUp className='h-3 w-3 opacity-50' />
                                <ChevronDown className='h-3 w-3 opacity-50 -mt-1' />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Resize Handle */}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className='absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-300 opacity-0 hover:opacity-100'
                        style={{
                          userSelect: 'none',
                          touchAction: 'none',
                        }}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className='border-b transition-colors hover:bg-gray-50/50'>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className='p-4 align-middle'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className='flex items-center justify-between space-x-2 py-4'>
          <div className='flex-1 text-sm text-gray-700'>
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className='flex items-center space-x-6 lg:space-x-8'>
            <div className='flex items-center space-x-2'>
              <p className='text-sm font-medium'>Rows per page</p>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className='h-8 w-16 rounded border border-gray-300 bg-white px-2 text-sm'
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex w-24 items-center justify-center text-sm font-medium'>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {'>'}
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
