# Data Model: Job Results

## Entities

### JobResult
Represents the processed file output stored on the server disk.
- `job_id`: Unique identifier for the job.
- `file_path`: Absolute path on the server disk (`/tmp/outputs/{job_id}/{filename}`).
- `filename`: Final transformed filename (encoded).
- `content_type`: MIME type (e.g., `application/vnd.openxmlformats-officedocument.wordprocessingml.document`).
- `expiry`: Time when the result will be deleted (1 hour after creation).
