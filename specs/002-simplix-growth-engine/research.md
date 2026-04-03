# Research Document: Simplix Growth Engine

**Branch**: `002-simplix-growth-engine` | **Status**: Complete

## 1. Metadata & Programmatic SEO in Next.js 14+

### Decision: `generateStaticParams` with `generateMetadata`
**Rationale**: Using Next.js 14 App Router, dynamic routes like `/[tool]` can be statically pre-rendered for all 50+ tool configurations defined in our local JSON files. This ensures lightning-fast LCP (< 2s) and perfect crawling for search engines.
**Alternatives Considered**:
- Client-side data fetching: Rejected due to poor SEO and slow initial render.
- Separate pages for each tool: Rejected as unmaintainable duplication.

## 2. Visitor Identification (IP + Cookie Tracking)

### Decision: Redis-backed Hash with Secure Cookie
**Rationale**: 
1. **Cookie**: A signed `visitor_id` cookie for persistence across sessions.
2. **IP**: Store multiple `visitor_ids` associated with an IP hash in Redis with an 86400s (24h) TTL.
3. This "Mixed" strategy makes it significantly harder to reset limits by just clearing cookies, while avoiding blocking entire office/school networks by allowing multiple IDs per IP with separate counts.
**Alternatives Considered**:
- In-memory cache: Rejected because Railway restarts (already observed) wipe usage counts.

## 3. Web Share API & Social Modals

### Decision: Native Web Share API with React Fallback
**Rationale**: Mobile users (where virality is highest) should get the native share sheet. Desktop users will get a custom Lucide-styled modal with localized (Arabic) WhatsApp and Facebook links.
**Alternatives Considered**:
- External share libraries: Rejected to keep bundle size small and performance high.

## 4. Rich Snippet Strategy

### Decision: `WebApplication` + `FAQPage` JSON-LD
**Rationale**: Google specifically prioritizes FAQ schemas for tool-related searches. `SoftwareApplication` (category `WebApplication`) will provide the star rating and download/interactive signal in SERP.
**Alternatives Considered**:
- Microdata in HTML: Rejected; JSON-LD is cleaner and the standard for Next.js SEO optimization.
