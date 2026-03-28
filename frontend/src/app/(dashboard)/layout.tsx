import { DashboardSidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex">
      <DashboardSidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
