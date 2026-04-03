# Tasks: Simplix Growth Engine

**Input**: Design documents from `/specs/002-simplix-growth-engine/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Create tool configuration directory in `packages/frontend/src/config/tools/`
- [X] T002 [P] Create sample tool template in `packages/frontend/src/config/tools/template.json`
- [X] T003 Update shared `ToolType` enum in `packages/shared/src/types/index.ts` to support new growth slugs
- [X] T004 [P] Synchronize `ToolType` enum in `hf_deploy/app/models/schemas.py` for backend consistency

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure for SEO and Tracking

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Install `redis` and `ioredis` dependencies in backend and frontend respectively
- [X] T006 Setup Redis connection utility in `hf_deploy/app/core/redis.py`
- [X] T007 [P] Create `SEOHead` component in `packages/frontend/src/components/common/SEOHead.tsx` for dynamic meta injection
- [X] T008 [P] Implement `JsonLDSchema` component for FAQ and SoftwareApplication structured data in `packages/frontend/src/components/common/JsonLDSchema.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Programmatic SEO Tool Pages (Priority: P1) 🎯 MVP

**Goal**: Dedicated, optimized landing pages for all 50+ tools with dynamic metadata and FAQs.

**Independent Test**: Visit `/pdf-to-word` and verify correct H1, Metadata, and FAQ Schema tags in the DOM.

### Implementation for User Story 1

- [X] T009 [P] [US1] Create dynamic route file at `packages/frontend/src/app/[tool]/page.tsx`
- [X] T010 [US1] Implement `generateStaticParams` in `packages/frontend/src/app/[tool]/page.tsx` to read from `src/config/tools/*.json`
- [X] T011 [US1] Implement `generateMetadata` for dynamic SEO titles/descriptions in `packages/frontend/src/app/[tool]/page.tsx`
- [X] T012 [US1] Build the Tool Landing Page template (H1, How it Works, FAQ sections) in `packages/frontend/src/app/[tool]/page.tsx`
- [X] T013 [US1] Integrate `SEOHead` and `JsonLDSchema` into the landing page template
- [X] T014 [US1] Implement "Related Tools" logic to show 3 links per page from the JSON config

**Checkpoint**: User Story 1 functional - All tool landing pages are crawlable and SEO-compliant.

---

## Phase 4: User Story 2 - Zero Friction Usage Limits (Priority: P1)

**Goal**: Enforce a 10-operation daily limit for unauthenticated users using IP + Cookie tracking.

**Independent Test**: Perform 10 PDF conversions in Incognito; verify 11th operation triggers the "Limit Reached" prompt.

### Implementation for User Story 2

- [X] T015 [P] [US2] Implement `UsageService` with Mixed (IP + Cookie) logic in `hf_deploy/app/services/usage_service.py`
- [X] T016 [US2] Create usage status endpoint in `hf_deploy/app/routers/usage.py` (`GET /api/usage/status`)
- [X] T017 [US2] Implement usage increment logic in `hf_deploy/app/routers/tools.py` upon successful job completion
- [X] T018 [US2] Create `UsageProvider` context in `packages/frontend/src/providers/UsageProvider.tsx` to track limits globally
- [X] T019 [US2] Update `FileUploader.tsx` in `packages/frontend/src/components/` to check `isLimitReached` before allowing upload
- [X] T020 [US2] Build the "Limit Reached" conversion modal in `packages/frontend/src/components/modals/LimitReachedModal.tsx`

**Checkpoint**: User Story 2 functional - Platform is protected against abuse while encouraging registration.

---

## Phase 5: User Story 3 & 4 - Viral Loop & Trust System (Priority: P2)

**Goal**: Passive distribution via filenames and share UI; visual indicators for privacy trust.

**Independent Test**: Download a file and verify name starts with `simplix_`; Check post-processing UI for share button.

### Implementation for User Story 3 & 4

- [X] T021 [US3] Update file delivery logic in `hf_deploy/app/services/pdf_service.py` to prefix output filenames with `simplix_`
- [X] T022 [US3] Build the `ShareModal` component with social icons in `packages/frontend/src/components/share/ShareModal.tsx`
- [X] T023 [US3] Add "Share Result" button to the job completion screen in `packages/frontend/src/components/FileUploader.tsx`
- [X] T024 [P] [US4] Add Privacy guarantee message and Deletion Timer UI to the Tool Landing page template
- [X] T025 [P] [US4] Add Security Badges to the footer/sidebar of tool pages per design

---

## Phase 6: User Story 5 - Transparency via Kanban Roadmap (Priority: P3)

**Goal**: Replace the flat roadmap list with a modern 4-column Kanban board.

**Independent Test**: Visit `/roadmap` and verify items are correctly sorted into Backlog/Planned/In Progress/Done columns.

### Implementation for User Story 5

- [X] T026 [P] [US5] Create the roadmap data config in `packages/frontend/src/config/roadmap.json`
- [X] T027 [P] [US5] Implement `KanbanCard` component in `packages/frontend/src/components/roadmap/KanbanCard.tsx`
- [X] T028 [P] [US5] Implement `KanbanColumn` component in `packages/frontend/src/components/roadmap/KanbanColumn.tsx`
- [X] T029 [US5] Update `packages/frontend/src/app/roadmap/page.tsx` to render the 4-column layout using the new components

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T030 [P] Global CSS audit for HSL colors and glassmorphism consistency in `packages/frontend/src/app/globals.css`
- [X] T031 Performance audit: Verify < 2.0s LCP for the generated tool pages
- [X] T032 [P] Update `README.md` and `quickstart.md` with final production URLs and tracking details

---

## Dependencies & Execution Order

- **Phase 1 (Setup)** MUST be complete before Phase 2.
- **Phase 2 (Foundational)** MUST be complete before any User Story.
- **US1 (SEO)** and **US2 (Limits)** can proceed in parallel once Phase 2 is done.
- **US3/4 (Viral)** depends on US2 (conversion triggers).
- **US5 (Kanban)** can proceed in parallel at any time after Phase 1.

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Initial setup of JSON configs and Redis.
2. Build the dynamic landing page template for SEO traffic.
3. Implement the daily limit tracker to capture and convert traffic.
4. **VALIDATE**: Ensure a user can land on `/pdf-to-word`, use it, and see the 10-op limit work.
