import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/chat.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../utils/socketClient";

const FREE_CHAT_DURATION = 120;
const CHAT_START_KEY = "chatStartTime";
const CHAT_SESSION_KEY = "chatSession";

const readChatSession = () => {
  try {
    return JSON.parse(localStorage.getItem(CHAT_SESSION_KEY) || "{}");
  } catch (error) {
    console.error("[ChatPage] failed to read chat session", error);
    return {};
  }
};

const writeChatSession = (session) => {
  try {
    localStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("[ChatPage] failed to save chat session", error);
  }
};

const saveChatSessionState = (overrides = {}) => {
  const current = readChatSession();
  const next = { ...current, ...overrides };
  writeChatSession(next);
  return next;
};

const ChatPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(FREE_CHAT_DURATION);
  const [isLocked, setIsLocked] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userPlan, setUserPlan] = useState("free");
  const [chatEndTime, setChatEndTime] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatReady, setChatReady] = useState(false);
  const [consultationStatus, setConsultationStatus] = useState("waiting");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const [messageStatuses, setMessageStatuses] = useState({});
  const timerEndHandledRef = useRef(false);
  const typingTimeoutRef = useRef(null);
  const chatBodyRef = useRef(null);
  const audioRef = useRef(null);

  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const appendMessage = (newMessage) => {
    setMessages((prev) => {
      const exists = prev.some((msg) => msg.id === newMessage.id);
      if (exists) return prev;
      return [...prev, newMessage];
    });
  };

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
        setIsLocked(true);
        localStorage.removeItem(CHAT_START_KEY);
        setTimeLeft(0);
        setChatReady(true);
        return;
      }

      if (data?.paid && data.plan === "basic") {
        setUserPlan("basic");
        setChatEndTime(data.chat_end_time || null);
        setIsLocked(true);
        localStorage.removeItem(CHAT_START_KEY);
        setChatReady(true);
        return;
      }

      const session = readChatSession();
      const accepted = Boolean(chatUser.chatRequestAccepted || session.chatRequestAccepted || session.chatReady);
      setUserPlan("free");
      setChatEndTime(null);
      setIsLocked(false);
      setChatReady(accepted);

      if (accepted) {
        const startTime = getFreeStartTime() || setFreeStartTime(chatUser.acceptedAt || session.acceptedAt || Date.now());
        setTimeLeft(getRemainingFreeSeconds(startTime));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadConsultationState = async () => {
    try {
      const rawUser = localStorage.getItem("chatUser");
      if (!rawUser) return;
      const chatUser = JSON.parse(rawUser);
      if (!chatUser?.phone) return;

      const { data } = await axios.get(`http://localhost:5000/api/consultation-state/${chatUser.phone}`);
      const consultation = data?.consultation;

      if (!consultation) return;

      const nextStatus = consultation.status || "waiting";
      const nextRemainingSeconds = Number(consultation.remainingSeconds || 0);

      setConsultationStatus(nextStatus);
      setRemainingSeconds(nextRemainingSeconds);
      setTimeLeft(nextRemainingSeconds);

      if (nextStatus === "live") {
        setChatReady(true);
        setIsLocked(false);
        setChatEndTime(consultation.chatEndTime || null);
        setUserPlan(consultation.plan === "premium" ? "premium" : "free");
      } else if (nextStatus === "expired") {
        setChatReady(false);
        setIsLocked(true);
        setTimeLeft(0);
        setRemainingSeconds(0);
      } else {
        setChatReady(false);
        setIsLocked(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isLocked || !chatReady) return;
    try {
      const chatUser = JSON.parse(localStorage.getItem("chatUser"));
      if (!chatUser) return;

      const response = await axios.post("http://localhost:5000/api/send-message", {
        phone: chatUser.phone,
        message,
        sender: "user",
      });

      const sent = response.data?.message;
      if (sent) {
        appendMessage(sent);
        setMessageStatuses((prev) => ({ ...prev, [sent.id]: "Sent" }));
        socket.emit("send-message", {
          roomId: chatUser.id,
          ...sent,
        });
      }

      setMessage("");
      socket.emit("stop-typing", {
        roomId: chatUser.id,
        sender: "user",
        userId: chatUser.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getFreeStartTime = () => {
    const session = readChatSession();
    const stored = session.freeStartTime || localStorage.getItem(CHAT_START_KEY);
    return stored && !Number.isNaN(Number(stored)) ? Number(stored) : null;
  };

  const setFreeStartTime = (timestamp = Date.now()) => {
    saveChatSessionState({ freeStartTime: timestamp });
    localStorage.setItem(CHAT_START_KEY, String(timestamp));
    return timestamp;
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
        socket.emit("free-chat-ended", {
          userId: chatUser.id,
          phone: chatUser.phone,
          userName: chatUser.name,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      saveChatSessionState({ freeChatUsed: true, chatReady: false, freeStartTime: null });
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
    const rawUser = localStorage.getItem("chatUser");
    if (!rawUser) return;

    const chatUser = JSON.parse(rawUser);
    if (!chatUser?.phone) return;

    loadChatState();
    loadConsultationState();
    loadMessages();

    const notificationAudio = new Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAAAA"
    );
    audioRef.current = notificationAudio;

    socket.connect();

    socket.on("connect", () => {
      setOnlineStatus(true);
      socket.emit("join-room", { roomId: chatUser.id });
      socket.emit("user-online", { userId: chatUser.id });
    });

    socket.on("disconnect", () => {
      setOnlineStatus(false);
      socket.emit("user-offline", { userId: chatUser.id });
    });

    socket.on("receive-message", (incoming) => {
      if (!incoming) return;
      appendMessage(incoming);
      playNotification();
      setIsTyping(false);
      if (document.hidden) {
        setUnreadCount((prev) => prev + 1);
      }
      if (incoming.sender === "admin") {
        socket.emit("message-seen", {
          roomId: chatUser.id,
          messageId: incoming.id,
          sender: "user",
          userId: chatUser.id,
        });
      }
    });

    socket.on("typing", ({ sender }) => {
      if (sender === "admin") {
        setIsTyping(true);
      }
    });

    socket.on("stop-typing", ({ sender }) => {
      if (sender === "admin") {
        setIsTyping(false);
      }
    });

    socket.on("message-delivered", ({ messageId, sender }) => {
      if (sender === "user") {
        setMessageStatuses((prev) => ({ ...prev, [messageId]: "Delivered" }));
      }
    });

    socket.on("message-seen", ({ messageId, sender }) => {
      if (sender === "admin") {
        setMessageStatuses((prev) => ({ ...prev, [messageId]: "Seen" }));
      }
    });

    socket.on("chat-request-accepted", () => {
      const acceptedAt = Date.now();
      const storedUser = JSON.parse(localStorage.getItem("chatUser") || "{}");
      storedUser.chatRequestPending = false;
      storedUser.chatRequestAccepted = true;
      storedUser.acceptedAt = acceptedAt;
      localStorage.setItem("chatUser", JSON.stringify(storedUser));
      saveChatSessionState({ chatRequestAccepted: true, acceptedAt, freeStartTime: acceptedAt, chatReady: true });
      setConsultationStatus("accepted");
      setChatReady(true);
      setIsLocked(false);
      setUserPlan("free");
      setChatEndTime(null);
      setTimeLeft(FREE_CHAT_DURATION);
      localStorage.setItem(CHAT_START_KEY, String(acceptedAt));
    });

    socket.on("consultation-started", ({ remainingSeconds }) => {
      const storedUser = JSON.parse(localStorage.getItem("chatUser") || "{}");
      storedUser.chatRequestAccepted = true;
      localStorage.setItem("chatUser", JSON.stringify(storedUser));
      setConsultationStatus("live");
      setChatReady(true);
      setIsLocked(false);
      setTimeLeft(Number(remainingSeconds || 0));
      setRemainingSeconds(Number(remainingSeconds || 0));
    });

    socket.on("consultation-tick", ({ remainingSeconds }) => {
      setTimeLeft(Number(remainingSeconds || 0));
      setRemainingSeconds(Number(remainingSeconds || 0));
      if (Number(remainingSeconds || 0) <= 0) {
        setIsLocked(true);
      }
    });

    socket.on("consultation-ended", () => {
      setConsultationStatus("expired");
      setChatReady(false);
      setIsLocked(true);
      setTimeLeft(0);
      setRemainingSeconds(0);
    });

    socket.on("admin-status", ({ isOnline }) => {
      setIsAdminOnline(Boolean(isOnline));
    });

    const handleVisibility = () => {
      if (!document.hidden) {
        setUnreadCount(0);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receive-message");
      socket.off("typing");
      socket.off("stop-typing");
      socket.off("message-delivered");
      socket.off("message-seen");
      socket.off("chat-request-accepted");
      socket.off("consultation-started");
      socket.off("consultation-tick");
      socket.off("consultation-ended");
      socket.off("admin-status");
      socket.emit("user-offline", { userId: chatUser.id });
      socket.emit("leave-room", { roomId: chatUser.id });
      socket.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (!chatBodyRef.current) return;
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    if (!message.trim()) return;
    const rawUser = localStorage.getItem("chatUser");
    if (!rawUser) return;
    const chatUser = JSON.parse(rawUser);
    const roomId = chatUser.id;
    socket.emit("typing", { roomId, sender: "user", userId: chatUser.id });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { roomId, sender: "user", userId: chatUser.id });
    }, 1200);
    return () => clearTimeout(typingTimeoutRef.current);
  }, [message]);

  useEffect(() => {
    if (!chatReady || userPlan === "premium") {
      return;
    }

    if (userPlan === "basic") {
      if (timeLeft === 0 && !isLocked) {
        handleBasicChatEnd();
      }
      return;
    }

    if (timeLeft === 0 && !isLocked && consultationStatus === "live") {
      handleFreeChatEnd();
    }
  }, [timeLeft, userPlan, isLocked, chatReady, consultationStatus]);

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
              <div className={`online-dot ${onlineStatus ? "online" : "offline"}`}></div>
              <div>
                <h2>Astrologer Sushil Kumar</h2>
                <p>{onlineStatus ? "🟢 Online" : "🔴 Offline"}</p>
              </div>
            </div>
            <div className="timer-box">
              {isPremium ? "🟢 Premium Member" : consultationStatus === "live" ? `${minutes}:${seconds}` : "Waiting"}
            </div>
          </div>

          <div className={`chat-body ${isLocked ? "blur-chat" : ""}`} ref={chatBodyRef}>
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

            {!chatReady && !isLocked && (
              <div className="message astrologer">
                ⏳ Waiting for admin to accept your chat request.
                <br />
                {isAdminOnline ? "Admin is online and will accept shortly." : "Admin is currently offline. Once they accept, your free chat will start."}
              </div>
            )}

            {chatReady && consultationStatus === "live" && (
              <div className="message astrologer">
                🟢 Consultation started. Your free 2-minute consultation is now active.
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={msg.sender === "user" ? "message client" : "message astrologer"}>
                {msg.message}
                {msg.sender === "user" && messageStatuses[msg.id] && (
                  <div className="message-status">{messageStatuses[msg.id]}</div>
                )}
              </div>
            ))}

            {isTyping && <div className="typing-indicator">Astrologer is typing...</div>}

            {unreadCount > 0 && (
              <div className="unread-badge">{unreadCount} new message{unreadCount > 1 ? "s" : ""}</div>
            )}
          </div>

          {!isLocked && chatReady && (
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
