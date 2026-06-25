import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/paymentSuccess.css";

const PaymentSuccess = () => {
  return (
    <>
      <Navbar />

      <section className="success-page">

        <div className="success-card">

          <div className="success-icon">
            ✅
          </div>

          <h1>Payment Successful</h1>

          <p>
            Thank you for choosing Adhyatma Jyotish.
            Your consultation plan has been activated.
          </p>

          <div className="plan-info">

            <div className="info-row">
              <span>Plan</span>
              <strong>Premium Membership</strong>
            </div>

            <div className="info-row">
              <span>Reference ID</span>
              <strong>#AST2026001</strong>
            </div>

            <div className="info-row">
              <span>Contact Number</span>
              <strong>+91 7377237360</strong>
            </div>

          </div>

          <a
            href="https://wa.me/917377237360"
            target="_blank"
            rel="noreferrer"
            className="whatsapp-btn"
          >
            Continue on WhatsApp
          </a>

          <Link
            to="/"
            className="home-btn"
          >
            Back to Home
          </Link>

        </div>

      </section>

      <Footer />
    </>
  );
};

export default PaymentSuccess;