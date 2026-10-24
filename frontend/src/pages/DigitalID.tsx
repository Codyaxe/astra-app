import React from 'react';
import { QRCode } from '../components/QRCode.js';

export const DigitalID: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100">Digital ID</h2>
      <p className="text-sm text-slate-400">
        Member digital ID card with QR code showing membership and paid status.
      </p>
      <QRCode value="STUB_MEMBER_TOKEN_PLACEHOLDER" />
      {/* TODO(Frontend): Wire up /members/me/id data fetching and dynamic QR refresh */}
      <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-amber-400 font-mono">
        TODO(Frontend): Fetch digital ID payload from /members/me/id and display student details.
      </div>
    </div>
  );
};
