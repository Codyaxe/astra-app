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
