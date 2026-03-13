import asyncio
import asyncpg
import os

# Manual parsing of .env.vercel since it might have different format
def load_vercel_env():
    try:
        with open(".env.vercel", "r") as f:
            for line in f:
                if "=" in line:
                    key, value = line.strip().split("=", 1)
                    # Remove quotes
                    if value.startswith('"') and value.endswith('"'):
                        value = value[1:-1]
                    os.environ[key] = value
    except Exception as e:
        print(f"Error loading .env.vercel: {e}")

async def init_db():
    load_vercel_env()
    dsn = os.getenv("DATABASE_URL")
    if not dsn:
        print("DATABASE_URL not found")
        return

    print(f"Connecting to {dsn.split('@')[-1]}...")
    conn = await asyncpg.connect(dsn)
    try:
        # Resolve path to init.sql
        init_sql_path = "../../infrastructure/postgres/init.sql"
        if not os.path.exists(init_sql_path):
            print(f"init.sql not found at {init_sql_path}")
            return

        with open(init_sql_path, "r") as f:
            sql = f.read()
            await conn.execute(sql)
            print("Database initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(init_db())
