# ASTRAscend submission integration

The feature calls `submitServiceRequest(request)` in `requestIntegration.ts`. This is the only frontend submission boundary. It currently returns an asynchronous demo receipt without making network requests, writing to storage, or sending email.

## Backend handoff

Replace the internals of `submitServiceRequest` with the agreed API transport. Keep the exported request, receipt, and error contracts stable so form components do not need transport changes. The existing shared API client can be used here once an endpoint is agreed. This document does not add or assume a live endpoint.

- Authenticate and authorize on the backend as required by the agreed public intake policy.
- Validate and save the request on the backend; do not trust client validation alone.
- Map backend field names, receipt data, and errors in this integration module.
- Return `mode: 'live'` only for an actual successful save, with the backend's reference number and timestamp.
- Set `confirmationEmailSent` to `true` only when supported by the backend's actual response.
- Throw `SubmissionError` for failures; `fieldErrors` uses paths such as `requester.email` and `details.title`.

`ServiceRequest` is a discriminated union: `service`, `requester`, `consent`, and the matching `details`. Optional blank fields are omitted. Flexible timelines remain text. Registration deadlines are date-only `YYYY-MM-DD` strings. Links to documents are links, not file uploads.

## Complete examples

The four complete, typed examples in `requestExamples.ts` can be imported as `requestExamples.makeform`, `.upshift`, `.linkup`, and `.reign`. All names, organizations, and example.com links are fictional.

| Service | Required details | Optional details |
| --- | --- | --- |
| MAKEFORM | `serviceType`, `title`, `supportNeeded`, `beneficiaries` | `preferredTimeline`, `resourcesBudget`, `materialsOrLinks` |
| UPSHIFT | `learningSupportType`, `topic`, `goal` | `experienceLevel`, `preferredFormat`, `participants`, `preferredSchedule` |
| LINKUP | `partnershipType`, `organizationName`, `proposal`, `contributions` | `organizationUrl`, `collaborationPeriod`, `proposalLink` |
| REIGN | `intent` | `opportunityName`, `opportunityUrl`, `skills`, `eligibility`, `assistanceNeeded`, `registrationDeadline`, `teamStatus` |

Every submission requires requester name, email, type, and `consent: true`. Contact organization is optional and separate from LINKUP's proposing organization. Stable service codes are `makeform`, `upshift`, `linkup`, and `reign`.

REIGN's competition-search payload contains only intent, skills, eligibility, and assistance. Sharing excludes team status. Team matching and participation support permit all REIGN fields. Hidden draft answers are retained in memory but excluded from the submitted payload.

No request personal information is persisted in local storage. Only the ASTRAscend appearance preference may be stored there. Demo receipts are explicitly labeled and are not proof of registration or email delivery.

## Styling

ASTRAscend uses the existing Tailwind 3 setup. Components own their layout, typography, responsive rules, interaction states, and artwork positioning through utility classes. `styles.ts` holds complete, reusable class strings for common controls and layout elements; avoid constructing fragments that Tailwind cannot discover.

The `ascend` color tokens and `font-astrascend` family are additive extensions in `tailwind.config.js`. `astrascend.css` contains only local Urbanist font declarations and scoped light/dark color variables. Keep the existing app's brand palette, default breakpoints, global theme, and Preflight unchanged.

- `as-dark:` applies beneath `.astrascend[data-theme="dark"]`; it does not use or change the global dark-mode strategy.
- `as-compact:` preserves the compact laptop layout at widths of 1024–1599px, and at wider widths when viewport height is 800px or less.
- `as-tiny:`, `as-label:`, and `as-wide:` preserve the existing 359px, 480–1023px, and 1200px layout boundaries without replacing Tailwind's standard breakpoints.
- `data-as-landing` identifies the canvas's containing page. `data-as-star-mask` marks the precise text/card areas that stars must avoid. These behavior hooks must survive styling changes; do not replace them with utility-class queries.

Keep the current sticky-header offsets, floating toggle's scroll/keyboard behavior, reduced-motion support, and compact sizing when changing styles. The submission contract and service definitions are independent of styling.
