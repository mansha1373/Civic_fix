import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  AlertTriangle,
  FileCheck,
  Info,
  ExternalLink
} from "lucide-react"
import { useAdmin } from "../../context/AdminContext.jsx"

const TABS = [
  { id: "all", label: "All Notifications" },
  { id: "unread", label: "Unread" },
  { id: "complaints", label: "Complaints" },
  { id: "system", label: "System Updates" }
]

export default function AdminNotifications() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
    stats
  } = useAdmin()

  const [activeTab, setActiveTab] = useState("all")

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read
    if (activeTab === "complaints") return n.type?.startsWith("complaint")
    if (activeTab === "system") return n.type === "system"
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#281719] font-serif flex items-center gap-2">
            <span>Administrative Notifications</span>
            {stats.unreadNotifications > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFD20A] text-[#281719]">
                {stats.unreadNotifications} unread
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#695154] mt-0.5">
            Audit logs, emergency civic alerts, citizen ticket dispatches, and SLA milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {notifications.length > 0 && (
            <>
              <button
                onClick={markAllNotificationsRead}
                className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-[#EAE3D5] bg-white text-[#59343B] hover:bg-[#FFF9EA] text-xs font-bold shadow-sm transition"
              >
                <CheckCheck className="w-4 h-4 text-[#59343B]" />
                <span>Mark All Read</span>
              </button>
              <button
                onClick={clearAllNotifications}
                className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-[#EFC3C6] bg-[#FAECEE] text-[#8C2329] hover:bg-[#F2C5C7] text-xs font-bold shadow-sm transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Tray</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#EAE3D5] pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === tab.id
                ? "bg-[#59343B] text-white shadow-sm"
                : "text-[#59343B] hover:bg-[#F5ECEE]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-[#EAE3D5] shadow-civic divide-y divide-[#EAE3D5]/60 overflow-hidden">
        {filteredNotifications.map((notif) => {
          let icon = <Info className="w-4 h-4 text-[#59343B]" />
          let iconBg = "bg-[#F5ECEE] text-[#59343B]"

          if (notif.type === "complaint_critical") {
            icon = <AlertTriangle className="w-4 h-4 text-[#93272C]" />
            iconBg = "bg-[#FAECEE] text-[#93272C]"
          } else if (notif.type === "complaint_resolved") {
            icon = <FileCheck className="w-4 h-4 text-[#1E5C31]" />
            iconBg = "bg-[#EBF5EE] text-[#1E5C31]"
          }

          return (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start gap-4 transition hover:bg-[#FFF9EA]/60 ${
                !notif.read ? "bg-[#FFF9EA]/40" : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
                {icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#281719]">
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-[#695154] shrink-0">{notif.timestamp}</span>
                </div>

                <p className="text-xs text-[#59343B] mt-1 leading-relaxed">
                  {notif.message}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px]">
                  {notif.complaintId && (
                    <Link
                      to={`/admin/complaints?search=${encodeURIComponent(notif.complaintId)}`}
                      className="inline-flex items-center gap-1 font-bold text-[#59343B] hover:underline"
                    >
                      <span>View Ticket ({notif.complaintId})</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                  {notif.category && (
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FFF9EA] border border-[#EAE3D5] text-[#59343B] font-semibold">
                      {notif.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0 self-center">
                {!notif.read && (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="p-1.5 rounded-lg text-[#59343B] hover:text-[#281719] hover:bg-[#FFF9EA] transition"
                    title="Mark as Read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="p-1.5 rounded-lg text-[#93272C] hover:bg-[#FAECEE] transition"
                  title="Delete Notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}

        {filteredNotifications.length === 0 && (
          <div className="p-12 text-center text-[#695154]">
            <Bell className="w-10 h-10 mx-auto text-[#59343B]/30 mb-2" />
            <p className="text-sm font-bold font-serif text-[#281719]">No notifications in this folder</p>
            <p className="text-xs text-[#695154] mt-1">You're all caught up with municipal updates!</p>
          </div>
        )}
      </div>
    </div>
  )
}
