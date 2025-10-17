
import React, { useState } from 'react';

interface AdminLoginProps {
  onAdminLogin: (password: string) => boolean;
  onExit: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onAdminLogin, onExit }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAdminLogin(password)) {
      setError('Incorrect password.');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Admin Access</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Enter the password to access the lucky draw panel.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password-admin" className="sr-only">Password</label>
            <input
              id="password-admin"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Admin Password"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <button
              type="button"
              onClick={onExit}
              className="w-full flex justify-center py-2 px-4 border rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
