import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Menu,
  Search,
  Bell,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Info
} from "lucide-react"
import { useAdmin } from "../../context/AdminContext.jsx"

export default function AdminTopbar({ onToggleSidebar, onOpenNewComplaint }) {
  const { currentUser, stats, toasts } = useAdmin()
  const [searchVal, setSearchVal] = useState("")
  const navigate = useNavigate()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/admin/complaints?search=${encodeURIComponent(searchVal.trim())}`)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FFF9EA] border-b border-[#EAE3D5] px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-[#59343B] hover:bg-[#EAE3D5]/50 transition"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-[#59343B] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Quick search ticket ID, citizen, sector..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-[#EAE3D5] bg-white text-[#281719] placeholder-[#695154] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
            />
          </form>
        </div>

        {/* Right: Quick actions, notifications, admin profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewComplaint}
            className="hidden sm:flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-[#FFD20A] hover:bg-[#EBBF00] text-[#281719] text-xs font-bold shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Issue</span>
          </button>

          {/* Notifications Link */}
          <Link
            to="/admin/notifications"
            className="relative p-2 rounded-xl text-[#59343B] hover:bg-[#EAE3D5]/50 transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {stats.unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#93272C] ring-2 ring-white" />
            )}
          </Link>

          {/* Profile Pill */}
          <Link
            to="/admin/settings"
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-2xl hover:bg-[#EAE3D5]/40 transition border border-transparent hover:border-[#EAE3D5]"
          >
            <img
              src={currentUser.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"}
              alt={currentUser.name}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#FFD20A]"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-[#281719] leading-tight">
                {currentUser.name}
              </p>
              <span className="text-[10px] text-[#59343B] font-semibold">
                {currentUser.title || "Administrator"}
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Floating Toast Alerts Container */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto p-3.5 rounded-2xl bg-white border border-[#EAE3D5] shadow-2xl flex items-start gap-3 animate-fade-in text-xs"
          >
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-[#236336] shrink-0 mt-0.5" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-[#93272C] shrink-0 mt-0.5" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-[#59343B] shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold text-[#281719]">{toast.title}</p>
              <p className="text-[#695154] text-[11px] mt-0.5">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
