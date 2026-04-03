# Implementation Plan: Simplix Growth Engine

**Branch**: `002-simplix-growth-engine` | **Date**: 2026-04-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-simplix-growth-engine/spec.md`

## Summary

The Simplix Growth Engine aims to scale the platform's reach through programmatic SEO, viral distribution, and converted retention. We will implement dedicated landing pages for each tool (e.g., `/pdf-to-word`) with localized metadata and FAQs, enforce a 10-operation daily limit for unauthenticated users (via IP + Cookie tracking), and bake virality into the product by renaming output files to `simplix_*` and adding a social sharing modal.

## Technical Context

**Language/Version**: TypeScript (Next.js 14+), Python 3.12 (FastAPI)  
**Primary Dependencies**: `lucide-react`, `zod`, `pytesseract`, `pdf2image`, `python-docx`  
**Storage**: Local JSON (Tool Configs), Redis (Usage Tracking), PostgreSQL (Jobs/Users)  
**Testing**: Jest (Frontend), Pytest (Backend)  
**Target Platform**: Vercel (Frontend), Railway (Backend)  
**Project Type**: Web Application (Monorepo)  
**Performance Goals**: < 2.0s Page Load (LCP), < 500ms API response for limit checks  
**Constraints**: < 100MB RAM per OCR page (Memory Optimized), 10 ops/day unauthenticated limit  
**Scale/Scope**: 1000+ daily unique visitors, ~50 dedicated tool landing pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **SEO Compliance**: All generated tool pages must support SSG/SSR for search engine indexing.
- [x] **Privacy Integrity**: Usage tracking (IP Hash) must comply with GDPR/privacy standards (no PII storage).
- [x] **Consistency**: New `ToolType` entries must be synchronized across `shared`, `frontend`, and `backend`.
- [x] **Security**: Usage limit checks must occur at the API gateway/router level before expensive processing starts.

## Project Structure

### Documentation (this feature)

```text
specs/002-simplix-growth-engine/
├── plan.md              # This file
├── research.md          # Next.js SEO & Rate Limiting Research
├── data-model.md        # Usage tracking & Config structures
├── quickstart.md        # Setting up local SEO configs
├── contracts/           # API schemas for limit checks
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
packages/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── [tool]/page.tsx      # Dynamic Tool Landing Pages
│   │   │   └── roadmap/page.tsx     # Kanban Roadmap Page
│   │   ├── components/
│   │   │   ├── roadmap/             # Kanban Components
│   │   │   └── share/               # Social Share Modal
│   │   └── config/
│   │       └── tools/               # Local JSON FAQ/SEO configs
├── shared/
│   ├── src/
│   │   ├── types/                   # Unified ToolType
│   │   └── validations/             # Usage limit schemas
hf_deploy/
├── app/
│   ├── routers/
│   │   └── usage.py                 # Limit enforcement router
│   ├── services/
│   │   └── usage_service.py         # IP+Cookie tracking logic
```

**Structure Decision**: Monorepo structure (Next.js + FastAPI). Dynamic routing `[tool]/page.tsx` will be used for programmatic SEO to handle various tool paths with a single template.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| IP + Cookie Hybrid | Accuracy of usage limits | Cookie-only is trivially bypassed by Incognito mode; IP-only blocks shared networks (offices). |
| Dynamic [tool] routing | Scale ~50 tool pages | Hardcoding 50 pages is unmaintainable for metadata/FAQ updates. |
