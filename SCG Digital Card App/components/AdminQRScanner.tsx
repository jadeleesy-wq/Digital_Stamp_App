
import React, { useEffect, useState } from 'react';
import { ShieldAlert, Check, XCircle } from 'lucide-react';

declare const Html5Qrcode: any;
const QR_READER_ID = "admin-qr-reader";

interface AdminQRScannerProps {
  onScanSuccess: (data: string) => void;
  onClose: () => void;
  minStamps: number;
}

const AdminQRScanner: React.FC<AdminQRScannerProps> = ({ onScanSuccess, onClose, minStamps }) => {
  const [scanResult, setScanResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(QR_READER_ID);
    let scannerRunning = true;

    const qrCodeSuccessCallback = (decodedText: string) => {
      if (scanResult) return; // Debounce to prevent rapid multiple scans
      
      try {
        const data = JSON.parse(decodedText);
        if (data.name && data.team && typeof data.stamps === 'number') {
           if (data.stamps >= minStamps) {
            onScanSuccess(decodedText);
            setScanResult({ type: 'success', message: `Added ${data.name}!` });
          } else {
            setScanResult({ type: 'error', message: `${data.name} has only ${data.stamps} stamps. Not eligible.` });
          }
        } else {
          setScanResult({ type: 'error', message: 'Invalid QR code format.' });
        }
      } catch (e) {
        setScanResult({ type: 'error', message: 'Not a valid participant QR code.' });
      }
      setTimeout(() => setScanResult(null), 2500);
    };

    const config = { fps: 5, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true };
    
    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, undefined)
      .catch(err => {
        console.error("QR Code scanner error:", err);
        setError('Could not start camera. Please grant permission and refresh the page.');
      });

    return () => {
      if (scannerRunning) {
        html5QrCode.stop().then(() => {
            scannerRunning = false;
        }).catch(err => {
          console.error("Failed to stop QR scanner.", err);
        });
      }
    };
  }, [onScanSuccess, minStamps, scanResult]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Scan Participants</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl font-bold leading-none">&times;</button>
        </div>
        
        {error ? (
          <div className="text-center flex flex-col items-center justify-center h-64 p-4 bg-red-100 dark:bg-red-900/50 rounded-lg">
            <ShieldAlert size={56} className="text-red-500 mb-4" />
            <p className="text-md font-semibold text-red-800 dark:text-red-300">{error}</p>
          </div>
        ) : (
          <>
            <div id={QR_READER_ID} className="w-full rounded-lg overflow-hidden border-2 border-slate-300 dark:border-slate-600"></div>
            <div className="h-10 mt-4 text-center">
              {scanResult && (
                 <p className={`font-semibold flex items-center justify-center gap-2 ${
                    scanResult.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                }`}>
                  {scanResult.type === 'success' ? <Check size={20} /> : <XCircle size={20} />}
                  {scanResult.message}
                </p>
              )}
            </div>
          </>
        )}

        <div className="flex justify-end mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminQRScanner;
