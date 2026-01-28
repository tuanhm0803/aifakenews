#!/bin/bash
set -e

echo "🚀 Starting AIFakeNews Backend..."

# Wait for postgres to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  sleep 1
done

echo "✅ PostgreSQL is ready!"

# Run database migrations (create tables)
echo "📦 Creating database tables..."
python -c "from database import engine; import models; models.Base.metadata.create_all(bind=engine)"

# Seed demo users if they don't exist
echo "👥 Seeding demo users..."
python seed_users.py || echo "⚠️  Users may already exist, skipping..."

# Start the application
echo "🎉 Starting FastAPI application..."
exec uvicorn main:app --host 0.0.0.0 --port 8000
