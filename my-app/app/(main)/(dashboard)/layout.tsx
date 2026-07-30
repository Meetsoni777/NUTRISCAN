import AuthSidebar from "@/_components/_layout/AuthSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-72px)]">
      <AuthSidebar />
      <div className="flex-1 overflow-auto p-6 md:p-8">{children}</div>
    </div>
  );
}
