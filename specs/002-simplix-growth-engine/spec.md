# Feature Specification: Simplix Growth Engine

**Feature Branch**: `002-simplix-growth-engine`  
**Created**: 2026-04-03  
**Status**: Draft  
**Input**: User description: "replace the flat feedback list on the /roadmap with a kanban layout... Simplix Growth Engine"

---

## Clarifications

### Session 2026-04-03
- Q: How should we identify "unauthenticated visitors" to enforce the 10-operation limit? → A: Mixed (IP + Cookie) tracking.
- Q: What should the "Share Result" button do? → A: Open a Modal with social share icons (WhatsApp, X, Facebook) and a copy-link option.
- Q: Where should the FAQ content for tool pages reside? → A: Tool-specific local JSON configuration files (for SEO precision).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Programmatic SEO Tool Pages (Priority: P1)

Users arriving from search engines will land on a dedicated, highly optimized Tool Page (e.g., `/pdf-to-word`) tailored specifically to their search query. The page will immediately present the tool, clear value propositions, how it works, and an FAQ section, driving immediate tool usage.

**Why this priority**: Without these landing pages, organic traffic acquisition is impossible. This is the foundation of the SEO-driven traffic machine.

**Independent Test**: Can be fully tested by visiting a new dedicated URL (like `/pdf-to-word`) and ensuring all required page components (H1, Subheading, Tool UI, How it Works, Benefits, FAQ, Internal Links) are present and correctly rendered.

**Acceptance Scenarios**:

1. **Given** a user searches for "تحويل PDF إلى Word", **When** they visit `/pdf-to-word`, **Then** they see an exact match H1, a drag & drop UI, step-by-step instructions, and an FAQ section.
2. **Given** a user is on a tool page, **When** they scroll to the bottom, **Then** they see internal links to 3 related tools (e.g., compress-pdf, merge-pdf).
3. **Given** a search engine bot crawls the page, **When** they read the meta tags, **Then** a 60-char title, 160-char description, and SoftwareApplication + FAQ schemas are present.

---

### User Story 2 - Zero Friction to Conversion Funnel (Priority: P1)

Users should be able to use the tool without signing up initially, but heavy users will eventually be prompted to sign up once they hit a usage limit, effectively acting as a "Trojan Horse" conversion system.

**Why this priority**: Driving traffic is useless without a system to convert visitors into loyal, registered users.

**Independent Test**: Can be tested by executing 10 operations passively without an account to verify the hard limit trigger and conversion message.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor, **When** they perform their first tool operation, **Then** the result is processed smoothly without requesting a login.
2. **Given** an unauthenticated visitor has completed 10 operations in a day, **When** they attempt the 11th operation, **Then** they are blocked and presented with a message: "لقد وصلت للحد اليومي — سجل للحصول على استخدام غير محدود".

---

### User Story 3 - Viral Loop System (Priority: P2)

Every file successfully processed by the platform will carry a viral mechanism natively baked in, both in the filename and post-processing UI, encouraging users to share and passively distribute the platform.

**Why this priority**: Amplifies the marketing effort automatically. Every user becomes a passive ambassador.

**Independent Test**: Can be tested by uploading a file, checking the resulting filename, and inspecting the UI post-download for the share button.

**Acceptance Scenarios**:

1. **Given** a user processes a file named "report.pdf", **When** the file is downloaded, **Then** the resulting filename is exactly `simplix_report.pdf`.
2. **Given** a user successfully completes a file operation, **When** the success screen appears, **Then** a prominent "شارك النتيجة" (Share Result) button is displayed.

---

### User Story 4 - Trust & Analytics System (Priority: P2)

Users must immediately feel secure using the platform to avoid drop-offs, while site owners must have tracking mechanisms to monitor conversion rates and most used tools.

**Why this priority**: Users won't upload sensitive PDFs if trust is low. Analytics is required to measure the success of the Growth Engine.

**Independent Test**: Can be verified by visual inspection of security badges/timers and verifying analytics tracking payloads in network activity.

