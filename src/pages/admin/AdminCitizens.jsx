import React, { useState, useMemo } from "react"
import {
  Search,
  Plus,
  Mail,
  Phone,
  Eye,
  ShieldCheck,
  UserCheck,
  UserX,
  X
} from "lucide-react"
import { useAdmin } from "../../context/AdminContext.jsx"
import { formatDate } from "../../utils/formatters.js"

export default function AdminCitizens() {
  const { citizens, complaints, addCitizen, toggleCitizenStatus } = useAdmin()

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  // Selected Citizen for detail modal
  const [selectedCitizen, setSelectedCitizen] = useState(null)

  // Add Citizen Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })
  const [formErrors, setFormErrors] = useState({})

  // Filter logic
  const filteredCitizens = useMemo(() => {
    return citizens.filter((c) => {
      if (statusFilter !== "All" && c.status !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = c.name?.toLowerCase().includes(q)
        const matchesEmail = c.email?.toLowerCase().includes(q)
        const matchesPhone = c.phone?.includes(q)
        const matchesAddress = c.address?.toLowerCase().includes(q)
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesAddress) return false
      }
      return true
    })
  }, [citizens, statusFilter, searchQuery])

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = "Full name is required."
    if (!formData.email.trim()) {
      errs.email = "Email address is required."
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please enter a valid email address."
    }
    if (!formData.phone.trim()) errs.phone = "Phone number is required."
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSaveCitizen = (e) => {
    e.preventDefault()
    if (!validate()) return
    addCitizen({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim() || "Sector 17, Chandigarh"
    })
    setFormData({ name: "", email: "", phone: "", address: "" })
    setIsAddModalOpen(false)
  }

  const citizenComplaints = useMemo(() => {
    if (!selectedCitizen) return []
    return complaints.filter(
      (c) =>
        c.citizen?.email?.toLowerCase() === selectedCitizen.email?.toLowerCase() ||
        c.citizen?.name?.toLowerCase() === selectedCitizen.name?.toLowerCase()
    )
  }, [selectedCitizen, complaints])

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#281719] font-serif flex items-center gap-2">
            <span>Citizens Directory</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EBF5EE] text-[#1E5C31] border border-[#C3E4CD]">
              {citizens.length} Verified Users
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#695154] mt-0.5">
            Manage citizen profiles, complaint filing histories, and account authorizations.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FFD20A] hover:bg-[#EBBF00] text-[#281719] text-xs font-bold shadow-md shadow-[#281719]/10 transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Citizen</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3D5] shadow-civic flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#59343B] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by citizen name, email, phone..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] placeholder-[#695154] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#695154] font-medium">Account Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] font-medium focus:outline-none"
          >
            <option value="All">All Citizens</option>
            <option value="Active">Active Accounts</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Citizens Table */}
      <div className="bg-white rounded-2xl border border-[#EAE3D5] shadow-civic overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF9EA] text-[#59343B] font-bold border-b border-[#EAE3D5]">
              <tr>
                <th className="py-3 px-4">Citizen Profile</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Registered Address</th>
                <th className="py-3 px-4 text-center">Complaints Filed</th>
                <th className="py-3 px-4 text-center">Resolved</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D5]/70">
              {filteredCitizens.map((c) => {
                const myComplaints = complaints.filter(
                  (comp) =>
                    comp.citizen?.email?.toLowerCase() === c.email?.toLowerCase() ||
                    comp.citizen?.name?.toLowerCase() === c.name?.toLowerCase()
                )
                const total = myComplaints.length || c.totalComplaints || 0
                const resolved =
                  myComplaints.filter((comp) => comp.status === "Resolved").length ||
                  c.resolvedComplaints ||
                  0
                const isActive = c.status === "Active"

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-[#FFF9EA]/50 transition group"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FFD20A]/70"
                        />
                        <div>
                          <p className="font-bold text-[#281719]">{c.name}</p>
                          <span className="text-[10px] font-mono font-bold text-[#59343B]">{c.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-semibold text-[#281719] flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#59343B]" />
                        {c.email}
                      </p>
                      <p className="text-[11px] text-[#695154] flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-[#59343B]" />
                        {c.phone}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-[#695154] truncate">
                      {c.address}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#281719] font-serif text-sm">
                      {total}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#1E5C31] font-serif text-sm">
                      {resolved}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          isActive
                            ? "bg-[#EBF5EE] text-[#1E5C31] border-[#C3E4CD]"
                            : "bg-[#FAECEE] text-[#8C2329] border-[#EFC3C6]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? "bg-[#236336]" : "bg-[#93272C]"
                          }`}
                        />
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCitizen(c)}
                          className="p-1.5 rounded-lg border border-[#EAE3D5] bg-white hover:border-[#59343B] text-[#59343B] hover:bg-[#FFF9EA] transition"
                          title="View Citizen Profile & Complaints"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleCitizenStatus(c.id)}
                          className={`p-1.5 rounded-lg border transition ${
                            isActive
                              ? "border-[#EAE3D5] text-[#59343B] hover:bg-[#FFF9EA]"
                              : "border-[#C3E4CD] text-[#1E5C31] hover:bg-[#EBF5EE]"
                          }`}
                          title={isActive ? "Suspend Citizen" : "Re-activate Citizen"}
                        >
                          {isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filteredCitizens.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[#695154]">
                    No citizens match the search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Citizen Details Modal */}
      {selectedCitizen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#281719]/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EAE3D5] overflow-hidden my-6">
            <div className="flex items-center justify-between p-6 border-b border-[#EAE3D5] bg-[#FFF9EA]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCitizen.avatar}
                  alt={selectedCitizen.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#FFD20A]"
                />
                <div>
                  <h3 className="text-lg font-bold text-[#281719] font-serif">
                    {selectedCitizen.name}
                  </h3>
                  <p className="text-xs text-[#59343B] font-mono font-bold">
                    ID: {selectedCitizen.id} • Registered Member
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCitizen(null)}
                className="p-1.5 rounded-lg text-[#59343B] hover:text-[#281719] hover:bg-[#EAE3D5]/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Contact Information & Trust Score */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FFF9EA] border border-[#EAE3D5]">
                <div className="space-y-1.5">
                  <span className="text-[#59343B] text-[10px] uppercase font-bold">Contact</span>
                  <p className="font-bold text-[#281719]">{selectedCitizen.email}</p>
                  <p className="text-[#695154]">{selectedCitizen.phone}</p>
                  <p className="text-[#695154]">{selectedCitizen.address}</p>
                </div>
                <div className="space-y-1.5 sm:border-l sm:border-[#EAE3D5] sm:pl-4">
                  <span className="text-[#59343B] text-[10px] uppercase font-bold">Verification</span>
                  <p className="flex items-center gap-1.5 text-[#1E5C31] font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#236336]" />
                    Verified Citizen Identity
                  </p>
                  <p className="text-[#695154]">
                    Community Trust Score: <strong className="text-[#281719]">{selectedCitizen.trustScore || 95}%</strong>
                  </p>
                  <p className="text-[#695154]">Joined on: {formatDate(selectedCitizen.joinedDate)}</p>
                </div>
              </div>

              {/* Citizen's Complaint History */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#59343B] font-serif mb-3 flex items-center justify-between">
                  <span>Complaints Submitted ({citizenComplaints.length})</span>
                  <span className="text-[11px] text-[#1E5C31] font-bold">
                    {citizenComplaints.filter((c) => c.status === "Resolved").length} Resolved
                  </span>
                </h4>

                <div className="space-y-2.5">
                  {citizenComplaints.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-2xl border border-[#EAE3D5] bg-[#FFF9EA]/40 hover:border-[#59343B] transition flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#59343B]">
                            {c.id}
                          </span>
                          <span className="font-bold text-[#281719]">
                            {c.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#695154] mt-0.5">
                          {c.category} • {typeof c.location === "object" ? (c.location?.sector || "Sector 17") : (c.sector || c.location || "Sector 17")} • {formatDate(c.submissionDate)}
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          c.status === "Resolved"
                            ? "bg-[#EBF5EE] text-[#1E5C31] border-[#C3E4CD]"
                            : c.status === "In Progress"
                            ? "bg-[#F4ECEE] text-[#59343B] border-[#DEC7CB]"
                            : "bg-[#FFF4D0] text-[#7A5300] border-[#F2DE8A]"
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  ))}

                  {citizenComplaints.length === 0 && (
                    <div className="p-6 text-center text-[#695154] rounded-2xl bg-[#FFF9EA]">
                      No complaints registered in system by this citizen yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#EAE3D5] bg-[#FFF9EA] flex justify-end">
              <button
                onClick={() => setSelectedCitizen(null)}
                className="py-2 px-5 rounded-xl border border-[#EAE3D5] text-xs font-bold text-[#59343B] hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Citizen Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#281719]/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#EAE3D5] p-6">
            <h3 className="text-lg font-bold text-[#281719] font-serif mb-4">
              Register New Citizen
            </h3>
            <form onSubmit={handleSaveCitizen} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#281719] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
                />
                {formErrors.name && <p className="text-[#93272C] text-[11px] mt-1 font-semibold">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block font-bold text-[#281719] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ramesh@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
                />
                {formErrors.email && <p className="text-[#93272C] text-[11px] mt-1 font-semibold">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block font-bold text-[#281719] mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
                />
                {formErrors.phone && <p className="text-[#93272C] text-[11px] mt-1 font-semibold">{formErrors.phone}</p>}
              </div>

              <div>
                <label className="block font-bold text-[#281719] mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House 402, Sector 17-C, Chandigarh"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE3D5]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2 px-4 rounded-xl border border-[#EAE3D5] text-[#59343B] font-bold hover:bg-[#FFF9EA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#FFD20A] hover:bg-[#EBBF00] text-[#281719] font-bold shadow-md shadow-[#281719]/10"
                >
                  Register Citizen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
