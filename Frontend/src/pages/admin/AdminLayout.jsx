import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import { FiBarChart2, FiBell, FiCreditCard, FiLogOut, FiMessageSquare, FiSearch, FiSettings, FiUsers } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: MdDashboard },
  { to: "/admin/users", label: "Leads", icon: FiUsers },
  { to: "/admin/notifications", label: "Notifications", icon: FiBell },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ name: "Admin" });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    axios.get(`${API_BASE_URL}/api/admin/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setAdmin(res.data.admin))
      .catch(() => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-slate-800 bg-slate-900/90 p-6 lg:flex">
          <div className="mb-8">
            <h2 className="text-xl font-semibold">Astro Admin</h2>
            <p className="text-sm text-slate-400">Control Center</p>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-cyan-500/20 text-cyan-300" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
              >
                <Icon className="text-lg" />
                {label}
              </NavLink>
            ))}
          </nav>

          <button onClick={handleLogout} className="mt-auto flex items-center gap-3 rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800">
            <FiLogOut />
            Logout
          </button>
        </aside>

        <main className="flex-1">
          <header className="border-b border-slate-800 bg-slate-900/70 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Welcome back, {admin.name}</h1>
                <p className="text-sm text-slate-400">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-400">
                  <FiSearch />
                  <input className="bg-transparent outline-none" placeholder="Search" />
                </label>
                <div className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-300">🔔</div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 font-semibold text-slate-950">A</div>
                  <div>
                    <p className="text-sm font-semibold">{admin.name}</p>
                    <p className="text-xs text-slate-400">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
