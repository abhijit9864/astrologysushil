import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import { Link } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    axios.get(`${API_BASE_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsers(res.data.users || []));
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = [user.name, user.phone, user.service, user.problem].join(" ").toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [users, search]);

  return (
    <div className="space-y-5 rounded-2xl border border-[#efe6d7] bg-[#fffdfa] p-6 shadow-[0_16px_40px_rgba(107,52,24,0.06)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#2b2b2b]">Users</h2>
          <p className="text-sm text-[#6b7280]">Manage plans, payments, and consultation access.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads" className="rounded-xl border border-[#efe6d7] bg-[#fcf5ea] px-3 py-2 text-sm outline-none" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-[#efe6d7] text-left text-[#6b7280]">
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Phone</th>
              <th className="px-3 py-3">Service</th>
              <th className="px-3 py-3">Problem</th>
              <th className="px-3 py-3">Registered</th>
              <th className="px-3 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-[#efe6d7] text-[#2b2b2b]">
                <td className="px-3 py-3 font-medium">{user.name}</td>
                <td className="px-3 py-3">{user.phone}</td>
                <td className="px-3 py-3">{user.service || "—"}</td>
                <td className="px-3 py-3">{user.problem || "—"}</td>
                <td className="px-3 py-3">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-3">
                  <Link to={`/admin/users/${user.id}`} className="rounded-lg bg-[#6b3418] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#4d2310]">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
