import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/chat.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(120);
  const [isLocked, setIsLocked] = useState(false);
  const [message, setMessage] = useState("");

 useEffect(() => {

  const handleTimerEnd = async () => {

    try {

      const chatUser = JSON.parse(
        localStorage.getItem("chatUser")
      );

      if (chatUser) {

        await axios.put(
          `http://localhost:5000/api/free-chat-used/${chatUser.phone}`
        );

      }

      setIsLocked(true);

      setTimeout(() => {
        navigate("/payment");
      }, 3000);

    } catch (error) {
      console.log(error);
    }

  };

  if (timeLeft <= 0) {
    handleTimerEnd();
    return;
  }

  const timer = setInterval(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);

}, [timeLeft, navigate]);
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  

  return (
    <>
      <Navbar />

      <section className="chat-page">

        <div className="chat-container">

          <div className="chat-header">

            <div className="astrologer-info">
              <div className="online-dot"></div>

              <div>
                <h2>Astrologer Sushil Kumar</h2>
                <p>Free Consultation</p>
              </div>
            </div>

            <div className="timer-box">
              {minutes}:{seconds}
            </div>

          </div>

          <div className={`chat-body ${isLocked ? "blur-chat" : ""}`}>

            <div className="message astrologer">
              🙏 Namaskar, How can I help you today?
            </div>

            <div className="message client">
              Sir, I need guidance regarding my career.
            </div>

            <div className="message astrologer">
              Please tell me your age and education.
            </div>

          </div>

          {!isLocked && (
            <div className="chat-input-area">

              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button>
                Send
              </button>

            </div>
          )}

          {isLocked && (
            <div className="payment-popup">

              <h2>🔒 Free Chat Ended</h2>

              <p>
                Your 2-minute free consultation has expired.
              </p>

              <div className="plan-box">

                <div className="plan-card" onClick={() => navigate("/payment")}>
                  <h3>₹199</h3>
                  <p>Basic Consultation</p>
                </div>

                <div className="plan-card premium" onClick={() => navigate("/payment")}>
                  <h3>₹499</h3>
                  <p>Premium Membership</p>
                </div>

              </div>

            </div>
          )}

        </div>

      </section>

      <Footer />
    </>
  );
};

export default ChatPage;