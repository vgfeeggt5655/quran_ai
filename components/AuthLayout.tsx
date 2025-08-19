
import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 font-amiri">القرآن الكريم</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
            {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
