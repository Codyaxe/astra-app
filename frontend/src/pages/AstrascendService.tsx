import React from 'react';
import { useParams, Link } from 'react-router-dom';

export const AstrascendService: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const serviceName = (serviceId || 'Service').toUpperCase();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-100">{serviceName}</h2>
        <Link to="/astrascend" className="text-xs text-indigo-400 hover:underline">
          &larr; Back to Hub
        </Link>
      </div>
      <p className="text-sm text-slate-400">
        Static informational page and program guide for {serviceName}.
      </p>
      {/* TODO(Frontend): Populate specific program guidelines and external request link */}
      <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-amber-400 font-mono">
        TODO(Frontend): Render content and request action tailored to {serviceName}.
      </div>
    </div>
  );
};
