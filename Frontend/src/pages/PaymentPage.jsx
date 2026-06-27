import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/payment.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PaymentPage = () => {

  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState("");

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const rawUser = localStorage.getItem("chatUser");
      if (!rawUser) return;

      try {
        const chatUser = JSON.parse(rawUser);
        if (!chatUser?.phone) return;

        const { data } = await axios.post(
          "http://localhost:5000/api/check-payment",
          {
            phone: chatUser.phone,
          }
        );
        if (data?.paid) {
          // If already paid, redirect to payment success to avoid duplicate payments
          navigate("/payment-success", { replace: true });
          return;
        }
        
      } catch (err) {
        console.log("Payment status check failed:", err);
      }
    };

    checkPaymentStatus();
  }, [navigate]);

  const handleContinue = async () => {
  if (!selectedPlan) {
    Swal.fire({
      icon: "warning",
      title: "Select Plan",
      text: "Please select a consultation plan.",
    });
    return;
  }

  try {
    const chatUser = JSON.parse(localStorage.getItem("chatUser"));

    const amount = selectedPlan === "basic" ? 303 : 501;

    // Save payment in DB
    // const paymentRes = await axios.post(
    //   "http://localhost:5000/api/create-payment",
    //   {
    //     phone: chatUser.phone,
    //     plan: selectedPlan,
    //     amount,
    //   }
    // );

        const paymentRes = await axios.post(
          "http://localhost:5000/api/create-payment",
          {
            phone: chatUser.phone,
            plan: selectedPlan,
            amount,
          }
        );

        if (paymentRes.data.alreadyPaid) {
          // populate lastPayment for success page
          const check = await axios.post("http://localhost:5000/api/check-payment", { phone: chatUser.phone });
          const lastPayment = {
            plan: check.data.plan || selectedPlan,
            amount: check.data.plan === "basic" ? 303 : 501,
            paymentId: null,
          };
          localStorage.setItem("lastPayment", JSON.stringify(lastPayment));
          navigate("/payment-success", { replace: true });
          return;
        }

        const paymentId = paymentRes.data.paymentId;

        // store pending payment info for success page
        localStorage.setItem(
          "lastPayment",
          JSON.stringify({ plan: selectedPlan, amount, paymentId })
        );

    // Create Razorpay Order
    const { data: order } = await axios.post(
      "http://localhost:5000/api/create-order",
      {
        amount,
      }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: order.amount,

      currency: order.currency,

      order_id: order.id,

      name: "Astrologer Sushil Kumar",

      description: "Astrology Consultation",

      image: "/logo.png",

      prefill: {
        name: chatUser.name,
        contact: chatUser.phone,
      },

      notes: {
        plan: selectedPlan,
      },

      theme: {
        color: "#D4AF37",
      },

//       handler: async function (response) {

//   await axios.post(
//     "http://localhost:5000/api/verify-payment",
//     {

//       razorpay_order_id:
//         response.razorpay_order_id,

//       razorpay_payment_id:
//         response.razorpay_payment_id,

//       razorpay_signature:
//         response.razorpay_signature,

//       paymentId,

//       phone: chatUser.phone,

//       plan: selectedPlan,

//     }
//   );

//   await Swal.fire({
//     icon: "success",
//     title: "Payment Successful 🎉",
//     text: "Your plan has been activated.",
//     confirmButtonColor: "#D4AF37",
//   });

//   navigate("/payment-success");

// },

      handler: async function (response) {

  try {

    const verify = await axios.post(
      "http://localhost:5000/api/verify-payment",
      {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        paymentId,
        phone: chatUser.phone,
        plan: selectedPlan,
      }
    );

    console.log(verify.data);

    await Swal.fire({
      icon: "success",
      title: "Payment Successful!",
      text: "Our astrologer will contact you shortly on WhatsApp.",
      timer: 2000,
      showConfirmButton: false,
      allowOutsideClick: false,
      timerProgressBar: true,
    });

    setTimeout(() => {
      navigate("/payment-success", { replace: true });
    }, 2000);

  } catch (err) {

    console.log(err);

    Swal.fire({
      icon: "error",
      title: "Verification Failed",
      text: "Payment completed but verification failed.",
    });

  }

},
     
modal: {
        ondismiss: function () {
          console.log("Payment Cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {

      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: response.error.description,
      });

    });

    rzp.open();

  } catch (error) {

    console.log(error);

    Swal.fire({
      icon: "error",
      title: "Something Went Wrong",
      text: "Please try again later.",
    });

  }
};

return (
    <>
      <Navbar />

      <section className="payment-page">

        <div className="payment-header">

          <span className="payment-badge">
            Consultation Plans
          </span>

          <h1>
            Continue Your Consultation
          </h1>

          <p>
            Choose a plan to continue your astrology consultation.
          </p>

        </div>

        <div className="plans-container">

          <div
            className={`payment-card ${
              selectedPlan === "basic"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              setSelectedPlan("basic")
            }
          >
            <h3>Basic Consultation</h3>

            <h2>₹303</h2>

            <ul>
              <li>✓ One Session Chat</li>
              <li>✓ Astrology Guidance</li>
              <li>✓ Problem Discussion</li>
              <li>✓ Chat Support</li>
            </ul>
          </div>

          <div
            className={`payment-card premium ${
              selectedPlan === "premium"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              setSelectedPlan("premium")
            }
          >
            <div className="popular-tag">
              MOST POPULAR
            </div>

            <h3>Premium Membership</h3>

            <h2>₹501</h2>

            <ul>
              <li>✓ Lifetime Support</li>
              <li>✓ WhatsApp Access</li>
              <li>✓ Priority Response</li>
              <li>✓ Existing Client Benefits</li>
              <li>✓ Office Visit Support</li>
            </ul>
          </div>

        </div>

        <div className="payment-action">

          <button
            onClick={handleContinue}
          >
            Continue Payment
          </button>

        </div>

      </section>

      <Footer />
    </>
  );
};

export default PaymentPage;