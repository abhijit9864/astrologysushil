const express = require("express");
const router = express.Router();
const db = require("../config/db");
const razorpay = require("../config/razorpay");

router.post("/create-payment", (req, res) => {

  const { phone, plan, amount } = req.body;

  db.query(
    "SELECT id FROM users WHERE phone = ?",
    [phone],
    (err, userResult) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (userResult.length === 0) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      const userId = userResult[0].id;

      db.query(
        `INSERT INTO payments
        (user_id, amount, plan, status)
        VALUES (?, ?, ?, ?)`,
        [userId, amount, plan, "pending"],
        (err, result) => {

          if (err) {
            return res.status(500).json(err);
          }

          res.json({
            success: true,
            paymentId: result.insertId
          });

        }
      );

    }
  );

});
router.put("/payment-success/:paymentId", (req, res) => {

  const { paymentId } = req.params;

  db.query(
    "UPDATE payments SET status = 'paid' WHERE id = ?",
    [paymentId],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true,
        message: "Payment Updated"
      });

    }
  );

});

router.put("/activate-plan", (req, res) => {

  const { phone, plan } = req.body;

  db.query(
    `UPDATE users
     SET plan = ?, payment_status = 'paid'
     WHERE phone = ?`,
    [plan, phone],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true,
        message: "Plan Activated"
      });

    }
  );

});
router.post("/create-order", async (req, res) => {

  try {

    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Order creation failed"
    });
  }

});

module.exports = router;