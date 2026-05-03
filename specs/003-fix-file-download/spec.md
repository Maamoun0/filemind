# Feature Specification: Fix File Download Issue

**Feature Branch**: `003-fix-file-download`  
**Created**: 2026-04-09  
**Status**: Draft  
**Input**: User description: "Fix 'Failed to download' issue after file processing"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Download of Converted Result (Priority: P1)

As a user of fileMind, after I have successfully converted a PDF to a Word document and seen the "Verified by AI Experts" message, I want to click the "Download" button and have the file immediately saved to my device so that I can use the editable result.

**Why this priority**: This is the core value proposition of the tool. If the user cannot download the result, the entire processing effort is wasted.

**Independent Test**: Can be fully tested by uploading a sample PDF, waiting for completion, clicking download, and verifying the file exists on the local filesystem with the correct content.

**Acceptance Scenarios**:

1. **Given** a completed PDF-to-Word job, **When** clicking "Download Verified Result", **Then** the browser starts downloading a .docx file.
2. **Given** a filename with Arabic characters (e.g., "سياسة.pdf"), **When** downloaded, **Then** the result filename should be properly encoded (e.g., "filemind_سياسة.docx").

---

### User Story 2 - Resilient Cross-Origin File Delivery (Priority: P2)

As a system, I want to ensure that files processed on the backend (HuggingFace Spaces) are securely and reliably delivered to the frontend (Vercel) despite cross-origin boundaries, so that users on the web platform have a seamless experience.

**Why this priority**: The architecture relies on cross-domain communication. Failure here leads to the reported "Failed to download" error.

**Independent Test**: Can be tested by triggering a download from the production Vercel URL and observing the network response from the HF backend.

**Acceptance Scenarios**:

1. **Given** a request from the Vercel frontend, **When** the backend serves the file, **Then** CORS headers must allow the browser to process the response blob.
2. **Given** a backend error (e.g., missing file), **When** downloading, **Then** the system should provide a clear error message instead of a generic failure if possible.

---

### Edge Cases

- **What happens when the file has expired?** The system should return a 404 and the UI should inform the user the session has timed out (1 hour limit).
- **How does the system handle very large files?** The download should stream correctly without crashing the backend or timing out the browser fetch.
- **What happens if two users download at once?** Each session/job_id is isolated in `/tmp/outputs/{job_id}`, ensuring no data leakage or collision.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Backend MUST properly import and use `FileResponse` (from `fastapi.responses`) to serve files.
- **FR-002**: Backend MUST include the `Content-Disposition` header with properly encoded filenames (supporting UTF-8/Arabic characters).
- **FR-003**: Frontend MUST handle the response as a Blob and use `URL.createObjectURL` to trigger a native browser download.
- **FR-004**: Frontend MUST fallback to a default filename if the `Content-Disposition` header is inaccessible due to CORS restrictions.
- **FR-005**: All processing tools (PDF-to-Word, OCR, Compression) MUST utilize the same robust download endpoint.

### Key Entities

- **Job**: Represents a single processing task, identified by a UUID.
- **Processed File**: The output stored in the backend filesystem (`/tmp/outputs/{job_id}/`) to be served.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of "Completed" jobs lead to a successful file download when initiated within 60 minutes.
- **SC-002**: Download initiation starts in under 500ms after clicking the button.
- **SC-003**: Resulting filenames consistently follow the `filemind_[original_name].[extension]` pattern.

## Assumptions

- **Processing Environment**: The backend runs on a Linux-based environment (HuggingFace Spaces) with a writable `/tmp` directory.
- **Storage Policy**: Files are intentionally ephemeral and deleted after 1 hour (Zero Permanent Storage architecture).
- **Connectivity**: Users have sufficient bandwidth to download the resulting files (which may be larger than the input).
- **Browser Support**: Modern browsers supporting Fetch API and Blobs are used.
