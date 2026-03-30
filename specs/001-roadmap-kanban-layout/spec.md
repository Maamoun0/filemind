# Feature Specification: Kanban Roadmap Layout

**Feature Branch**: `001-roadmap-kanban-layout`  
**Created**: 2026-03-30  
**Status**: Draft  
**Input**: User description: "replace the flat feedback list on the /roadmap with a kanban layout that groups the items by status columns"

## Clarifications

### Session 2026-03-30

- Q: Should columns (statuses) be fixed or dynamic? → A: Dynamic (Option B) - Admin can manage columns via database/interface.
- Q: Visibility control for items? → A: Public/Private flag (Option B) - Items can be hidden from the public roadmap page.
- Q: Roadmap consumption of user limits? → A: Unlimited (Option B) - Viewing the /roadmap does NOT count towards the 10 operations/day limit.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualizing Project Progress (Priority: P1)

As a visitor to the Simplix site, I want to see feature requests and feedback items organized into "Status" columns (e.g., Planned, In Progress, Released) rather than a long list, so I can immediately understand what is currently being worked on and what is coming next.

**Why this priority**: Essential for the core value proposition of a roadmap (clarity of progress). This is the primary reason for the change.

**Independent Test**: Can be tested by visiting the /roadmap page and verifying that items are grouped into distinct vertical columns based on their implementation status.

**Acceptance Scenarios**:

1. **Given** there are 10 feedback items with various statuses, **When** I navigate to /roadmap, **Then** I should see 3-4 distinct columns (e.g., "Planned", "In Progress", "Released") containing the respective items.
2. **Given** I am on the /roadmap page, **When** i look at an item in the "In Progress" column, **Then** its visual card should contain the title and description clearly.

---

### User Story 2 - Basic Filtering and Sorting (Priority: P2)

As a user interested in specific types of improvements (e.g., "Performance", "UI"), I want to see the Kanban board sorted by priority within each column, so the most important items remain at the top.

**Why this priority**: Improves usability for high-traffic or high-item boards.

**Independent Test**: Can be tested by verifying that items with higher priority values appear above lower priority items in the same column.

**Acceptance Scenarios**:

1. **Given** multiple items in the "Planned" column, **When** the page loads, **Then** "P1" items must appear above "P2" and "P3" items.

---

### User Story 3 - Mobile-Friendly View (Priority: P3)

As a mobile user, I want the Kanban board to collapse or adapt into a scrollable stack, so I can still read the roadmap without horizontal overflow issues.

**Why this priority**: Mobile accessibility is a standard requirement for web tools.

**Independent Test**: Can be tested by resizing the browser window or using mobile emulation and verifying that columns stack vertically or become horizontal-scrollable without breaking the layout.

**Acceptance Scenarios**:

1. **Given** a screen width under 600px, **When** accessing /roadmap, **Then** columns should stack vertically or the user should be able to swipe between columns.

---

### Edge Cases

- **What happens when a column is empty?**: The system must display a subtle "No items yet" message or keep the column header visible to maintain layout consistency.
- **How does system handle item overflow?**: If a column has too many items, the board should allow vertical scrolling within the column or implement a lazy-loading "See More" button.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render a responsive Kanban board on the `/roadmap` route.
- **FR-002**: Items MUST be grouped by their `Status` attribute into separate vertical columns.
- **FR-003**: System MUST display columns dynamically based on the configuration defined in the database (Status Column entity).
- **FR-004**: Each item card MUST display: Title, Short Description, and Category Tag (if available).
- **FR-005**: Items MUST be sorted by `Priority` (Descending: P1 > P2 > P3) within each column.
- **FR-006**: System MUST persist the Kanban layout as the definitive view for the roadmap, replacing the old flat list.
- **FR-007**: System MUST handle cases where items are missing a status by placing them in a 'Backlog' or 'Unassigned' column by default to ensure no task is hidden from view.
- **FR-008**: Admin users MUST be able to manage (Create, Rename, Reorder) Status Columns through an administrative interface.
- **FR-009**: System MUST only display items marked as `Public` on the public `/roadmap` route.

### Key Entities *(include if feature involves data)*

- **Roadmap Item**: Represents a single piece of feedback or feature request.
    - Attributes: ID, Title, Description, Status (ID), Priority (1-3), IsPublic (Boolean), CreatedAt.
- **Status Column**: Defines the categories for the Kanban wall and drives the layout order.
    - Attributes: ID, Label (e.g., "Planned"), DisplayOrder, IsDefault (for new items).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can distinguish between "In Progress" and "Planned" items in under 3 seconds by looking at the page layout.
- **SC-002**: /roadmap page initial load time remains under 1.5 seconds for datasets up to 100 items.
- **SC-003**: 100% of existing "flat list" feedback items are successfully migrated and displayed in the new Kanban columns without data loss.

## Assumptions

- **Target Users**: Simplix users and stakeholders following the project progression.
- **Scope boundaries**: Drag-and-drop reordering is out of scope for the initial read-only roadmap for visitors.
- **Infrastructure**: The roadmap data is stored in the same database (SQLite/Redis) as the job usage metrics.
- **Migration**: Existing feedback items have a `status` field or can be mapped to one during migration.
- **Usage Limits**: Viewing the /roadmap does NOT consume the user's daily operation limit (10 ops/day).
