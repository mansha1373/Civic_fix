import React from "react"
import { Building2 } from "lucide-react"

export default function DepartmentMiniMeter({ departments = [] }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-[#EAE3D5] shadow-civic space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-[#281719] font-serif flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-[#59343B]" />
          <span>Departmental Quota Clearance</span>
        </h4>
      </div>

      <div className="space-y-3 text-xs">
        {departments.slice(0, 5).map((d) => {
          const assigned = d.assignedComplaints || 1
          const resolved = d.resolvedComplaints || 0
          const rate = Math.round((resolved / assigned) * 100)

          return (
            <div key={d.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#281719] truncate max-w-[170px]">
                  {d.name}
                </span>
                <span className="text-[11px] font-bold text-[#59343B] font-mono">
                  {rate}% ({resolved}/{assigned})
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#FFF9EA] border border-[#EAE3D5] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#59343B] transition-all duration-500"
                  style={{ width: `${Math.min(rate, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
