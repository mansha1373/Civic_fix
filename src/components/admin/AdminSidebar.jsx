import React from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  FileText,
  Building2,
  Users,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  Compass,
  X
} from "lucide-react"
import { useAdmin } from "../../context/AdminContext.jsx"

const NAV_ITEMS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/complaints", label: "Complaints", icon: FileText },
  { to: "/admin/departments", label: "Departments", icon: Building2 },
  { to: "/admin/citizens", label: "Citizens Directory", icon: Users },
  { to: "/admin/analytics", label: "Analytics & SLA", icon: BarChart3 },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings }
]

export default function AdminSidebar({ isOpen, onClose }) {
  const { stats, logout } = useAdmin()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/admin/login")
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#281719]/50 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#59343B] text-white flex flex-col justify-between border-r border-[#4A282E] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#4A282E] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD20A] text-[#281719] flex items-center justify-center font-serif font-extrabold text-xl shadow-md">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-serif font-extrabold text-lg tracking-tight text-white leading-tight">
                  CivicFix<span className="text-[#FFD20A]">.</span>
                </h1>
                <span className="text-[10px] font-bold text-[#FFD20A] tracking-wider uppercase">
                  Admin Console
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-[#EAE3D5] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            {NAV_ITEMS.map((item) => {
              const IconComp = item.icon
              const isNotif = item.to === "/admin/notifications"
              const badgeCount = isNotif ? stats.unreadNotifications : null

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl transition ${
                      isActive
                        ? "bg-[#FFD20A] text-[#281719] font-bold shadow-md shadow-[#281719]/20"
                        : "text-[#EAE3D5] hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4 stroke-[2.2]" />
                    <span>{item.label}</span>
                  </div>

                  {badgeCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFD20A] text-[#281719]">
                      {badgeCount}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[#4A282E] space-y-2">
          {/* Switch to Citizen Portal */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 text-[#FFF9EA] text-xs font-bold transition"
            title="Switch to Citizen / Resident Portal"
          >
            <Compass className="w-4 h-4 text-[#FFD20A]" />
            <span>Citizen Portal</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[#F2C5C7] hover:bg-[#FAECEE]/15 hover:text-white text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
