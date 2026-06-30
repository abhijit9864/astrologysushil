const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/check-user", (req, res) => {
  const { phone } = req.body;

  db.query(
    "SELECT * FROM users WHERE phone = ?",
    [phone],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.json({
          exists: false,
          freeChatUsed: false,
        });
      }

      return res.json({
        exists: true,
        freeChatUsed: result[0].free_chat_used,
        id: result[0].id,
      });
    }
  );
});
router.post("/register-user", (req, res) => {
  const { name, phone } = req.body;

  db.query(
    "SELECT * FROM users WHERE phone = ?",
    [phone],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length > 0) {
        return res.json({
          success: true,
          message: "User already exists",
          id: result[0].id,
        });
      }

      db.query(
        "INSERT INTO users(name, phone) VALUES(?, ?)",
        [name, phone],
        (err, insertResult) => {
          if (err) {
            return res.status(500).json(err);
          }

          res.json({
            success: true,
            message: "User registered",
            id: insertResult.insertId,
          });
        }
      );
    }
  );
});

router.put("/free-chat-used/:phone", (req, res) => {

  const { phone } = req.params;

  db.query(
    "UPDATE users SET free_chat_used = true WHERE phone = ?",
    [phone],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true
      });

    }
  );

});

module.exports = router;