import React from "react"
import { AlertTriangle, Clock, MapPin } from "lucide-react"
import { formatDate } from "../../utils/formatters.js"

export default function UrgentAlerts({ complaints = [], onSelectComplaint }) {
  const urgent = complaints.filter(
    (c) => (c.priority === "Critical" || c.priority === "High") && c.status !== "Resolved"
  ).slice(0, 4)

  return (
    <div className="bg-white p-5 rounded-3xl border border-[#EAE3D5] shadow-civic space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-[#281719] font-serif flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-[#93272C]" />
          <span>Urgent Attention Required</span>
        </h4>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FAECEE] text-[#93272C] border border-[#EFC3C6]">
          {urgent.length} Priority
        </span>
      </div>

      <div className="space-y-2.5">
        {urgent.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectComplaint && onSelectComplaint(c)}
            className="p-3 rounded-2xl border border-[#EAE3D5] bg-[#FFF9EA]/40 hover:border-[#59343B] transition cursor-pointer text-xs group"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono font-bold text-[#59343B] text-[11px]">
                {c.id}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAECEE] text-[#93272C] border border-[#EFC3C6]">
                {c.priority}
              </span>
            </div>

            <p className="font-bold text-[#281719] mt-1 group-hover:text-[#59343B] transition line-clamp-1">
              {c.title}
            </p>

            <div className="flex items-center justify-between text-[11px] text-[#695154] mt-2 pt-1.5 border-t border-[#EAE3D5]/60">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#59343B]" />
                {typeof c.location === "object" ? (c.location?.sector || "Sector 17") : (c.sector || c.location || "Sector 17")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#695154]" />
                {formatDate(c.submissionDate)}
              </span>
            </div>
          </div>
        ))}

        {urgent.length === 0 && (
          <div className="p-6 text-center text-[#695154] text-xs">
            No critical escalations pending. All high-urgency reports are in order!
          </div>
        )}
      </div>
    </div>
  )
}
