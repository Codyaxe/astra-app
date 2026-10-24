import React from 'react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100">Home</h2>
      <p className="text-sm text-slate-400">
        Member dashboard displaying membership summary, announcements, and quick actions.
      </p>
      {/* TODO(Frontend): Wire up member status card and upcoming events overview */}
      <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-amber-400 font-mono">
        TODO(Frontend): Render member summary card, active points, and quick action shortcuts.
      </div>
    </div>
  );
};
