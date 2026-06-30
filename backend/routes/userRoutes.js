const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/consultation-request", (req, res) => {
  const { name, phone, dob, birthTime, birthPlace, service, problem } = req.body;

  if (!name || !phone || !dob || !birthTime || !birthPlace || !service || !problem) {
    return res.status(400).json({ success: false, message: "Please complete all required fields." });
  }

  const values = [name, phone, dob, birthTime, birthPlace, service, problem];

  db.query(
    "INSERT INTO consultation_requests (name, phone, dob, birth_time, birth_place, service, problem) VALUES (?, ?, ?, ?, ?, ?, ?)",
    values,
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Unable to save consultation request." });
      }

      db.query(
        "INSERT INTO users (name, phone, dob, birth_time, birth_place, service, problem, plan, payment_status, chat_status) VALUES (?, ?, ?, ?, ?, ?, ?, 'lead', 'pending', 'new')",
        values,
        (userErr) => {
          if (userErr) {
            console.error("Failed to sync lead to users table", userErr);
          }
        }
      );

      res.json({ success: true, id: result.insertId, message: "Consultation request received." });
    }
  );
});

module.exports = router;