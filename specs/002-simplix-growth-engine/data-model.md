# Data Model: Simplix Growth Engine

**Branch**: `002-simplix-growth-engine` | **Status**: Complete

## 1. Local Tool Configurations (SEO JSON)

**Format**: `packages/frontend/src/config/tools/[slug].json`

Each JSON file defines the static SEO context for a dedicated landing page.

| Field | Type | Description |
|-------|------|-------------|
| `slug` | `string` | The URL part (e.g., "pdf-to-word") |
| `title` | `string` | SEO Title (60 chars) |
| `description` | `string` | SEO Description (160 chars) |
| `h1` | `string` | Exact match Arabic keyword heading |
| `subheading` | `string` | Value proposition text |
| `faqs` | `Array<FAQItem>` | List of Question/Answer pairs |
| `related` | `Array<string>` | List of 3 related tool slugs |
| `toolType` | `ToolType` | Shared enum link for UI functionality |

## 2. Usage Tracking Model (Redis Keys)

**Key Strategy**: `usage:{visitor_id}:{yyyymmdd}` (TTL 24h) and `ip_map:{ip_hash}:{yyyymmdd}`.

| Field | Type | Description |
|-------|------|-------------|
| `visitor_id` | `uuid` | Secure cookie-based UUID |
| `ip_hash` | `string` | SHA-256 hash of visitor IP |
| `count` | `number` | Operations performed (max 10) |
| `is_limit_reached` | `boolean` | Computed derived state |

## 3. Roadmap Feature Items (Kanban UI)

**Format**: `packages/frontend/src/config/roadmap.json` (or SQL)

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Feature ID |
| `title` | `string` | Name of the feature |
| `description` | `string` | Short explanatory text |
| `status` | `string` | `backlog`, `planned`, `processing`, `done` |
| `priority` | `number` | 1 (high), 2 (medium), 3 (low) |
| `category` | `string` | `Core`, `UI`, `Infra`, `Account` |
