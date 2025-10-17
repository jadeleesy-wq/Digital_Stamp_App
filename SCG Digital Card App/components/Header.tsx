
import React from 'react';
import type { User } from '../types';
import { UserCircle, LogOut } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          Division Stamp Rally
        </h1>
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <div className="hidden sm:flex items-center space-x-2">
                <UserCircle className="text-slate-500" />
                <span className="font-medium">{user.name}</span>
                <span className="text-sm text-slate-500">({user.team})</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5 text-red-500" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
