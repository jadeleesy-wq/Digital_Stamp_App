
import React, { useEffect, useState } from 'react';

interface WinnerDisplayProps {
  winners: string[];
  announcement: string;
  onReset: () => void;
}

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute" style={style}>
    <div className="w-2 h-4" style={{ backgroundColor: style.backgroundColor, transform: `rotate(${Math.random() * 360}deg)` }}></div>
  </div>
);

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ winners, announcement, onReset }) => {
  const [confetti, setConfetti] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    const newConfetti = Array.from({ length: 100 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${-10 - Math.random() * 90}%`,
      animation: `fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s forwards`,
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    }));
    setConfetti(newConfetti);
  }, [winners]);
  
  // Define animation keyframes in a style tag as Tailwind doesn't support dynamic keyframes
  const keyframes = `
    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
  `;

  return (
    <div className="relative text-center p-8 border border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-gray-800 rounded-lg overflow-hidden">
      <style>{keyframes}</style>
      <div className="absolute inset-0 pointer-events-none">
        {confetti.map((style, index) => (
          <ConfettiPiece key={index} style={style} />
        ))}
      </div>
      
      <h3 className="text-3xl font-bold text-yellow-800 dark:text-yellow-300">Congratulations!</h3>
      
      <div className="my-6">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Our lucky winners are:</p>
        <ul className="mt-4 space-y-2">
          {winners.map((winner, index) => (
            <li key={index} className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-700 rounded-md py-2 px-4 shadow-sm inline-block mx-2">
              {winner}
            </li>
          ))}
        </ul>
      </div>

      {announcement ? (
        <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
          <p className="text-green-800 dark:text-green-200 italic">{announcement}</p>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse">
            <p className="text-gray-500">Generating special announcement...</p>
        </div>
      )}
      
      <div className="mt-8">
        <button
          onClick={onReset}
          className="py-2 px-6 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          Start New Draw
        </button>
      </div>
    </div>
  );
};

export default WinnerDisplay;
