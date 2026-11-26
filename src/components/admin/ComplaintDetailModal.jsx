import React, { useState } from "react"
import { X, CheckCircle2, Clock, MapPin, User, Phone, Mail, ShieldAlert, FileCheck } from "lucide-react"
import { useAdmin } from "../../context/AdminContext.jsx"
import { formatDate, PRIORITY_STYLES, STATUS_STYLES } from "../../utils/formatters.js"

export default function ComplaintDetailModal({ complaint, isOpen, onClose }) {
  const { approveComplaint, markResolved } = useAdmin()
  const [remark, setRemark] = useState("")

  if (!isOpen || !complaint) return null

  const priorityStyle = PRIORITY_STYLES[complaint.priority] || PRIORITY_STYLES.Medium
  const statusStyle = STATUS_STYLES[complaint.status] || STATUS_STYLES.Pending

  const handleApprove = () => {
    approveComplaint(complaint.id)
    onClose()
  }

  const handleResolve = () => {
    markResolved(complaint.id, remark.trim() || "Resolved via Administrative Console.")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#281719]/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EAE3D5] overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EAE3D5] bg-[#FFF9EA]">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-[#59343B] text-sm bg-white border border-[#EAE3D5] px-2.5 py-1 rounded-xl">
              {complaint.id}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
              {complaint.status}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border ${priorityStyle.bg}`}>
              {complaint.priority} Priority
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#59343B] hover:text-[#281719] hover:bg-[#EAE3D5]/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          <div>
            <h2 className="text-xl font-bold text-[#281719] font-serif">
              {complaint.title}
            </h2>
            <p className="text-[#695154] text-xs mt-1.5 leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* Photo Evidence */}
          {complaint.image && (
            <div>
              <span className="text-[10px] uppercase font-bold text-[#59343B] tracking-wider block mb-2">
                Field Photographic Evidence
              </span>
              <div className="rounded-2xl overflow-hidden border border-[#EAE3D5] max-h-72 bg-[#FFF9EA]">
                <img
                  src={complaint.image}
                  alt={complaint.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FFF9EA] border border-[#EAE3D5]">
            <div className="space-y-1.5">
              <span className="text-[#59343B] text-[10px] uppercase font-bold">Location & Sector</span>
              <p className="font-bold text-[#281719] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#59343B]" />
                {typeof complaint.location === "object"
                  ? (complaint.location?.address || complaint.location?.sector || "Sector 17, Chandigarh")
                  : (complaint.location || "Sector 17, Chandigarh")}
              </p>
              <p className="text-[#695154]">
                {typeof complaint.location === "object"
                  ? complaint.location?.sector
                  : (complaint.sector || "Sector 17")}
              </p>
              <p className="text-[#695154] text-[11px] pt-1">Logged on: {formatDate(complaint.submissionDate)}</p>
            </div>

            <div className="space-y-1.5 sm:border-l sm:border-[#EAE3D5] sm:pl-4">
              <span className="text-[#59343B] text-[10px] uppercase font-bold">Reporting Citizen</span>
              <p className="font-bold text-[#281719] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#59343B]" />
                {complaint.citizen?.name || "Citizen Reporter"}
              </p>
              <p className="text-[#695154] flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#59343B]" />
                {complaint.citizen?.phone || "+91 98000 00000"}
              </p>
              <p className="text-[#695154] flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#59343B]" />
                {complaint.citizen?.email || "citizen@civicfix.in"}
              </p>
            </div>
          </div>

          {/* Department & Officer Assignment */}
          <div className="p-4 rounded-2xl bg-white border border-[#EAE3D5] space-y-2">
            <span className="text-[#59343B] text-[10px] uppercase font-bold">Assigned Jurisdiction</span>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#281719]">{complaint.department || "Municipal Corporation"}</span>
              <span className="text-[#695154]">{complaint.assignedOfficer || "Pending Field Officer"}</span>
            </div>
          </div>

          {/* Resolution Remark Input */}
          {complaint.status !== "Resolved" && (
            <div className="space-y-2 pt-2">
              <label className="block font-bold text-[#281719]">
                Officer Dispatch Remarks / Work Order Notes
              </label>
              <textarea
                rows={2}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter field inspection notes, contractor work order number, or resolution remarks..."
                className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#EAE3D5] bg-[#FFF9EA] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-[#EAE3D5] text-xs font-bold text-[#59343B] hover:bg-white transition"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {complaint.status === "Pending" && (
              <button
                onClick={handleApprove}
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#59343B] hover:bg-[#43262C] text-white text-xs font-bold shadow-sm transition active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Dispatch</span>
              </button>
            )}

            {complaint.status !== "Resolved" && (
              <button
                onClick={handleResolve}
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#236336] hover:bg-[#1E5C31] text-white text-xs font-bold shadow-sm transition active:scale-95"
              >
                <FileCheck className="w-4 h-4" />
                <span>Mark Resolved</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
