import React from 'react';

export const NotValid: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-rose-400">Not Valid</h2>
      <p className="text-sm text-slate-400">
        Notice displayed when membership status is invalid or annual dues are unpaid.
      </p>
      {/* TODO(Frontend): Add renewal instructions and payment officer contact information */}
      <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-amber-400 font-mono">
        TODO(Frontend): Provide payment instructions and dues renewal guidance.
      </div>
    </div>
  );
};
