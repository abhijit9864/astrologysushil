import { useState } from "react";

export default function AdminSettings() {
  const [form, setForm] = useState({ websiteName: "Astro Consult", adminName: "Admin", footerText: "© 2026 Astrology Solutions" });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#efe6d7] bg-[#fffdfa] p-6 shadow-[0_16px_40px_rgba(107,52,24,0.06)]">
        <h2 className="text-xl font-semibold text-[#2b2b2b]">Settings</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-[#6b7280]">Website Name</label>
            <input value={form.websiteName} onChange={(e) => setForm({ ...form, websiteName: e.target.value })} className="w-full rounded-xl border border-[#efe6d7] bg-[#fcf5ea] px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-[#6b7280]">Admin Profile</label>
            <input value={form.adminName} onChange={(e) => setForm({ ...form, adminName: e.target.value })} className="w-full rounded-xl border border-[#efe6d7] bg-[#fcf5ea] px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-[#6b7280]">SMTP Settings</label>
            <input placeholder="smtp.example.com" className="w-full rounded-xl border border-[#efe6d7] bg-[#fcf5ea] px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-[#6b7280]">Razorpay Keys</label>
            <input placeholder="Enter keys" className="w-full rounded-xl border border-[#efe6d7] bg-[#fcf5ea] px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-[#6b7280]">Footer Text</label>
            <input value={form.footerText} onChange={(e) => setForm({ ...form, footerText: e.target.value })} className="w-full rounded-xl border border-[#efe6d7] bg-[#fcf5ea] px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-[#6b7280]">Change Password</label>
            <input type="password" className="w-full rounded-xl border border-[#efe6d7] bg-[#fcf5ea] px-3 py-2 outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
