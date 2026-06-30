import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../../utils/socketClient";

const PENDING_CHAT_REQUESTS_KEY = "pendingChatRequests";

const parsePendingRequests = () => {
  try {
    return JSON.parse(localStorage.getItem(PENDING_CHAT_REQUESTS_KEY) || "[]");
  } catch (error) {
    console.error("[AdminNotifications] failed to parse pending requests", error);
    return [];
  }
};

const savePendingRequests = (requests) => {
  localStorage.setItem(PENDING_CHAT_REQUESTS_KEY, JSON.stringify(requests));
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [form, setForm] = useState({ title: "", message: "", target: "all" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const fetchPendingRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/pending-chat-requests", { headers: { Authorization: `Bearer ${token}` } });
        const next = res.data.requests || [];
        setPendingRequests(next);
        savePendingRequests(next);
        console.log("[AdminNotifications] loaded pending requests", next);
      } catch (error) {
        console.error("[AdminNotifications] failed to load pending requests", error);
      }
    };

    axios.get("http://localhost:5000/api/admin/notifications", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setNotifications(res.data.notifications || []));

    const initialRequests = parsePendingRequests();
    setPendingRequests(initialRequests);
    fetchPendingRequests();
    const intervalId = window.setInterval(fetchPendingRequests, 4000);
    console.log("[AdminNotifications] loaded pending requests", initialRequests);

    const handleStorage = (event) => {
      if (event.key === PENDING_CHAT_REQUESTS_KEY) {
        const next = parsePendingRequests();
        setPendingRequests(next);
        console.log("[AdminNotifications] storage updated pending requests", next);
      }
    };

    window.addEventListener("storage", handleStorage);

    socket.connect();
    socket.emit("join-room", { roomId: "admin" });
    socket.emit("admin-online");

    socket.on("connect", () => {
      console.log("[AdminNotifications] socket connected");
      socket.emit("join-room", { roomId: "admin" });
      socket.emit("admin-online");
    });

    socket.on("chat-request", (request) => {
      console.log("[AdminNotifications] received chat-request", request);
      if (!request?.userId) return;
      setPendingRequests((prev) => {
        const next = prev.some((item) => String(item.userId) === String(request.userId))
          ? prev.map((item) => (String(item.userId) === String(request.userId) ? request : item))
          : [...prev, request];
        savePendingRequests(next);
        return next;
      });
    });

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("storage", handleStorage);
      socket.off("connect");
      socket.off("chat-request");
      socket.emit("admin-offline");
      socket.emit("leave-room", { roomId: "admin" });
      socket.disconnect();
    };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    await axios.post("http://localhost:5000/api/admin/notifications", form, { headers: { Authorization: `Bearer ${token}` } });
    setForm({ title: "", message: "", target: "all" });
  };

  const openChatRequest = (request) => {
    navigate(`/admin/chats?userId=${request.userId}`);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Send Notification</h2>
        <form onSubmit={handleSend} className="mt-4 space-y-4">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none" />
          <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message" rows="4" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none" />
          <select value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none">
            <option value="all">All Users</option>
            <option value="premium">Premium Users</option>
            <option value="basic">Basic Users</option>
          </select>
          <button className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Send</button>
        </form>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Pending Chat Requests</h3>
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">{pendingRequests.length}</span>
        </div>
        <div className="mt-4 space-y-3">
          {pendingRequests.length === 0 && <p className="text-sm text-slate-400">No pending chat requests right now.</p>}
          {pendingRequests.map((request) => (
            <div key={request.userId} className="rounded-xl border border-cyan-500/20 bg-slate-950 p-4">
              <p className="font-medium text-slate-100">{request.userName || "New user"}</p>
              <p className="mt-1 text-sm text-slate-400">{request.phone || "No phone number"}</p>
              <button type="button" onClick={() => openChatRequest(request)} className="mt-3 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950">
                Open Chat
              </button>
            </div>
          ))}
        </div>

        <h3 className="mt-6 text-lg font-semibold">Recent Notifications</h3>
        <div className="mt-4 space-y-3">
          {notifications.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="font-medium">{item.title}</p>
              <p className="mt-1 text-sm text-slate-400">{item.message}</p>
              <p className="mt-2 text-xs text-slate-500">Target: {item.target}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
