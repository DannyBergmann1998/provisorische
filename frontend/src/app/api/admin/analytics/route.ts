import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, serverError } from "@/lib/utils";
import { subMonths, startOfMonth, endOfMonth, format, eachDayOfInterval, subDays } from "date-fns";

export async function GET(_req: NextRequest) {
  try {
    const now       = new Date();
    const thisMonth = { gte: startOfMonth(now), lte: endOfMonth(now) };
    const lastMonth = { gte: startOfMonth(subMonths(now, 1)), lte: endOfMonth(subMonths(now, 1)) };

    const [
      totalRevenue,
      thisMonthRevenue,
      lastMonthRevenue,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRepairs,
      pendingRepairs,
      inProgressRepairs,
      doneRepairs,
      totalBuybacks,
      pendingBuybacks,
      acceptedBuybacks,
      totalUsers,
      newUsersThisMonth,
    ] = await Promise.all([
      db.payment.aggregate({ _sum: { amount: true } }),
      db.payment.aggregate({ _sum: { amount: true }, where: { createdAt: thisMonth } }),
      db.payment.aggregate({ _sum: { amount: true }, where: { createdAt: lastMonth } }),
      db.order.count(),
      db.order.count({ where: { status: "PENDING" } }),
      db.order.count({ where: { status: { in: ["DELIVERED", "PAID"] } } }),
      db.repair.count(),
      db.repair.count({ where: { status: "PENDING" } }),
      db.repair.count({ where: { status: "IN_PROGRESS" } }),
      db.repair.count({ where: { status: "DONE" } }),
      db.buyback.count(),
      db.buyback.count({ where: { status: "PENDING" } }),
      db.buyback.count({ where: { status: "ACCEPTED" } }),
      db.user.count(),
      db.user.count({ where: { createdAt: thisMonth } }),
    ]);

    const totalRev     = Number(totalRevenue._sum.amount ?? 0);
    const thisMonthRev = Number(thisMonthRevenue._sum.amount ?? 0);
    const lastMonthRev = Number(lastMonthRevenue._sum.amount ?? 0);
    const growth = lastMonthRev > 0
      ? ((thisMonthRev - lastMonthRev) / lastMonthRev) * 100
      : 0;

    // Last 30 days revenue chart
    const last30Days = eachDayOfInterval({
      start: subDays(now, 29),
      end:   now,
    });

    const dailyPayments = await db.payment.groupBy({
      by:      ["createdAt"],
      _sum:    { amount: true },
      _count:  { id: true },
      where: {
        createdAt: { gte: subDays(now, 29) },
      },
    });

    const revenueChart = last30Days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const entry = dailyPayments.find(
        (p) => format(new Date(p.createdAt), "yyyy-MM-dd") === dateStr
      );
      return {
        date:    format(day, "dd.MM"),
        revenue: Number(entry?._sum.amount ?? 0),
        orders:  entry?._count.id ?? 0,
      };
    });

    return ok({
      revenue: {
        total:     totalRev,
        thisMonth: thisMonthRev,
        lastMonth: lastMonthRev,
        growth:    Math.round(growth * 10) / 10,
      },
      orders:   { total: totalOrders, pending: pendingOrders, completed: completedOrders },
      repairs:  { total: totalRepairs, pending: pendingRepairs, inProgress: inProgressRepairs, completed: doneRepairs },
      buybacks: { total: totalBuybacks, pending: pendingBuybacks, accepted: acceptedBuybacks },
      users:    { total: totalUsers, newThisMonth: newUsersThisMonth },
      revenueChart,
    });
  } catch (error) {
    console.error("[ADMIN_ANALYTICS]", error);
    return serverError();
  }
}
