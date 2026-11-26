import React, { useState, useMemo, useEffect } from "react"
import { useSearchParams, useOutletContext } from "react-router-dom"
import {
  Search,
  ArrowUpDown,
  Plus,
  Eye,
  CheckCircle2,
  FileCheck,
  Download,
  ChevronLeft,
  ChevronRight,
  MapPin,
  AlertCircle
} from "lucide-react"
import { useAdmin } from "../../context/AdminContext.jsx"
import ComplaintDetailModal from "../../components/admin/ComplaintDetailModal.jsx"
import { formatDate, PRIORITY_STYLES, STATUS_STYLES } from "../../utils/formatters.js"
import { exportToCSV } from "../../utils/exportUtils.js"

const CATEGORIES = [
  "All Categories",
  "Roads and Infrastructure",
  "Water Supply",
  "Electricity",
  "Sanitation",
  "Waste Management",
  "Public Safety"
]

const PRIORITIES = ["All Priorities", "Critical", "High", "Medium", "Low"]

const STATUS_TABS = [
  { id: "All", label: "All Complaints" },
  { id: "Pending", label: "Pending" },
  { id: "In Progress", label: "In Progress" },
  { id: "Resolved", label: "Resolved" },
  { id: "Rejected", label: "Rejected" }
]

export default function AdminComplaints({ defaultStatus }) {
  const { complaints, approveComplaint, markResolved, stats } = useAdmin()
  const { openNewComplaint } = useOutletContext()
  const [searchParams] = useSearchParams()

  const initialSearch = searchParams.get("search") || ""

  // Local Filter & Search States
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [statusTab, setStatusTab] = useState(defaultStatus || "All")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedPriority, setSelectedPriority] = useState("All Priorities")
  const [sortField, setSortField] = useState("submissionDate")
  const [sortDirection, setSortDirection] = useState("desc")

  // Selected complaint for modal
  const [selectedComplaint, setSelectedComplaint] = useState(null)

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([])

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  // Sync when defaultStatus prop changes
  useEffect(() => {
    if (defaultStatus) {
      setStatusTab(defaultStatus)
    }
  }, [defaultStatus])

  // Sync URL search param
  useEffect(() => {
    if (searchParams.get("search")) {
      setSearchQuery(searchParams.get("search"))
    }
  }, [searchParams])

  // Filter & Sort Logic
  const filteredComplaints = useMemo(() => {
    return complaints
      .filter((c) => {
        // 1. Status Filter
        if (statusTab !== "All" && c.status !== statusTab) {
          return false
        }
        // 2. Category Filter
        if (selectedCategory !== "All Categories" && c.category !== selectedCategory) {
          return false
        }
        // 3. Priority Filter
        if (selectedPriority !== "All Priorities" && c.priority !== selectedPriority) {
          return false
        }
        // 4. Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const matchesId = c.id?.toLowerCase().includes(q)
          const matchesTitle = c.title?.toLowerCase().includes(q)
          const matchesCitizen = c.citizen?.name?.toLowerCase().includes(q)
          const locText = typeof c.location === "object"
            ? `${c.location?.address || ""} ${c.location?.sector || ""}`
            : `${c.location || ""} ${c.sector || ""}`
          const matchesLoc = locText.toLowerCase().includes(q)
          const matchesCat = c.category?.toLowerCase().includes(q)
          if (!matchesId && !matchesTitle && !matchesCitizen && !matchesLoc && !matchesCat) {
            return false
          }
        }
        return true
      })
      .sort((a, b) => {
        let valA = a[sortField]
        let valB = b[sortField]

        if (sortField === "citizen") {
          valA = a.citizen?.name || ""
          valB = b.citizen?.name || ""
        }

        if (sortField === "submissionDate") {
          valA = new Date(valA || 0).getTime()
          valB = new Date(valB || 0).getTime()
        }

        if (valA < valB) return sortDirection === "asc" ? -1 : 1
        if (valA > valB) return sortDirection === "asc" ? 1 : -1
        return 0
      })
  }, [complaints, statusTab, selectedCategory, selectedPriority, searchQuery, sortField, sortDirection])

  // Pagination Slice
  const totalPages = Math.ceil(filteredComplaints.length / pageSize) || 1
  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredComplaints.slice(start, start + pageSize)
  }, [filteredComplaints, currentPage, pageSize])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Bulk Selection Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedComplaints.map((c) => c.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleBulkApprove = () => {
    selectedIds.forEach((id) => approveComplaint(id))
    setSelectedIds([])
  }

  const handleBulkResolve = () => {
    selectedIds.forEach((id) => markResolved(id, "Bulk resolved via administrator selection."))
    setSelectedIds([])
  }

  const handleExportSelected = () => {
    const dataToExport = complaints
      .filter((c) => (selectedIds.length ? selectedIds.includes(c.id) : true))
      .map((c) => ({
        ID: c.id,
        Title: c.title,
        Category: c.category,
        Priority: c.priority,
        Status: c.status,
        Citizen: c.citizen?.name || "Citizen",
        Phone: c.citizen?.phone || "",
        Address: c.location?.address || "",
        Sector: c.location?.sector || "",
        Date: c.submissionDate
      }))

    exportToCSV(`CivicFix-Complaints-Export`, dataToExport)
  }

  const getTabCount = (tabId) => {
    if (tabId === "All") return complaints.length
    if (tabId === "Pending") return stats.pending
    if (tabId === "In Progress") return stats.inProgress
    if (tabId === "Resolved") return stats.resolved
    if (tabId === "Rejected") return stats.rejected
    return 0
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#281719] font-serif flex items-center gap-2">
            <span>Complaints Management</span>
            {defaultStatus && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFD20A] text-[#281719]">
                {defaultStatus} Only
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#695154] mt-0.5">
            View, investigate, prioritize, assign and resolve citizen-reported civic grievances.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportSelected}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-[#EAE3D5] bg-white text-[#59343B] hover:bg-[#FFF9EA] text-xs font-bold shadow-sm transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openNewComplaint}
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#FFD20A] hover:bg-[#EBBF00] text-[#281719] text-xs font-bold shadow-md shadow-[#281719]/10 transition active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Complaint</span>
          </button>
        </div>
      </div>

      {/* Status Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#EAE3D5] pb-1 scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const isActive = statusTab === tab.id
          const count = getTabCount(tab.id)
          return (
            <button
              key={tab.id}
              onClick={() => {
                setStatusTab(tab.id)
                setCurrentPage(1)
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition whitespace-nowrap ${
                isActive
                  ? "bg-[#59343B] text-white shadow-sm"
                  : "text-[#59343B] hover:bg-[#F5ECEE]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                  isActive
                    ? "bg-[#FFD20A] text-[#281719]"
                    : "bg-[#EAE3D5] text-[#59343B]"
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3D5] shadow-civic space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#59343B] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search by ID, keyword, citizen name, sector..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] placeholder-[#695154] focus:outline-none focus:ring-2 focus:ring-[#59343B]"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] font-medium focus:outline-none focus:ring-2 focus:ring-[#59343B]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedPriority}
              onChange={(e) => {
                setSelectedPriority(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] font-medium focus:outline-none focus:ring-2 focus:ring-[#59343B]"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFF9EA] border border-[#FFD20A] text-xs text-[#281719] animate-fade-in font-medium">
            <span className="font-bold">
              {selectedIds.length} complaint(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkApprove}
                className="py-1 px-3 rounded-lg bg-[#59343B] hover:bg-[#43262C] text-white font-bold text-xs shadow-sm transition"
              >
                Approve All
              </button>
              <button
                onClick={handleBulkResolve}
                className="py-1 px-3 rounded-lg bg-[#236336] hover:bg-[#1E5C31] text-white font-bold text-xs shadow-sm transition"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="py-1 px-2.5 rounded-lg border border-[#EAE3D5] text-[#59343B] hover:bg-white text-xs font-semibold transition"
              >
                Deselect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Complaints Table */}
      <div className="bg-white rounded-2xl border border-[#EAE3D5] shadow-civic overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF9EA] text-[#59343B] font-bold border-b border-[#EAE3D5]">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      paginatedComplaints.length > 0 &&
                      paginatedComplaints.every((c) => selectedIds.includes(c.id))
                    }
                    className="rounded text-[#59343B] focus:ring-[#59343B]"
                  />
                </th>
                <th
                  onClick={() => handleSort("id")}
                  className="py-3 px-3 cursor-pointer hover:text-[#281719] transition whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("title")}
                  className="py-3 px-4 cursor-pointer hover:text-[#281719] transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Complaint Title</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Category</th>
                <th
                  onClick={() => handleSort("citizen")}
                  className="py-3 px-4 cursor-pointer hover:text-[#281719] transition whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Citizen</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Location</th>
                <th
                  onClick={() => handleSort("submissionDate")}
                  className="py-3 px-3 cursor-pointer hover:text-[#281719] transition whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 whitespace-nowrap">Priority</th>
                <th className="py-3 px-3 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D5]/70">
              {paginatedComplaints.map((c) => {
                const priorityStyle = PRIORITY_STYLES[c.priority] || PRIORITY_STYLES.Medium
                const statusStyle = STATUS_STYLES[c.status] || STATUS_STYLES.Pending
                const isChecked = selectedIds.includes(c.id)

                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-[#FFF9EA]/50 transition group ${
                      isChecked ? "bg-[#FFF9EA]" : ""
                    }`}
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSelect(c.id)}
                        className="rounded text-[#59343B] focus:ring-[#59343B]"
                      />
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#59343B] whitespace-nowrap">
                      {c.id}
                    </td>
                    <td className="py-3 px-4 max-w-xs sm:max-w-sm">
                      <p
                        onClick={() => setSelectedComplaint(c)}
                        className="font-bold text-[#281719] truncate hover:text-[#59343B] cursor-pointer transition"
                      >
                        {c.title}
                      </p>
                      <p className="text-[11px] text-[#695154] line-clamp-1">{c.description}</p>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-[#59343B] font-medium">
                      {c.category}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={c.citizen?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                          alt={c.citizen?.name || "Citizen"}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#281719] leading-tight">
                            {c.citizen?.name || "Citizen"}
                          </p>
                          <p className="text-[10px] text-[#695154]">{c.citizen?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-[#59343B]">
                      <span className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-[#59343B] shrink-0" />
                        {typeof c.location === "object" ? (c.location?.sector || "Sector 17") : (c.sector || c.location || "Sector 17")}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-[#695154]">
                      {formatDate(c.submissionDate)}
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
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusStyle.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedComplaint(c)}
                          className="p-1.5 rounded-lg border border-[#EAE3D5] bg-white hover:border-[#59343B] text-[#59343B] hover:bg-[#FFF9EA] transition"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {c.status === "Pending" && (
                          <button
                            onClick={() => approveComplaint(c.id)}
                            className="p-1.5 rounded-lg bg-[#EBF5EE] text-[#1E5C31] hover:bg-[#1E5C31] hover:text-white transition"
                            title="Quick Approve"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {c.status === "In Progress" && (
                          <button
                            onClick={() => markResolved(c.id, "Quick resolved by administrator.")}
                            className="p-1.5 rounded-lg bg-[#FFF4D0] text-[#7A5300] hover:bg-[#FFD20A] hover:text-[#281719] transition"
                            title="Mark Resolved"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}

              {paginatedComplaints.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-[#695154]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-8 h-8 text-[#59343B]/40" />
                      <p className="text-sm font-bold font-serif text-[#281719]">No complaints found</p>
                      <p className="text-xs text-[#695154]">
                        Try resetting your search query or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-[#EAE3D5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#695154]">
          <div className="flex items-center gap-2">
            <span>
              Showing {filteredComplaints.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredComplaints.length)} of{" "}
              {filteredComplaints.length} entries
            </span>
            <span className="text-[#EAE3D5]">|</span>
            <div className="flex items-center gap-1.5">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="py-1 px-2 rounded-lg border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] font-medium focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#EAE3D5] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFF9EA] transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-bold text-xs transition ${
                  currentPage === page
                    ? "bg-[#59343B] text-white shadow-sm"
                    : "border border-[#EAE3D5] text-[#59343B] hover:bg-[#FFF9EA]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#EAE3D5] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFF9EA] transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          isOpen={Boolean(selectedComplaint)}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  )
}
