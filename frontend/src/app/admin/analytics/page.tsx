"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { formatPrice } from "@/lib/utils";
import type { AnalyticsData } from "@/types";

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["admin-analytics"],
    queryFn:  () => fetch("/api/admin/analytics").then((r) => r.json()).then((r) => r.data),
  });

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => <div key={i} className="card animate-pulse h-64" />)}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-black mb-1">Statistiken</h1>
        <p className="text-gray-600 text-sm">Umsatz, Aufträge und Nutzer im Überblick.</p>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Gesamtumsatz",    value: formatPrice(analytics.revenue.total),     color: "text-blue-600" },
          { label: "Diesen Monat",    value: formatPrice(analytics.revenue.thisMonth),  color: "text-green-600" },
          { label: "Letzten Monat",   value: formatPrice(analytics.revenue.lastMonth),  color: "text-gray-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <p className={`text-2xl font-semibold ${color} mb-1`}>{value}</p>
            <p className="text-gray-600 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="card">
        <h2 className="text-lg font-semibold text-black mb-6">Umsatz & Bestellungen (30 Tage)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analytics.revenueChart}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.2} />
                <stop offset="95%"stopColor="#2563eb" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
            <Tooltip
              contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              formatter={(v: number) => [formatPrice(v), "Umsatz"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Orders bar chart */}
      <div className="card">
        <h2 className="text-lg font-semibold text-black mb-6">Bestellungen (30 Tage)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={analytics.revenueChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              formatter={(v: number) => [v, "Bestellungen"]}
            />
            <Bar dataKey="orders" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Reparaturen",
            color: "text-purple-600",
            stats: [
              { label: "Gesamt",         value: analytics.repairs.total },
              { label: "Ausstehend",     value: analytics.repairs.pending },
              { label: "In Bearbeitung", value: analytics.repairs.inProgress },
              { label: "Abgeschlossen",  value: analytics.repairs.completed },
            ],
          },
          {
            title: "Ankäufe",
            color: "text-orange-600",
            stats: [
              { label: "Gesamt",     value: analytics.buybacks.total },
              { label: "Ausstehend", value: analytics.buybacks.pending },
              { label: "Akzeptiert", value: analytics.buybacks.accepted },
            ],
          },
          {
            title: "Nutzer",
            color: "text-green-600",
            stats: [
              { label: "Gesamt",            value: analytics.users.total },
              { label: "Neu diesen Monat",  value: analytics.users.newThisMonth },
            ],
          },
        ].map(({ title, color, stats }) => (
          <div key={title} className="card">
            <h3 className={`text-base font-semibold ${color} mb-5`}>{title}</h3>
            <div className="space-y-3">
              {stats.map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-black">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
