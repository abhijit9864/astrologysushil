import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    axios.get("http://localhost:5000/api/admin/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsers(res.data.users || []));
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = [user.name, user.phone, user.plan, user.payment_status].join(" ").toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" ? true : user.plan === filter || user.payment_status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  return (
    <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-black/10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Users</h2>
          <p className="text-sm text-slate-400">Manage plans, payments, and consultation access.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none">
            <option value="all">All</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-slate-400">
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Phone</th>
              <th className="px-3 py-3">Plan</th>
              <th className="px-3 py-3">Payment Status</th>
              <th className="px-3 py-3">Registration Date</th>
              <th className="px-3 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-slate-800 text-slate-300">
                <td className="px-3 py-3 font-medium">{user.name}</td>
                <td className="px-3 py-3">{user.phone}</td>
                <td className="px-3 py-3 capitalize">{user.plan || "free"}</td>
                <td className="px-3 py-3 capitalize">{user.payment_status || "pending"}</td>
                <td className="px-3 py-3">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-3">
                  <Link to={`/admin/users/${user.id}`} className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
