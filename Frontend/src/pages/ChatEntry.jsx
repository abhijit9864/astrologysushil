import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/chatEntry.css";
import axios from "axios";
import socket from "../utils/socketClient";

const PENDING_CHAT_REQUESTS_KEY = "pendingChatRequests";

const persistPendingRequest = (request) => {
  try {
    const current = JSON.parse(localStorage.getItem(PENDING_CHAT_REQUESTS_KEY) || "[]");
    const exists = current.some((item) => String(item.userId) === String(request.userId));
    const next = exists
      ? current.map((item) => (String(item.userId) === String(request.userId) ? request : item))
      : [...current, request];
    localStorage.setItem(PENDING_CHAT_REQUESTS_KEY, JSON.stringify(next));
    console.log("[ChatEntry] persisted pending request", request);
  } catch (error) {
    console.error("[ChatEntry] failed to persist pending request", error);
  }
};

const emitChatRequest = (request) => {
  console.log("[ChatEntry] emitting chat-request", request);
  if (socket.connected) {
    socket.emit("chat-request", request);
    return;
  }

  socket.connect();
  socket.once("connect", () => {
    socket.emit("chat-request", request);
  });
};

const ChatEntry = () => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const chatUser = JSON.parse(localStorage.getItem("chatUser") || "null");
      const chatSession = JSON.parse(localStorage.getItem("chatSession") || "{}");
      const hasActiveChat = Boolean(
        chatUser?.chatRequestAccepted ||
        chatUser?.chatRequestPending ||
        chatSession?.chatRequestAccepted ||
        chatSession?.freeStartTime
      );

      if (hasActiveChat) {
        navigate("/chat", { replace: true });
      }
    } catch (error) {
      console.error("[ChatEntry] failed to restore chat session", error);
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/check-user", {
        phone: formData.phone,
      });

      if (response.data.exists) {
        const userPayload = {
          id: response.data.id,
          name: formData.name,
          phone: formData.phone,
          chatRequestPending: true,
          chatRequestAccepted: false,
        };

        localStorage.setItem("chatUser", JSON.stringify(userPayload));
        const requestPayload = {
          userId: userPayload.id,
          phone: userPayload.phone,
          userName: userPayload.name,
        };
        persistPendingRequest(requestPayload);
        emitChatRequest(requestPayload);

        if (response.data.freeChatUsed) {
          navigate("/payment");
          return;
        }

        navigate("/chat");
        return;
      }

      const registerResponse = await axios.post("http://localhost:5000/api/register-user", {
        name: formData.name,
        phone: formData.phone,
      });

      const registeredUser = {
        id: registerResponse.data.id,
        name: formData.name,
        phone: formData.phone,
        chatRequestPending: true,
        chatRequestAccepted: false,
      };

      localStorage.setItem("chatUser", JSON.stringify(registeredUser));
      const requestPayload = {
        userId: registeredUser.id,
        phone: registeredUser.phone,
        userName: registeredUser.name,
      };
      persistPendingRequest(requestPayload);
      emitChatRequest(requestPayload);

      navigate("/chat");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };



  return (
    <section className="entry-page">

      <div className="entry-card">

        <h1>Start Free Consultation</h1>

        <p>
          Get 2 minutes free astrology consultation.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />

          <input
            type="tel"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
          />

          <button type="submit">
            Start Free Chat
          </button>

        </form>

      </div>

    </section>
  );
};

export default ChatEntry;