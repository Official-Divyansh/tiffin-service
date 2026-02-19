# 🍱 Ghar Ka Khana - Tiffin Service Application

A complete full-stack web application for a home-cooked tiffin (meal delivery) service with customer booking, callback requests, automated email reminders, and admin dashboard.

## 📋 Features

### Customer Features
- **Home Page**: Beautiful landing page with service highlights and animated hero section
- **Food Gallery Slider**: Auto-rotating image carousel showcasing signature dishes
- **Weekly Menu with Images**: Modern card-based menu with real food photography
  - Day selector with pill-strip navigation
  - Lunch/Dinner toggle
  - Professional food cards with images, descriptions, and tags
- **Tiffin Booking**: Complete booking form with:
  - Personal details (Name, Phone, Email, Address)
  - Meal type selection (Lunch/Dinner/Both)
  - Subscription duration (1 week to 6 months)
  - Start date selection
  - Special requirements
- **Request a Call**: Simple callback request form
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

### Admin Features
- **Dashboard Statistics**: 
  - Total bookings and call requests
  - Today's bookings and calls
  - Total emails sent
- **Booking Management**: View all tiffin bookings with complete details
- **Call Request Management**: View all callback requests
- **Email Logs**: View history of automated subscription reminder emails
- **Data Management**: Delete entries as needed
- **Auto-refresh**: Dashboard updates every 30 seconds
- **Responsive Admin Panel**: Clean interface for managing requests

### Automated Email Notifications
- **Booking Confirmation**: Instant email when booking is created
- **Subscription Expiry Reminders**: Automatic emails sent at:
  - 7 days before expiry
  - 3 days before expiry (urgent reminder)
  - 1 day before expiry (final notice)
- **Beautiful HTML Templates**: Professional email design with branding
- **Tracking**: All sent emails logged in database

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL 15+ (replaces SQLite for production-ready scalability)
- **Email**: Nodemailer with Gmail/Ethereal SMTP
- **Scheduler**: node-cron for daily email checks
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Design**: Custom responsive design with Playfair Display + Karla fonts

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL 15+ installed and running
- npm (Node Package Manager)

### Setup Steps

1. **Install PostgreSQL** (if not already installed)
   ```bash
   # See POSTGRESQL_SETUP.md for detailed instructions
   
   # macOS
   brew install postgresql@15
   brew services start postgresql@15
   
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   
   # Docker
   docker run --name tiffin-postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=tiffin_service \
     -p 5432:5432 -d postgres:15
   ```

2. **Create Database**
   ```bash
   # Using psql
   psql -U postgres -c "CREATE DATABASE tiffin_service;"
   
   # Or using Docker
   docker exec -it tiffin-postgres psql -U postgres -c "CREATE DATABASE tiffin_service;"
   ```

3. **Clone/Download the project**
   ```bash
   cd tiffin-service-app
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database and SMTP credentials
   ```

   Example `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=tiffin_service
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

6. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Main Website: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin`

## 📁 Project Structure

```
tiffin-service-app/
├── server.js                  # Express server with PostgreSQL & email
├── package.json               # Project dependencies
├── .env.example              # Environment variables template
├── POSTGRESQL_SETUP.md       # Detailed PostgreSQL setup guide
├── README.md                 # This file
├── QUICKSTART.md             # Quick start guide
├── FEATURES.md               # Detailed features documentation
└── public/
    ├── index.html            # Main customer-facing website
    └── admin.html            # Admin dashboard
```

## 🗄️ Database Schema

