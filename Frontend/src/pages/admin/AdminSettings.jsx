import { useState } from "react";

export default function AdminSettings() {
  const [form, setForm] = useState({ websiteName: "Astro Consult", adminName: "Admin", footerText: "© 2026 Astrology Solutions" });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Settings</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-400">Website Name</label>
            <input value={form.websiteName} onChange={(e) => setForm({ ...form, websiteName: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-400">Admin Profile</label>
            <input value={form.adminName} onChange={(e) => setForm({ ...form, adminName: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-400">SMTP Settings</label>
            <input placeholder="smtp.example.com" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-400">Razorpay Keys</label>
            <input placeholder="Enter keys" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-400">Footer Text</label>
            <input value={form.footerText} onChange={(e) => setForm({ ...form, footerText: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-400">Change Password</label>
            <input type="password" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
