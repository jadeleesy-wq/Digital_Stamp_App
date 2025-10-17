
import React, { useEffect, useRef, useState } from 'react';
import type { User } from '../types';
import { Copy, Check } from 'lucide-react';

declare const QRCode: any;

interface SubmissionModalProps {
  user: User;
  stampsCollected: number;
  onClose: () => void;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({ user, stampsCollected, onClose }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const submissionData = JSON.stringify({
    name: user.name,
    team: user.team,
    stamps: stampsCollected
  });

  useEffect(() => {
    if (qrCodeRef.current) {
      // Clear previous QR code if any
      qrCodeRef.current.innerHTML = ''; 
      new QRCode(qrCodeRef.current, {
        text: submissionData,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  }, [submissionData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(submissionData).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative text-center">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl font-bold leading-none"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-2">Submit Your Entry!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-4">Show this QR code to an admin to enter the lucky draw, or copy the data to send it to them.</p>

        <div className="flex items-center justify-center my-6">
            <div ref={qrCodeRef} className="p-4 bg-white rounded-lg shadow-inner inline-block"></div>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <p className="text-xs text-slate-500 mb-2">Or copy this data:</p>
            <div className="relative">
                <input 
                    type="text"
                    readOnly
                    value={submissionData}
                    className="w-full p-2 pr-10 border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md font-mono text-xs"
                />
                <button onClick={handleCopy} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-indigo-600">
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
            </div>
        </div>

        <div className="mt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">
              Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;
