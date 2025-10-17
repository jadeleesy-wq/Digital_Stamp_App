
import React, { useState, useEffect, useCallback } from 'react';
import type { User } from './types';
import { BOOTHS, ADMIN_PASSWORD, DEFAULT_TEAMS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import LoginScreen from './components/LoginScreen';
import StampCard from './components/StampCard';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';

type View = 'login' | 'user' | 'adminLogin' | 'admin';

const App: React.FC = () => {
  const [user, setUser] = useLocalStorage<User | null>('stamp-card-user', null);
  const [stampedBooths, setStampedBooths] = useLocalStorage<number[]>('stamp-card-stamps', []);
  const [teams, setTeams] = useLocalStorage<string[]>('stamp-card-teams', DEFAULT_TEAMS);
  const [view, setView] = useState<View>('login');

  useEffect(() => {
    if (user) {
      setView('user');
    } else {
      setView('login');
    }
  }, [user]);

  const handleLogin = (name: string, team: string) => {
    setUser({ name, team });
  };

  const handleLogout = () => {
    setUser(null);
    setStampedBooths([]);
    setView('login');
  };

  const handleStamp = useCallback((boothId: number) => {
    if (!stampedBooths.includes(boothId)) {
      setStampedBooths(prev => [...prev, boothId]);
    }
  }, [stampedBooths, setStampedBooths]);

  const handleAdminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setView('admin');
      return true;
    }
    return false;
  };
  
  const exitAdminView = () => {
    if (user) {
      setView('user');
    } else {
      setView('login');
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'user':
        return user && <StampCard user={user} booths={BOOTHS} stampedBooths={stampedBooths} onStamp={handleStamp} />;
      case 'adminLogin':
        return <AdminLogin onAdminLogin={handleAdminLogin} onExit={exitAdminView} />;
      case 'admin':
        return <AdminPanel onExit={exitAdminView} teams={teams} onTeamsChange={setTeams} />;
      case 'login':
      default:
        return <LoginScreen onLogin={handleLogin} teams={teams} onNavigateToAdmin={() => setView('adminLogin')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header 
        user={user} 
        onLogout={handleLogout} 
      />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-xs text-slate-500 dark:text-slate-400">
        <p>Digital Stamp Card App</p>
      </footer>
    </div>
  );
};

export default App;
