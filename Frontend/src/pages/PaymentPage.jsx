import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/payment.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {

  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState("");

  const handleContinue = async () => {

    if (!selectedPlan) {
      alert("Please select a plan");
      return;
    }

    try {

      const chatUser = JSON.parse(
        localStorage.getItem("chatUser")
      );

      const amount =
        selectedPlan === "basic"
          ? 199
          : 499;

      await axios.post(
        "http://localhost:5000/api/create-payment",
        {
          phone: chatUser.phone,
          plan: selectedPlan,
          amount,
        }
      );

      navigate("/payment-success");

    } catch (error) {
      console.log(error);
      alert("Payment creation failed");
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

            <h2>₹199</h2>

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

            <h2>₹499</h2>

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