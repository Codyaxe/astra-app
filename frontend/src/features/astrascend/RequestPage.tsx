import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ContactFields, ConsentField } from './CommonFields';
import { ServiceFields } from './ServiceFields';
import { SubmissionReceiptView } from './SubmissionReceiptView';
import { useRequestState } from './RequestState';
import { normalizeSubmissionError, submitServiceRequest } from './requestIntegration';
import { definitions, serviceCards } from './services';
import { isService, type FieldErrors, type Service, type ServiceRequest } from './types';

export function RequestPage() {
  const state = useRequestState();
  const [params, setParams] = useSearchParams();
  const selected = params.get('service');
  const service: Service = isService(selected) ? selected : 'makeform';
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const form = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => { setErrors({}); setMessage(''); }, [service]);
  useEffect(() => { if (Object.keys(errors).length) form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(); }, [errors]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setMessage(''); setErrors({});
    try {
      let request: ServiceRequest;
      // Keep each category paired with its typed draft at the submission boundary.
      switch (service) {
        case 'makeform': request = definitions.makeform.buildRequest(state.contact, state.consent, state.drafts.makeform); break;
        case 'upshift': request = definitions.upshift.buildRequest(state.contact, state.consent, state.drafts.upshift); break;
        case 'linkup': request = definitions.linkup.buildRequest(state.contact, state.consent, state.drafts.linkup); break;
        case 'reign': request = definitions.reign.buildRequest(state.contact, state.consent, state.drafts.reign); break;
      }
      setPending(true);
      const receipt = await submitServiceRequest(request);
      if (mounted.current) { state.setReceipt(receipt); navigate('/astrascend/request/success'); }
    } catch (error) {
      if (mounted.current) {
        const failure = normalizeSubmissionError(error);
        setErrors(failure.fieldErrors); setMessage(failure.message);
      }
    } finally {
      inFlight.current = false;
      if (mounted.current) setPending(false);
    }
  };
  const fieldProps = { errors, disabled: pending, onChange: (field: string, value: string) => state.updateDetail(service, field, value) };
  return <div className="as-request-page"><div className="as-container">
    <div className="as-request-intro"><span className="as-badge">TAKE THE FIRST STEP</span><h1>Tell us what you have in mind.</h1><p>A service request, a partnership, or an opportunity worth exploring.</p></div>
    <form className="as-panel as-request-form" ref={form} onSubmit={submit} noValidate aria-busy={pending}>
      {message && <p className="as-error-summary" role="alert">{message}</p>}
      <fieldset className="as-form-section" disabled={pending}><legend><span>01</span> Find your direction</legend>
        <div className="as-direction-grid">{serviceCards.map(card => <label key={card.service} className={`as-direction${service === card.service ? ' as-direction--selected' : ''}`}>
          <input type="radio" name="service" value={card.service} checked={service === card.service} onChange={() => setParams({ service: card.service }, { replace: true })} />
          <span className="as-direction-name">{card.name}</span><strong>{card.title}</strong><span className="as-direction-description">{card.description}</span>
          {service === card.service && <span className="as-selected" aria-hidden="true">✓ Selected</span>}
        </label>)}</div>
      </fieldset>
      <fieldset className="as-form-section" disabled={pending}><legend><span>02</span> Introduce yourself</legend><ContactFields value={state.contact} onChange={state.setContact} errors={errors} disabled={pending} /></fieldset>
      <fieldset className="as-form-section" disabled={pending}><legend><span>03</span> {definitions[service].heading}</legend>
        {service === 'makeform' && <ServiceFields definition={definitions.makeform} draft={state.drafts.makeform} {...fieldProps} />}
        {service === 'upshift' && <ServiceFields definition={definitions.upshift} draft={state.drafts.upshift} {...fieldProps} />}
        {service === 'linkup' && <ServiceFields definition={definitions.linkup} draft={state.drafts.linkup} {...fieldProps} />}
        {service === 'reign' && <ServiceFields definition={definitions.reign} draft={state.drafts.reign} {...fieldProps} />}
      </fieldset>
      <fieldset className="as-form-section" disabled={pending}><legend><span>04</span> Review & submit</legend><ConsentField checked={state.consent} onChange={state.setConsent} error={errors.consent} disabled={pending} />
        <p className="as-demo-label">Demo mode: this form shows the submission flow. It does not save a request or send email.</p>
        <button className="as-button" type="submit" disabled={pending}>{pending ? 'Submitting demo…' : 'Submit my request ↗'}</button>
        {pending && <p role="status" className="as-muted">Preparing your demo receipt…</p>}
      </fieldset>
    </form>
    <aside className="as-panel as-next"><h2>What happens next?</h2><ol><li>Receive your reference number</li><li>Officers assess fit and feasibility</li><li>We clarify scope and next steps</li></ol><p>For live requests, submission does not guarantee acceptance. Availability depends on skills, resources, capacity, and leadership approval.</p></aside>
  </div></div>;
}

export function SuccessPage() {
  const state = useRequestState();
  const navigate = useNavigate();
  if (!state.receipt) return <Navigate to="/astrascend/request" replace />;
  return <SubmissionReceiptView receipt={state.receipt} onStartAnother={() => { state.reset(); navigate('/astrascend/request'); }} />;
}

export function LegacyServiceRedirect() {
  const { serviceId } = useParams();
  const code = serviceId?.toLowerCase() === 'ascent' ? 'reign' : serviceId?.toLowerCase();
  return <Navigate replace to={isService(code) ? `/astrascend/request?service=${code}` : '/astrascend'} />;
}
