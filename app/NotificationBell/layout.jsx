"use client";
import NotificationBell from "@/NotificationBell";

export default function MainLayout({ children }) {
  return (
    <div>
      <nav className="flex items-center justify-between px-6 py-3 bg-white shadow">
        <span className="font-bold text-lg">NSTREN</span>
        <div className="flex items-center gap-4">
          <NotificationBell />
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
