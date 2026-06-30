import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import { FiBarChart2, FiClipboard, FiMessageSquare, FiUsers } from "react-icons/fi";

const statCards = [
  { key: "totalUsers", label: "Total Leads", icon: FiUsers, color: "from-cyan-500 to-sky-700" },
  { key: "todayUsers", label: "Today's Leads", icon: FiUsers, color: "from-emerald-500 to-green-700" },
  { key: "consultationRequests", label: "Consultation Requests", icon: FiClipboard, color: "from-violet-500 to-fuchsia-700" },
  { key: "todayRequests", label: "Today's Requests", icon: FiClipboard, color: "from-amber-500 to-orange-700" },
  { key: "totalLeads", label: "Total Requests", icon: FiMessageSquare, color: "from-rose-500 to-red-700" },
  { key: "pendingLeads", label: "Pending Follow-up", icon: FiBarChart2, color: "from-blue-500 to-indigo-700" },
];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    axios.get(`${API_BASE_URL}/api/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setAnalytics(res.data.analytics))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-slate-400">Loading dashboard...</div>;
  }

  const revenueData = [24, 42, 36, 58, 70, 82];
  const userData = [12, 18, 14, 27, 21, 32];
  const planData = [45, 35, 20];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
            <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${color} p-3 text-white`}>
              <Icon className="text-xl" />
            </div>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{analytics[key] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Revenue Overview</h3>
            <span className="text-sm text-cyan-300">+18.2%</span>
          </div>
          <svg viewBox="0 0 300 140" className="h-48 w-full">
            <path d="M0 120 C30 100, 50 90, 80 90 S130 95, 160 70 S220 30, 300 20" stroke="#22d3ee" strokeWidth="3" fill="none" />
            <path d="M0 120 C30 100, 50 90, 80 90 S130 95, 160 70 S220 30, 300 20 L300 140 L0 140 Z" fill="rgba(34,211,238,0.18)" />
          </svg>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Daily User Registration</h3>
            <span className="text-sm text-emerald-300">+11%</span>
          </div>
          <div className="flex h-48 items-end gap-3">
            {userData.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-xl bg-gradient-to-t from-cyan-500 to-emerald-400" style={{ height: `${value * 3}px` }} />
                <span className="text-xs text-slate-500">D{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <h3 className="mb-4 text-lg font-semibold">Monthly Revenue</h3>
          <div className="flex h-40 items-end gap-3">
            {revenueData.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-xl bg-gradient-to-t from-violet-500 to-cyan-400" style={{ height: `${value * 1.5}px` }} />
                <span className="text-xs text-slate-500">W{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-4 text-lg font-semibold">Plan Distribution</h3>
          <div className="flex items-center justify-center">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[16px] border-cyan-500 border-t-fuchsia-500" />
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-400">
            <p>Premium: {planData[0]}%</p>
            <p>Basic: {planData[1]}%</p>
            <p>Free: {planData[2]}%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Users</h3>
          <div className="space-y-3 text-sm text-slate-400">No recent users yet.</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Payments</h3>
          <div className="space-y-3 text-sm text-slate-400">No recent payments yet.</div>
        </div>
      </div>
    </div>
  );
}
