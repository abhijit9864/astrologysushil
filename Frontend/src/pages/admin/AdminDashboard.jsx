import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import { FiBarChart2, FiClipboard, FiMessageSquare, FiUsers } from "react-icons/fi";

const statCards = [
  { key: "totalUsers", label: "Total Leads", icon: FiUsers, color: "from-[#6b3418] to-[#8b5e3c]" },
  { key: "todayUsers", label: "Today's Leads", icon: FiUsers, color: "from-[#c9a227] to-[#8b5e3c]" },
  { key: "consultationRequests", label: "Consultation Requests", icon: FiClipboard, color: "from-[#a65d1e] to-[#6b3418]" },
  { key: "todayRequests", label: "Today's Requests", icon: FiClipboard, color: "from-[#d8b874] to-[#c9a227]" },
  { key: "totalLeads", label: "Total Requests", icon: FiMessageSquare, color: "from-[#8b5e3c] to-[#6b3418]" },
  { key: "pendingLeads", label: "Pending Follow-up", icon: FiBarChart2, color: "from-[#4d2310] to-[#6b3418]" },
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
    return <div className="text-[#6b7280]">Loading dashboard...</div>;
  }

  const revenueData = [24, 42, 36, 58, 70, 82];
  const userData = [12, 18, 14, 27, 21, 32];
  const planData = [45, 35, 20];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="rounded-2xl border border-[#efe6d7] bg-[#fffdfa] p-5 shadow-[0_16px_40px_rgba(107,52,24,0.06)]">
            <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${color} p-3 text-white`}>
              <Icon className="text-xl" />
            </div>
            <p className="text-sm text-[#6b7280]">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#2b2b2b]">{analytics[key] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#efe6d7] bg-[#fffdfa] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#2b2b2b]">Revenue Overview</h3>
            <span className="text-sm text-[#6b3418]">+18.2%</span>
          </div>
          <svg viewBox="0 0 300 140" className="h-48 w-full">
            <path d="M0 120 C30 100, 50 90, 80 90 S130 95, 160 70 S220 30, 300 20" stroke="#c9a227" strokeWidth="3" fill="none" />
            <path d="M0 120 C30 100, 50 90, 80 90 S130 95, 160 70 S220 30, 300 20 L300 140 L0 140 Z" fill="rgba(201,162,39,0.18)" />
          </svg>
        </div>
        <div className="rounded-2xl border border-[#efe6d7] bg-[#fffdfa] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#2b2b2b]">Daily User Registration</h3>
            <span className="text-sm text-[#6b3418]">+11%</span>
          </div>
          <div className="flex h-48 items-end gap-3">
            {userData.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-xl bg-gradient-to-t from-[#6b3418] to-[#c9a227]" style={{ height: `${value * 3}px` }} />
                <span className="text-xs text-[#6b7280]">D{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#efe6d7] bg-[#fffdfa] p-6 xl:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-[#2b2b2b]">Monthly Revenue</h3>
          <div className="flex h-40 items-end gap-3">
            {revenueData.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-xl bg-gradient-to-t from-[#8b5e3c] to-[#c9a227]" style={{ height: `${value * 1.5}px` }} />
                <span className="text-xs text-[#6b7280]">W{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[#efe6d7] bg-[#fffdfa] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[#2b2b2b]">Plan Distribution</h3>
          <div className="flex items-center justify-center">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[16px] border-[#6b3418] border-t-[#c9a227]" />
          </div>
          <div className="mt-4 space-y-2 text-sm text-[#6b7280]">
            <p>Premium: {planData[0]}%</p>
            <p>Basic: {planData[1]}%</p>
            <p>Free: {planData[2]}%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#efe6d7] bg-[#fffdfa] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[#2b2b2b]">Recent Users</h3>
          <div className="space-y-3 text-sm text-[#6b7280]">No recent users yet.</div>
        </div>
        <div className="rounded-2xl border border-[#efe6d7] bg-[#fffdfa] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[#2b2b2b]">Recent Payments</h3>
          <div className="space-y-3 text-sm text-[#6b7280]">No recent payments yet.</div>
        </div>
      </div>
    </div>
  );
}
