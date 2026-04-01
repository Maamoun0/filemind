import asyncio
import io
import os
from unittest.mock import AsyncMock, MagicMock


# Mocking the dependencies
class MockUploadFile:
    def __init__(self, filename, content, size):
        self.filename = filename
        self.file = io.BytesIO(content)
        self.size = size
        self.read = AsyncMock(side_effect=self.file.read)
        self.seek = MagicMock(side_effect=self.file.seek)


# This is the function logic we modified
async def upload_file_mock(file, temp_dir: str):
    # Simulate saving to disk
    job_id = "test-job-id"
    upload_dir = os.path.join(temp_dir, "uploads", job_id)
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)

    # Streaming simulation
    with open(file_path, "wb") as f:
        while True:
            chunk = await file.read(1024)
            if not chunk:
                break
            f.write(chunk)

    return os.path.exists(file_path)


async def test_streaming_upload():
    # Setup test file (e.g., 30MB)
    file_size = 30 * 1024 * 1024
    content = b"0" * 1024  # Only simulate 1KB in memory for the mock read

    # Mocking the file reading behavior to simulate 30MB stream
    class StreamingMockFile(MockUploadFile):
        def __init__(self, filename, chunk_size, total_size):
            self.filename = filename
            self.size = total_size
            self.total_size = total_size
            self.remaining = total_size
            self.read = AsyncMock(side_effect=self.read_chunk)
            self.seek = MagicMock()

        async def read_chunk(self, size):
            if self.remaining <= 0:
                return b""
            read_size = min(size, self.remaining)
            self.remaining -= read_size
            return b"0" * read_size

    mock_file = StreamingMockFile("test_30mb.pdf", 1024 * 1024, file_size)

    # Test directory
    test_dir = "./tmp_test_30mb"

    # Execute
    success = await upload_file_mock(mock_file, test_dir)

    # Assert
    assert success == True
    file_path = os.path.join(test_dir, "uploads", "test-job-id", "test_30mb.pdf")
    assert os.path.getsize(file_path) == file_size
    print(f"Streaming upload test with {file_size / (1024 * 1024)}MB passed!")

    # Cleanup
    import shutil

    shutil.rmtree(test_dir)


if __name__ == "__main__":
    asyncio.run(test_streaming_upload())
