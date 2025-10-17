
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (name: string, team: string) => void;
  teams: string[];
  onNavigateToAdmin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, teams, onNavigateToAdmin }) => {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && team) {
      onLogin(name.trim(), team);
    }
  };
  
  const isFormValid = name.trim() !== '' && team !== '';

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome!
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your details to start collecting stamps.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="team" className="sr-only">Team</label>
              <select
                id="team"
                name="team"
                required
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="" disabled>Select your team</option>
                {teams.map((teamName) => (
                  <option key={teamName} value={teamName}>{teamName}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isFormValid}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              Start Collecting
            </button>
          </div>
        </form>
        <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={onNavigateToAdmin}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
