import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import Swal from "sweetalert2";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/admin/login`, form);
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        Swal.fire({ icon: "success", title: "Welcome back", text: "Admin login successful" });
        navigate("/admin/dashboard");
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Login failed", text: error.response?.data?.message || "Try again" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7] px-4 text-[#2b2b2b]">
      <div className="w-full max-w-md rounded-2xl border border-[#efe6d7] bg-[#fffdfa] p-8 shadow-[0_20px_60px_rgba(107,52,24,0.08)]">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-[#6b3418]">Admin Access</h1>
          <p className="mt-2 text-sm text-[#6b7280]">Securely manage consultations, users, payments, and chats.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-[#6b3418]">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-[#efe6d7] bg-[#fcf5ea] px-4 py-3 outline-none ring-0"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-[#6b3418]">Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-[#efe6d7] bg-[#fcf5ea] px-4 py-3 outline-none ring-0"
              placeholder="Enter password"
            />
          </div>
          <button disabled={loading} className="w-full rounded-xl bg-[#6b3418] px-4 py-3 font-semibold text-white transition hover:bg-[#4d2310] disabled:opacity-70">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
