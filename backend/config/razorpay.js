const Razorpay = require("razorpay");

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.warn("Razorpay credentials not configured. Payment routes will be unavailable until env vars are set.");
}

const razorpay = keyId && keySecret
  ? new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  : {
      orders: {
        create: async () => {
          throw new Error("Razorpay not configured");
        },
      },
    };

module.exports = razorpay;