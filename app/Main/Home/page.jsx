"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVouchers: 0,
    totalPurchase: 0,
    totalBudget: 0,
  });
  const [recentVouchers, setRecentVouchers] = useState([]);
  const [recentPurchase, setRecentPurchase] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, vouchersRes, purchaseRes, budgetsRes] =
          await Promise.all([
            fetch("/api/users"),
            fetch("/api/vouchers"),
            fetch("/api/purchase"),
            fetch("/api/budgets"),
          ]);

        const usersData = await usersRes.json();
        const vouchersData = await vouchersRes.json();
        const purchaseData = await purchaseRes.json();
        const budgetsData = await budgetsRes.json();

        const users = usersData.users || [];
        const vouchers = vouchersData.data || [];
        const purchases = purchaseData.data || [];
        const budgets = Array.isArray(budgetsData)
          ? budgetsData
          : budgetsData.data || budgetsData.budgets || [];

        setStats({
          totalUsers: users.length,
          totalVouchers: vouchers.length,
          totalPurchase: purchases.length,
          totalBudget: budgets.length,
        });

        setRecentVouchers(vouchers.slice(0, 5));
        setRecentPurchase(purchases.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const statusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";
    const s = status.toLowerCase();
    if (s === "approved" || s === "active")
      return "bg-green-100 text-green-700";
    if (s === "pending") return "bg-yellow-100 text-yellow-700";
    if (s === "rejected" || s === "inactive") return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-700";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Loading dashboard...
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Overview of your system</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: stats.totalUsers,
            icon: "👤",
            color: "bg-blue-50 border-blue-100",
            text: "text-blue-600",
          },
          {
            label: "Vouchers",
            value: stats.totalVouchers,
            icon: "🧾",
            color: "bg-purple-50 border-purple-100",
            text: "text-purple-600",
          },
          {
            label: "Purchase Requests",
            value: stats.totalPurchase,
            icon: "🛒",
            color: "bg-amber-50 border-amber-100",
            text: "text-amber-600",
          },
          {
            label: "Budget Projects",
            value: stats.totalBudget,
            icon: "📊",
            color: "bg-green-50 border-green-100",
            text: "text-green-600",
          },
        ].map(({ label, value, icon, color, text }) => (
          <div
            key={label}
            className={`rounded-xl border p-4 ${color} flex items-center gap-4`}
          >
            <span className="text-3xl">{icon}</span>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className={`text-2xl font-bold ${text}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT VOUCHERS */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">
              Recent Vouchers
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-gray-400 font-medium">
                  ID
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-400 font-medium">
                  Payee
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-400 font-medium">
                  Amount
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-400 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentVouchers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-400 text-xs"
                  >
                    No vouchers found
                  </td>
                </tr>
              ) : (
                recentVouchers.map((v, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 text-gray-600 font-mono text-xs">
                      {v.voucherID || v.id || "—"}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {v.payee || v.Payee || "—"}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      ₱{(v.totalAmount || v.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(v.status || v.Status)}`}
                      >
                        {v.status || v.Status || "—"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* RECENT PURCHASE REQUESTS */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">
              Recent Purchase Requests
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-gray-400 font-medium">
                  PR Code
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-400 font-medium">
                  Department
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-400 font-medium">
                  Total
                </th>
                <th className="px-4 py-2 text-left text-xs text-gray-400 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentPurchase.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-400 text-xs"
                  >
                    No purchase requests found
                  </td>
                </tr>
              ) : (
                recentPurchase.map((p, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 text-gray-600 font-mono text-xs">
                      {p.PRCode || "—"}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {p.RequestorDepartment || "—"}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      ₱{(p.Total || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(p.Status)}`}
                      >
                        {p.Status || "—"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
