const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Send Message
router.post("/send-message", (req, res) => {
  const { phone, message, sender = "user" } = req.body;
  const normalizedSender = sender === "admin" ? "admin" : "user";

  db.query(
    "SELECT id FROM users WHERE phone = ?",
    [phone],
    (err, userResult) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (userResult.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const userId = userResult[0].id;

      db.query(
        `INSERT INTO messages
        (user_id, sender, message)
        VALUES (?, ?, ?)`,
        [userId, normalizedSender, message],
        (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }

          const newMessage = {
            id: result.insertId,
            user_id: userId,
            sender: normalizedSender,
            message,
            created_at: new Date(),
          };

          const io = req.app.get("io");
          if (io) {
            io.to(String(userId)).emit("receive-message", newMessage);

            if (normalizedSender === "user") {
              io.to("admin").emit("user-message-notification", {
                userId,
                phone,
                message,
                created_at: newMessage.created_at,
              });
            }
          }

          res.json({
            success: true,
            message: newMessage,
          });
        }
      );
    }
  );
});

// Get Messages
router.get("/messages/:phone", (req, res) => {
  const { phone } = req.params;

  db.query(
    "SELECT id FROM users WHERE phone=?",
    [phone],
    (err, userResult) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (userResult.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const userId = userResult[0].id;

      db.query(
        `SELECT id, sender, message, created_at
         FROM messages
         WHERE user_id=?
         ORDER BY created_at ASC`,
        [userId],
        (err, messages) => {
          if (err) {
            return res.status(500).json(err);
          }

          res.json(messages);
        }
      );
    }
  );
});

module.exports = router;