
import React from 'react';
import type { Booth } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface StampProps {
  booth: Booth;
  isStamped: boolean;
  onClick: () => void;
}

const Stamp: React.FC<StampProps> = ({ booth, isStamped, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative aspect-square flex flex-col items-center justify-center p-4 border-2 rounded-lg shadow-md transition-all duration-300 ${
        isStamped
          ? 'bg-green-500 border-green-600 text-white cursor-default'
          : 'bg-white dark:bg-gray-800 border-dashed border-slate-400 dark:border-gray-600 hover:border-solid hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer'
      }`}
    >
      {isStamped && (
        <div className="absolute top-2 right-2 text-white">
          <CheckCircle2 size={24} />
        </div>
      )}
      <div className={`transition-opacity duration-300 ${isStamped ? 'opacity-70' : 'opacity-100'}`}>
        {booth.icon}
      </div>
      <h3 className={`mt-2 text-center font-semibold ${isStamped ? '' : 'text-slate-700 dark:text-slate-300'}`}>
        {booth.name}
      </h3>
       {!isStamped && (
        <p className="mt-1 text-xs text-center text-slate-500 dark:text-slate-400 px-1">
          {booth.description}
        </p>
      )}
    </div>
  );
};

export default Stamp;
