# 📸 Features Overview - Ghar Ka Khana

## 🏠 Customer Website Features

### 1. Home Page / Landing Section
**URL**: `http://localhost:3000`

**Features**:
- Eye-catching hero section with tagline "Just Like Mom Made It! 🏡"
- Four feature cards highlighting:
  - 🥘 Home-Style Food
  - 🌱 Daily Fresh Meals
  - 💰 Affordable Pricing
  - 🚚 Doorstep Delivery
- Call-to-action button linking to booking section
- Animated food illustration
- Smooth scroll animations

**Design Elements**:
- Warm color palette (terracotta, cream, brown)
- Professional Playfair Display + Karla font combination
- Gradient backgrounds with floating animations
- Responsive grid layout

---

### 2. Weekly Menu Section
**Location**: Scroll down or click "Menu" in navigation

**Features**:
- Interactive day tabs (Monday through Sunday)
- Each day displays:
  - 🌅 Lunch Menu (6 items)
  - 🌙 Dinner Menu (6 items)
- Menu items include:
  - Rotis/Chapatis
  - Main course (Sabzi/Paneer)
  - Dal varieties
  - Rice preparations
  - Salad/Raita
  - Desserts (on dinner menu)

**User Experience**:
- Click any day to instantly view that day's menu
- Smooth tab switching with fade animations
- Cards hover effect for better interactivity
- Mobile-friendly layout

**Sample Menu Structure**:
```
Monday Lunch:
🍽️ 4 Phulka Roti
🍽️ Aloo Gobhi Sabzi
🍽️ Yellow Dal Tadka
🍽️ Jeera Rice
🍽️ Fresh Green Salad
🍽️ Pickle & Papad
```

---

### 3. Tiffin Booking Form
**Location**: "Book Now" section

**Form Fields**:
1. **Full Name*** (Required)
2. **Mobile Number*** (Required, 10 digits)
3. **Email** (Optional)
4. **Delivery Address*** (Required, Textarea)
5. **Meal Type*** (Required, Radio buttons):
   - Lunch
   - Dinner
   - Both
6. **Start Date*** (Required, Date picker - minimum today)
7. **Subscription Duration*** (Required, Dropdown):
   - 1 Week
   - 2 Weeks
   - 1 Month
   - 3 Months
   - 6 Months
8. **Special Requirements** (Optional, Textarea)

**Functionality**:
- Real-time form validation
- Date picker prevents past dates
- Phone number format validation (10 digits)
- Submit button with loading state
- Success modal on submission
- Data saved to SQLite database
- Form automatically resets after submission

**API Call**:
```javascript
POST /api/bookings
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "address": "123 Main Street, Delhi",
  "meal_type": "Both",
  "plan_type": "1 Month",
  "start_date": "2025-02-20",
  "notes": "No spicy food"
}
```

---

### 4. Request a Call Feature
**Location**: "Contact" section with gradient background

**Form Fields**:
1. **Your Name*** (Required)
2. **Phone Number*** (Required, 10 digits)

**Features**:
- Beautiful gradient card design
- Animated background pattern
- Contact information display:
  - 📞 Phone: +91 98765 43210
  - 📧 Email: contact@gharkhakhana.com
  - ⏰ Service Hours: 8:00 AM - 9:00 PM
- Submit button with loading spinner
- Success confirmation modal
- Data stored in database

**API Call**:
```javascript
POST /api/call-requests
{
  "name": "Jane Smith",
  "phone": "9876543210"
}
```

---

### 5. Navigation & Layout
**Header**:
- Sticky navigation bar
- Logo with icon
- Menu links: Home, Menu, Book Now, Contact
- Mobile hamburger menu
- Smooth scroll to sections

**Footer**:
- About section
- Quick links
- Service areas
- Copyright information
- Dark theme for contrast

---

## 👨‍💼 Admin Dashboard Features

### 1. Dashboard Statistics
**URL**: `http://localhost:3000/admin`

**Statistics Cards** (Auto-updates every 30 seconds):
1. **📦 Total Bookings**: All-time booking count
2. **📞 Call Requests**: All-time call request count
3. **📅 Today's Bookings**: Bookings received today
4. **📲 Today's Calls**: Call requests received today

**Design**:
- Four card layout
- Hover animations
- Large numbers with Playfair Display font
- Icons for visual clarity

---

### 2. Tiffin Bookings Table
**Tab**: "Tiffin Bookings"

