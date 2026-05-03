# Research: File Download Fix

## Decisions

- **Decision**: Explicitly encode `Content-Disposition` header in the backend using RFC 5987.
- **Rationale**: The default `FileResponse` filename handling in Starlette doesn't support non-ASCII characters correctly and might not be robust enough for all proxies.
- **Alternatives Considered**: Using a direct link `<a>` tag with `download` attribute. Rejected because of cross-origin security restrictions on the `download` attribute for different domains.

- **Decision**: Update backend to use `StreamingResponse` for serving files.
- **Rationale**: `FileResponse` is generally fine, but `StreamingResponse` gives more control over headers and ensures we don't load the whole file into memory (good for larger files).
- **Alternatives Considered**: Serving from a separate static file server (Nginx). Rejected to keep deployment simple on Hugging Face.

- **Decision**: Implement manual filename extraction in Frontend with explicit fallback.
- **Rationale**: Some proxies might strip `Content-Disposition`, so we need to rely on the `job_id` or the original filename stored in the job state as a fallback.

## Findings

### RFC 5987 Formatting
To support non-ASCII filenames (like Arabic), the header should look like:
`Content-Disposition: attachment; filename="normal_name.docx"; filename*=UTF-8''%D8%AA%D9%82%D8%B1%D9%8A%D8%B1.docx`

### FastAPI CORS and Headers
FastAPI's `CORSMiddleware` correctly exposes headers when `expose_headers` is set. However, some cloud providers (like Hugging Face) might have edge proxies that require additional configuration or handle specific headers differently.

### Browser Blob Handling
Using `URL.createObjectURL(blob)` is the most reliable way to initiate a download from a `fetch` result without triggering browser security blocks on cross-origin redirects.
