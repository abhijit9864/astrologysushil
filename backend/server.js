require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", paymentRoutes);
app.use("/api", chatRoutes);
app.use("/api", adminRoutes);

function initializeDatabase() {
  const createAdminTable = `
    CREATE TABLE IF NOT EXISTS admin (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createNotificationsTable = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      message TEXT NOT NULL,
      target VARCHAR(50) DEFAULT 'all',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createAdminTable, (err) => {
    if (err) {
      console.error("Admin table init error", err);
      return;
    }

    db.query("SELECT COUNT(*) AS count FROM admin", (err, result) => {
      if (err) {
        console.error("Admin seed check error", err);
        return;
      }

      if (result[0].count === 0) {
        const crypto = require("crypto");
        const passwordHash = crypto.createHash("sha256").update("admin123").digest("hex");
        db.query(
          "INSERT INTO admin (name, email, password) VALUES (?, ?, ?)",
          ["Super Admin", "admin@astrology.com", passwordHash],
          (insertErr) => {
            if (!insertErr) {
              console.log("Default admin created");
            }
          }
        );
      }
    });
  });

  db.query(createNotificationsTable, (err) => {
    if (err) {
      console.error("Notifications table init error", err);
    }
  });
}

initializeDatabase();

app.listen(5000, () => {
  console.log("Server Running on 5000");
});