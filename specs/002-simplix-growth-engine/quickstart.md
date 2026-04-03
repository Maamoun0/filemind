# Quickstart: Simplix Growth Engine

**Branch**: `002-simplix-growth-engine` | **Status**: Complete

## 1. Local Setup for SEO Tool Pages

Create your first tool landing page configuration (e.g., PDF to Word):

```bash
mkdir -p packages/frontend/src/config/tools
# Add a template (Arabic/English)
cp templates/tool-config-sample.json packages/frontend/src/config/tools/pdf-to-word.json
```

## 2. Usage Tracking Setup (Redis)

Ensure you have a Redis instance running locally or a connection string from Railway.

```bash
# Set your Redis URL
export REDIS_URL="redis://localhost:6379"
```

## 3. RoadMap Kanban Board UI

Load the mock board by navigating to:
`http://localhost:3000/roadmap`

Items are sourced from: `packages/frontend/src/config/roadmap.json` for initial development.

## 4. Viral Rename Test

Run the conversion locally and check the output filename.
Expected: `simplix_{input_filename}.{ext}`
