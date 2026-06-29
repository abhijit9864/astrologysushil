import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminChats() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    axios.get("http://localhost:5000/api/admin/chats", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setChats(res.data.chats || []));
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_1.9fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Live Chats</h2>
        <div className="mt-4 space-y-3">
          {chats.map((chat) => (
            <div key={chat.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{chat.name}</p>
                  <p className="text-sm text-slate-400">{chat.phone}</p>
                </div>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">{chat.messageCount} msgs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-lg font-semibold">Conversation</h3>
        <div className="mt-4 flex h-80 flex-col justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
          <div className="space-y-3 text-sm text-slate-400">Select a user to continue the conversation.</div>
          <div className="flex gap-2">
            <input className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 outline-none" placeholder="Type admin reply" />
            <button className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
