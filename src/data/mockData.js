/**
 * CivicFix Admin Mock Data & Analytics Benchmarks
 */

export const MONTHLY_ANALYTICS_DATA = [
  { month: "Jan", filed: 142, resolved: 118, pending: 24 },
  { month: "Feb", filed: 165, resolved: 140, pending: 25 },
  { month: "Mar", filed: 198, resolved: 172, pending: 26 },
  { month: "Apr", filed: 180, resolved: 164, pending: 16 },
  { month: "May", filed: 210, resolved: 189, pending: 21 },
  { month: "Jun", filed: 245, resolved: 220, pending: 25 },
  { month: "Jul", filed: 280, resolved: 246, pending: 34 },
  { month: "Aug", filed: 295, resolved: 270, pending: 25 },
  { month: "Sep", filed: 260, resolved: 238, pending: 22 },
  { month: "Oct", filed: 275, resolved: 255, pending: 20 },
  { month: "Nov", filed: 240, resolved: 225, pending: 15 }
]

export const RESOLUTION_TIME_BY_CATEGORY = [
  { category: "Roads & Infra", avgDays: "2.1", targetDays: "3.0" },
  { category: "Water Supply", avgDays: "1.2", targetDays: "2.0" },
  { category: "Electricity", avgDays: "0.8", targetDays: "1.5" },
  { category: "Sanitation", avgDays: "1.4", targetDays: "2.5" },
  { category: "Waste Mgt", avgDays: "1.6", targetDays: "2.0" },
  { category: "Public Safety", avgDays: "0.5", targetDays: "1.0" }
]

export const INITIAL_DEPARTMENTS = [
  {
    id: "DEPT-ROADS",
    name: "Roads and Infrastructure",
    head: "Er. Ramesh Kulkarni",
    title: "Superintending Engineer",
    email: "roads@civicfix.gov",
    phone: "+91 172 274001",
    description: "Maintenance of city highways, bituminous paving, potholes repair, and stormwater bridge crossings.",
    icon: "Truck",
    status: "Active",
    assignedComplaints: 48,
    resolvedComplaints: 39,
    pendingComplaints: 9
  },
  {
    id: "DEPT-WATER",
    name: "Water Supply",
    head: "Er. Sunita Verma",
    title: "Executive Engineer",
    email: "water@civicfix.gov",
    phone: "+91 172 274002",
    description: "Management of Kajauli water pipelines, potable water filtration, booster pumping, and leak restorations.",
    icon: "Droplets",
    status: "Active",
    assignedComplaints: 34,
    resolvedComplaints: 29,
    pendingComplaints: 5
  },
  {
    id: "DEPT-ELEC",
    name: "Electricity",
    head: "Er. Baldev Singh",
    title: "Divisional Engineer (Electrical)",
    email: "power@civicfix.gov",
    phone: "+91 172 274003",
    description: "Municipal high-mast streetlighting, transformer maintenance, and underground cable fault resolutions.",
    icon: "Zap",
    status: "Active",
    assignedComplaints: 26,
    resolvedComplaints: 24,
    pendingComplaints: 2
  },
  {
    id: "DEPT-SAN",
    name: "Sanitation",
    head: "Dr. Alok Nath",
    title: "Chief Medical Officer (Health)",
    email: "health@civicfix.gov",
    phone: "+91 172 274004",
    description: "Public hygiene, secondary garbage transport, sewer vacuum desilting, and anti-larval mosquito fogging.",
    icon: "Sparkles",
    status: "Active",
    assignedComplaints: 41,
    resolvedComplaints: 35,
    pendingComplaints: 6
  },
  {
    id: "DEPT-WASTE",
    name: "Waste Management",
    head: "Smt. Manjit Kaur",
    title: "Director (Swachh Cell)",
    email: "swachh@civicfix.gov",
    phone: "+91 172 274005",
    description: "Door-to-door segregated solid waste collection, composting facilities, and processing plant oversight.",
    icon: "Trash2",
    status: "Active",
    assignedComplaints: 29,
    resolvedComplaints: 26,
    pendingComplaints: 3
  },
  {
    id: "DEPT-SAFE",
    name: "Public Safety",
    head: "Shri Gurpreet Singla",
    title: "Enforcement Officer",
    email: "safety@civicfix.gov",
    phone: "+91 172 274006",
    description: "Unauthorized encroachment clearances, dangerous tree prunings, and park safety vigilance.",
    icon: "ShieldAlert",
    status: "Active",
    assignedComplaints: 18,
    resolvedComplaints: 16,
    pendingComplaints: 2
  }
]

export const INITIAL_CITIZENS = [
  {
    id: "CIT-1042",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98140 12345",
    address: "House 304, Sector 17-C, Chandigarh",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    status: "Active",
    trustScore: 98,
    joinedDate: "2023-11-15",
    totalComplaints: 6,
    resolvedComplaints: 5
  },
  {
    id: "CIT-1088",
    name: "Pooja Mehta",
    email: "pooja.mehta@example.com",
    phone: "+91 98722 54321",
    address: "Flat 12-B, Sector 22-A, Chandigarh",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "Active",
    trustScore: 94,
    joinedDate: "2024-01-20",
    totalComplaints: 4,
    resolvedComplaints: 4
  },
  {
    id: "CIT-1120",
    name: "Mansha Verma",
    email: "mansha@gmail.com",
    phone: "+91 98888 77665",
    address: "Kothi 88, Sector 15-D, Chandigarh",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    status: "Active",
    trustScore: 99,
    joinedDate: "2023-08-10",
    totalComplaints: 8,
    resolvedComplaints: 7
  },
  {
    id: "CIT-1194",
    name: "Vikramjit Singh",
    email: "vikram.singh@example.com",
    phone: "+91 97791 22334",
    address: "SCF 45, Sector 35-C, Chandigarh",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "Active",
    trustScore: 91,
    joinedDate: "2024-03-02",
    totalComplaints: 3,
    resolvedComplaints: 2
  },
  {
    id: "CIT-1250",
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    phone: "+91 94172 99881",
    address: "House 510, Sector 8-B, Chandigarh",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "Active",
    trustScore: 96,
    joinedDate: "2024-02-14",
    totalComplaints: 5,
    resolvedComplaints: 4
  }
]