### Bookings Table
```sql
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT NOT NULL,
    meal_type VARCHAR(50) NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    notes TEXT,
    email_sent_7d BOOLEAN DEFAULT FALSE,
    email_sent_3d BOOLEAN DEFAULT FALSE,
    email_sent_1d BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Call Requests Table
```sql
CREATE TABLE call_requests (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Email Logs Table
```sql
CREATE TABLE email_logs (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    days_left INTEGER,
    status VARCHAR(20),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### Create Booking
- **POST** `/api/bookings`
- **Body**: 
  ```json
  {
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "address": "123 Main St",
    "meal_type": "Both",
    "plan_type": "1 Month",
    "start_date": "2025-02-20",
    "notes": "No onions please"
  }
  ```

### Get All Bookings
- **GET** `/api/bookings`
- **Response**: Array of booking objects

### Create Call Request
- **POST** `/api/call-requests`
- **Body**:
  ```json
  {
    "name": "Jane Smith",
    "phone": "9876543210"
  }
  ```

### Get Statistics
- **GET** `/api/stats`
- **Response**: 
  ```json
  {
    "totalBookings": 10,
    "totalCallRequests": 5,
    "todayBookings": 2,
    "todayCallRequests": 1,
    "emailsSent": 8
  }
  ```

### Get Email Logs
- **GET** `/api/email-logs`
- **Response**: Array of email log objects

### Test Expiry Email (Admin)
- **POST** `/api/test-expiry-email/:bookingId?days=3`
- Send test expiry reminder email

## 🎨 Design Features

- **Color Scheme**: Warm terracotta (#D97757), cream (#F4E8D8), and brown (#8B6F47)
- **Typography**: Playfair Display (headings) + Karla (body text)
- **Animations**: Smooth transitions, scroll effects, hover states
- **Modern Menu**: Card-based layout with real Unsplash food images
- **Responsive**: Mobile-first design approach with breakpoints
- **Accessibility**: Semantic HTML, proper form labels, ARIA attributes

## 📧 Email Configuration

### Gmail Setup (Recommended)
1. Enable 2-Step Verification on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Create an App Password for "Mail"
4. Use credentials in `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_16_char_app_password
   ```

### Ethereal (Development/Testing)
1. Go to https://ethereal.email/
2. Click "Create Account"
3. Use provided credentials in `.env`
4. Emails won't be sent but you'll get preview URLs in console

## 📱 Usage

### For Customers

1. **Browse the Food Gallery**: Auto-rotating carousel of signature dishes
2. **Explore Weekly Menu**: Click days to see menus, toggle Lunch/Dinner
3. **Book Tiffin Service**: 
   - Fill out the booking form
   - Add email to receive confirmations and reminders
   - Select meal type and duration
   - Choose start date
   - Submit the form
4. **Request a Call**: 
   - Enter name and phone number
   - Submit to receive a callback

### For Admins

1. **Access Admin Panel**: Navigate to `/admin`
2. **View Statistics**: See dashboard cards with key metrics
3. **Manage Bookings**: 
   - View all booking details in table format
   - See email reminder status flags
   - Delete completed bookings
4. **Manage Call Requests**:
   - View all callback requests
   - Delete contacted requests
5. **Check Email Logs**:
   - See history of automated emails
   - Track delivery status
6. **Refresh Data**: Click refresh button or wait for auto-refresh

## 🔒 Security Notes

**Important**: This is a production-ready application with PostgreSQL.

For production deployment, ensure:
- ✅ PostgreSQL user with limited permissions (not postgres superuser)
- ✅ Strong database password
- ✅ Firewall rules to limit database access
- ✅ SSL/TLS for database connections
- ✅ User authentication for admin panel
- ✅ Input validation and sanitization (already implemented)
- ✅ Rate limiting on API endpoints
- ✅ HTTPS encryption
- ✅ Environment variables for configuration
- ✅ Regular database backups
- ✅ Error logging and monitoring
- ✅ CSRF protection
- ✅ SQL injection prevention (using parameterized queries - already implemented)

## 🚀 Deployment

### Heroku
```bash
# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_USER=your@email.com
heroku config:set SMTP_PASS=yourpassword

# Deploy
git push heroku main
```

### Railway / Render / Fly.io
1. Connect GitHub repository
2. Add PostgreSQL database service
3. Set environment variables in dashboard
4. Deploy automatically on push

### VPS (DigitalOcean, AWS, etc.)
1. Install PostgreSQL
2. Clone repository
3. Configure `.env`
4. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name tiffin-service
   pm2 startup
   pm2 save
   ```

## 🆕 What's New in v3.0

- 🐘 **PostgreSQL Database**: Replaced SQLite for production scalability
- 📸 **Image-based Menu**: Real food photography from Unsplash
- 🎨 **Modern Card Design**: Beautiful food cards with badges and tags
- 🔄 **Improved Navigation**: Day pill strip + Lunch/Dinner toggle
- 📧 **Email Tracking**: Better logging and status monitoring
- 🔗 **Connection Pooling**: Optimized database connections
- 📊 **Better Indexes**: Performance optimizations
- 🛡️ **Foreign Keys**: Database referential integrity

## 🐛 Troubleshooting

### Database connection errors
See `POSTGRESQL_SETUP.md` for detailed troubleshooting

### Port 3000 already in use
Change in `.env` or server.js:
```env
PORT=3001
```

### Email not sending
1. Check SMTP credentials in `.env`
2. For Gmail, ensure App Password is used (not regular password)
3. Check console for Ethereal preview URLs in development

## 📝 License

This project is created for demonstration purposes.

## 👨‍💻 Support

For detailed setup instructions:
- See `POSTGRESQL_SETUP.md` for database setup
- See `QUICKSTART.md` for quick start guide
- See `FEATURES.md` for feature documentation

---

**Made with ❤️ for food lovers**
