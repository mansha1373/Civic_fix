import React from "react"
import { Eye, MapPin, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { formatDate, PRIORITY_STYLES, STATUS_STYLES } from "../../utils/formatters.js"

export default function RecentComplaintsTable({ complaints = [], onSelectComplaint }) {
  const recent = complaints.slice(0, 6)

  return (
    <div className="bg-white rounded-3xl border border-[#EAE3D5] shadow-civic overflow-hidden">
      <div className="p-5 border-b border-[#EAE3D5] flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#281719] font-serif">
            Recent Grievance Submissions
          </h3>
          <p className="text-xs text-[#695154] mt-0.5">
            Latest incoming civic issues queued for municipal officer review
          </p>
        </div>

        <Link
          to="/admin/complaints"
          className="flex items-center gap-1 text-xs font-bold text-[#59343B] hover:text-[#281719] transition group"
        >
          <span>View All Complaints</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FFF9EA] text-[#59343B] font-bold border-b border-[#EAE3D5]">
            <tr>
              <th className="py-3 px-4">Ticket ID</th>
              <th className="py-3 px-4">Complaint Title</th>
              <th className="py-3 px-3">Citizen</th>
              <th className="py-3 px-3">Sector</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE3D5]/70">
            {recent.map((c) => {
              const priorityStyle = PRIORITY_STYLES[c.priority] || PRIORITY_STYLES.Medium
              const statusStyle = STATUS_STYLES[c.status] || STATUS_STYLES.Pending

              return (
                <tr
                  key={c.id}
                  className="hover:bg-[#FFF9EA]/50 transition group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-[#59343B] whitespace-nowrap">
                    {c.id}
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate font-bold text-[#281719]">
                    <span
                      onClick={() => onSelectComplaint && onSelectComplaint(c)}
                      className="cursor-pointer hover:text-[#59343B] transition"
                    >
                      {c.title}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-[#281719] font-medium">
                    {c.citizen?.name || "Citizen"}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-[#695154]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#59343B]" />
                      {typeof c.location === "object" ? (c.location?.sector || "Sector 17") : (c.sector || c.location || "Sector 17")}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${priorityStyle.bg}`}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectComplaint && onSelectComplaint(c)}
                      className="p-1.5 rounded-lg border border-[#EAE3D5] bg-white hover:border-[#59343B] text-[#59343B] hover:bg-[#FFF9EA] transition"
                      title="Inspect Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              )
            })}

            {recent.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[#695154]">
                  No complaints registered in queue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