**Columns Displayed**:
1. **ID**: Booking reference number (#1, #2, etc.)
2. **Name**: Customer name
3. **Phone**: Contact number
4. **Email**: Email address (if provided)
5. **Address**: Delivery address (truncated if long)
6. **Meal Type**: Badge showing Lunch/Dinner/Both
   - Color-coded badges for easy identification
7. **Plan**: Subscription duration
8. **Start Date**: When service begins
9. **Date Created**: Timestamp of booking
10. **Actions**: Delete button

**Features**:
- Sortable by date (newest first)
- Hover highlight on rows
- Color-coded meal type badges:
  - 🔵 Lunch (Blue)
  - 🟣 Dinner (Purple)
  - 🟢 Both (Green)
- Delete functionality with confirmation
- Refresh button to reload data
- Loading spinner during data fetch
- Empty state message when no bookings

**Sample Data Display**:
```
ID    Name         Phone        Email              Address           Meal Type    Plan      Start Date    Created
#5    John Doe     9876543210   john@email.com     123 Main St...    [Both]      1 Month   Feb 20, 2025  Feb 15, 2025 2:30 PM
#4    Jane Smith   9988776655   jane@email.com     456 Park Ave...   [Lunch]     2 Weeks   Feb 18, 2025  Feb 15, 2025 1:15 PM
```

---

### 3. Call Requests Table
**Tab**: "Call Requests"

**Columns Displayed**:
1. **ID**: Request reference number
2. **Name**: Customer name
3. **Phone Number**: Contact number (bold)
4. **Request Date & Time**: When callback was requested
5. **Actions**: Delete button

**Features**:
- Simple, focused table layout
- Easy-to-read phone numbers
- Timestamp for follow-up priority
- Delete with confirmation
- Refresh capability
- Loading and empty states

**Sample Data Display**:
```
ID    Name          Phone Number    Request Date & Time
#3    Mike Johnson  9876543210      Feb 15, 2025 3:45 PM
#2    Sarah Wilson  9988776655      Feb 15, 2025 2:20 PM
```

---

### 4. Admin Panel Features

**Tab Navigation**:
- Switch between Bookings and Call Requests
- Active tab highlighting
- Smooth transitions

**Refresh Functionality**:
- Manual refresh button on each section
- Auto-refresh every 30 seconds
- Visual feedback during loading

**Data Management**:
- Delete entries (with confirmation dialog)
- Real-time statistics updates
- Responsive table design
- Mobile-friendly overflow scroll

**User Experience**:
- Clean, professional design
- No authentication (demo purposes)
- Administrator badge in header
- Consistent color scheme with main site

---

## 🎨 Design Highlights

### Color Palette
```css
Primary: #D97757 (Terracotta)
Primary Dark: #C25A3B
Secondary: #F4E8D8 (Cream)
Accent: #8B6F47 (Brown)
Text Dark: #2C2416
Text Light: #6B5D4F
Background: #FFF9F0 (Light Cream)
```

### Typography
- **Headings**: Playfair Display (Serif)
- **Body**: Karla (Sans-serif)
- **Weights**: 300, 400, 500, 600, 700

### Animations
- Slide down header on page load
- Fade in sections on scroll
- Hover effects on cards
- Button press animations
- Modal pop-in effects
- Loading spinners
- Floating background patterns

---

## 📱 Responsive Design

### Mobile (< 768px)
- Hamburger menu for navigation
- Stacked form fields
- Single column layouts
- Touch-friendly buttons
- Optimized font sizes
- Horizontal scroll for tables

### Tablet (768px - 1024px)
- Two-column layouts
- Adaptive menu sizing
- Optimized spacing

### Desktop (> 1024px)
- Full navigation bar
- Multi-column grids
- Hover effects enabled
- Maximum width constraints

---

## 🔄 Data Flow

### Customer Booking Flow:
1. User fills booking form
2. Frontend validates input
3. POST request to `/api/bookings`
4. Server validates and saves to SQLite
5. Success response sent
6. Modal shows confirmation
7. Form resets

### Admin View Flow:
1. Admin opens dashboard
2. GET request to `/api/stats`
3. GET request to `/api/bookings`
4. Data rendered in tables
5. Auto-refresh every 30 seconds
6. Manual refresh on button click

### Database Operations:
```sql
-- Insert Booking
INSERT INTO bookings (name, phone, email, address, meal_type, plan_type, start_date, notes)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)

-- Fetch All Bookings
SELECT * FROM bookings ORDER BY created_at DESC

-- Delete Booking
DELETE FROM bookings WHERE id = ?
```

---

## 🚀 Performance Features

- Lightweight vanilla JavaScript (no frameworks)
- CSS-only animations where possible
- Optimized images (emoji icons)
- Minimal external dependencies
- Fast SQLite queries
- Efficient DOM updates
- Debounced auto-refresh

---

## ✅ Quality Assurance

### Form Validation
- Required field checks
- Phone number format (10 digits)
- Email format validation
- Date constraints (no past dates)
- Character limits on text areas

### Error Handling
- Try-catch blocks on API calls
- User-friendly error messages
- Loading states during operations
- Graceful failure recovery
- Console error logging

### User Feedback
- Success modals
- Loading spinners
- Button disabled states
- Confirmation dialogs
- Empty state messages
- Hover effects for interactivity

---

This application provides a complete, production-ready prototype for a tiffin service business with excellent user experience and admin management capabilities!
