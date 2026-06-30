import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    axios.get(`${API_BASE_URL}/api/admin/payments`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setPayments(res.data.payments || []));
  }, []);

  const filtered = useMemo(() => payments.filter((payment) => [payment.name, payment.phone, payment.plan, payment.status, payment.razorpay_payment_id].join(" ").toLowerCase().includes(search.toLowerCase())), [payments, search]);

  return (
    <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-black/10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Payments</h2>
          <p className="text-sm text-slate-400">Track transactions and manage plan access.</p>
        </div>
        <div className="flex gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search payments" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none" />
          <button className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">Export CSV</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-slate-400">
              <th className="px-3 py-3">User</th>
              <th className="px-3 py-3">Phone</th>
              <th className="px-3 py-3">Plan</th>
              <th className="px-3 py-3">Amount</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Transaction</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((payment) => (
              <tr key={payment.id} className="border-b border-slate-800 text-slate-300">
                <td className="px-3 py-3">{payment.name}</td>
                <td className="px-3 py-3">{payment.phone}</td>
                <td className="px-3 py-3 capitalize">{payment.plan}</td>
                <td className="px-3 py-3">₹{payment.amount}</td>
                <td className="px-3 py-3 capitalize">{payment.status}</td>
                <td className="px-3 py-3">{new Date(payment.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-3">{payment.razorpay_payment_id || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
