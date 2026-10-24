import React from 'react';

export const CheckIn: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100">Event Check-In</h2>
      <p className="text-sm text-slate-400">
        QR scanner and code entry to check into events and claim attendance points.
      </p>
      {/* TODO(Frontend): Integrate camera QR scanner and submit check-in to /events/:id/checkin */}
      <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-amber-400 font-mono">
        TODO(Frontend): Wire up camera scanner library and POST /events/:id/checkin.
      </div>
    </div>
  );
};
