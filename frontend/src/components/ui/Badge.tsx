import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  PENDING:       "bg-yellow-100 text-yellow-700 border-yellow-300",
  RECEIVED:      "bg-blue-100 text-blue-700 border-blue-300",
  IN_PROGRESS:   "bg-purple-100 text-purple-700 border-purple-300",
  WAITING_PARTS: "bg-cyan-100 text-cyan-700 border-cyan-300",
  DONE:          "bg-green-100 text-green-700 border-green-300",
  CANCELLED:     "bg-red-100 text-red-700 border-red-300",
  PAID:          "bg-green-100 text-green-700 border-green-300",
  PROCESSING:    "bg-blue-100 text-blue-700 border-blue-300",
  SHIPPED:       "bg-indigo-100 text-indigo-700 border-indigo-300",
  DELIVERED:     "bg-emerald-100 text-emerald-700 border-emerald-300",
  REFUNDED:      "bg-orange-100 text-orange-700 border-orange-300",
  ACCEPTED:      "bg-green-100 text-green-700 border-green-300",
  REJECTED:      "bg-red-100 text-red-700 border-red-300",
  REVIEWED:      "bg-blue-100 text-blue-700 border-blue-300",
  COMPLETED:     "bg-emerald-100 text-emerald-700 border-emerald-300",
  ADMIN:         "bg-purple-100 text-purple-700 border-purple-300",
  SUPERADMIN:    "bg-red-100 text-red-700 border-red-300",
  TECHNICIAN:    "bg-blue-100 text-blue-700 border-blue-300",
  CUSTOMER:      "bg-gray-100 text-gray-700 border-gray-300",
};

interface BadgeProps {
  status?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ status, variant, children, className }: BadgeProps) {
  const variantStyles = {
    default: "bg-gray-100 text-gray-700 border-gray-300",
    success: "bg-green-100 text-green-700 border-green-300",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-300",
    danger:  "bg-red-100 text-red-700 border-red-300",
    info:    "bg-blue-100 text-blue-700 border-blue-300",
  };

  const style = status
    ? (statusStyles[status] ?? variantStyles.default)
    : (variantStyles[variant ?? "default"]);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        style,
        className
      )}
    >
      {children}
    </span>
  );
}
