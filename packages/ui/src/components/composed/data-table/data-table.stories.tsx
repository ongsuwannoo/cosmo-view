import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './data-table';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const sampleData: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'active',
    lastLogin: '2024-01-14',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Moderator',
    status: 'inactive',
    lastLogin: '2024-01-10',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'User',
    status: 'active',
    lastLogin: '2024-01-16',
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-13',
  },
];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className='font-medium'>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div className='text-gray-600'>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      return (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            role === 'Admin'
              ? 'bg-purple-100 text-purple-800'
              : role === 'Moderator'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
          }`}
        >
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
    cell: ({ row }) => <div className='text-gray-600'>{row.getValue('lastLogin')}</div>,
  },
];

const meta = {
  title: 'Composed/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    columns,
    data: sampleData,
    searchKey: 'name',
    searchPlaceholder: 'Search users...',
  },
};

export const WithoutSearch = {
  args: {
    columns,
    data: sampleData,
    showColumnToggle: true,
    showPagination: true,
  },
};

export const WithoutColumnToggle = {
  args: {
    columns,
    data: sampleData,
    searchKey: 'name',
    showColumnToggle: false,
  },
};

export const WithoutPagination = {
  args: {
    columns,
    data: sampleData,
    searchKey: 'name',
    showPagination: false,
  },
};

export const SmallPageSize = {
  args: {
    columns,
    data: sampleData,
    searchKey: 'name',
    pageSize: 3,
  },
};
