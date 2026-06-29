import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminReports() {
  const [reports, setReports] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    axios.get("http://localhost:5000/api/admin/reports", { headers: { Authorization: `Bearer ${token}` } })
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
          <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Most Purchased Plan</h2>
        <p className="mt-2 text-lg text-cyan-300">{reports.mostPurchasedPlan || "No data"}</p>
      </div>
    </div>
  );
}
