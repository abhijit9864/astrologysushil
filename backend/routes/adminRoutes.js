const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const db = require("../config/db");
const { sign, verify } = require("../utils/jwt");

function hashPassword(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function verifyPassword(input, stored) {
  return hashPassword(input) === stored || input === stored;
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verify(token);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

router.post("/admin/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM admin WHERE email = ? LIMIT 1",
    [email],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0 || !verifyPassword(password, result[0].password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const admin = result[0];
      const token = sign({ id: admin.id, email: admin.email, name: admin.name });
      res.json({ success: true, token, admin: { id: admin.id, name: admin.name, email: admin.email } });
    }
  );
});

router.get("/admin/profile", authMiddleware, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

router.get("/admin/dashboard", authMiddleware, (req, res) => {
  db.query(
    `SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()) AS todayUsers,
      (SELECT COUNT(*) FROM users WHERE plan = 'premium') AS premiumUsers,
      (SELECT COUNT(*) FROM users WHERE plan = 'basic') AS basicUsers,
      (SELECT COUNT(*) FROM users WHERE payment_status = 'paid') AS activeChats,
      (SELECT COUNT(*) FROM users WHERE payment_status = 'expired') AS expiredChats,
      (SELECT COUNT(*) FROM payments) AS totalPayments,
      (SELECT COALESCE(SUM(amount),0) FROM payments WHERE DATE(created_at) = CURDATE()) AS todayRevenue,
      (SELECT COALESCE(SUM(amount),0) FROM payments WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE())) AS monthlyRevenue,
      (SELECT COUNT(*) FROM messages WHERE sender='user') AS unreadChats`,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      const analytics = result[0];
      res.json({ success: true, analytics });
    }
  );
});

router.get("/admin/users", authMiddleware, (req, res) => {
  const sql = `SELECT id, name, phone, plan, payment_status, free_chat_used, created_at FROM users ORDER BY created_at DESC`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ success: true, users: result });
  });
});

router.get("/admin/users/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, user: result[0] });
  });
});

router.get("/admin/chats", authMiddleware, (req, res) => {
  const sql = `SELECT u.id, u.name, u.phone, u.plan, COUNT(m.id) AS messageCount
               FROM users u
               LEFT JOIN messages m ON m.user_id = u.id
               GROUP BY u.id, u.name, u.phone, u.plan
               ORDER BY u.id DESC`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ success: true, chats: result });
  });
});

router.get("/admin/payments", authMiddleware, (req, res) => {
  const sql = `SELECT p.id, p.amount, p.plan, p.status, p.created_at, p.razorpay_payment_id, u.name, u.phone
               FROM payments p
               LEFT JOIN users u ON p.user_id = u.id
               ORDER BY p.created_at DESC`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ success: true, payments: result });
  });
});

router.get("/admin/notifications", authMiddleware, (req, res) => {
  db.query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ success: true, notifications: result });
  });
});

router.post("/admin/notifications", authMiddleware, (req, res) => {
  const { title, message, target } = req.body;
  db.query("INSERT INTO notifications (title, message, target) VALUES (?, ?, ?)", [title, message, target], (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ success: true, message: "Notification created" });
  });
});

router.get("/admin/reports", authMiddleware, (req, res) => {
  db.query(
    `SELECT
      (SELECT COALESCE(SUM(amount),0) FROM payments WHERE DATE(created_at)=CURDATE()) AS dailyRevenue,
      (SELECT COALESCE(SUM(amount),0) FROM payments WHERE WEEK(created_at)=WEEK(CURDATE())) AS weeklyRevenue,
      (SELECT COALESCE(SUM(amount),0) FROM payments WHERE MONTH(created_at)=MONTH(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE())) AS monthlyRevenue,
      (SELECT COUNT(*) FROM messages WHERE sender='user') AS totalChats,
      (SELECT plan FROM payments GROUP BY plan ORDER BY COUNT(*) DESC LIMIT 1) AS mostPurchasedPlan`,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ success: true, reports: result[0] });
    }
  );
});

module.exports = router;
