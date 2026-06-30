import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/paymentSuccess.css";
import axios from "axios";
import API_BASE_URL from "../config/api";

const OWNER_NUMBER = import.meta.env.VITE_OWNER_NUMBER || "+917377237360";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [chatUser, setChatUser] = useState(null);
  const [lastPayment, setLastPayment] = useState(null);
  const [lastUserMessage, setLastUserMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const rawUser = localStorage.getItem("chatUser");
      if (rawUser) setChatUser(JSON.parse(rawUser));

      const lp = localStorage.getItem("lastPayment");
      if (lp) {
        setLastPayment(JSON.parse(lp));
      } else if (rawUser) {
        // Fallback: query server for plan
        try {
          const { phone } = JSON.parse(rawUser);
          const { data } = await axios.post(`${API_BASE_URL}/api/check-payment`, { phone });
          setLastPayment({ plan: data.plan, amount: data.plan === "basic" ? 303 : 501 });
        } catch (err) {
          console.log(err);
        }
      }

      // fetch last user message
      try {
        if (rawUser) {
          const { phone } = JSON.parse(rawUser);
          const { data } = await axios.get(`${API_BASE_URL}/api/messages/${phone}`);
          if (Array.isArray(data) && data.length) {
            const last = [...data].reverse().find((m) => m.sender === "user");
            setLastUserMessage(last ? last.message : "");
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, []);

  const planLabel = lastPayment?.plan === "basic" ? "Basic Consultation" : "Premium Consultation";
  const amountLabel = lastPayment?.amount ? `₹${lastPayment.amount}` : "";

  const buildMessage = () => {
    const name = chatUser?.name || "";
    const phone = chatUser?.phone || "";
    const dob = chatUser?.dob || "";
    const tob = chatUser?.timeOfBirth || "";
    const pob = chatUser?.placeOfBirth || "";

    if (lastPayment?.plan === "basic") {
      return `Namaste Pandit Ji.\n\nI have successfully paid ₹303.\n\nMy Details:\nName: ${name}\nPhone: ${phone}\nDate of Birth: ${dob}\nTime of Birth: ${tob}\nPlace of Birth: ${pob}\n\nMy Problem:\n${lastUserMessage}\n\nI request a consultation.`;
    }

    // premium
    return `Namaste Pandit Ji.\n\nI have successfully paid ₹501 (Premium Consultation).\n\nMy Details:\nName: ${name}\nPhone: ${phone}\nDate of Birth: ${dob}\nTime of Birth: ${tob}\nPlace of Birth: ${pob}\n\nI will also share my Kundali.\n\nMy Problem:\n${lastUserMessage}\n\nPlease guide me.`;
  };

  const waLink = `https://wa.me/${OWNER_NUMBER.replace(/\+/g, "")}?text=${encodeURIComponent(buildMessage())}`;

  return (
    <>
      <Navbar />

      <section className="success-page">

        <div className="success-card">

          <div className="success-icon">✅</div>

          <h1>Payment Successful</h1>

          <p>
            Thank you for your payment. Your consultation request has been submitted.
          </p>

          <div className="plan-info">

            <div className="info-row">
              <span>Plan</span>
              <strong>{planLabel}</strong>
            </div>

            <div className="info-row">
              <span>Amount</span>
              <strong>{amountLabel}</strong>
            </div>

            <div className="info-row">
              <span>Contact</span>
              <strong>{OWNER_NUMBER}</strong>
            </div>

          </div>

          <a href={waLink} target="_blank" rel="noreferrer" className="whatsapp-btn">
            Open WhatsApp
          </a>

          <a href={`tel:${OWNER_NUMBER}`} className="call-btn">
            Call Now
          </a>

          <Link to="/" className="home-btn">Go Home</Link>

        </div>

      </section>

      <Footer />
    </>
  );
};

export default PaymentSuccess;