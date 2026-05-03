# Tasks: Fix File Download Issue

**Input**: Design documents from `/specs/003-fix-file-download/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Verify backend environment variables for CORS and API_URL in `hf_deploy/.env` (if exists) or HF Space settings.
- [X] T002 [P] Check for any conflicting middleware in `hf_deploy/app/main.py`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T003 Ensure `FileResponse` is correctly imported in `hf_deploy/app/routers/tools.py`.
- [X] T004 Implement robust `Content-Disposition` header encoding for Arabic filenames in `hf_deploy/app/routers/tools.py`.
- [X] T005 Add logging to `download_result` to track file paths and existence in `hf_deploy/app/routers/tools.py`.

---

## Phase 3: User Story 1 - Secure Download of Converted Result (Priority: P1) 🎯 MVP

**Goal**: Deliver a working download button for all converted files.

**Independent Test**: Upload a PDF, wait for "Completed", click download, and verify the file is saved locally.

### Implementation for User Story 1

- [X] T006 [US1] Update `handleDownload` in `packages/frontend/src/components/FileUploader.tsx` to handle cross-origin blob correctly.
- [X] T007 [US1] Implement fallback filename logic in `packages/frontend/src/components/FileUploader.tsx` if headers are masked by CORS.
- [X] T008 [US1] Add console logging during download attempt in `packages/frontend/src/components/FileUploader.tsx` for debugging.
- [X] T009 [US1] Ensure the download button UI correctly reflects the `isDownloading` state to prevent multiple clicks.

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Resilient Cross-Origin File Delivery (Priority: P2)

**Goal**: Ensure the system works across different domains (Vercel vs HF) and handles edge cases.

**Independent Test**: Verify download works from the production Vercel URL.

### Implementation for User Story 2

- [X] T010 [US2] Update `app/main.py` (Backend) to explicitly expose `Content-Disposition` header via CORS `expose_headers`.
- [ ] T011 [US2] Add unit test or manual script to verify the download endpoint returns correct headers for Arabic filenames.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T012 [P] Cleanup temporary logs added during debugging in `hf_deploy/app/routers/tools.py` and `packages/frontend/src/components/FileUploader.tsx`.
- [ ] T013 Verify that "Process Another File" button works correctly after a successful download.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Story 1 (Phase 3)**: Depends on Foundational completion.
- **User Story 2 (Phase 4)**: Depends on US1 completion.
- **Polish (Final Phase)**: After all stories are complete.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently.

### Incremental Delivery

1. Foundation ready.
2. Add User Story 1 (Fixes the reported bug).
3. Add User Story 2 (Hardens the fix for production/CORS).
