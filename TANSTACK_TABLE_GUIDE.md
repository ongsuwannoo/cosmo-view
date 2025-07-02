# TanStack Table Integration

This project now includes a powerful DataTable component built with TanStack Table that provides:

## Features

- **Sorting**: Click on column headers to sort data
- **Filtering**: Global search across all columns
- **Column Visibility**: Show/hide columns with the column toggle
- **Pagination**: Navigate through large datasets with configurable page sizes
- **Resizable Columns**: Drag column borders to resize (when enabled)
- **Responsive Design**: Works well on all screen sizes
- **Keyboard Accessible**: Full keyboard navigation support

## Usage

```tsx
import { DataTable, type ColumnDef } from '@cosmo-view/ui';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email', 
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
        {row.getValue('role')}
      </span>
    ),
  },
];

const data: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  // ... more data
];

export function MyTable() {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search users..."
      pageSize={10}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TData, TValue>[]` | Required | Column definitions |
| `data` | `TData[]` | Required | Array of data objects |
| `searchKey` | `string` | `undefined` | Column key to enable global search on |
| `searchPlaceholder` | `string` | `"Search..."` | Placeholder text for search input |
| `showColumnToggle` | `boolean` | `true` | Show/hide column visibility toggle |
| `showPagination` | `boolean` | `true` | Show/hide pagination controls |
| `pageSize` | `number` | `10` | Number of rows per page |
| `className` | `string` | `undefined` | Additional CSS classes |

## Live Demo

Visit the running application at `http://localhost:3000/table` to see the DataTable in action with:

- Sample user data with multiple columns
- Department and role badges with color coding
- Search functionality across user names
- Column visibility controls
- Pagination with configurable page sizes
- Responsive design

## Development

The DataTable component is built with:

- **TanStack Table v8** for core table functionality
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **TypeScript** for type safety

To customize the component, edit `/packages/ui/src/components/composed/data-table/data-table.tsx`.

## Storybook

View the component in Storybook by running:

```bash
pnpm storybook
```

Then navigate to `Composed/DataTable` to see all the available stories and interactive controls.
