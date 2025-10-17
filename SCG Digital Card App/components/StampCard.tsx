
import React, { useState } from 'react';
import type { User, Booth } from '../types';
import Stamp from './Stamp';
import StampModal from './StampModal';
import SubmissionModal from './SubmissionModal';
import { Ticket } from 'lucide-react';
import { MIN_STAMPS_FOR_LUCKY_DRAW } from '../constants';

interface StampCardProps {
  user: User;
  booths: Booth[];
  stampedBooths: number[];
  onStamp: (boothId: number) => void;
}

const StampCard: React.FC<StampCardProps> = ({ user, booths, stampedBooths, onStamp }) => {
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const progress = (stampedBooths.length / booths.length) * 100;
  const isEligibleForSubmission = stampedBooths.length >= MIN_STAMPS_FOR_LUCKY_DRAW;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Your Stamp Card</h2>
        <p className="text-slate-500 dark:text-slate-400">Visit all the booths to complete your card!</p>
      </div>

      <div className="mb-8 px-2">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full text-center text-white text-xs transition-all duration-500"
            style={{ width: `${progress}%` }}
          >
           {stampedBooths.length > 0 && `${stampedBooths.length} / ${booths.length}`}
          </div>
        </div>
      </div>
      
      {isEligibleForSubmission && (
        <div className="my-6 text-center">
            <button
              onClick={() => setIsSubmissionModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-500 text-white font-bold text-lg hover:bg-yellow-600 transition-transform hover:scale-105 shadow-lg animate-pulse"
            >
              <Ticket size={24} />
              Submit for Lucky Draw!
            </button>
            <p className="text-xs text-slate-500 mt-2">You have enough stamps to enter the draw!</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
        {booths.map(booth => (
          <Stamp
            key={booth.id}
            booth={booth}
            isStamped={stampedBooths.includes(booth.id)}
            onClick={() => !stampedBooths.includes(booth.id) && setSelectedBooth(booth)}
          />
        ))}
      </div>
      
      {selectedBooth && (
        <StampModal 
          booth={selectedBooth}
          onClose={() => setSelectedBooth(null)}
          onStamp={onStamp}
        />
      )}
      
      {isSubmissionModalOpen && (
        <SubmissionModal 
          user={user}
          stampsCollected={stampedBooths.length}
          onClose={() => setIsSubmissionModalOpen(false)}
        />
      )}
    </div>
  );
};

export default StampCard;
