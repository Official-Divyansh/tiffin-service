# 🚀 Quick Start Guide

## Getting Started in 3 Simple Steps

### Step 1: Install Dependencies
```bash
npm install
```

This will install:
- express (Web framework)
- sqlite3 (Database)
- body-parser (Parse request bodies)
- cors (Cross-origin resource sharing)

### Step 2: Start the Server
```bash
npm start
```

You should see:
```
Connected to SQLite database
Bookings table ready
Call requests table ready

🚀 Server is running on http://localhost:3000
📱 Main Website: http://localhost:3000
👨‍💼 Admin Panel: http://localhost:3000/admin
```

### Step 3: Open in Browser

**Customer Website**: 
Open `http://localhost:3000` in your browser

**Admin Dashboard**: 
Open `http://localhost:3000/admin` in your browser

## Testing the Application

### Test Customer Booking:
1. Go to http://localhost:3000
2. Scroll to "Book Your Tiffin Service" section
3. Fill in the form:
   - Name: Test User
   - Phone: 9876543210
   - Address: 123 Test Street
   - Meal Type: Both
   - Duration: 1 Month
   - Start Date: (Select any future date)
4. Click "Submit Booking Request"
5. You should see a success message

### Test Call Request:
1. Scroll to "Need to Talk to Us?" section
2. Enter:
   - Name: Test User
   - Phone: 9876543210
3. Click "Request a Call"
4. You should see a success message

### View in Admin Panel:
1. Open http://localhost:3000/admin
2. You should see:
   - Updated statistics in the cards
   - Your test booking in the "Tiffin Bookings" tab
   - Your call request in the "Call Requests" tab

## Common Commands

**Start Server**:
```bash
npm start
```

**Start with Auto-reload** (for development):
```bash
npm run dev
```
(Note: Requires nodemon to be installed)

**Stop Server**:
Press `Ctrl + C` in the terminal

## Troubleshooting

### Port Already in Use
If port 3000 is busy, change it in `server.js`:
```javascript
const PORT = 3001; // Change this line
```

### Database Issues
If you encounter database errors, delete `tiffin_service.db` and restart:
```bash
rm tiffin_service.db
npm start
```

### Dependencies Not Installing
Try:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

## Development Tips

1. **Database Location**: The SQLite database file `tiffin_service.db` is created automatically in the project root

2. **Live Reload**: Install nodemon globally for auto-restart on file changes:
   ```bash
   npm install -g nodemon
   npm run dev
   ```

3. **View Database**: Use SQLite browser tools to inspect the database:
   - [DB Browser for SQLite](https://sqlitebrowser.org/)
   - Or CLI: `sqlite3 tiffin_service.db`

4. **API Testing**: Use tools like:
   - Postman
   - Insomnia
   - curl commands

## Production Deployment

For production, consider:
1. Use environment variables for configuration
2. Add authentication to admin panel
3. Use PM2 or similar for process management
4. Set up proper logging
5. Configure HTTPS
6. Add rate limiting
7. Set up monitoring

## Need Help?

- Check the main README.md for detailed documentation
- Review the code comments in server.js
- Test API endpoints using the provided documentation

---

Happy Cooking! 🍱
