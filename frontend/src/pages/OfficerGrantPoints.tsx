import React from 'react';

export const OfficerGrantPoints: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100">Officer Grant Points</h2>
      <p className="text-sm text-slate-400">
        Officer tool to search members and grant attendance or contribution points.
      </p>
      {/* TODO(Frontend): Wire up member lookup and point grant submission to POST /points/grant */}
      <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-amber-400 font-mono">
        TODO(Frontend): Build grant form with studentId input, amount, reason, and API submit.
      </div>
    </div>
  );
};
