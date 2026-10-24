import React from 'react';
import { Link } from 'react-router-dom';

const services = ['MAKEFORM', 'UPSHIFT', 'LINKUP', 'ASCENT'];

export const AstrascendHub: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100">ASTRAscend Hub</h2>
      <p className="text-sm text-slate-400">
        Service directory providing information and requests for core ASTRA programs.
      </p>
      <div className="grid grid-cols-2 gap-3 pt-2">
        {services.map((svc) => (
          <Link
            key={svc}
            to={`/astrascend/service/${svc.toLowerCase()}`}
            className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center hover:border-indigo-500/50 transition-colors"
          >
            <span className="text-xs font-bold text-indigo-400">{svc}</span>
          </Link>
        ))}
      </div>
      <Link
        to="/opportunities"
        className="block p-3 bg-slate-900 border border-slate-800 rounded-lg text-center hover:border-indigo-500/50 transition-colors"
      >
        <span className="text-xs font-bold text-amber-400">View Opportunities & Request Forms</span>
      </Link>
      {/* TODO(Frontend): Wire up service descriptions and dynamic program content */}
      <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-amber-400 font-mono">
        TODO(Frontend): Render detailed service program descriptions and static FAQs.
      </div>
    </div>
  );
};
