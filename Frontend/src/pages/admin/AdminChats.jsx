import { useEffect, useRef, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import socket from "../../utils/socketClient";

const PENDING_CHAT_REQUESTS_KEY = "pendingChatRequests";

const parsePendingRequests = () => {
  try {
    return JSON.parse(localStorage.getItem(PENDING_CHAT_REQUESTS_KEY) || "[]");
  } catch (error) {
    console.error("[AdminChats] failed to parse pending requests", error);
    return [];
  }
};

const savePendingRequests = (requests) => {
  localStorage.setItem(PENDING_CHAT_REQUESTS_KEY, JSON.stringify(requests));
};

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUser, setTypingUser] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [presenceMap, setPresenceMap] = useState({});
  const [consultationTimers, setConsultationTimers] = useState({});
  const selectedChatRef = useRef(null);

  const token = localStorage.getItem("adminToken");

  const loadChats = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const nextChats = (data.chats || []).map((chat) => ({
        ...chat,
        chat_status: chat.chat_status || "waiting",
      }));
      setChats(nextChats);
    } catch (err) {
      console.log(err);
    }
  };

  const loadMessages = async (user) => {
    if (!user) return;
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/messages/${user.phone}`);
      setMessages(data);
      setUnreadCounts((prev) => ({ ...prev, [user.id]: 0 }));
    } catch (err) {
      console.log(err);
    }
  };

  const selectChat = (chat) => {
    if (!chat) return;
    if (selectedChat?.id === chat.id) return;

    setSelectedChat(chat);
    setMessages([]);
    loadMessages(chat);
    setTypingUser(false);
  };

  const acceptChatRequest = (request) => {
    if (!request?.userId) return;

    const chatUser = {
      id: Number(request.userId),
      name: request.userName || "New user",
      phone: request.phone || "",
      plan: "free",
      messageCount: 0,
      free_chat_used: false,
      payment_status: "active",
      chat_status: "waiting",
    };

    setPendingRequests((prev) => prev.filter((item) => item.userId !== request.userId));
    setChats((prev) => {
      if (prev.some((chat) => Number(chat.id) === chatUser.id)) {
        return prev.map((chat) => (Number(chat.id) === chatUser.id ? { ...chat, ...chatUser } : chat));
      }
      return [chatUser, ...prev];
    });

    selectChat(chatUser);
    socket.emit("chat-request-accepted", { userId: chatUser.id });
  };

  const sendAdminMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/send-message`, {
        phone: selectedChat.phone,
        message: newMessage,
        sender: "admin",
      });

      const sent = response.data?.message;
      if (sent) {
        setMessages((prev) => (prev.some((msg) => msg.id === sent.id) ? prev : [...prev, sent]));
      }
      setNewMessage("");
      socket.emit("send-message", {
        roomId: selectedChat.id,
        ...sent,
      });
      socket.emit("stop-typing", {
        roomId: selectedChat.id,
        sender: "admin",
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadChats();

    const token = localStorage.getItem("adminToken");
    const fetchPendingRequests = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/admin/pending-chat-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const next = data.requests || [];
        setPendingRequests(next);
        savePendingRequests(next);
      } catch (error) {
        console.error("[AdminChats] failed to load pending requests", error);
      }
    };

    const initialRequests = parsePendingRequests();
    setPendingRequests(initialRequests);
    fetchPendingRequests();
    const intervalId = window.setInterval(fetchPendingRequests, 4000);

    socket.connect();

    socket.on("connect", () => {
      setSocketConnected(true);
      socket.emit("join-room", { roomId: "admin" });
      socket.emit("admin-online");
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("receive-message", (incoming) => {
      if (!incoming) return;
      const current = selectedChatRef.current;
      if (current && incoming.user_id === current.id) {
        setMessages((prev) => (prev.some((msg) => msg.id === incoming.id) ? prev : [...prev, incoming]));
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [incoming.user_id]: (prev[incoming.user_id] || 0) + 1,
        }));
      }
      setTypingUser(false);
    });

    socket.on("typing", ({ sender }) => {
      if (sender === "user") {
        setTypingUser(true);
      }
    });

    socket.on("stop-typing", ({ sender }) => {
      if (sender === "user") {
        setTypingUser(false);
      }
    });

    socket.on("message-seen", ({ messageId }) => {
      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, seen: true } : msg)));
    });

    socket.on("chat-request", (request) => {
      if (!request?.userId) return;
      setPendingRequests((prev) => {
        const next = prev.some((item) => String(item.userId) === String(request.userId))
          ? prev.map((item) => (String(item.userId) === String(request.userId) ? request : item))
          : [...prev, request];
        savePendingRequests(next);
        return next;
      });
      setChats((prev) => {
        if (prev.some((chat) => Number(chat.id) === Number(request.userId))) {
          return prev;
        }
        return [
          {
            id: Number(request.userId),
            name: request.userName || "New user",
            phone: request.phone || "",
            plan: "free",
            messageCount: 0,
            free_chat_used: false,
            payment_status: "pending",
          },
          ...prev,
        ];
      });
    });

    socket.on("user-presence", ({ userId, isOnline }) => {
      setPresenceMap((prev) => ({ ...prev, [String(userId)]: Boolean(isOnline) }));
    });

    socket.on("consultation-started", ({ userId, remainingSeconds }) => {
      setConsultationTimers((prev) => ({ ...prev, [String(userId)]: Number(remainingSeconds || 0) }));
      setChats((prev) => prev.map((chat) => (Number(chat.id) === Number(userId) ? { ...chat, chat_status: "live" } : chat)));
      setSelectedChat((prev) => (prev && Number(prev.id) === Number(userId) ? { ...prev, chat_status: "live" } : prev));
    });

    socket.on("consultation-tick", ({ userId, remainingSeconds }) => {
      setConsultationTimers((prev) => ({ ...prev, [String(userId)]: Number(remainingSeconds || 0) }));
      setChats((prev) => prev.map((chat) => (Number(chat.id) === Number(userId) ? { ...chat, chat_status: "live" } : chat)));
      setSelectedChat((prev) => (prev && Number(prev.id) === Number(userId) ? { ...prev, chat_status: "live" } : prev));
    });

    socket.on("consultation-ended", ({ userId }) => {
      setConsultationTimers((prev) => ({ ...prev, [String(userId)]: 0 }));
      setChats((prev) => prev.map((chat) => (Number(chat.id) === Number(userId) ? { ...chat, chat_status: "expired", free_chat_used: true, payment_status: "expired" } : chat)));
      setSelectedChat((prev) => (prev && Number(prev.id) === Number(userId) ? { ...prev, chat_status: "expired", free_chat_used: true, payment_status: "expired" } : prev));
    });

    socket.on("free-chat-ended", ({ userId }) => {
      setChats((prev) => prev.map((chat) => (chat.id === Number(userId) ? { ...chat, free_chat_used: true, payment_status: "expired" } : chat)));
      setSelectedChat((prev) => (prev && prev.id === Number(userId) ? { ...prev, free_chat_used: true, payment_status: "expired" } : prev));
    });

    return () => {
      window.clearInterval(intervalId);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receive-message");
      socket.off("typing");
      socket.off("stop-typing");
      socket.off("message-seen");
      socket.off("chat-request");
      socket.off("user-presence");
      socket.off("consultation-started");
      socket.off("consultation-tick");
      socket.off("consultation-ended");
      socket.off("free-chat-ended");
      socket.emit("admin-offline");
      socket.emit("leave-room", { roomId: "admin" });
      if (selectedChatRef.current) {
        socket.emit("leave-room", { roomId: selectedChatRef.current.id });
      }
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
    if (!selectedChat) return;

    socket.emit("join-room", { roomId: selectedChat.id });
    return () => {
      socket.emit("leave-room", { roomId: selectedChat.id });
    };
  }, [selectedChat]);

  const freeChatEnded = Boolean(selectedChat?.free_chat_used || selectedChat?.payment_status === "expired");
  const selectedStatus = selectedChat?.chat_status || "waiting";
  const selectedTimer = selectedChat ? consultationTimers[String(selectedChat.id)] ?? 0 : 0;
  const selectedTimerLabel = selectedTimer > 0 ? `${String(Math.floor(selectedTimer / 60)).padStart(2, "0")}:${String(selectedTimer % 60).padStart(2, "0")}` : "00:00";

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_1.9fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Live Chats</h2>
          <span className={`rounded-full px-3 py-1 text-xs ${socketConnected ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
            {socketConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {pendingRequests.length > 0 && (
            <div className="space-y-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3">
              <p className="text-sm font-semibold text-cyan-200">Pending chat requests</p>
              {pendingRequests.map((request) => (
                <div key={request.userId} className="flex items-center justify-between gap-3 rounded-lg border border-cyan-500/20 bg-slate-950/70 p-2">
                  <div>
                    <p className="text-sm font-medium text-slate-100">{request.userName || "New user"}</p>
                    <p className="text-xs text-slate-400">{request.phone}</p>
                  </div>
                  <button type="button" onClick={() => acceptChatRequest(request)} className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950">
                    Accept
                  </button>
                </div>
              ))}
            </div>
          )}

          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => selectChat(chat)}
              className={`w-full rounded-xl border px-4 py-4 text-left transition ${selectedChat?.id === chat.id ? "border-cyan-500 bg-slate-800" : "border-slate-800 bg-slate-950 hover:border-cyan-500 hover:bg-slate-900"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-100">{chat.name}</p>
                  <p className="text-sm text-slate-400">{chat.phone}</p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs ${presenceMap[String(chat.id)] ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
                    {presenceMap[String(chat.id)] ? "Online" : "Offline"}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs ${chat.chat_status === "live" ? "bg-emerald-500/20 text-emerald-300" : chat.chat_status === "expired" ? "bg-amber-500/20 text-amber-200" : "bg-cyan-500/20 text-cyan-300"}`}>
                    {chat.chat_status === "live" ? "Live" : chat.chat_status === "expired" ? "Expired" : "Waiting"}
                  </span>
                  {consultationTimers[String(chat.id)] > 0 && (
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{String(Math.floor(consultationTimers[String(chat.id)] / 60)).padStart(2, "0")}:{String(consultationTimers[String(chat.id)] % 60).padStart(2, "0")}</span>
                  )}
                  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">{chat.messageCount} msgs</span>
                  {chat.free_chat_used && (
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-200">Free chat ended</span>
                  )}
                  {unreadCounts[chat.id] > 0 && (
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-200">{unreadCounts[chat.id]}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Conversation</h3>
          <span className="rounded-full bg-slate-950 px-3 py-1 text-xs text-slate-400">{selectedChat ? selectedChat.name : "Select a user"}</span>
        </div>

        <div className="mt-4 flex h-[560px] flex-col rounded-xl border border-slate-800 bg-slate-950 p-4">
          {selectedChat && freeChatEnded && (
            <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              This user’s free consultation has ended. Please guide them to purchase a plan.
            </div>
          )}
          <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            {!selectedChat && <div className="text-sm text-slate-400">Select a user to continue the conversation.</div>}
            {selectedChat && messages.length === 0 && <div className="text-sm text-slate-400">No conversation yet. Send the first message.</div>}
            {messages.map((msg) => (
              <div key={msg.id} className={`rounded-2xl p-4 ${msg.sender === "admin" ? "bg-cyan-500 text-slate-950 self-end" : "bg-slate-800 text-slate-200 self-start"}`}>
                <div>{msg.message}</div>
                {msg.sender === "admin" && (
                  <div className="mt-2 text-[11px] text-slate-400">{msg.seen ? "Seen" : "Delivered"}</div>
                )}
              </div>
            ))}
          </div>
          {typingUser && <div className="mt-2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-300">User is typing...</div>}

          <div className="mt-4 flex gap-3">
            <input
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                if (selectedChat) {
                  socket.emit("typing", { roomId: selectedChat.id, sender: "admin" });
                }
              }}
              onBlur={() => {
                if (selectedChat) {
                  socket.emit("stop-typing", { roomId: selectedChat.id, sender: "admin" });
                }
              }}
              disabled={selectedStatus === "expired"}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={selectedStatus === "expired" ? "Consultation ended" : "Type admin reply"}
            />
            <button
              type="button"
              onClick={sendAdminMessage}
              disabled={selectedStatus === "expired"}
              className="rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
