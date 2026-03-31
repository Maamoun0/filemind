FROM python:3.10-slim
WORKDIR /code
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0 tesseract-ocr tesseract-ocr-ara && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Start the production entrypoint
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
