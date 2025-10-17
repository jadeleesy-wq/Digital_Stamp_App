
import React, { useState, useMemo } from 'react';
import { generateWinnerAnnouncement } from '../services/geminiService';
import WinnerDisplay from './WinnerDisplay';
import AdminQRScanner from './AdminQRScanner';
import type { Participant } from '../types';
import { ScanLine, Download, Trash2 } from 'lucide-react';
import { MIN_STAMPS_FOR_LUCKY_DRAW } from '../constants';

interface AdminPanelProps {
  onExit: () => void;
  teams: string[];
  onTeamsChange: (teams: string[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onExit, teams, onTeamsChange }) => {
  // Lucky Draw State
  const [participantData, setParticipantData] = useState('');
  const [numWinners, setNumWinners] = useState(5);
  const [winners, setWinners] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Team Management State
  const [editableTeams, setEditableTeams] = useState(teams.join('\n'));
  const [teamSaveMessage, setTeamSaveMessage] = useState('');

  const allParsedParticipants = useMemo((): Participant[] => {
    return participantData
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        try {
          const p = JSON.parse(line) as Participant;
          if (typeof p.name === 'string' && typeof p.team === 'string' && typeof p.stamps === 'number') {
            return p;
          }
          return null;
        } catch {
          return null;
        }
      })
      .filter((p): p is Participant => p !== null);
  }, [participantData]);
  
  const eligibleParticipants = useMemo((): Participant[] => {
      return allParsedParticipants.filter(p => p.stamps >= MIN_STAMPS_FOR_LUCKY_DRAW);
  }, [allParsedParticipants]);

  const ineligibleParticipants = useMemo((): Participant[] => {
      return allParsedParticipants.filter(p => p.stamps < MIN_STAMPS_FOR_LUCKY_DRAW);
  }, [allParsedParticipants]);

  const handleScanSuccess = (data: string) => {
    const newParticipant = JSON.parse(data) as Participant;
    const isDuplicate = allParsedParticipants.some(p => p.name === newParticipant.name);
    if (!isDuplicate) {
      setParticipantData(prev => `${prev}\n${data}`.trim());
    }
  };

  const handleDraw = async () => {
    if (eligibleParticipants.length === 0) {
      setError('Please add at least one eligible participant.');
      return;
    }
    const participantNames = eligibleParticipants.map(p => p.name);
    if (numWinners > participantNames.length) {
      setError('Number of winners cannot be more than the number of eligible participants.');
      return;
    }
    if (numWinners <= 0) {
      setError('Number of winners must be at least 1.');
      return;
    }

    setError('');
    setIsLoading(true);
    setWinners([]);
    setAnnouncement('');

    const shuffled = participantNames.sort(() => 0.5 - Math.random());
    const drawnWinners = shuffled.slice(0, numWinners);
    setWinners(drawnWinners);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    const generatedAnnouncement = await generateWinnerAnnouncement(drawnWinners);
    setAnnouncement(generatedAnnouncement);
    setIsLoading(false);
  };
  
  const resetDraw = () => {
    setWinners([]);
    setAnnouncement('');
    setParticipantData('');
    setError('');
  };
  
  const handleTeamSave = () => {
    const updatedTeams = editableTeams.split('\n').map(t => t.trim()).filter(Boolean);
    onTeamsChange(updatedTeams);
    setTeamSaveMessage('Team list updated successfully!');
    setTimeout(() => setTeamSaveMessage(''), 3000);
  };
  
  const handleDownloadCSV = () => {
    if (eligibleParticipants.length === 0) {
      alert("No eligible participant data to download.");
      return;
    }
    const headers = "Name,Team,Stamps\n";
    const csvContent = eligibleParticipants.map(p => `"${p.name.replace(/"/g, '""')}","${p.team}","${p.stamps}"`).join('\n');
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "eligible_participants.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Admin Panel</h2>
        <button onClick={onExit} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Exit Admin</button>
      </div>

      {winners.length > 0 ? (
        <WinnerDisplay winners={winners} announcement={announcement} onReset={resetDraw} />
      ) : (
        <div>
          <h3 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Lucky Draw</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="participants" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Participant Data
              </label>
              <div className="flex space-x-2 mb-2">
                <button onClick={() => setIsScanning(true)} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                    <ScanLine size={18}/> Scan QR Codes
                </button>
                <button onClick={handleDownloadCSV} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700">
                    <Download size={18} /> Download Eligible as CSV
                </button>
              </div>
              <textarea
                id="participants"
                rows={8}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-xs"
                placeholder="Scan QR codes or paste participant data here. Each entry should be a JSON string on a new line."
                value={participantData}
                onChange={(e) => setParticipantData(e.target.value)}
              />
               <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                    {eligibleParticipants.length} eligible participant(s) found.
                </p>
                <button onClick={() => setParticipantData('')} className="text-xs text-red-500 hover:underline inline-flex items-center gap-1">
                    <Trash2 size={12}/> Clear List
                </button>
               </div>
               {ineligibleParticipants.length > 0 && (
                <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 p-2 bg-yellow-50 dark:bg-yellow-900/50 rounded-md border border-yellow-200 dark:border-yellow-800">
                    <p className="font-bold">The following {ineligibleParticipants.length} participant(s) are not eligible (less than {MIN_STAMPS_FOR_LUCKY_DRAW} stamps) and will be excluded:</p>
                    <ul className="list-disc list-inside ml-2">
                        {ineligibleParticipants.map(p => <li key={p.name}>{p.name} ({p.stamps} stamps)</li>)}
                    </ul>
                </div>
                )}
            </div>
            <div>
              <label htmlFor="numWinners" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Winners to Draw
              </label>
              <input
                id="numWinners"
                type="number"
                min="1"
                value={numWinners}
                onChange={(e) => setNumWinners(parseInt(e.target.value, 10))}
                className="w-full max-w-xs p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <div className="mt-6">
            <button
              onClick={handleDraw}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-md text-white font-semibold bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {isLoading ? 'Drawing...' : 'Draw Winners'}
            </button>
          </div>
        </div>
      )}

      {winners.length === 0 && (
         <div className="pt-8">
            <h3 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Team Management</h3>
            <div>
              <label htmlFor="teams" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team Names
              </label>
              <textarea
                id="teams"
                rows={5}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter each team name on a new line."
                value={editableTeams}
                onChange={(e) => setEditableTeams(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Add, edit, or remove teams. One team per line. Changes will appear on the login screen.</p>
            </div>
            <div className="mt-4 flex items-center space-x-4">
                <button
                onClick={handleTeamSave}
                className="py-2 px-4 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                Save Teams
                </button>
                {teamSaveMessage && <p className="text-sm text-green-600 dark:text-green-400">{teamSaveMessage}</p>}
            </div>
        </div>
      )}
      
      {isScanning && (
        <AdminQRScanner 
            onScanSuccess={handleScanSuccess}
            onClose={() => setIsScanning(false)}
            minStamps={MIN_STAMPS_FOR_LUCKY_DRAW}
        />
      )}
    </div>
  );
};

export default AdminPanel;
