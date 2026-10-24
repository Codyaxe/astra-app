import React from 'react';

export const Login: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100">Login</h2>
      <p className="text-sm text-slate-400">
        Member and officer authentication screen.
      </p>
      {/* TODO(Frontend): Wire up Firebase Auth form and credentials handling */}
      <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-amber-400 font-mono">
        TODO(Frontend): Implement login credentials handling & auth state redirect.
      </div>
    </div>
  );
};
