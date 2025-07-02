import { DataTable, DashboardShell } from '@cosmo-view/ui';
import type { ColumnDef } from '@tanstack/react-table';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  joinDate: string;
  department: string;
}

// Sample data with more entries to showcase pagination
const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-07-01',
    joinDate: '2022-01-15',
    department: 'Engineering',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '2024-06-30',
    joinDate: '2021-03-20',
    department: 'Marketing',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    role: 'Developer',
    status: 'inactive',
    lastLogin: '2024-06-15',
    joinDate: '2023-05-10',
    department: 'Engineering',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice.brown@company.com',
    role: 'Designer',
    status: 'active',
    lastLogin: '2024-07-02',
    joinDate: '2022-08-05',
    department: 'Design',
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@company.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-07-01',
    joinDate: '2020-11-12',
    department: 'IT',
  },
  {
    id: '6',
    name: 'Diana Prince',
    email: 'diana.prince@company.com',
    role: 'Developer',
    status: 'pending',
    lastLogin: '2024-06-28',
    joinDate: '2024-06-01',
    department: 'Engineering',
  },
  {
    id: '7',
    name: 'Ethan Hunt',
    email: 'ethan.hunt@company.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '2024-07-02',
    joinDate: '2021-09-15',
    department: 'Operations',
  },
  {
    id: '8',
    name: 'Fiona Green',
    email: 'fiona.green@company.com',
    role: 'Analyst',
    status: 'active',
    lastLogin: '2024-07-01',
    joinDate: '2023-02-28',
    department: 'Finance',
  },
  {
    id: '9',
    name: 'George Miller',
    email: 'george.miller@company.com',
    role: 'Developer',
    status: 'inactive',
    lastLogin: '2024-05-20',
    joinDate: '2022-12-01',
    department: 'Engineering',
  },
  {
    id: '10',
    name: 'Helen Clark',
    email: 'helen.clark@company.com',
    role: 'Designer',
    status: 'active',
    lastLogin: '2024-07-02',
    joinDate: '2023-07-10',
    department: 'Design',
  },
  {
    id: '11',
    name: 'Ian Davis',
    email: 'ian.davis@company.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '2024-06-29',
    joinDate: '2020-04-18',
    department: 'Sales',
  },
  {
    id: '12',
    name: 'Julia Roberts',
    email: 'julia.roberts@company.com',
    role: 'Analyst',
    status: 'pending',
    lastLogin: '2024-06-25',
    joinDate: '2024-05-15',
    department: 'Finance',
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
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => {
      const department = row.getValue('department') as string;
      const colors = {
        Engineering: 'bg-blue-100 text-blue-800',
        Marketing: 'bg-green-100 text-green-800',
        Design: 'bg-purple-100 text-purple-800',
        IT: 'bg-gray-100 text-gray-800',
        Operations: 'bg-orange-100 text-orange-800',
        Finance: 'bg-yellow-100 text-yellow-800',
        Sales: 'bg-pink-100 text-pink-800',
      };
      return (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}
        >
          {department}
        </span>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const colors = {
        Admin: 'bg-red-100 text-red-800',
        Manager: 'bg-indigo-100 text-indigo-800',
        Developer: 'bg-green-100 text-green-800',
        Designer: 'bg-purple-100 text-purple-800',
        Analyst: 'bg-blue-100 text-blue-800',
      };
      return (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}
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
      const colors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
      };
      return (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'joinDate',
    header: 'Join Date',
    cell: ({ row }) => <div className='text-gray-600'>{row.getValue('joinDate')}</div>,
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
    cell: ({ row }) => <div className='text-gray-600'>{row.getValue('lastLogin')}</div>,
  },
];

export function DataTablePage() {
  return (
    <DashboardShell
      title='User Management'
      subtitle='Manage users with advanced table features including sorting, filtering, and column visibility.'
    >
      <div className='space-y-6'>
        <div className='rounded-lg border bg-white p-6'>
          <div className='mb-4'>
            <h3 className='text-lg font-semibold'>Smart Data Table Demo</h3>
            <p className='text-sm text-gray-600 mt-1'>
              This table demonstrates sorting, filtering, column hiding, resizing, and pagination
              features.
            </p>
          </div>

          <DataTable
            columns={columns}
            data={users}
            searchKey='name'
            searchPlaceholder='Search users by name...'
            pageSize={8}
            className='border-0'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='rounded-lg border bg-white p-4'>
            <h4 className='font-medium mb-2'>Features Included:</h4>
            <ul className='text-sm space-y-1 text-gray-600'>
              <li>• Sortable columns (click headers)</li>
              <li>• Global search filtering</li>
              <li>• Column visibility toggle</li>
              <li>• Pagination with configurable page sizes</li>
              <li>• Responsive design</li>
              <li>• Custom cell rendering</li>
            </ul>
          </div>

          <div className='rounded-lg border bg-white p-4'>
            <h4 className='font-medium mb-2'>Usage Tips:</h4>
            <ul className='text-sm space-y-1 text-gray-600'>
              <li>• Use the search box to filter by name</li>
              <li>• Click column headers to sort</li>
              <li>• Use "Columns" button to hide/show columns</li>
              <li>• Adjust page size in pagination controls</li>
              <li>• Table is fully keyboard accessible</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
