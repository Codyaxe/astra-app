import { Link } from 'react-router-dom';
import mascot from './assets/mascot.png';
import lightWave from './assets/wave-light.svg';
import darkWave from './assets/wave-dark.svg';
import { serviceCards } from './services';

const steps = [
  ['Browse and submit', 'Read the guidelines and send the form for your service.'],
  ['Review', 'Officers check requirements, feasibility, and capacity.'],
  ['Approve and assign', 'An authorized lead approves and assigns a team.'],
  ['Build or deliver', 'The team works while a Project Lead tracks progress.'],
  ['Check and hand over', 'We review the output and deliver it to you.'],
  ['Feedback and closure', 'We collect feedback and close the request.'],
];
const questions = [
  ['Who can submit a request?', 'Students, campus organizations, colleges, community groups, and suitable external or industry partners can propose a request or collaboration. Learning support is intended mainly for ASTRA members; non-members may be referred.'],
  ['Is every request accepted?', 'Submission does not guarantee acceptance. Officers assess technical readiness, member availability, resources, and leadership approval. Scope and next steps are clarified before work begins. No fixed response time is promised.'],
  ['Are the services free?', 'Any costs for hosting, tools, materials, or external services are discussed and agreed before work begins. Available resources and the project scope determine what support can be offered.'],
  ['Does a delivered website include ongoing support?', 'Ongoing hosting, maintenance, and future changes are separate arrangements. The team will clarify handover responsibilities and any support agreement with you.'],
];

export function LandingPage() {
  return <div className="as-landing">
    <section className="as-hero">
      <img className="as-hero-wave as-wave-light" src={lightWave} alt="" />
      <img className="as-hero-wave as-wave-dark" src={darkWave} alt="" />
      <div className="as-container as-hero-inner">
        <div className="as-hero-copy">
          <span className="as-badge">AN ASTRA DEVELOPERS INITIATIVE · AY 2026–2027 · LAUNCHING NOV 3</span>
          <h1>Great ideas.<br />New heights.<br />Let’s ascend.</h1>
          <p>A campus full of possibilities. A community ready to build. Bring your ideas to ASTRA Developers and turn possibility into meaningful impact.</p>
          <div className="as-actions"><Link className="as-button" to="/astrascend/request">Let’s build something ↗</Link><Link className="as-button as-button--white" to="#services">Explore our services ↓</Link></div>
        </div>
        <div className="as-mascot"><img src={mascot} alt="ASTRA's blue astronaut mascot reaching for new heights" fetchPriority="high" /></div>
      </div>
    </section>
    <div className="as-audience"><div className="as-container"><strong>OPEN TO IDEAS FROM</strong><span>Students</span><span>Campus organizations</span><span>Community groups</span><span>Industry partners</span></div></div>
    <section className="as-section" id="services" aria-labelledby="as-services-heading"><div className="as-container">
      <div className="as-section-intro"><h2 id="as-services-heading">What we can do for you</h2><p>Four services, one request form. Pick the one closest to your need and we’ll route it to the right team.</p></div>
      <div className="as-services-grid">{serviceCards.map(card => <article className="as-service-card" key={card.service}>
        <div><h3>{card.name}</h3><p className="as-service-title">{card.title}</p><p className="as-muted">{card.description}</p></div>
        <ul>{card.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul>
        <Link className="as-button" to={`/astrascend/request?service=${card.service}`}>{card.action}</Link>
      </article>)}</div>
      <p className="as-fine-print">A request starts a conversation, not a guaranteed commitment. Services depend on technical readiness, member availability, resources, and leadership approval.</p>
    </div></section>
    <section className="as-section as-section--tinted" id="how-it-works" aria-labelledby="as-process-heading"><div className="as-container">
      <div className="as-section-intro"><h2 id="as-process-heading">From request to result</h2><p>Every request follows the same six steps. No fixed response time is promised, and not every request is accepted.</p></div>
      <ol className="as-steps">{steps.map(([title, description], index) => <li key={title}><span aria-hidden="true">{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}</ol>
    </div></section>
    <section className="as-section" id="community" aria-labelledby="as-community-heading"><div className="as-container">
      <h2 id="as-community-heading">Stay close to ASTRA</h2>
      <div className="as-community-grid">
        <article className="as-community-card as-community-card--blue"><h3>ASTRA Developers Discord</h3><p>Ask technical questions, find learning resources, and hear announcements. Verified ASTRA members also get the Technology Support Hub.</p><div className="as-community-status"><span className="as-button as-button--white" aria-disabled="true">Invite link coming soon</span><small>The community invite is not available yet.</small></div></article>
        <article className="as-community-card"><h3>ASTRA Developers App</h3><p>Your digital member ID, partner perks, and rewards in one place. Coming soon, starting with membership and benefits.</p><span className="as-community-status">Coming soon</span></article>
      </div>
    </div></section>
    <section className="as-section as-section--tinted" aria-labelledby="as-partners-heading"><div className="as-container"><h2 id="as-partners-heading">Our partners</h2><div className="as-partners" aria-label="Partner placeholders">{[1, 2, 3, 4, 5].map(number => <div key={number}>Partner {number}</div>)}</div></div></section>
    <section className="as-section as-faq" aria-labelledby="as-faq-heading"><div className="as-container"><h2 id="as-faq-heading">Before you send a request</h2><div className="as-faq-list">{questions.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></div></section>
    <section className="as-final-cta"><div className="as-container"><h2>Have an idea? Start with one conversation.</h2><Link className="as-button as-button--white" to="/astrascend/request">Share your idea ↗</Link></div></section>
  </div>;
}
