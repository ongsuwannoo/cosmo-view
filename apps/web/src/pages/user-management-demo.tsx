/**
 * User Management Demo Page
 * Demonstrates the DDD implementation with a functional component
 */

import { UserManagementDashboard } from '../contexts/UserManagement';

export function UserManagementDemo() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Domain-Driven Design Demo</h1>
          <p className='text-lg text-gray-600 mb-6'>
            This is a proof of concept demonstrating Domain-Driven Design (DDD) principles in a
            React application with the User Management bounded context.
          </p>

          <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>DDD Structure Overview</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='border-l-4 border-blue-500 pl-4'>
                <h3 className='text-lg font-medium text-gray-800 mb-2'>Domain Layer</h3>
                <ul className='text-sm text-gray-600 space-y-1'>
                  <li>• Business logic and rules</li>
                  <li>• Domain entities and value objects</li>
                  <li>• State management (Zustand)</li>
                  <li>• Domain events</li>
                </ul>
              </div>

              <div className='border-l-4 border-green-500 pl-4'>
                <h3 className='text-lg font-medium text-gray-800 mb-2'>Infrastructure Layer</h3>
                <ul className='text-sm text-gray-600 space-y-1'>
                  <li>• API repository pattern</li>
                  <li>• React Query integration</li>
                  <li>• External service adapters</li>
                  <li>• Data persistence</li>
                </ul>
              </div>

              <div className='border-l-4 border-purple-500 pl-4'>
                <h3 className='text-lg font-medium text-gray-800 mb-2'>UI Components</h3>
                <ul className='text-sm text-gray-600 space-y-1'>
                  <li>• Domain-specific components</li>
                  <li>• Custom CSS modules</li>
                  <li>• Separated presentation logic</li>
                  <li>• Reusable UI patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <UserManagementDashboard />
      </div>
    </div>
  );
}
