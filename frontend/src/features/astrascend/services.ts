import { makeform } from './forms/makeform';
import { upshift } from './forms/upshift';
import { linkup } from './forms/linkup';
import { reign } from './forms/reign';

export const definitions = { makeform, upshift, linkup, reign };
export const serviceCards = [
  { service: 'makeform', name: 'MAKEFORM', title: 'Build & Innovate', description: 'Technology and digital solutions', action: 'Request a build', benefits: ['Technical consultation and project scoping', 'Websites and mobile apps', 'UI/UX design, wireframes, and prototypes', 'AI, machine learning, and cloud support'] },
  { service: 'upshift', name: 'UPSHIFT', title: 'Learn & Launch', description: 'Learning and professional development', action: 'Ask for guidance', benefits: ['Peer technical guidance', 'Career talks, mentorship, and networking', 'Startup and innovation insights'] },
  { service: 'linkup', name: 'LINKUP', title: 'Connect & Collaborate', description: 'Partnerships and collaborative projects', action: 'Propose a partnership', benefits: ['Campus and student organization collaborations', 'Community and industry partnerships', 'Resource sharing when mutually agreed'] },
  { service: 'reign', name: 'REIGN', title: 'Explore & Excel', description: 'Competitions and member opportunities', action: 'Explore opportunities', benefits: ['Competitions and hackathons', 'Career opportunities and external programs', 'Team formation and project discussion'] },
] as const;
