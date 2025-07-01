import { useState } from 'react';
import { LoginForm, RegisterForm, ContactForm } from '@/components/forms';
import type { LoginFormData, RegisterFormData } from '@/lib/validations/auth';
import type { ContactFormData } from '@/lib/validations/forms';

export function FormDemoPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'contact'>('login');
  const [submitResults, setSubmitResults] = useState<Record<string, unknown>>({});

  const handleLoginSubmit = async (data: LoginFormData) => {
    console.log('Login form submitted:', data);
    setSubmitResults({ login: data });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert('Login form submitted successfully! Check console for data.');
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    console.log('Register form submitted:', data);
    setSubmitResults({ register: data });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert('Register form submitted successfully! Check console for data.');
  };

  const handleContactSubmit = async (data: ContactFormData) => {
    console.log('Contact form submitted:', data);
    setSubmitResults({ contact: data });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert('Contact form submitted successfully! Check console for data.');
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Zod Form Validation Demo
          </h1>
          <p className='mt-2 text-lg text-gray-600 dark:text-gray-400'>
            React Hook Form + Zod validation with TypeScript
          </p>
        </div>

        {/* Tab Navigation */}
        <div className='flex justify-center mb-8'>
          <div className='flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1'>
            <button
              type='button'
              onClick={() => setActiveTab('login')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Login Form
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('register')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'register'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Register Form
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'contact'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Contact Form
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className='flex justify-center'>
          {activeTab === 'login' && <LoginForm onSubmit={handleLoginSubmit} />}
          {activeTab === 'register' && <RegisterForm onSubmit={handleRegisterSubmit} />}
          {activeTab === 'contact' && <ContactForm onSubmit={handleContactSubmit} />}
        </div>

        {/* Features List */}
        <div className='mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
            Form Features Implemented
          </h2>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h3 className='font-medium text-gray-900 dark:text-white mb-2'>
                Validation Features
              </h3>
              <ul className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
                <li>• Zod schema validation</li>
                <li>• Real-time field validation</li>
                <li>• Custom error messages</li>
                <li>• Password strength validation</li>
                <li>• Email format validation</li>
                <li>• Password confirmation matching</li>
              </ul>
            </div>
            <div>
              <h3 className='font-medium text-gray-900 dark:text-white mb-2'>UX Features</h3>
              <ul className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
                <li>• Form loading states</li>
                <li>• Disabled states during submission</li>
                <li>• Accessible form labels</li>
                <li>• Error styling</li>
                <li>• Helper text support</li>
                <li>• TypeScript type safety</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Last Submission Results */}
        {Object.keys(submitResults).length > 0 && (
          <div className='mt-6 bg-green-50 dark:bg-green-900/20 rounded-lg p-4'>
            <h3 className='font-medium text-green-900 dark:text-green-300 mb-2'>
              Last Form Submission:
            </h3>
            <pre className='text-sm text-green-700 dark:text-green-400 overflow-auto'>
              {JSON.stringify(submitResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
