import React from 'react';

export const PartnerInstructions: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100">Partner Instructions</h2>
      <p className="text-sm text-slate-400">
        Guide for partner staff on how to inspect member digital IDs and validate perk vouchers.
      </p>
      {/* TODO(Frontend): Add step-by-step merchant instructions and verification checklist */}
      <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-amber-400 font-mono">
        TODO(Frontend): Render partner redemption guide and voucher verification criteria.
      </div>
    </div>
  );
};
