import { Link } from 'react-router-dom';
import type { SubmissionReceipt } from './types';
import { badge, button, container, heading, panel } from './styles';

export function SubmissionReceiptView({ receipt, onStartAnother }: { receipt: SubmissionReceipt; onStartAnother: () => void }) {
  const demo = receipt.mode === 'demo';
  return <section className={`${container} flex flex-col items-center gap-6 pb-20 pt-14 text-center`} aria-labelledby="as-receipt-heading">
    <div className="grid h-[72px] w-[72px] place-items-center rounded-[50%] bg-ascend-blue text-[34px] text-white" aria-hidden="true">✓</div>
    {demo && <span className={badge()}>DEMO SUBMISSION</span>}
    <h1 className={`${heading} text-[clamp(34px,4vw,44px)]`} id="as-receipt-heading">{demo ? 'Demo request received' : 'Request received'}</h1>
    <p>Your {demo ? 'demo ' : ''}reference number</p>
    <output className="text-[28px] font-bold text-ascend-accent [overflow-wrap:anywhere]" aria-label="Reference number">{receipt.referenceNumber}</output>
    <p className="text-ascend-muted">Submitted <time dateTime={receipt.submittedAt}>{new Date(receipt.submittedAt).toLocaleString()}</time></p>
    {demo && <p className="max-w-[640px] text-ascend-muted" role="status">This is a demonstration. No request was saved and no confirmation email was sent.</p>}
    <div className={`${panel} w-full max-w-[960px] p-6 text-left md:p-8 as-compact:p-[22px]`}>
      <h2 className={`${heading} text-[22px]`}>What happens next?</h2>
      <ol className="mt-5 grid list-outside list-decimal gap-4 pl-6 text-ascend-muted">
        <li>{demo ? 'The demo shows how a receipt will look once submissions are connected.' : receipt.confirmationEmailSent ? 'We registered your request and sent a confirmation to your email.' : 'We registered your request.'}</li>
        <li>{demo ? 'For a real submission, officers assess fit and feasibility.' : 'Officers assess fit and feasibility.'}</li>
        <li>{demo ? 'The team would clarify scope before any work begins.' : 'We reach out to clarify scope before any work begins.'}</li>
      </ol>
    </div>
    <div className="flex w-full flex-wrap justify-center gap-4 sm:w-auto">
      <button type="button" className={`${button()} w-full sm:w-auto`} onClick={onStartAnother}>Start another request</button>
      <Link className={`${button('outline')} w-full sm:w-auto`} to="/astrascend">Back to home</Link>
    </div>
  </section>;
}
