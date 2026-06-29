import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ title: "", message: "", target: "all" });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    axios.get("http://localhost:5000/api/admin/notifications", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setNotifications(res.data.notifications || []));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    await axios.post("http://localhost:5000/api/admin/notifications", form, { headers: { Authorization: `Bearer ${token}` } });
    setForm({ title: "", message: "", target: "all" });
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
        <h3 className="text-lg font-semibold">Recent Notifications</h3>
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
