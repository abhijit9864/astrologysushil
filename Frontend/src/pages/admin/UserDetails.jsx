import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config/api";

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    axios.get(`${API_BASE_URL}/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.user));
  }, [id]);

  if (!user) {
    return <div className="text-slate-400">Loading user profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold">{user.name}</h2>
        <p className="mt-2 text-sm text-slate-400">Complete profile overview</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-950 p-4"><p className="text-slate-400">Phone</p><p className="mt-1 font-medium">{user.phone}</p></div>
          <div className="rounded-xl bg-slate-950 p-4"><p className="text-slate-400">DOB</p><p className="mt-1 font-medium">{user.dob || "Not provided"}</p></div>
          <div className="rounded-xl bg-slate-950 p-4"><p className="text-slate-400">Birth Place</p><p className="mt-1 font-medium">{user.birth_place || "Not provided"}</p></div>
          <div className="rounded-xl bg-slate-950 p-4"><p className="text-slate-400">Plan</p><p className="mt-1 font-medium capitalize">{user.plan || "free"}</p></div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-4 text-lg font-semibold">Payment History</h3>
          <p className="text-sm text-slate-400">No payment history available yet.</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-4 text-lg font-semibold">Chat History</h3>
          <p className="text-sm text-slate-400">No chat history available yet.</p>
        </div>
      </div>
    </div>
  );
}
