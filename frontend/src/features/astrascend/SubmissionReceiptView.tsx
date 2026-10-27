import { Link } from 'react-router-dom';
import type { SubmissionReceipt } from './types';

export function SubmissionReceiptView({ receipt, onStartAnother }: { receipt: SubmissionReceipt; onStartAnother: () => void }) {
  const demo = receipt.mode === 'demo';
  return <section className="as-receipt as-container" aria-labelledby="as-receipt-heading">
    <div className="as-success-icon" aria-hidden="true">✓</div>
    {demo && <span className="as-badge">DEMO SUBMISSION</span>}
    <h1 id="as-receipt-heading">{demo ? 'Demo request received' : 'Request received'}</h1>
    <p>Your {demo ? 'demo ' : ''}reference number</p>
    <output className="as-reference" aria-label="Reference number">{receipt.referenceNumber}</output>
    {demo && <p className="as-demo-notice" role="status">This is a demonstration. No request was saved and no confirmation email was sent.</p>}
    <div className="as-receipt-next as-panel">
      <h2>What happens next?</h2>
      <ol>
        <li>{demo ? 'The demo shows how a receipt will look once submissions are connected.' : receipt.confirmationEmailSent ? 'We registered your request and sent a confirmation to your email.' : 'We registered your request.'}</li>
        <li>{demo ? 'For a real submission, officers assess fit and feasibility.' : 'Officers assess fit and feasibility.'}</li>
        <li>{demo ? 'The team would clarify scope before any work begins.' : 'We reach out to clarify scope before any work begins.'}</li>
      </ol>
    </div>
    <div className="as-receipt-actions">
      <button type="button" className="as-button" onClick={onStartAnother}>Start another request</button>
      <Link className="as-button as-button--outline" to="/astrascend">Back to home</Link>
    </div>
  </section>;
}
