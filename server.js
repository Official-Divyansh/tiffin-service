require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ─── PostgreSQL Connection ─────────────────────────────────────────────────────
// Configure using environment variables or defaults
console.log(process.env.DATABASE_URL, "AKJFBS");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // host: process.env.DB_HOST || "localhost",
  // port: process.env.DB_PORT || 5432,
  // database: process.env.DB_DATABASE || "tiffin_service",
  // user: process.env.DB_USERNAME || "postgres",
  // password: process.env.DB_PASSWORD || "postgres",

  ssl: {
    rejectUnauthorized: false, // must be true when using CA
    //   ca: fs.readFileSync('./certs/ca.pem').toString(),
  },

//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Error connecting to PostgreSQL:", err.stack);
  } else {
    console.log("✅ Connected to PostgreSQL database");
    release();
    initDatabase();
  }
});

// ─── Email Config ──────────────────────────────────────────────────────────────
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "your_email@ethereal.email",
    pass: process.env.SMTP_PASS || "your_email_password",
  },
};

const FROM_EMAIL =
  process.env.FROM_EMAIL || '"Ghar Ka Khana 🍱" <noreply@gharkhakhana.com>';
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || "admin@gharkhakhana.com";

let transporter;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport(EMAIL_CONFIG);
  }
  return transporter;
}

// ─── Plan → Days mapping ───────────────────────────────────────────────────────
const PLAN_DAYS = {
  "1 Week": 7,
  "2 Weeks": 14,
  "1 Month": 30,
  "3 Months": 90,
  "6 Months": 180,
};

function getEndDate(startDate, planType) {
  const days = PLAN_DAYS[planType] || 30;
  const end = new Date(startDate);
  end.setDate(end.getDate() + days);
  return end.toISOString().split("T")[0];
}

