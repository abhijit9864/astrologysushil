require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoutes);
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

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      dob DATE NULL,
      birth_time VARCHAR(20) NULL,
      birth_place VARCHAR(100) NULL,
      service VARCHAR(100) NULL,
      problem TEXT NULL,
      plan VARCHAR(50) DEFAULT 'lead',
      payment_status VARCHAR(20) DEFAULT 'pending',
      free_chat_used TINYINT(1) DEFAULT 0,
      chat_status VARCHAR(20) DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createConsultationRequestsTable = `
    CREATE TABLE IF NOT EXISTS consultation_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      dob DATE NULL,
      birth_time VARCHAR(20) NULL,
      birth_place VARCHAR(100) NULL,
      service VARCHAR(100) NULL,
      problem TEXT NULL,
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

  db.query(createUsersTable, (err) => {
    if (err) {
      console.error("Users table init error", err);
    }
  });

  db.query(createConsultationRequestsTable, (err) => {
    if (err) {
      console.error("Consultation requests table init error", err);
    }
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