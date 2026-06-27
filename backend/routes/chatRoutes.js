const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Send Message
router.post("/send-message", (req, res) => {

  const { phone, message } = req.body;

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
        [userId, "user", message],
        (err, result) => {

          if (err) {
            return res.status(500).json(err);
          }

          res.json({
            success: true,
            messageId: result.insertId,
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
        `SELECT sender, message, created_at
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