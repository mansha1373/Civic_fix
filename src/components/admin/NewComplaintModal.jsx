import React, { useState } from "react"
import { X, Plus, AlertCircle } from "lucide-react"
import { useAdmin } from "../../context/AdminContext.jsx"

export default function NewComplaintModal({ isOpen, onClose }) {
  const { addComplaint, departments } = useAdmin()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Roads and Infrastructure",
    priority: "High",
    sector: "Sector 17",
    address: "Near Plaza Fountain, Sector 17-C, Chandigarh",
    citizenName: "Dr. Vandana Rao (Admin Logged)",
    citizenPhone: "+91 172 274000"
  })

  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || formData.title.trim().length < 5) {
      setError("Please provide a title of at least 5 characters.")
      return
    }

    addComplaint({
      title: formData.title.trim(),
      description: formData.description.trim() || "Reported through central administrative dispatch.",
      category: formData.category,
      priority: formData.priority,
      status: "In Progress",
      citizen: {
        name: formData.citizenName,
        email: "admin.vandana@civicfix.gov",
        phone: formData.citizenPhone,
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      },
      location: {
        address: formData.address,
        sector: formData.sector
      },
      department: formData.category,
      assignedOfficer: "Rapid Response Unit"
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#281719]/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#EAE3D5] overflow-hidden my-6">
        <div className="flex items-center justify-between p-6 border-b border-[#EAE3D5] bg-[#FFF9EA]">
          <h3 className="text-lg font-bold text-[#281719] font-serif flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#59343B]" />
            <span>Log Direct Municipal Issue</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#59343B] hover:text-[#281719]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-[#FAECEE] border border-[#EFC3C6] text-[#8C2329] flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-[#281719] mb-1">
              Issue Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Broken water conduit leaking on main road"
              className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] font-medium focus:outline-none focus:ring-2 focus:ring-[#59343B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#281719] mb-1">
                Department / Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] font-medium focus:outline-none focus:ring-2 focus:ring-[#59343B]"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#281719] mb-1">
                Urgency Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] font-medium focus:outline-none focus:ring-2 focus:ring-[#59343B]"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#281719] mb-1">
                Sector / Ward
              </label>
              <input
                type="text"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                placeholder="Sector 17"
                className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] font-medium focus:outline-none focus:ring-2 focus:ring-[#59343B]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#281719] mb-1">
                Specific Landmark Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Near fountain"
                className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] font-medium focus:outline-none focus:ring-2 focus:ring-[#59343B]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#281719] mb-1">
              Description & Field Instructions
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of issue for duty junior engineer..."
              className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE3D5]">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl border border-[#EAE3D5] text-[#59343B] font-bold hover:bg-[#FFF9EA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-[#FFD20A] hover:bg-[#EBBF00] text-[#281719] font-bold shadow-md shadow-[#281719]/10"
            >
              Log Grievance Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
