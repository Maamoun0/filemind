# Use official Python runtime as a parent image
FROM python:3.10-slim

# Set working directory
WORKDIR /code

# Install system dependencies required for OpenCV (libgl1) and generic operations
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY ./packages/backend-python/requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir -r /code/requirements.txt

# Copy the entire backend app
COPY ./packages/backend-python/app /code/app

# Set non-root user (Hugging Face Spaces requires this for security)
RUN useradd -m -u 1000 user
USER user

# Set environment variables for Hugging Face
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    PYTHONPATH=/code \
    PORT=7860 \
    RENDER=true 

# Run the FastAPI application on port 7860 (Hugging Face default)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