// ─── Email Templates ───────────────────────────────────────────────────────────
function buildRenewalEmail(booking, daysLeft) {
  const isExpiring = daysLeft <= 3;
  const urgencyColor = isExpiring ? "#e74c3c" : "#D97757";
  const urgencyText = isExpiring
    ? `⚠️ EXPIRING IN ${daysLeft} DAY${daysLeft === 1 ? "" : "S"}!`
    : `📅 ${daysLeft} days remaining`;

  return {
    from: FROM_EMAIL,
    to: booking.email,
    subject: `${
      isExpiring ? "🚨 Urgent: " : ""
    }Your Ghar Ka Khana Subscription Ends in ${daysLeft} Day${
      daysLeft === 1 ? "" : "s"
    }`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin:0; padding:0; background:#FFF9F0; font-family:'Georgia',serif; }
    .wrapper { max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
    .header { background:linear-gradient(135deg,#D97757,#C25A3B); padding:40px 32px; text-align:center; }
    .header-icon { font-size:56px; display:block; margin-bottom:12px; }
    .header h1 { color:#fff; margin:0; font-size:26px; font-weight:700; letter-spacing:-0.5px; }
    .header p { color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:14px; }
    .body { padding:36px 32px; }
    .greeting { font-size:18px; color:#2C2416; font-weight:600; margin-bottom:16px; }
    .message { color:#6B5D4F; font-size:15px; line-height:1.7; margin-bottom:24px; }
    .alert-box { background:linear-gradient(135deg,${urgencyColor}15,${urgencyColor}08); border-left:4px solid ${urgencyColor}; border-radius:8px; padding:18px 20px; margin:24px 0; }
    .alert-box .alert-title { color:${urgencyColor}; font-size:17px; font-weight:700; margin-bottom:6px; }
    .alert-box .alert-sub { color:#5a4a3a; font-size:14px; }
    .details-card { background:#FFF9F0; border-radius:12px; padding:20px 24px; margin:24px 0; border:1px solid rgba(139,111,71,0.15); }
    .details-card h3 { color:#D97757; font-size:15px; font-weight:700; margin:0 0 14px; text-transform:uppercase; letter-spacing:0.5px; }
    .detail-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(139,111,71,0.1); font-size:14px; }
    .detail-row:last-child { border-bottom:none; }
    .detail-label { color:#8B6F47; font-weight:600; }
    .detail-value { color:#2C2416; font-weight:500; }
    .cta-section { text-align:center; margin:32px 0; }
    .cta-btn { display:inline-block; background:linear-gradient(135deg,#D97757,#C25A3B); color:#fff; text-decoration:none; padding:14px 36px; border-radius:50px; font-size:16px; font-weight:700; letter-spacing:0.3px; box-shadow:0 4px 16px rgba(217,119,87,0.35); }
    .divider { height:1px; background:rgba(139,111,71,0.12); margin:24px 0; }
    .footer { background:#2C2416; padding:28px 32px; text-align:center; }
    .footer p { color:rgba(244,232,216,0.7); font-size:13px; margin:4px 0; }
    .footer .brand { color:#D97757; font-size:16px; font-weight:700; margin-bottom:8px; }
    .food-icons { font-size:24px; margin:8px 0; letter-spacing:6px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <span class="header-icon">🍱</span>
      <h1>Ghar Ka Khana</h1>
      <p>Home-Cooked Meals, Delivered with Love</p>
    </div>
    <div class="body">
      <div class="greeting">Dear ${booking.name},</div>
      <div class="message">
        We hope you've been enjoying your daily home-cooked tiffin meals! 
        This is a friendly reminder that your subscription is coming to an end soon.
        Don't let your delicious meal service lapse — renew today and keep enjoying 
        fresh, nutritious meals every day!
      </div>
      <div class="alert-box">
        <div class="alert-title">${urgencyText}</div>
        <div class="alert-sub">Your subscription ends on <strong>${getEndDate(
          booking.start_date,
          booking.plan_type
        )}</strong>. Renew now to avoid any interruption.</div>
      </div>
      <div class="details-card">
        <h3>📋 Your Subscription Details</h3>
        <div class="detail-row"><span class="detail-label">Plan</span><span class="detail-value">${
          booking.plan_type
        }</span></div>
        <div class="detail-row"><span class="detail-label">Meal Type</span><span class="detail-value">${
          booking.meal_type
        }</span></div>
        <div class="detail-row"><span class="detail-label">Started On</span><span class="detail-value">${
          booking.start_date
        }</span></div>
        <div class="detail-row"><span class="detail-label">Ends On</span><span class="detail-value">${getEndDate(
          booking.start_date,
          booking.plan_type
        )}</span></div>
        <div class="detail-row"><span class="detail-label">Delivery Address</span><span class="detail-value">${
          booking.address
        }</span></div>
      </div>
      <div class="cta-section">
        <a href="http://localhost:3000/#booking" class="cta-btn">🔄 Renew My Subscription</a>
      </div>
      <div class="divider"></div>
      <div class="message" style="font-size:14px; text-align:center;">
        Questions? Call us at <strong>+91 98765 43210</strong> or reply to this email.<br>
        We're available <strong>8 AM – 9 PM</strong>, 7 days a week.
      </div>
    </div>
    <div class="footer">
      <div class="brand">Ghar Ka Khana 🍱</div>
      <div class="food-icons">🥘 🫓 🍛 🥗 🍮</div>
      <p>Just Like Mom Made It!</p>
      <p style="margin-top:12px; font-size:11px; opacity:0.5;">You're receiving this because you subscribed to our tiffin service.<br>© 2025 Ghar Ka Khana. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
  };
}

// ─── Send Mail Helper ──────────────────────────────────────────────────────────
async function sendMail(mailOptions) {
  try {
    const info = await getTransporter().sendMail(mailOptions);
    console.log(
      `📧 Email sent to ${mailOptions.to} — MessageId: ${info.messageId}`
    );
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log("   Preview URL:", preview);
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: preview || null,
    };
  } catch (err) {
    console.error("❌ Email send error:", err.message);
    return { success: false, error: err.message };
  }
}

// ─── Database Initialization ───────────────────────────────────────────────────
async function initDatabase() {
  try {
    // Create bookings table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
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
            )
        `);
    console.log("✅ Bookings table ready");

    // Create call_requests table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS call_requests (
                id         SERIAL PRIMARY KEY,
                name       VARCHAR(255) NOT NULL,
                phone      VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    console.log("✅ Call requests table ready");

    // Create email_logs table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS email_logs (
                id         SERIAL PRIMARY KEY,
                booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
                days_left  INTEGER,
                status     VARCHAR(20),
                sent_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    console.log("✅ Email logs table ready");

    // Create indexes for better performance
    await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email) WHERE email IS NOT NULL;
            CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_email_logs_booking ON email_logs(booking_id);
        `);
    console.log("✅ Database indexes created");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  }
}

// ─── Subscription Expiry Checker (runs every day at 8 AM) ─────────────────────
cron.schedule("0 8 * * *", checkExpiringSubscriptions);
setTimeout(checkExpiringSubscriptions, 3000); // Also run once on startup

async function checkExpiringSubscriptions() {
  console.log("\n⏰ Running subscription expiry check…");

  try {
    const query = `SELECT * FROM bookings WHERE email IS NOT NULL AND email != ''`;
    const result = await pool.query(query);
    const bookings = result.rows;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const booking of bookings) {
      const endDate = new Date(
        getEndDate(booking.start_date, booking.plan_type)
      );
      endDate.setHours(0, 0, 0, 0);

      const diffMs = endDate - today;
      const daysLeft = Math.round(diffMs / (1000 * 60 * 60 * 24));

      let shouldSend = false;
      let flag = "";

      if (daysLeft === 7 && !booking.email_sent_7d) {
        shouldSend = true;
        flag = "email_sent_7d";
      } else if (daysLeft === 3 && !booking.email_sent_3d) {
        shouldSend = true;
        flag = "email_sent_3d";
      } else if (daysLeft === 1 && !booking.email_sent_1d) {
        shouldSend = true;
        flag = "email_sent_1d";
      }

      if (shouldSend) {
        console.log(
          `  → Sending renewal reminder to ${booking.email} (${daysLeft} days left)`
        );
        const mailResult = await sendMail(buildRenewalEmail(booking, daysLeft));

        // Mark flag
        await pool.query(`UPDATE bookings SET ${flag} = TRUE WHERE id = $1`, [
          booking.id,
        ]);

        // Log the email
        await pool.query(
          `INSERT INTO email_logs (booking_id, days_left, status) VALUES ($1, $2, $3)`,
          [booking.id, daysLeft, mailResult.success ? "sent" : "failed"]
        );
      }
    }

    console.log("✅ Subscription check complete.\n");
  } catch (err) {
    console.error("❌ Error in subscription check:", err);
  }
}

// ─── Manual trigger for testing ───────────────────────────────────────────────
app.post("/api/test-expiry-email/:id", async (req, res) => {
  const { id } = req.params;
  const daysLeft = parseInt(req.query.days) || 3;

  try {
    const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
      id,
    ]);
    const booking = result.rows[0];

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    if (!booking.email)
      return res
        .status(400)
        .json({ success: false, message: "No email on this booking" });

    const mailResult = await sendMail(buildRenewalEmail(booking, daysLeft));
    res.json({ success: mailResult.success, ...mailResult });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── API Routes ────────────────────────────────────────────────────────────────

// Create booking
app.post("/api/bookings", async (req, res) => {
  const {
    name,
    phone,
    email,
    address,
    meal_type,
    plan_type,
    start_date,
    notes,
  } = req.body;

  if (!name || !phone || !address || !meal_type || !plan_type || !start_date) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  try {
    const query = `
            INSERT INTO bookings (name, phone, email, address, meal_type, plan_type, start_date, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `;

    const result = await pool.query(query, [
      name,
      phone,
      email,
      address,
      meal_type,
      plan_type,
      start_date,
      notes,
    ]);
    const bookingId = result.rows[0].id;

    // Send booking confirmation email if email provided
    if (email) {
      const endDate = getEndDate(start_date, plan_type);
      const confirmMail = {
        from: FROM_EMAIL,
        to: email,
        subject: "✅ Booking Confirmed — Ghar Ka Khana",
        html: `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body{margin:0;padding:0;background:#FFF9F0;font-family:Georgia,serif;}
  .wrapper{max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);}
  .header{background:linear-gradient(135deg,#D97757,#C25A3B);padding:40px 32px;text-align:center;}
  .header h1{color:#fff;margin:0;font-size:26px;}
  .header p{color:rgba(255,255,255,.85);font-size:14px;margin:8px 0 0;}
  .body{padding:36px 32px;}
  .greeting{font-size:18px;color:#2C2416;font-weight:600;margin-bottom:12px;}
  .msg{color:#6B5D4F;font-size:15px;line-height:1.7;margin-bottom:20px;}
  .card{background:#FFF9F0;border-radius:12px;padding:20px 24px;margin:20px 0;border:1px solid rgba(139,111,71,.15);}
  .card h3{color:#D97757;font-size:14px;font-weight:700;margin:0 0 12px;text-transform:uppercase;letter-spacing:.5px;}
  .row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(139,111,71,.1);font-size:14px;}
  .row:last-child{border-bottom:none;}
  .lbl{color:#8B6F47;font-weight:600;}.val{color:#2C2416;}
  .footer{background:#2C2416;padding:24px 32px;text-align:center;}
  .footer p{color:rgba(244,232,216,.7);font-size:13px;margin:4px 0;}
  .brand{color:#D97757;font-size:16px;font-weight:700;margin-bottom:6px;}
</style></head><body>
<div class="wrapper">
  <div class="header"><h1>🍱 Ghar Ka Khana</h1><p>Booking Confirmed!</p></div>
  <div class="body">
    <div class="greeting">Namaste, ${name}! 🙏</div>
    <div class="msg">Your tiffin service has been successfully booked. Get ready to enjoy delicious home-cooked meals delivered fresh to your doorstep!</div>
    <div class="card">
      <h3>📋 Booking Details</h3>
      <div class="row"><span class="lbl">Meal Type</span><span class="val">${meal_type}</span></div>
      <div class="row"><span class="lbl">Plan</span><span class="val">${plan_type}</span></div>
      <div class="row"><span class="lbl">Start Date</span><span class="val">${start_date}</span></div>
      <div class="row"><span class="lbl">End Date</span><span class="val">${endDate}</span></div>
      <div class="row"><span class="lbl">Address</span><span class="val">${address}</span></div>
    </div>
    <div class="msg" style="text-align:center;font-size:14px;">📞 Questions? Call <strong>+91 98765 43210</strong></div>
  </div>
  <div class="footer"><div class="brand">Ghar Ka Khana 🍱</div><p>Just Like Mom Made It!</p><p style="font-size:11px;opacity:.5;margin-top:10px;">© 2025 Ghar Ka Khana. All rights reserved.</p></div>
</div></body></html>`,
      };
      await sendMail(confirmMail);
    }

    res.json({
      success: true,
      message: "Booking created successfully",
      bookingId,
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ success: false, message: "Error creating booking" });
  }
});

// Create call request
app.post("/api/call-requests", async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone)
    return res.status(400).json({
      success: false,
      message: "Please provide name and phone number",
    });

  try {
    const result = await pool.query(
      `INSERT INTO call_requests (name, phone) VALUES ($1, $2) RETURNING id`,
      [name, phone]
    );
    res.json({
      success: true,
      message: "Call request created successfully",
      requestId: result.rows[0].id,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error creating call request" });
  }
});

// Get all bookings (Admin)
app.get("/api/bookings", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM bookings ORDER BY created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching bookings" });
  }
});

// Get all call requests (Admin)
app.get("/api/call-requests", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM call_requests ORDER BY created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching call requests" });
  }
});

// Get email logs (Admin)
app.get("/api/email-logs", async (req, res) => {
  try {
    const query = `
            SELECT el.*, b.name, b.email FROM email_logs el
            LEFT JOIN bookings b ON el.booking_id = b.id
            ORDER BY el.sent_at DESC LIMIT 50
        `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching logs" });
  }
});

// Stats
app.get("/api/stats", async (req, res) => {
  try {
    const stats = {};

    const totalBookings = await pool.query(
      `SELECT COUNT(*) as count FROM bookings`
    );
    stats.totalBookings = parseInt(totalBookings.rows[0].count);

    const totalCallRequests = await pool.query(
      `SELECT COUNT(*) as count FROM call_requests`
    );
    stats.totalCallRequests = parseInt(totalCallRequests.rows[0].count);

    const todayBookings = await pool.query(
      `SELECT COUNT(*) as count FROM bookings WHERE DATE(created_at) = CURRENT_DATE`
    );
    stats.todayBookings = parseInt(todayBookings.rows[0].count);

    const todayCallRequests = await pool.query(
      `SELECT COUNT(*) as count FROM call_requests WHERE DATE(created_at) = CURRENT_DATE`
    );
    stats.todayCallRequests = parseInt(todayCallRequests.rows[0].count);

    const emailsSent = await pool.query(
      `SELECT COUNT(*) as count FROM email_logs WHERE status = 'sent'`
    );
    stats.emailsSent = parseInt(emailsSent.rows[0].count);

    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
});

// Delete booking
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM bookings WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting booking" });
  }
});

// Delete call request
app.delete("/api/call-requests/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM call_requests WHERE id = $1`, [
      req.params.id,
    ]);
    res.json({ success: true, message: "Call request deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting call request" });
  }
});

// Pages
app.get("/admin", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "admin.html"))
);
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

// Start
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Website : http://localhost:${PORT}`);
  console.log(`👨‍💼 Admin   : http://localhost:${PORT}/admin`);
  console.log(`📧 Email check runs daily at 8:00 AM\n`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await pool.end();
  console.log("✅ Database connections closed");
  process.exit(0);
});
