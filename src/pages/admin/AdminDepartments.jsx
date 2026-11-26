import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  Phone,
  Mail,
  User,
  X,
  Truck,
  Droplets,
  Zap,
  Sparkles,
  Trash,
  ShieldAlert
} from "lucide-react"
import { useAdmin } from "../../context/AdminContext.jsx"

const ICONS_MAP = {
  Truck: Truck,
  Droplets: Droplets,
  Zap: Zap,
  Sparkles: Sparkles,
  Trash2: Trash,
  ShieldAlert: ShieldAlert,
  Building2: Building2
}

export default function AdminDepartments() {
  const { departments, complaints, addDepartment, updateDepartment, deleteDepartment } = useAdmin()
  const navigate = useNavigate()

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  const [deletingDept, setDeletingDept] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    title: "Executive Officer",
    email: "",
    phone: "",
    description: "",
    icon: "Building2",
    status: "Active"
  })
  const [formErrors, setFormErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = "Department name is required."
    if (!formData.head.trim()) errs.head = "Department head name is required."
    if (!formData.email.trim()) {
      errs.email = "Contact email is required."
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please enter a valid email address."
    }
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      head: "",
      title: "Executive Officer",
      email: "",
      phone: "+91 172 274000",
      description: "",
      icon: "Building2",
      status: "Active"
    })
    setFormErrors({})
    setIsAddModalOpen(true)
  }

  const handleOpenEdit = (dept) => {
    setEditingDept(dept)
    setFormData({
      name: dept.name,
      head: dept.head,
      title: dept.title || "Executive Officer",
      email: dept.email,
      phone: dept.phone,
      description: dept.description || "",
      icon: dept.icon || "Building2",
      status: dept.status || "Active"
    })
    setFormErrors({})
  }

  const handleSaveAdd = (e) => {
    e.preventDefault()
    if (!validate()) return
    addDepartment(formData)
    setIsAddModalOpen(false)
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!validate()) return
    updateDepartment(editingDept.id, formData)
    setEditingDept(null)
  }

  const handleDeleteConfirm = () => {
    if (deletingDept) {
      deleteDepartment(deletingDept.id)
      setDeletingDept(null)
    }
  }

  const handleViewTickets = (deptName) => {
    navigate(`/admin/complaints?search=${encodeURIComponent(deptName)}`)
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#281719] font-serif flex items-center gap-2">
            <span>Department Management</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF4D0] text-[#7A5300] border border-[#F2DE8A]">
              {departments.length} Active Wings
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#695154] mt-0.5">
            Oversee municipal divisions, assigned grievance quotas, executive heads, and SLA metrics.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FFD20A] hover:bg-[#EBBF00] text-[#281719] text-xs font-bold shadow-md shadow-[#281719]/10 transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const deptComplaints = complaints.filter(
            (c) =>
              c.category?.toLowerCase() === dept.name.toLowerCase() ||
              c.department?.toLowerCase() === dept.name.toLowerCase()
          )
          const totalAssigned = deptComplaints.length || dept.assignedComplaints || 0
          const resolvedCount =
            deptComplaints.filter((c) => c.status === "Resolved").length || dept.resolvedComplaints || 0
          const pendingCount =
            deptComplaints.filter((c) => c.status === "Pending").length || dept.pendingComplaints || 0
          const resolutionRate = totalAssigned > 0 ? Math.round((resolvedCount / totalAssigned) * 100) : 100

          const IconComponent = ICONS_MAP[dept.icon] || Building2

          return (
            <div
              key={dept.id}
              className="bg-white rounded-3xl border border-[#EAE3D5] shadow-civic p-6 flex flex-col justify-between transition duration-200 card-hover-lift"
            >
              <div>
                {/* Header: Icon, Name, Status, Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF9EA] text-[#59343B] flex items-center justify-center border border-[#EAE3D5] shrink-0">
                      <IconComponent className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#281719] font-serif leading-tight">
                        {dept.name}
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-[#695154]">
                        {dept.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(dept)}
                      className="p-1.5 rounded-lg text-[#59343B] hover:text-[#281719] hover:bg-[#FFF9EA] transition"
                      title="Edit Department"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingDept(dept)}
                      className="p-1.5 rounded-lg text-[#93272C] hover:bg-[#FAECEE] transition"
                      title="Delete Department"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#695154] mt-3 line-clamp-2 leading-relaxed">
                  {dept.description || "Manages municipal infrastructure maintenance and emergency incident response."}
                </p>

                {/* Head Info */}
                <div className="mt-4 p-3.5 rounded-2xl bg-[#FFF9EA] border border-[#EAE3D5] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#281719] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#59343B]" />
                      {dept.head}
                    </span>
                    <span className="text-[10px] text-[#695154] font-medium">{dept.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#695154] text-[11px] pt-1 border-t border-[#EAE3D5]/60">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#59343B]" />
                      {dept.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#59343B]" />
                      {dept.phone}
                    </span>
                  </div>
                </div>

                {/* Complaint Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="p-2.5 rounded-xl bg-[#FFF9EA] border border-[#EAE3D5]">
                    <span className="text-[10px] text-[#695154] uppercase font-bold">Assigned</span>
                    <p className="text-lg font-bold text-[#281719] mt-0.5 font-serif">
                      {totalAssigned}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FFF4D0] border border-[#F2DE8A]">
                    <span className="text-[10px] text-[#7A5300] uppercase font-bold">Pending</span>
                    <p className="text-lg font-bold text-[#7A5300] mt-0.5 font-serif">
                      {pendingCount}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#EBF5EE] border border-[#C3E4CD]">
                    <span className="text-[10px] text-[#1E5C31] uppercase font-bold">Resolved</span>
                    <p className="text-lg font-bold text-[#1E5C31] mt-0.5 font-serif">
                      {resolvedCount}
                    </p>
                  </div>
                </div>

                {/* Resolution Progress Bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#695154] font-medium">Resolution Efficiency</span>
                    <span className="font-bold text-[#281719]">{resolutionRate}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FFF9EA] border border-[#EAE3D5] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        resolutionRate >= 80 ? "bg-[#236336]" : resolutionRate >= 60 ? "bg-[#59343B]" : "bg-[#FFD20A]"
                      }`}
                      style={{ width: `${resolutionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-5 pt-3.5 border-t border-[#EAE3D5] flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1E5C31]">
                  <span className="w-2 h-2 rounded-full bg-[#236336]" />
                  {dept.status || "Active"}
                </span>

                <button
                  onClick={() => handleViewTickets(dept.name)}
                  className="flex items-center gap-1 text-xs font-bold text-[#59343B] hover:text-[#281719] transition group"
                >
                  <span>View Tickets</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add / Edit Department Modal */}
      {(isAddModalOpen || editingDept) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#281719]/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#EAE3D5] overflow-hidden my-6">
            <div className="flex items-center justify-between p-6 border-b border-[#EAE3D5] bg-[#FFF9EA]">
              <h3 className="text-lg font-bold text-[#281719] font-serif">
                {editingDept ? "Edit Department" : "Add Municipal Department"}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false)
                  setEditingDept(null)
                }}
                className="p-1 rounded-lg text-[#59343B] hover:text-[#281719]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingDept ? handleSaveEdit : handleSaveAdd} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#281719] mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Roads and Infrastructure"
                  className={`w-full px-3 py-2 rounded-xl border bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B] ${
                    formErrors.name ? "border-[#93272C]" : "border-[#EAE3D5]"
                  }`}
                />
                {formErrors.name && <p className="text-[#93272C] text-[11px] mt-1 font-semibold">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#281719] mb-1">
                    Department Head *
                  </label>
                  <input
                    type="text"
                    value={formData.head}
                    onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                    placeholder="Er. Ramesh Kulkarni"
                    className={`w-full px-3 py-2 rounded-xl border bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B] ${
                      formErrors.head ? "border-[#93272C]" : "border-[#EAE3D5]"
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#281719] mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Chief Engineer"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#281719] mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="roads@civicfix.gov"
                    className={`w-full px-3 py-2 rounded-xl border bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B] ${
                      formErrors.email ? "border-[#93272C]" : "border-[#EAE3D5]"
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#281719] mb-1">
                    Emergency Hotline
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 172 274001"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#281719] mb-1">
                  Scope of Responsibilities
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of municipal duties and purview..."
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE3D5]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false)
                    setEditingDept(null)
                  }}
                  className="py-2 px-4 rounded-xl border border-[#EAE3D5] text-[#59343B] font-bold hover:bg-[#FFF9EA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#FFD20A] hover:bg-[#EBBF00] text-[#281719] font-bold shadow-md shadow-[#281719]/10"
                >
                  {editingDept ? "Save Changes" : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#281719]/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-[#EAE3D5]">
            <div className="w-12 h-12 rounded-2xl bg-[#FAECEE] text-[#93272C] flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#281719] font-serif text-center">
              Delete Department?
            </h3>
            <p className="text-xs text-[#695154] text-center mt-1.5 leading-relaxed">
              Are you sure you want to remove{" "}
              <strong className="text-[#281719]">{deletingDept.name}</strong>?
              Associated complaints will remain in archive.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setDeletingDept(null)}
                className="flex-1 py-2 px-3 rounded-xl border border-[#EAE3D5] text-xs font-bold text-[#59343B] hover:bg-[#FFF9EA]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 px-3 rounded-xl bg-[#93272C] hover:bg-[#7A1F24] text-white text-xs font-bold shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