export const INITIAL_COMPLAINTS = [
  {
    id: "CF-2024-8921",
    title: "Dangerous crater potholes near Sector 17 Rotary",
    description: "Deep cavity in the middle carriageway causing traffic bottlenecks and risk of two-wheeler skid during rain.",
    category: "Roads and Infrastructure",
    priority: "Critical",
    status: "In Progress",
    citizen: {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 98140 12345",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
    },
    location: {
      address: "Madhya Marg near Sector 17-C Roundabout",
      sector: "Sector 17"
    },
    submissionDate: "2024-11-20T09:30:00Z",
    department: "Roads and Infrastructure",
    assignedOfficer: "Er. Ramesh Kulkarni (Sub-Div 3)",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CF-2024-8922",
    title: "Major water supply pipeline burst on Jan Marg",
    description: "Potable drinking water gushing onto the road since morning, flooding cycle track and decreasing pressure in residential blocks.",
    category: "Water Supply",
    priority: "Critical",
    status: "Pending",
    citizen: {
      name: "Pooja Mehta",
      email: "pooja.mehta@example.com",
      phone: "+91 98722 54321",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    location: {
      address: "Jan Marg near Sector 22-A Petrol Pump",
      sector: "Sector 22"
    },
    submissionDate: "2024-11-21T07:15:00Z",
    department: "Water Supply",
    assignedOfficer: "Er. Sunita Verma",
    image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CF-2024-8923",
    title: "Uncollected commercial waste dump behind market plaza",
    description: "Garbage bins overflowing with organic rot and plastic waste emitting foul odor near food kiosks.",
    category: "Waste Management",
    priority: "High",
    status: "Resolved",
    citizen: {
      name: "Mansha Verma",
      email: "mansha@gmail.com",
      phone: "+91 98888 77665",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    location: {
      address: "Rear Parking Plaza, Sector 15-D Market",
      sector: "Sector 15"
    },
    submissionDate: "2024-11-18T14:20:00Z",
    department: "Waste Management",
    assignedOfficer: "Smt. Manjit Kaur",
    image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CF-2024-8924",
    title: "Non-functional streetlights on Sector 35 internal road",
    description: "Five continuous poles plunged into complete darkness creating safety hazards for female evening pedestrians.",
    category: "Electricity",
    priority: "Medium",
    status: "In Progress",
    citizen: {
      name: "Vikramjit Singh",
      email: "vikram.singh@example.com",
      phone: "+91 97791 22334",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    location: {
      address: "Road No. 4, Block C, Sector 35",
      sector: "Sector 35"
    },
    submissionDate: "2024-11-19T18:45:00Z",
    department: "Electricity",
    assignedOfficer: "Er. Baldev Singh",
    image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CF-2024-8925",
    title: "Choked stormwater drainage grating causing street waterlogging",
    description: "Silt and leaves blocking stormwater inlet; water stagnant over 4 inches across road width.",
    category: "Sanitation",
    priority: "High",
    status: "Pending",
    citizen: {
      name: "Neha Gupta",
      email: "neha.gupta@example.com",
      phone: "+91 94172 99881",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    location: {
      address: "Near Community Center, Sector 8-B",
      sector: "Sector 8"
    },
    submissionDate: "2024-11-22T11:00:00Z",
    department: "Sanitation",
    assignedOfficer: "Dr. Alok Nath",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "CF-2024-8926",
    title: "Damaged children swing set and broken boundary railing",
    description: "Exposed jagged iron edges on play swing posing immediate risk of cuts to toddlers in public green park.",
    category: "Public Safety",
    priority: "Low",
    status: "Resolved",
    citizen: {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 98140 12345",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
    },
    location: {
      address: "Shanti Kunj Park, Sector 16-A",
      sector: "Sector 16"
    },
    submissionDate: "2024-11-15T16:10:00Z",
    department: "Public Safety",
    assignedOfficer: "Shri Gurpreet Singla",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80"
  }
]

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-101",
    title: "Critical Water Pipe Rupture Alert",
    message: "Ticket #CF-2024-8922: 400mm main feeder burst logged near Sector 22 Petrol Pump. Field crew dispatched.",
    timestamp: "10 mins ago",
    read: false,
    type: "complaint_critical",
    complaintId: "CF-2024-8922",
    category: "Water Supply"
  },
  {
    id: "notif-102",
    title: "Ticket Resolution Verified",
    message: "Ticket #CF-2024-8923 (Market waste dump) sign-off uploaded by Sanitation Wing. Citizen notified.",
    timestamp: "2 hours ago",
    read: false,
    type: "complaint_resolved",
    complaintId: "CF-2024-8923",
    category: "Waste Management"
  },
  {
    id: "notif-103",
    title: "Automated Daily SLA Performance Sync",
    message: "Morning compliance check: 94.2% of open tickets met statutory SLA response benchmarks.",
    timestamp: "Today at 08:00 AM",
    read: true,
    type: "system",
    category: "System"
  },
  {
    id: "notif-104",
    title: "New Citizen Registered",
    message: "Citizen account verified for Neha Gupta (Sector 8-B). Trust rating initialized at 96%.",
    timestamp: "Yesterday",
    read: true,
    type: "system",
    category: "Citizen Directory"
  }
]
