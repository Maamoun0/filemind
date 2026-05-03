# Quickstart: File Download Fix

## Development Setup

1.  **Backend**: Start the FastAPI server locally from `hf_deploy`.
    ```bash
    cd hf_deploy
    pip install -r requirements.txt
    uvicorn app.main:app --reload --port 8000
    ```
2.  **Frontend**: Start the React application.
    ```bash
    cd packages/frontend
    npm run dev
    ```

## Testing the Fix

### Arabic Filename Test
1.  Upload a file named `تقرير_مهم.pdf`.
2.  Wait for the processing (e.g., PDF to Word) to complete.
3.  Click the download button.
4.  **Success**: The file starts downloading instantly with the name `filemind_تقرير_مهم.docx`.

### Expired File Test
1.  Upload any file and wait for completion.
2.  Delete the file from the server's `/tmp/outputs/{job_id}` folder manually.
3.  Click the download button in the UI.
4.  **Success**: A clear error message appears: "File not found or expired."
