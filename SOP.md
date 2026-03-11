# fileMind - Standard Operating Procedure (SOP)

## Project Overview
**fileMind** is a privacy-focused utility platform designed for secure file processing. Our core value is the "Zero Permanent Storage" policy.

## Technical Identity
- **Legal Name**: fileMind
- **Domain**: filemind.click
- **Brand Colors**: 
  - Slate (Text/Neutral)
  - Indigo/Violet (Primary/Brand)

## Infrastructure Management
1. **Container Identifiers**: All containers must be prefixed with `filemind-` (e.g., `filemind-backend`, `filemind-postgres`).
2. **Database Naming**: The primary database is named `filemind`.
3. **Queue Prefixes**: BullMQ queues must use the `filemind-` prefix for environment isolation.

## Security Procedures
1. **File Cleanup**: Every job must have a `delete_at` timestamp set to exactly 1 hour after creation.
2. **Worker Isolation**: The `fileMind-Worker` must run a 10-minute cleanup interval to verify and delete expired records and their associated binary data from the filesystem.
3. **Data Logging**: Never log raw document contents or sensitive user metadata. Use anonymized identifiers or job IDs for troubleshooting.

## Deployment & Rebranding
When updating the brand:
1. Update `package.json` names and metadata across all workspaces.
2. Run `npm install` to update workspace symlinks.
3. Update SEO metadata in `layout.tsx` and individual tool pages.
4. Verify JSON-LD schemas match the new brand identity.

---
*Last Updated: February 2026*
