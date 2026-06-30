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

router.get("/consultation-state/:phone", (req, res) => {
  const { phone } = req.params;

  db.query(
    "SELECT id, chat_status, chat_start_time, chat_end_time, plan, payment_status, free_chat_used FROM users WHERE phone = ?",
    [phone],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = result[0];
      const now = Date.now();
      const endTime = user.chat_end_time ? new Date(user.chat_end_time).getTime() : null;
      const isActive = user.chat_status === "live" && endTime && endTime > now;
      const remainingSeconds = isActive ? Math.max(0, Math.ceil((endTime - now) / 1000)) : 0;

      if (!isActive && user.chat_status === "live") {
        db.query("UPDATE users SET chat_status = 'expired', free_chat_used = 1 WHERE id = ?", [user.id], () => {});
      }

      res.json({
        success: true,
        consultation: {
          status: isActive ? "live" : (user.chat_status || "waiting"),
          remainingSeconds,
          chatStartTime: user.chat_start_time,
          chatEndTime: user.chat_end_time,
          plan: user.plan,
          paymentStatus: user.payment_status,
          freeChatUsed: Boolean(user.free_chat_used),
        },
      });
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