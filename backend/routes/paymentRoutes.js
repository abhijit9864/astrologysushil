const express = require("express");
const router = express.Router();
const db = require("../config/db");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

router.post("/create-payment", (req, res) => {
  const { phone, plan, amount } = req.body;

  db.query(
    "SELECT id, payment_status, plan, chat_end_time FROM users WHERE phone = ?",
    [phone],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const user = result[0];
      const now = new Date();
      const activeBasic =
        user.payment_status === "paid" &&
        user.plan === "basic" &&
        user.chat_end_time &&
        new Date(user.chat_end_time) > now;

      if (user.payment_status === "paid" && user.plan === "premium") {
        return res.json({ alreadyPaid: true });
      }

      if (activeBasic) {
        return res.json({ alreadyPaid: true });
      }

      const userId = user.id;

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
            paymentId: result.insertId,
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

router.post("/verify-payment", (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
      phone,
      plan,
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }

    db.query(
      "UPDATE payments SET status='paid', razorpay_payment_id=? WHERE id=?",
      [razorpay_payment_id, paymentId],
      (err) => {
        if (err) return res.status(500).json(err);

        // After payment, do not provide any temporary chat window — keep chat_end_time NULL
        const updateSql = `UPDATE users SET payment_status='paid', plan=?, chat_end_time=NULL WHERE phone=?`;

        db.query(updateSql, [plan, phone], (err) => {
          if (err) return res.status(500).json(err);

          res.json({
            success: true,
          });
        });
      }
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
    });

  }
});

router.post("/check-plan",(req,res)=>{

const {phone}=req.body;

db.query(

"SELECT payment_status,plan FROM users WHERE phone=?",

[phone],

(err,result)=>{

if(err)return res.status(500).json(err);

if(result.length==0){

return res.json({
paid:false
});

}

res.json({

paid:result[0].payment_status==="paid",

plan:result[0].plan

});

});

});

router.post("/check-payment", (req, res) => {
  const { phone } = req.body;

  db.query(
    "SELECT payment_status, plan, chat_end_time FROM users WHERE phone = ?",
    [phone],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.json({
          paid: false,
        });
      }

      res.json({
        paid: result[0].payment_status === "paid",
        plan: result[0].plan,
        chat_end_time: result[0].chat_end_time,
      });
    }
  );
});

module.exports = router;