**Acceptance Scenarios**:

1. **Given** a user is on the Tool UI, **When** they look at the design, **Then** they see a privacy message ("يتم حذف جميع الملفات تلقائياً بعد ساعة واحدة") and a file deletion timer.
2. **Given** users interact with various tools, **When** administrators check analytics, **Then** they can view active users, popular tools, session durations, and conversion funnel drop-offs.

### User Story 5 - Transparency via Kanban Roadmap (Priority: P3)

Users and stakeholders can visit `/roadmap` to see a modern, dynamic Kanban board showing the status of current, planned, and completed features instead of a flat list.

**Why this priority**: Enhances transparency and community trust in the platform's development pace.

**Independent Test**: Can be tested by visiting `/roadmap` and ensuring items are grouped into vertical columns (Backlog, Planned, In Progress, Done).

**Acceptance Scenarios**:

1. **Given** a user is on the roadmap page, **When** the data loads, **Then** a Kanban UI appears with 4 distinct columns.
2. **Given** a feature is in the "Done" state, **When** the page renders, **Then** it is visible only in the "Done" column.

---

### Edge Cases

- What happens when a user uses Incognito mode or clears cookies? (Does it reset their 10 limit usage count? Assume IP-level rate limiting or local storage strategy).
- How does the system handle rapid subsequent requests to prevent abuse of the "zero friction" tier?
- What happens if the generated filename `simplix_filename.pdf` exceeds OS character limits?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support dynamically templated dedicated URLs for every tool (e.g., `/pdf-to-word`, `/compress-pdf`).
- **FR-002**: System MUST inject dynamically generated SEO Meta Tags (Title, Description, Keywords) per tool page.
- **FR-003**: System MUST embed Schema.org structured data (SoftwareApplication and FAQ schemas) in the HTML head of tool pages.
- **FR-004**: System MUST rename all output files to prefix them with `simplix_`.
- **FR-005**: System MUST present a share button ("شارك النتيجة") upon job completion which opens a social sharing interface (Modal).
- **FR-006**: System MUST track usage count per unauthenticated visitor using a Mixed (IP + Cookie) tracking strategy and restrict operations to a maximum of 10 per day.
- **FR-007**: System MUST render a conversion prompt when the daily limit (10 operations) is reached.
- **FR-008**: System MUST display privacy guarantees and a visual deletion timer prominently on the conversion interface.
- **FR-009**: System MUST link to exactly 3 related tool pages at the bottom of each dedicated tool page.
- **FR-010**: System MUST track usage metrics, average session times, and conversion rates per tool.
- **FR-011**: System MUST replace the existing /roadmap flat list with a Kanban board component organized by status.

### Key Entities

- **ToolPageConfig**: Represents the SEO and structure mapping for a specific URL, sourced from local JSON files, including Title, H1, Description, FAQ List, and Related Tools.
- **UsageLimitTracker**: Tracks unauthorized user operation counts (likely via IP Hash / Local Storage) mapped to a timestamp.
- **AnalyticsEvent**: Represents a distinct user action (Upload, Conversion Limit Hit, Registration) used for metrics.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Achieve 1000 daily unique visitors across the platform's tool pages.
- **SC-002**: Increase the return user rate to 20%.
- **SC-003**: Maintain an operational failure rate of less than 3%.
- **SC-004**: System successfully restricts users over 10 daily usages with 100% reliability.
- **SC-005**: Load times for tool pages, including dynamic SEO elements, must remain strictly under 2.0 seconds.

## Assumptions

- We assume Mixed (IP + Cookie) tracking is sufficient to enforce the daily usage limits for unregistered users while minimizing false positives/negatives.
- We assume that the platform architecture (Next.js) natively supports dynamic meta tag and schema injection (SSG/SSR).
- We assume distribution strategies (Reddit, Quora, Product Hunt) mentioned in the input are manual marketing campaigns and not automated bot features built into the code.
