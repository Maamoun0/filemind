# Tasks: Kanban Roadmap Layout

**Input**: Design documents from `/specs/001-roadmap-kanban-layout/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [data-model.md](./data-model.md)

**Tests**: Test-First (Mandatory per Constitution).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Create project structure for backend (FastAPI) and frontend (React/Vite)
- [X] T002 Initialize Python environment and install dependencies (FastAPI, SQLAlchemy, Pydantic, Alembic)
- [X] T003 [P] Initialize Frontend project and install UI dependencies (TailwindCSS, Framer Motion for animations)

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T004 [P] Configure SQLite database connection and Alembic migrations in `backend/app/db/`
- [X] T005 Define SQLAlchemy models for `StatusColumn` and `RoadmapItem` in `backend/app/models/roadmap.py`
- [X] T006 [P] Create Pydantic schemas for Roadmap entities in `backend/app/schemas/roadmap.py`
- [X] T007 Setup base API router and register roadmap submodule in `backend/app/main.py`

---

## Phase 3: User Story 1 - Visualizing Project Progress (Priority: P1) 🎯 MVP

**Goal**: Display roadmap items in dynamic columns (Planned, In Progress, Released).

**Independent Test**: Verify that visiting `/roadmap` shows vertical columns with items grouped by status.

### Tests for User Story 1
- [X] T008 [P] [US1] Unit test for roadmap grouping service in `backend/tests/test_roadmap_service.py`
- [X] T009 [P] [US1] Integration test for `GET /api/roadmap` in `backend/tests/api/test_roadmap.py`

### Implementation for User Story 1
- [X] T010 [US1] Implement service logic to fetch and group items by column in `backend/app/services/roadmap.py`
- [X] T011 [US1] Implement `GET /api/roadmap` endpoint and `GET /api/columns` endpoint
- [X] T012 [P] [US1] Create `RoadmapCard` React component in `frontend/src/components/roadmap/RoadmapCard.tsx`
- [X] T013 [P] [US1] Create `KanbanColumn` React component in `frontend/src/components/roadmap/KanbanColumn.tsx`
- [X] T014 [US1] Implement the Main Roadmap page layout in `frontend/src/pages/Roadmap.tsx`

---

## Phase 4: User Story 2 - Basic Filtering and Sorting (Priority: P2)

**Goal**: Ensure items are sorted by priority (P1 > P2 > P3) within each column.

**Independent Test**: Verify that a "P1" item appears above a "P2" item in the same column.

### Tests for User Story 2
- [X] T015 [P] [US2] Unit test for priority sorting logic in `backend/tests/test_roadmap_sorting.py`

### Implementation for User Story 2
- [X] T016 [US2] Update roadmap service to apply sorting by priority and creation date
- [X] T017 [US2] Update `RoadmapCard` component to show priority badges or visual indicators

---

## Phase 5: User Story 3 - Mobile-Friendly View (Priority: P3)

**Goal**: Adapt columns into a scrollable stack for mobile devices.

**Independent Test**: Resize screen to mobile width; columns should stack vertically without horizontal overflow.

### Implementation for User Story 3
- [X] T018 [US3] Add responsive Tailwind grid classes to the board container (1 column on mobile, 3+ on desktop)
- [X] T019 [US3] Implement horizontal snap-scroll for columns on mobile (Optional/Progressive enhancement)

---

## Phase 6: Admin & Visibility Controls

**Goal**: Support Public/Private flags and dynamic column management.

### Implementation
- [X] T020 [P] [Admin] Implement `PATCH /api/admin/items/{id}` for visibility and status updates
- [X] T021 [Admin] Implement `POST /api/admin/columns` for dynamic column creation
- [X] T022 [Admin] Update Public API to filter out `is_public=False` items per FR-009

---

## Phase N: Polish & Cross-Cutting Concerns

- [X] T023 [P] Add seed script for default columns and sample roadmap items in `backend/scripts/seed_roadmap.py`
- [X] T024 Add loading skeletons and error states for the Kanban board
- [X] T025 Final accessibility audit for the roadmap cards

---

## Dependencies & Execution Order

- **Phase 1 & 2**: Mandatory start.
- **Phase 3 (US1)**: Must be complete before priority sorting (US2) or mobile polishing (US3) can be validated.
- **Phase 6**: Can be done in parallel with User Stories if the database models are stable.

## Parallel Opportunities
- Frontend components (T012, T013) can be built in parallel with Backend logic (T010, T011) using mock data.
- Unit tests (T008, T015) can be written simultaneously.
