# fileMind

Smart, Secure, & Fast File Processing Platform.

## Features
- **Zero Permanent Storage**: All files are automatically deleted after 1 hour.
- **Privacy-First**: No user accounts, no tracking, hashed IP addresses.
- **Hybrid Processing**: High-performance client-side workers combined with server-side processing queues.
- **Modular Architecture**: Built with Next.js 14, Python/FastAPI, BullMQ, Redis, and PostgreSQL.

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker & Docker Compose

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Infrastructure (Postgres & Redis):
   ```bash
   docker-compose up -d
   ```
4. Start Development Servers:
   ```bash
   npm run dev
   ```

## License
MIT
