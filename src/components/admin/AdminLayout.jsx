import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import { AdminProvider } from "../../context/AdminContext.jsx"
import AdminSidebar from "./AdminSidebar.jsx"
import AdminTopbar from "./AdminTopbar.jsx"
import NewComplaintModal from "./NewComplaintModal.jsx"

function AdminLayoutInner() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FFF9EA] text-[#281719] flex">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <AdminTopbar
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ openNewComplaint: () => setIsNewComplaintOpen(true) }} />
        </main>
      </div>

      {/* New Complaint Modal */}
      <NewComplaintModal
        isOpen={isNewComplaintOpen}
        onClose={() => setIsNewComplaintOpen(false)}
      />
    </div>
  )
}

export default function AdminLayout() {
  return (
    <AdminProvider>
      <AdminLayoutInner />
    </AdminProvider>
  )
}
