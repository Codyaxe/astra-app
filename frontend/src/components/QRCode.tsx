import React from 'react';

// Placeholder empty box with a label, no QR library wired up
export const QRCode: React.FC<{ value?: string }> = ({ value }) => {
  // TODO(Frontend): Wire up actual QR rendering library (e.g. qrcode.react)
  return (
    <div className="w-56 h-56 mx-auto border-2 border-dashed border-slate-700 bg-slate-900 rounded-xl flex flex-col items-center justify-center p-4 text-center">
      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
        QR Code Placeholder
      </span>
      <span className="text-[11px] text-slate-500 font-mono mt-2 break-all max-w-full px-2">
        {value || 'NO_TOKEN_ATTACHED'}
      </span>
    </div>
  );
};
