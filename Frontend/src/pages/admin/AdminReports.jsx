import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";

export default function AdminReports() {
  const [reports, setReports] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    axios.get(`${API_BASE_URL}/api/admin/reports`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setReports(res.data.reports || {}));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Daily Revenue", reports.dailyRevenue],
          ["Weekly Revenue", reports.weeklyRevenue],
          ["Monthly Revenue", reports.monthlyRevenue],
          ["Total Chats", reports.totalChats],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[#efe6d7] bg-[#fffdfa] p-6 shadow-[0_16px_40px_rgba(107,52,24,0.06)]">
            <p className="text-sm text-[#6b7280]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#2b2b2b]">{value ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#efe6d7] bg-[#fffdfa] p-6 shadow-[0_16px_40px_rgba(107,52,24,0.06)]">
        <h2 className="text-xl font-semibold text-[#2b2b2b]">Most Purchased Plan</h2>
        <p className="mt-2 text-lg text-[#6b3418]">{reports.mostPurchasedPlan || "No data"}</p>
      </div>
    </div>
  );
}
