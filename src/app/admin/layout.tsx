import { AdminSidebar } from "@/components/admin/Sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">관리자 페이지</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <AdminSidebar />
        <div className="flex-1 bg-card p-6 rounded-md">
          {children}
        </div>
      </div>
    </div>
  )
} 