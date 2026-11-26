/**
 * CivicFix Admin Formatters & Badge Styles
 */

export function formatDate(dateString) {
  if (!dateString) return "N/A"
  try {
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return dateString
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  } catch {
    return dateString
  }
}

export const PRIORITY_STYLES = {
  Critical: {
    bg: "bg-[#FAECEE] text-[#93272C] border-[#EFC3C6]",
    dot: "bg-[#93272C]"
  },
  High: {
    bg: "bg-[#FFF4D0] text-[#7A5300] border-[#F2DE8A]",
    dot: "bg-[#7A5300]"
  },
  Medium: {
    bg: "bg-[#F5ECEE] text-[#59343B] border-[#DEC7CB]",
    dot: "bg-[#59343B]"
  },
  Low: {
    bg: "bg-[#EBF5EE] text-[#1E5C31] border-[#C3E4CD]",
    dot: "bg-[#236336]"
  }
}

export const STATUS_STYLES = {
  Pending: {
    bg: "bg-[#FFF4D0] text-[#7A5300] border-[#F2DE8A]",
    dot: "bg-[#7A5300]"
  },
  "In Progress": {
    bg: "bg-[#F5ECEE] text-[#59343B] border-[#DEC7CB]",
    dot: "bg-[#59343B]"
  },
  Resolved: {
    bg: "bg-[#EBF5EE] text-[#1E5C31] border-[#C3E4CD]",
    dot: "bg-[#236336]"
  },
  Rejected: {
    bg: "bg-[#FAECEE] text-[#93272C] border-[#EFC3C6]",
    dot: "bg-[#93272C]"
  }
}
