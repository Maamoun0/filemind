# Implementation Plan: Kanban Roadmap Layout

**Feature Branch**: `001-roadmap-kanban-layout`  
**Created**: 2026-03-30  
**Status**: Draft  
**Spec**: [spec.md](./spec.md)

## Technical Context

### Tech Stack
- **Framework**: FastAPI (Backend) / [NEEDS CLARIFICATION: Frontend framework - Next.js or Vanilla?]
- **Storage**: SQLite (Daily usage and Roadmap data)
- **Deployment**: Railway (Backend), Vercel (Frontend)

### Architecture
- **API-First**: Frontend fetches roadmap data via JSON endpoints.
- **Dynamic Layout**: The board is rendered based on columns fetched from the database.
- **Admin Interface**: Simple authenticated endpoints for managing columns and items.

## Constitution Check

| Principle | Adherence | Rationale |
|-----------|-----------|-----------|
| Library-First | Partial | Roadmap features will be integrated into the existing core services. |
| Test-First | Mandatory | Unit tests for status transitions and filtering logic are required. |
| Simplicity | High | Using a single SQLite DB for both usage tracking and roadmap content. |

## Phase 1: Data Model & API Contracts

### Data Model (`data-model.md`)
- Define `RoadmapItem` and `StatusColumn` schemas.
- Implement migration for existing feedback items.

### API Contracts (`/contracts/`)
- `GET /api/roadmap`: Returns grouped items by column.
- `GET /api/admin/columns`: Manage status columns.
- `PATCH /api/admin/items/{id}`: Update status/visibility.

## Phase 2: Backend Implementation
- Create FastAPI routers for the new endpoints.
- Implement database logic for dynamic columns.
- Add basic authentication for administrative endpoints.

## Phase 3: Frontend Implementation
- Build the Kanban board component.
- Implement vertical columns and horizontal scrolling for desktop.
- Implement stacked/carousel view for mobile.

## Phase 4: Integration & Test
- End-to-end test of the "Option A" logic (items without status go to Backlog).
- Verify success criteria (load time < 1.5s).
