
import React, { useState, useEffect, useRef } from 'react';
import type { Booth } from '../types';
import { Camera, Check, X, ShieldAlert } from 'lucide-react';

declare const Html5Qrcode: any;

interface StampModalProps {
  booth: Booth;
  onClose: () => void;
  onStamp: (boothId: number) => void;
}

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error' | 'permissionError';

const StampModal: React.FC<StampModalProps> = ({ booth, onClose, onStamp }) => {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [message, setMessage] = useState('');
  const scannerRef = useRef<any>(null);
  const readerId = `qr-reader-${booth.id}`;

  const startScanner = () => {
    setStatus('scanning');
    setMessage("Point your camera at the booth's QR code.");

    const html5QrCode = new Html5Qrcode(readerId);
    scannerRef.current = html5QrCode;
    
    const qrCodeSuccessCallback = (decodedText: string) => {
      scannerRef.current?.stop();
      if (decodedText === booth.secretCode) {
        setStatus('success');
        setMessage('Stamp collected! Great job!');
        setTimeout(() => {
          onStamp(booth.id);
          onClose();
        }, 1500);
      } else {
        setStatus('error');
        setMessage('Wrong QR code scanned. Please find the correct booth.');
      }
    };

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, undefined)
      .catch((err: any) => {
          console.error("QR Code scanner error:", err);
          setStatus('permissionError');
          setMessage('Camera permission is required. Please enable it in your browser settings and try again.');
      });
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((err: any) => {
          console.warn("Failed to stop QR scanner on unmount.", err);
        });
      }
    };
  }, []);

  const renderContent = () => {
    switch(status) {
      case 'success':
        return (
          <div className="text-center flex flex-col items-center justify-center h-64">
            <Check size={64} className="text-green-500 mb-4 animate-bounce" />
            <p className="text-lg font-semibold">{message}</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center flex flex-col items-center justify-center h-64">
            <X size={64} className="text-red-500 mb-4" />
            <p className="text-lg font-semibold">{message}</p>
            <button onClick={startScanner} className="mt-4 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
              Try Again
            </button>
          </div>
        );
       case 'permissionError':
        return (
          <div className="text-center flex flex-col items-center justify-center h-64 p-4 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
            <ShieldAlert size={56} className="text-yellow-500 mb-4" />
            <p className="text-md font-semibold text-yellow-800 dark:text-yellow-300">{message}</p>
          </div>
        );
      case 'scanning':
        return (
            <>
              <div id={readerId} className="w-full rounded-lg overflow-hidden border-2 border-slate-300 dark:border-slate-600"></div>
              <p className="text-center mt-4 text-sm text-slate-500">{message}</p>
            </>
        );
      case 'idle':
      default:
        return (
          <div className="text-center flex flex-col items-center justify-center h-64">
              <Camera size={64} className="text-indigo-500 mb-4" />
              <p className="mb-6">Ready to collect your stamp for {booth.name}?</p>
              <button onClick={startScanner} className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-transform hover:scale-105">
                Scan QR Code
              </button>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Collect Stamp</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl font-bold leading-none">&times;</button>
        </div>
        
        {renderContent()}

        { (status === 'idle' || status === 'error' || status === 'permissionError') && (
          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StampModal;
