# ASTRAscend frontend and backend handoff

ASTRAscend has a public landing page, four service forms, and a submission receipt. The pages are in [pages/](pages/), reusable components are in [components/](components/), form controls and service definitions are in [forms/](forms/), request submission code is in [submission/](submission/), and the animated star background is in [background/](background/). The frontend collects answers and passes one object to `submitServiceRequest(request)` in [requestIntegration.ts](submission/requestIntegration.ts).

**Current status: demo submissions only.** The function returns a demo receipt without making submission network calls, saving requests, or sending email. The broader ASTRA member app and its backend scaffolding remain separate.

## How submission works

1. The selected service validates its visible fields and builds a `ServiceRequest` object.
2. The form calls the dedicated integration function below.
3. The function returns a `SubmissionReceipt`, or throws a `SubmissionError` that the form can display.

```ts
submitServiceRequest(request: ServiceRequest): Promise<SubmissionReceipt>
```

To connect real submissions, the backend developer implements an endpoint that validates and saves the request. Replace the internals of `submitServiceRequest` with a call to that endpoint. Keep the form-facing input, receipt, and error contracts stable; map transport details, authentication headers, backend field names, and responses inside this module. The existing shared API client can be used once the endpoint is agreed.

The endpoint URL, database tables, access policy, and email service are still backend decisions. Before enabling live submissions, also update the request page's hard-coded demo notice and loading messages. The receipt component already supports both demo and live receipts.

## What every form passes

Each request has four top-level properties. Only `details` changes between services.

| Property    | JSON / TypeScript type                      | Meaning                                                                                                                |
| ----------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `service`   | String / `Service` union                    | One of `makeform`, `upshift`, `linkup`, or `reign`; identifies which details to validate.                              |
| `requester` | Object / `Requester`                        | The contact person's name, email, affiliation, and requester type.                                                     |
| `consent`   | Boolean / literal `true`                    | The requester agreed to assessment, coordination, and contact. It must be the Boolean `true`, not the string `"true"`. |
| `details`   | Object / matching service details interface | Only the active service's applicable answers.                                                                          |

The exact TypeScript interfaces and dropdown codes are in [types.ts](forms/types.ts). Required-field and visibility rules are in [formModel.ts](forms/formModel.ts) and the [service definitions](forms/serviceFields/).

- All answer values are strings, except the Boolean `consent`. Even participant descriptions and budgets are text in the current form.
- Strings are trimmed. Blank optional fields are omitted; they are not sent as empty strings or `null`.
- Answers from other service drafts and hidden REIGN fields are excluded from the submitted object. Drafts remain in memory when categories change.
- Flexible timelines remain text. `registrationDeadline` is a real calendar date in `YYYY-MM-DD` format, without a time zone.
- Document fields contain text or links, not file uploads. Dedicated URL fields accept complete `http://` or `https://` links.
- Requester information is not persisted in local storage. Only the theme choice may be stored there.

## Suggested storage types and reasons

These are **suggestions for the backend owner**, not an implemented database schema. The repository's Data Connect scaffold targets PostgreSQL. The tables below suggest SQL types if each logical field is stored in a column; the owner can choose related tables or another supported structure while keeping the frontend JSON unchanged.

`TEXT` preserves variable-length answers. For dropdowns, use `TEXT` with server-side allowed-value validation and, where practical, a database constraint. This keeps stable codes without storing display labels. Required fields should reject missing/blank values; optional columns may use SQL `NULL` when their JSON property is absent.

Data Connect schema files use GraphQL notation such as `String`, `Boolean`, and `Timestamp`. Map these storage suggestions through the chosen connector's supported types rather than copying SQL type names into GraphQL.

