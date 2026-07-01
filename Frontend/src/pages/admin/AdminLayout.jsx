import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import { FiBell, FiLogOut, FiSearch, FiSettings, FiUsers } from "react-icons/fi";
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
    <div className="min-h-screen bg-[#fdfbf7] text-[#2b2b2b]">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-[#efe6d7] bg-[#fffdfa]/95 p-6 shadow-sm lg:flex">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#6b3418]">Astro Admin</h2>
            <p className="text-sm text-[#6b7280]">Control Center</p>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-[#6b3418] text-white" : "text-[#6b7280] hover:bg-[#f8f2e9] hover:text-[#6b3418]"}`}
              >
                <Icon className="text-lg" />
                {label}
              </NavLink>
            ))}
          </nav>

          <button onClick={handleLogout} className="mt-auto flex items-center gap-3 rounded-xl border border-[#efe6d7] px-4 py-3 text-sm text-[#6b3418] transition hover:bg-[#f8f2e9]">
            <FiLogOut />
            Logout
          </button>
        </aside>

        <main className="flex-1">
          <header className="border-b border-[#efe6d7] bg-[#fffdfa]/90 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[#2b2b2b]">Welcome back, {admin.name}</h1>
                <p className="text-sm text-[#6b7280]">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 rounded-xl border border-[#efe6d7] bg-[#fcf5ea] px-3 py-2 text-sm text-[#6b7280]">
                  <FiSearch />
                  <input className="bg-transparent outline-none" placeholder="Search" />
                </label>
                <div className="rounded-xl border border-[#efe6d7] bg-[#fcf5ea] p-2 text-[#6b3418]">🔔</div>
                <div className="flex items-center gap-2 rounded-xl border border-[#efe6d7] bg-[#fcf5ea] px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6b3418] font-semibold text-white">A</div>
                  <div>
                    <p className="text-sm font-semibold text-[#2b2b2b]">{admin.name}</p>
                    <p className="text-xs text-[#6b7280]">Administrator</p>
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
