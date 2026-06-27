import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/chat.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FREE_CHAT_DURATION = 120;
const CHAT_START_KEY = "chatStartTime";

const ChatPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(FREE_CHAT_DURATION);
  const [isLocked, setIsLocked] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userPlan, setUserPlan] = useState("free");
  const [chatEndTime, setChatEndTime] = useState(null);
  const timerEndHandledRef = useRef(false);

  const loadMessages = async () => {
    try {
      const chatUser = JSON.parse(localStorage.getItem("chatUser"));
      if (!chatUser) return;
      const { data } = await axios.get(
        `http://localhost:5000/api/messages/${chatUser.phone}`
      );
      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadChatState = async () => {
    try {
      const rawUser = localStorage.getItem("chatUser");
      if (!rawUser) return;
      const chatUser = JSON.parse(rawUser);
      if (!chatUser?.phone) return;

      const { data } = await axios.post("http://localhost:5000/api/check-payment", {
        phone: chatUser.phone,
      });

      if (data?.paid && data.plan === "premium") {
        setUserPlan("premium");
        setChatEndTime(null);
        // After payment, keep chat locked; consultation happens via WhatsApp/phone
        setIsLocked(true);
        localStorage.removeItem(CHAT_START_KEY);
        setTimeLeft(0);
        return;
      }

      if (data?.paid && data.plan === "basic") {
        setUserPlan("basic");
        setChatEndTime(data.chat_end_time || null);
        // After payment, keep chat locked
        setIsLocked(true);
        localStorage.removeItem(CHAT_START_KEY);
        return;
      }

      setUserPlan("free");
      setChatEndTime(null);
      setIsLocked(false);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isLocked) return;
    try {
      const chatUser = JSON.parse(localStorage.getItem("chatUser"));
      if (!chatUser) return;
      await axios.post("http://localhost:5000/api/send-message", {
        phone: chatUser.phone,
        message,
      });
      setMessage("");
      loadMessages();
    } catch (error) {
      console.log(error);
    }
  };

  const getFreeStartTime = () => {
    const stored = localStorage.getItem(CHAT_START_KEY);
    return stored && !Number.isNaN(Number(stored)) ? Number(stored) : null;
  };

  const setFreeStartTime = () => {
    const now = Date.now();
    localStorage.setItem(CHAT_START_KEY, String(now));
    return now;
  };

  const getRemainingFreeSeconds = (startTime) => {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    return Math.max(0, FREE_CHAT_DURATION - elapsed);
  };

  const getRemainingBasicSeconds = (endTime) => {
    if (!endTime) return 0;
    const expiresAt = new Date(endTime).getTime();
    return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  };

  const handleFreeChatEnd = async () => {
    if (timerEndHandledRef.current) return;
    timerEndHandledRef.current = true;

    try {
      const chatUser = JSON.parse(localStorage.getItem("chatUser"));
      if (chatUser) {
        await axios.put(`http://localhost:5000/api/free-chat-used/${chatUser.phone}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem(CHAT_START_KEY);
      setIsLocked(true);
      setTimeout(() => {
        navigate("/payment");
      }, 3000);
    }
  };

  const handleBasicChatEnd = () => {
    if (timerEndHandledRef.current) return;
    timerEndHandledRef.current = true;
    setIsLocked(true);
    setTimeout(() => {
      navigate("/payment");
    }, 3000);
  };

  useEffect(() => {
    loadChatState();
    loadMessages();
  }, []);

  useEffect(() => {
    let timerId;

    if (userPlan === "premium") {
      setTimeLeft(0);
      return () => {
        if (timerId) clearInterval(timerId);
      };
    }

    if (userPlan === "basic") {
      const updateTime = () => {
        const remaining = getRemainingBasicSeconds(chatEndTime);
        setTimeLeft(remaining);
      };

      updateTime();
      timerId = setInterval(updateTime, 1000);
      return () => clearInterval(timerId);
    }

    const startTime = getFreeStartTime() || setFreeStartTime();
    const updateTime = () => {
      const remaining = getRemainingFreeSeconds(startTime);
      setTimeLeft(remaining);
    };

    updateTime();
    timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, [userPlan, chatEndTime]);

  useEffect(() => {
    if (userPlan === "premium") return;

    if (userPlan === "basic") {
      if (timeLeft === 0 && !isLocked) {
        handleBasicChatEnd();
      }
      return;
    }

    if (timeLeft === 0 && !isLocked) {
      handleFreeChatEnd();
    }
  }, [timeLeft, userPlan, isLocked]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const isPremium = userPlan === "premium";
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
              {isPremium ? "🟢 Premium Member" : `${minutes}:${seconds}`}
            </div>
          </div>

          <div className={`chat-body ${isLocked ? "blur-chat" : ""}`}>
            <div className="message astrologer">
              🙏 Namaskar! Welcome to Astrologer Sushil Kumar's Consultation.
            </div>

            <div className="message astrologer">
              I am <strong>Pandit Sushil Kumar</strong>.
              <br />
              <br />
              Please share:
              <br />
              <br />
              • Full Name
              <br />
              • Date of Birth
              <br />
              • Time of Birth
              <br />
              • Place of Birth
              <br />
              <br />
              Then tell me how I can help you today.
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.sender === "user" ? "message client" : "message astrologer"
                }
              >
                {msg.message}
              </div>
            ))}
          </div>

          {!isLocked && (
            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          )}

          {isLocked && (
            <div className="payment-popup">
              <h2>🔒 Free Chat Ended</h2>
              <p>Your consultation time has expired. Please purchase again to continue.</p>
              <div className="plan-box">
                <div className="plan-card" onClick={() => navigate("/payment")}>
                  <h3>₹303</h3>
                  <p>Basic Consultation</p>
                </div>
                <div className="plan-card premium" onClick={() => navigate("/payment")}>
                  <h3>₹501</h3>
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
