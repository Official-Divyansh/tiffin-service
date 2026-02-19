# 🐘 PostgreSQL Setup Guide

This application now uses **PostgreSQL** instead of SQLite for better scalability, concurrent connections, and production readiness.

## 📦 Installing PostgreSQL

### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Ubuntu/Debian Linux
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows
1. Download installer from: https://www.postgresql.org/download/windows/
2. Run the installer (accept defaults)
3. Remember the password you set for the `postgres` user

### Docker (All Platforms)
```bash
docker run --name tiffin-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=tiffin_service \
  -p 5432:5432 \
  -d postgres:15
```

---

## 🔧 Initial Database Setup

### 1. Create the Database

#### Using psql command line:
```bash
# Connect as postgres user
sudo -u postgres psql

# Or on macOS/Windows:
psql -U postgres

# Create database
CREATE DATABASE tiffin_service;

# Exit
\q
```

#### Using Docker:
```bash
docker exec -it tiffin-postgres psql -U postgres -c "CREATE DATABASE tiffin_service;"
```

### 2. Create a dedicated user (optional but recommended)
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create user
CREATE USER tiffin_user WITH PASSWORD 'secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE tiffin_service TO tiffin_user;

-- Connect to the database
\c tiffin_service

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO tiffin_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tiffin_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tiffin_user;

-- Exit
\q
```

---

## ⚙️ Configure the Application

### 1. Copy environment template
```bash
cp .env.example .env
```

### 2. Edit `.env` file
```env
# PostgreSQL Connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tiffin_service
DB_USER=postgres              # or tiffin_user if you created one
DB_PASSWORD=your_password     # the password you set

# SMTP Settings (for email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start the application
```bash
npm start
```

The application will automatically:
- Connect to PostgreSQL
- Create tables if they don't exist
- Create indexes for performance
- Start the web server

---

## 🗄️ Database Schema

The application creates three tables:

### **bookings**
```sql
CREATE TABLE bookings (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    phone       VARCHAR(20) NOT NULL,
    email       VARCHAR(255),
    address     TEXT NOT NULL,
    meal_type   VARCHAR(50) NOT NULL,
    plan_type   VARCHAR(50) NOT NULL,
    start_date  DATE NOT NULL,
    notes       TEXT,
    email_sent_7d  BOOLEAN DEFAULT FALSE,
    email_sent_3d  BOOLEAN DEFAULT FALSE,
    email_sent_1d  BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **call_requests**
```sql
CREATE TABLE call_requests (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    phone      VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **email_logs**
```sql
CREATE TABLE email_logs (
    id         SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    days_left  INTEGER,
    status     VARCHAR(20),
    sent_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔍 Useful PostgreSQL Commands

### Check database connection
```bash
psql -U postgres -d tiffin_service -c "SELECT version();"
```

### List all tables
```bash
psql -U postgres -d tiffin_service -c "\dt"
```

### View bookings
```bash
psql -U postgres -d tiffin_service -c "SELECT * FROM bookings ORDER BY created_at DESC LIMIT 10;"
```

### Count records
```bash
psql -U postgres -d tiffin_service -c "SELECT 
  (SELECT COUNT(*) FROM bookings) as bookings,
  (SELECT COUNT(*) FROM call_requests) as calls,
  (SELECT COUNT(*) FROM email_logs) as emails;"
```

### Reset all data (⚠️ CAUTION: Deletes everything!)
```bash
psql -U postgres -d tiffin_service -c "
  TRUNCATE bookings, call_requests, email_logs RESTART IDENTITY CASCADE;
"
```

### Drop and recreate database (⚠️ CAUTION: Complete reset!)
```bash
psql -U postgres -c "DROP DATABASE IF EXISTS tiffin_service;"
psql -U postgres -c "CREATE DATABASE tiffin_service;"
```

---

## 🐳 Docker Compose (Recommended)

For easier setup, use Docker Compose:

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: tiffin-postgres
    environment:
      POSTGRES_DB: tiffin_service
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

Start with:
```bash
docker-compose up -d
```

---

## 🔐 Security Best Practices

### For Development:
- Default password `postgres` is fine
- Keep database local (localhost)

### For Production:
1. **Strong Password**: Use a long, random password
2. **Dedicated User**: Create a user with limited permissions
3. **Firewall**: Only allow connections from your app server
4. **SSL/TLS**: Enable SSL connections
5. **Backup**: Set up automated backups
6. **Environment Variables**: Never commit `.env` to git

Example production connection:
```env
DB_HOST=your-database-host.com
DB_PORT=5432
DB_NAME=tiffin_service
DB_USER=tiffin_app_user
DB_PASSWORD=VERY_STRONG_RANDOM_PASSWORD_HERE_128_CHARS
```

---

## 🚀 Cloud Database Options

### Supabase (Free tier available)
1. Sign up at https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Use in `.env`:
```env
DB_HOST=db.xxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
```

### Railway (Free tier available)
1. Sign up at https://railway.app
2. Create new project → Add PostgreSQL
3. Copy connection details to `.env`

### Heroku Postgres
1. Create Heroku app
2. Add Heroku Postgres addon
3. Connection string auto-configured

### AWS RDS / Azure Database / Google Cloud SQL
Follow provider documentation for PostgreSQL setup.

---

## 🆘 Troubleshooting

### "FATAL: database does not exist"
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE tiffin_service;"
```

### "FATAL: role does not exist"
```bash
# Use the postgres superuser
psql -U postgres
```

### "connection refused"
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                # macOS
```

### "permission denied for schema public"
```bash
psql -U postgres -d tiffin_service -c "
  GRANT ALL ON SCHEMA public TO your_username;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO your_username;
  GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO your_username;
"
```

### Port 5432 already in use
```bash
# Find what's using it
sudo lsof -i :5432

# Or change the port in .env
DB_PORT=5433
```

---

## 📊 Performance Tips

### Enable connection pooling (already configured)
The app uses `pg.Pool` with:
- Max 20 connections
- 30s idle timeout
- 2s connection timeout

### Add indexes for common queries
Already created automatically:
```sql
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);
CREATE INDEX idx_email_logs_booking ON email_logs(booking_id);
```

### Monitor query performance
```sql
-- Enable timing
\timing

-- View slow queries
SELECT * FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

---

## 📚 Resources

- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [pgAdmin (GUI Tool)](https://www.pgadmin.org/)

---

**Need help?** Check the main README.md or open an issue on GitHub.
