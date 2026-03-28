"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Wrench, RefreshCw, ShoppingBag, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatPrice } from "@/lib/utils";
import type { AnalyticsData } from "@/types";

function StatCard({
  title, value, sub, icon: Icon, color, trend,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: number;
}) {
  const TrendIcon = trend === undefined || trend === 0 ? Minus : trend > 0 ? TrendingUp : TrendingDown;
  const trendColor = trend === undefined || trend === 0 ? "text-gray-500" : trend > 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={14} />
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold text-black mb-1">{value}</p>
      <p className="text-sm text-gray-600">{title}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["admin-analytics"],
    queryFn:  () => fetch("/api/admin/analytics").then((r) => r.json()).then((r) => r.data),
    refetchInterval: 60_000,
  });

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse h-32" />
          ))}
        </div>
        <div className="card animate-pulse h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-black mb-1">Admin-Dashboard</h1>
        <p className="text-gray-600 text-sm">Willkommen im Verwaltungsbereich.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Umsatz (Monat)"
          value={formatPrice(analytics.revenue.thisMonth)}
          sub={`Gesamt: ${formatPrice(analytics.revenue.total)}`}
          icon={TrendingUp}
          color="bg-blue-600"
          trend={analytics.revenue.growth}
        />
        <StatCard
          title="Bestellungen"
          value={String(analytics.orders.total)}
          sub={`${analytics.orders.pending} ausstehend`}
          icon={ShoppingBag}
          color="bg-green-600"
        />
        <StatCard
          title="Reparaturen"
          value={String(analytics.repairs.total)}
          sub={`${analytics.repairs.pending} neu · ${analytics.repairs.inProgress} laufend`}
          icon={Wrench}
          color="bg-purple-600"
        />
        <StatCard
          title="Nutzer gesamt"
          value={String(analytics.users.total)}
          sub={`+${analytics.users.newThisMonth} diesen Monat`}
          icon={Users}
          color="bg-orange-600"
        />
      </div>

      {/* Revenue chart */}
      <div className="card">
        <h2 className="text-lg font-semibold text-black mb-6">Umsatz (letzte 30 Tage)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={analytics.revenueChart} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}€`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              labelStyle={{ color: "#1f2937" }}
              formatter={(value: number) => [formatPrice(value), "Umsatz"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-black mb-4 flex items-center gap-2">
            <Wrench size={16} className="text-purple-600" />
            Reparatur-Status
          </h3>
          <div className="space-y-2.5">
            {[
              { label: "Ausstehend",    value: analytics.repairs.pending,    color: "bg-yellow-500" },
              { label: "In Bearbeitung", value: analytics.repairs.inProgress, color: "bg-purple-500" },
              { label: "Abgeschlossen", value: analytics.repairs.completed,  color: "bg-green-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-gray-600">{label}</span>
                </div>
                <span className="font-semibold text-black">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-black mb-4 flex items-center gap-2">
            <RefreshCw size={16} className="text-orange-600" />
            Ankauf-Status
          </h3>
          <div className="space-y-2.5">
            {[
              { label: "Ausstehend",  value: analytics.buybacks.pending,  color: "bg-yellow-500" },
              { label: "Akzeptiert",  value: analytics.buybacks.accepted, color: "bg-green-500" },
              { label: "Gesamt",      value: analytics.buybacks.total,    color: "bg-blue-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-gray-600">{label}</span>
                </div>
                <span className="font-semibold text-black">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-black mb-4 flex items-center gap-2">
            <ShoppingBag size={16} className="text-green-600" />
            Bestellungs-Status
          </h3>
          <div className="space-y-2.5">
            {[
              { label: "Ausstehend",    value: analytics.orders.pending,   color: "bg-yellow-500" },
              { label: "Abgeschlossen", value: analytics.orders.completed, color: "bg-green-500" },
              { label: "Gesamt",        value: analytics.orders.total,     color: "bg-blue-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-gray-600">{label}</span>
                </div>
                <span className="font-semibold text-black">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
