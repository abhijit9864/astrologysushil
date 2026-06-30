import { useEffect, useRef, useState } from "react";
import axios from "axios";
import socket from "../../utils/socketClient";

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUser, setTypingUser] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const selectedChatRef = useRef(null);

  const token = localStorage.getItem("adminToken");

  const loadChats = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/admin/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(data.chats || []);
    } catch (err) {
      console.log(err);
    }
  };

  const loadMessages = async (user) => {
    if (!user) return;
    try {
      const { data } = await axios.get(`http://localhost:5000/api/messages/${user.phone}`);
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

  const sendAdminMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await axios.post("http://localhost:5000/api/send-message", {
        phone: selectedChat.phone,
        message: newMessage,
        sender: "admin",
      });

      const sent = response.data?.message;
      if (sent) {
        setMessages((prev) => [...prev, sent]);
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

    socket.connect();

    socket.on("connect", () => {
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("receive-message", (incoming) => {
      if (!incoming) return;
      const current = selectedChatRef.current;
      if (current && incoming.user_id === current.id) {
        setMessages((prev) => [...prev, incoming]);
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

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receive-message");
      socket.off("typing");
      socket.off("stop-typing");
      socket.off("message-seen");
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
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">{chat.messageCount} msgs</span>
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
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none"
              placeholder="Type admin reply"
            />
            <button
              type="button"
              onClick={sendAdminMessage}
              className="rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