Type references: [PostgreSQL character types](https://www.postgresql.org/docs/current/datatype-character.html), [date/time types](https://www.postgresql.org/docs/current/datatype-datetime.html), and [Boolean type](https://www.postgresql.org/docs/current/datatype-boolean.html).

### Shared fields

| Field path               | Required | Sent as        | Suggested storage          | Why                                                                                                        |
| ------------------------ | -------- | -------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `service`                | Yes      | String code    | `TEXT` with allowed values | Routes the request to the correct service.                                                                 |
| `requester.fullName`     | Yes      | String         | `TEXT`                     | Supports full names without assuming a fixed length or name format.                                        |
| `requester.email`        | Yes      | String         | `TEXT`                     | Stores the contact address; validate its format separately. It does not need to be unique across requests. |
| `requester.organization` | No       | String         | Nullable `TEXT`            | Affiliation is free text and may be absent.                                                                |
| `requester.type`         | Yes      | String code    | `TEXT` with allowed values | Distinguishes students, members, organizations, and other requesters.                                      |
| `consent`                | Yes      | Boolean `true` | `BOOLEAN`                  | Represents an explicit yes/no value; accepted submissions require `true`.                                  |

### MAKEFORM: project and technology support

All paths in this table are inside `details`.

| Field               | Required | Sent as     | Suggested storage          | Why                                                                                                 |
| ------------------- | -------- | ----------- | -------------------------- | --------------------------------------------------------------------------------------------------- |
| `serviceType`       | Yes      | String code | `TEXT` with allowed values | Identifies the requested technology service.                                                        |
| `title`             | Yes      | String      | `TEXT`                     | A readable project title.                                                                           |
| `supportNeeded`     | Yes      | String      | `TEXT`                     | A free-text description of the requested support.                                                   |
| `beneficiaries`     | Yes      | String      | `TEXT`                     | Describes people and expected impact, not a numeric count.                                          |
| `preferredTimeline` | No       | String      | Nullable `TEXT`            | May contain a date, range, or wording such as “flexible.”                                           |
| `resourcesBudget`   | No       | String      | Nullable `TEXT`            | May describe funds, equipment, existing content, or uncertainty; it is not a currency amount alone. |
| `materialsOrLinks`  | No       | String      | Nullable `TEXT`            | May contain notes and multiple links rather than one validated URL.                                 |

### UPSHIFT: learning support

| Field in `details`    | Required | Sent as     | Suggested storage                   | Why                                                                    |
| --------------------- | -------- | ----------- | ----------------------------------- | ---------------------------------------------------------------------- |
| `learningSupportType` | Yes      | String code | `TEXT` with allowed values          | Identifies the kind of learning support.                               |
| `topic`               | Yes      | String      | `TEXT`                              | A topic or skill description.                                          |
| `experienceLevel`     | No       | String code | Nullable `TEXT` with allowed values | Stores a selected experience category.                                 |
| `preferredFormat`     | No       | String code | Nullable `TEXT` with allowed values | Distinguishes online, in-person, and hybrid sessions.                  |
| `goal`                | Yes      | String      | `TEXT`                              | Describes the intended learning outcome.                               |
| `participants`        | No       | String      | Nullable `TEXT`                     | May be a group name or “a team of four students,” not just an integer. |
| `preferredSchedule`   | No       | String      | Nullable `TEXT`                     | Supports availability descriptions and flexible dates.                 |

### LINKUP: partnerships

| Field in `details`    | Required | Sent as     | Suggested storage          | Why                                                          |
| --------------------- | -------- | ----------- | -------------------------- | ------------------------------------------------------------ |
| `partnershipType`     | Yes      | String code | `TEXT` with allowed values | Identifies the proposed collaboration category.              |
| `organizationName`    | Yes      | String      | `TEXT`                     | Names the organization proposing the partnership.            |
| `organizationUrl`     | No       | URL string  | Nullable `TEXT`            | Stores a validated website or official-page link.            |
| `proposal`            | Yes      | String      | `TEXT`                     | Contains the collaboration description.                      |
| `contributions`       | Yes      | String      | `TEXT`                     | May describe funding, expertise, venues, or other resources. |
| `collaborationPeriod` | No       | String      | Nullable `TEXT`            | Allows a date range or a period still to be agreed.          |
| `proposalLink`        | No       | URL string  | Nullable `TEXT`            | Stores a document link rather than a file upload.            |

Keep `requester.organization` separate from `details.organizationName`: one describes the contact person's affiliation, and the other identifies the proposing organization.

### REIGN: opportunities and participation

| Field in `details`     | Required | Sent as             | Suggested storage                   | Why                                                                                    |
| ---------------------- | -------- | ------------------- | ----------------------------------- | -------------------------------------------------------------------------------------- |
| `intent`               | Yes      | String code         | `TEXT` with allowed values          | Identifies the main action and determines applicable fields.                           |
| `opportunityName`      | No       | String              | Nullable `TEXT`                     | A readable opportunity or competition name.                                            |
| `opportunityUrl`       | No       | URL string          | Nullable `TEXT`                     | Stores a validated official announcement link.                                         |
| `skills`               | No       | String              | Nullable `TEXT`                     | Describes skills or fields; the current form does not send a tag array.                |
| `eligibility`          | No       | String              | Nullable `TEXT`                     | Describes who can participate.                                                         |
| `assistanceNeeded`     | No       | String code         | Nullable `TEXT` with allowed values | Describes the specific help requested, separately from the main action.                |
| `registrationDeadline` | No       | `YYYY-MM-DD` string | Nullable `DATE`                     | Stores a calendar deadline without inventing a time or shifting it between time zones. |
| `teamStatus`           | No       | String code         | Nullable `TEXT` with allowed values | Describes the requester's current team situation.                                      |

Only `intent` is required within REIGN details. Other fields are optional **and** subject to these visibility rules:

| `intent`                | Applicable fields in `details`                                                  |
| ----------------------- | ------------------------------------------------------------------------------- |
| No choice yet           | Only the intent control is shown; submission fails until an action is selected. |
| `find_competition`      | `intent`, `skills`, `eligibility`, `assistanceNeeded`                           |
| `share_opportunity`     | All REIGN fields except `teamStatus`                                            |
| `find_teammates`        | All REIGN fields                                                                |
| `participation_support` | All REIGN fields                                                                |

### Allowed dropdown codes

Store these codes, such as `mobile_app`, rather than their display labels, such as “Mobile app.” TypeScript represents each choice field as a union of string literals; see [types.ts](types.ts).

| Field path                            | Allowed codes                                                                                                           |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `requester.type`                      | `student`, `astra_member`, `campus_organization`, `college`, `community_group`, `external_partner`, `other`             |
| MAKEFORM `details.serviceType`        | `website`, `mobile_app`, `ui_ux`, `ai_ml`, `cloud`, `other`                                                             |
| UPSHIFT `details.learningSupportType` | `technical_consultation`, `mentorship`, `workshop`, `career_talk`, `other`                                              |
| UPSHIFT `details.experienceLevel`     | `beginner`, `intermediate`, `advanced`, `not_sure`                                                                      |
| UPSHIFT `details.preferredFormat`     | `online`, `in_person`, `hybrid`                                                                                         |
| LINKUP `details.partnershipType`      | `event`, `sponsorship`, `technical_collaboration`, `organization_partnership`, `resource_sharing`, `app_perks`, `other` |
| REIGN `details.intent`                | `share_opportunity`, `find_competition`, `find_teammates`, `participation_support`                                      |
| REIGN `details.assistanceNeeded`      | `share`, `find_teammates`, `guidance`, `team_coordination`, `other`                                                     |
| REIGN `details.teamStatus`            | `individual`, `team_formed`, `need_teammates`, `not_applicable`                                                         |

## Copyable request examples

These are complete form-facing objects, not an agreed HTTP endpoint or database schema. All names, organizations, and example.com links are fictional. The four complete examples also exist in [requestExamples.ts](requestExamples.ts) as `requestExamples.makeform`, `.upshift`, `.linkup`, and `.reign`.

### MAKEFORM

```json
{
    "service": "makeform",
    "requester": {
        "fullName": "Alex Reyes",
        "email": "alex@example.com",
        "type": "campus_organization",
        "organization": "Campus Innovation Club"
    },
    "consent": true,
    "details": {
        "serviceType": "website",
        "title": "Website for our organization",
        "supportNeeded": "A website with information about our organization and upcoming activities.",
        "beneficiaries": "Students looking for campus activities and registration information.",
        "preferredTimeline": "November 2026; flexible",
        "resourcesBudget": "Logo and content available; hosting costs to discuss.",
        "materialsOrLinks": "https://example.com/project-brief"
    }
}
```

### UPSHIFT

```json
{
    "service": "upshift",
    "requester": {
        "fullName": "Bea Santos",
        "email": "bea@example.com",
        "type": "astra_member",
        "organization": "ASTRA Developers"
    },
    "consent": true,
    "details": {
        "learningSupportType": "mentorship",
        "topic": "React and API integration",
        "experienceLevel": "beginner",
        "preferredFormat": "online",
        "goal": "Learn to structure our first React project and handle API responses.",
        "participants": "A team of four students",
        "preferredSchedule": "A weekend in November"
    }
}
```

### LINKUP

```json
{
    "service": "linkup",
    "requester": {
        "fullName": "Carlo Lim",
        "email": "carlo@example.com",
        "type": "external_partner",
        "organization": "Community Learning Network"
    },
    "consent": true,
    "details": {
        "partnershipType": "event",
        "organizationName": "Community Learning Network",
        "organizationUrl": "https://example.com/community",
        "proposal": "A joint introductory web development workshop for student organizations.",
        "contributions": "Venue, publicity, registration support and volunteers.",
        "collaborationPeriod": "December 2026; date to agree",
        "proposalLink": "https://example.com/workshop-proposal"
    }
}
```

### REIGN: find teammates

This example omits optional `requester.organization`.

```json
{
    "service": "reign",
    "requester": {
        "fullName": "Dani Cruz",
        "email": "dani@example.com",
        "type": "astra_member"
    },
    "consent": true,
    "details": {
        "intent": "find_teammates",
        "opportunityName": "Campus Innovation Challenge",
        "opportunityUrl": "https://example.com/challenge",
        "skills": "Frontend development and UI design",
        "eligibility": "Students",
        "assistanceNeeded": "find_teammates",
        "registrationDeadline": "2027-01-10",
        "teamStatus": "need_teammates"
    }
}
```

### Other REIGN actions

Keep `service`, `requester`, and `consent` from the REIGN example above. Replace only its `details` object with one of the following.

Find a competition: opportunity details, deadline, and team status are not applicable and are excluded.

```json
{
    "intent": "find_competition",
    "skills": "Web development",
    "eligibility": "Undergraduate students",
    "assistanceNeeded": "guidance"
}
```

Share an opportunity: team status is excluded.

```json
{
    "intent": "share_opportunity",
    "opportunityName": "Student Innovation Challenge",
    "opportunityUrl": "https://example.com/challenge",
    "skills": "Programming and design",
    "eligibility": "College students",
    "assistanceNeeded": "share",
    "registrationDeadline": "2027-01-10"
}
```

Request participation support: all REIGN fields are applicable.

```json
{
    "intent": "participation_support",
    "opportunityName": "Student Innovation Challenge",
    "opportunityUrl": "https://example.com/challenge",
    "skills": "Frontend development",
    "eligibility": "College students",
    "assistanceNeeded": "team_coordination",
    "registrationDeadline": "2027-01-10",
    "teamStatus": "team_formed"
}
```

## Expected result and error handling

The integration function returns the following `SubmissionReceipt` shape. This is the frontend contract; the backend's HTTP response may be mapped to it inside `requestIntegration.ts`.

### Current demo receipt

```json
{
    "mode": "demo",
    "referenceNumber": "DEMO-1234ABCD",
    "submittedAt": "2026-10-28T06:30:00.000Z",
    "confirmationEmailSent": false
}
```

### After a real successful save

```json
{
    "mode": "live",
    "referenceNumber": "ASC-000123",
    "submittedAt": "2026-10-28T06:30:00.000Z",
    "confirmationEmailSent": false
}
```

The live reference format above is illustrative; the backend chooses and generates the actual unique reference. The backend also supplies the authoritative submission time. Neither value is part of the form's input.

| Receipt field           | JSON / TypeScript type         | Suggested storage, if persisted                         | Why                                                                                                   |
| ----------------------- | ------------------------------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `mode`                  | String union: `demo` or `live` | Usually integration configuration, not a request column | Identifies whether a real save occurred. Return `live` only after success.                            |
| `referenceNumber`       | String                         | Unique, non-null `TEXT`                                 | References may contain letters, prefixes, and leading zeros.                                          |
| `submittedAt`           | ISO 8601 string                | Non-null `TIMESTAMPTZ`                                  | Records a precise instant; return a timestamp with an explicit UTC offset, such as `Z`.               |
| `confirmationEmailSent` | Boolean                        | `BOOLEAN`, if tracked                                   | Reports actual sending confirmation. Leave `false` if email is disabled, only queued, or unconfirmed. |

Demo receipts do not prove registration or email delivery. Do not save demo requests as live submissions.

### Validation and transport failures

Validate the JSON again on the backend: required values, allowed codes, email format, URLs, real calendar dates, consent, and service-specific visibility. Apply authentication/authorization according to the agreed public intake policy. Frontend TypeScript types and client validation do not validate incoming HTTP requests on the server.

Map failures to the existing `SubmissionError` inside the integration module. Field keys use JSON paths so the UI can identify the corresponding input:

```ts
throw new SubmissionError(
    'Please check the highlighted fields.',
    'validation',
    {
        'requester.email': 'Enter a valid email address.',
        'details.title': 'Enter a project title.',
    },
);
```

Use `details.title` only for MAKEFORM; map each error to an applicable field. `fieldErrors` is a `Record<string, string>`: each key is a field path and each value is its user-facing message.

```ts
throw new SubmissionError(
    'Your request could not be submitted. Please retry.',
    'network',
);
```

The supported error kinds are `validation`, `network`, and `unknown`. Unexpected failures are normalized to a generic retry message. These examples describe the UI-facing error contract, not an agreed HTTP error-response format.

## Tests

Feature tests are grouped in [`__tests__/`](__tests__/), with individual service tests in [`__tests__/forms/`](__tests__/forms/). The production components, integration module, and service definitions remain outside that directory.

Run the frontend suite from `frontend/`:

```sh
npm test
```

Run just the ASTRAscend tests:

```sh
npm test -- src/features/astrascend/__tests__
```

The shared member-app smoke test remains in `frontend/src/__tests__/smoke.test.tsx` and runs with the full suite.

## Styling

ASTRAscend uses the existing Tailwind 3 setup. Components own their layout, typography, responsive rules, interaction states, and artwork positioning through utility classes. `styles.ts` holds complete, reusable class strings for common controls and layout elements; avoid constructing fragments that Tailwind cannot discover.

The `ascend` color tokens and `font-astrascend` family are additive extensions in `tailwind.config.js`. `astrascend.css` contains only local Urbanist font declarations and scoped light/dark color variables. Keep the existing app's brand palette, default breakpoints, global theme, and Preflight unchanged.

- `as-dark:` applies beneath `.astrascend[data-theme="dark"]`; it does not use or change the global dark-mode strategy.
- `as-compact:` preserves the compact laptop layout at widths of 1024–1599px, and at wider widths when viewport height is 800px or less.
- `as-tiny:`, `as-label:`, and `as-wide:` preserve the existing 359px, 480–1023px, and 1200px layout boundaries without replacing Tailwind's standard breakpoints.
- `data-as-landing` identifies the canvas's containing page. `data-as-star-mask` measures individual visible text lines, including wrapped paragraphs and expanded FAQ answers. Use `data-as-star-mask="surface"` for cards, artwork, badges, and buttons; these masks follow the element's bounds and rounded corners. These behavior hooks must survive styling changes; do not replace them with utility-class queries.

`starMasks.ts` fades whole star sprites over a 12px approach to content, with a 2px text buffer. Empty container space remains visible. Mask measurements refresh on scrolling, resizing, FAQ expansion, and font loading; the renderer retains reduced-motion and off-screen cleanup behavior.

Keep the current sticky-header offsets, floating toggle's scroll/keyboard behavior, reduced-motion support, and compact sizing when changing styles. The submission contract and service definitions are independent of styling.

## Form controls

`SelectField` and `DatePicker` use the shared `useFieldPopover` positioning and dismissal behavior. Popovers fit above or below the field, stay within the viewport and below the sticky header, and scroll internally when neither side has enough room. Page scrolling, outside clicks/focus, and Escape close them; internal scrolling remains available. Optional dropdown values have a separate clear action. Placeholder prompts are never list options.

Dropdowns support arrow keys, Home/End, Enter, Escape, and typing to locate an option. The calendar supports arrow keys, Home/End, Page Up/Down (Shift changes years), manual YYYY-MM-DD entry, Today, and optional clearing. All selected values retain the existing payload identifiers and date-only format.

`fieldValidation.ts` shares email/date syntax checks between inline feedback and submission validation. Email feedback appears after blur and updates during correction. This checks address format only; it does not verify mailbox ownership or delivery and makes no network calls.
