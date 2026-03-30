# Data Model: Kanban Roadmap Layout

**Feature Branch**: `001-roadmap-kanban-layout`  
**Created**: 2026-03-30  
**Status**: Draft  
**Spec**: [spec.md](./spec.md)

## Entities

### `StatusColumn`
Defines columns on the Kanban wall, driving the layout order and categorization.

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Unique identifier. |
| `label` | String | Display name (e.g., "Planned", "In Progress"). |
| `display_order` | Integer | Sorting order for columns. |
| `is_default` | Boolean | True if new items with no status should go here. |

### `RoadmapItem`
Represents a single piece of feedback or feature request.

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Unique identifier. |
| `title` | String | Title of the feature. |
| `description` | Text | Short description. |
| `status_id` | UUID | Reference to `StatusColumn.id` (Optional). |
| `priority` | Integer | (1-3) P1 is highest. |
| `is_public` | Boolean | Visibility on the public roadmap page. |
| `category` | String | Optional (e.g., "UI", "Performance"). |
| `created_at` | DateTime | Timestamp of creation. |

## Relationships
- **One-to-Many**: One `StatusColumn` can have multiple `RoadmapItem`s.
- **Nullability**: `status_id` can be null (handled by logic in FR-007).

## Transitions
- Moving an item from one column to another updates the `status_id`.
- Deleting a column requires updating its items to have a null status or moving them to a default column.
