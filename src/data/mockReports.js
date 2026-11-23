// Realistic mock data for CivicFix Citizen Dashboard
// Indian locations: Chandigarh, Mohali, Panchkula, Karnal and surrounding sectors

export const mockCurrentUser = {
  id: "USR-CH-1042",
  name: "Citizen",
  email: "citizen@civicfix.in",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  city: "Chandigarh",
  sector: "Sector 17",
  ward: "Ward No. 4, MCC",
  role: "Verified Citizen",
  joinedDate: "October 2024",
  stats: {
    reportsSubmitted: 12,
    upvotesGiven: 47,
    communityPoints: 340,
    impactRank: "Top 5% in Sector 17"
  }
}

export const mockStatistics = [
  {
    id: "total",
    label: "Total Reports",
    count: 12,
    description: "+3 submitted this month",
    trend: "+25%",
    trendUp: true,
    color: "#59343B",
    bgLight: "#F5EFE6",
    icon: "fileText"
  },
  {
    id: "review",
    label: "Under Review",
    count: 3,
    description: "Awaiting field officer verification",
    trend: "Avg. 24h",
    trendUp: false,
    color: "#59343B",
    bgLight: "#F5EFE6",
    icon: "clock"
  },
  {
    id: "progress",
    label: "In Progress",
    count: 4,
    description: "Assigned to municipal crews",
    trend: "Active now",
    trendUp: true,
    color: "#59343B",
    bgLight: "#F5EFE6",
    icon: "tool"
  },
  {
    id: "resolved",
    label: "Resolved",
    count: 5,
    description: "Verified fixes in your neighbourhood",
    trend: "91% fix rate",
    trendUp: true,
    color: "#59343B",
    bgLight: "#F5EFE6",
    icon: "checkCircle"
  }
]

export const mockCategories = [
  {
    id: "potholes",
    label: "Potholes",
    icon: "road",
    department: "MCC Roads & Pavements Wing",
    description: "Deep road craters, sunken surfaces & asphalt cavities creating hazard."
  },
  {
    id: "damaged_roads",
    label: "Damaged Roads",
    icon: "tool",
    department: "MCC Highway & Infrastructure Wing",
    description: "Cracked pavement, broken dividers, eroded tarmac & uneven shoulders."
  },
  {
    id: "garbage",
    label: "Garbage Accumulation",
    icon: "trash",
    department: "Sanitation & Swachh Bharat Cell",
    description: "Overflowing dumpsters, roadside trash heaps & unsanitary waste."
  },
  {
    id: "drainage",
    label: "Drainage and Sewage",
    icon: "droplet",
    department: "Public Health Engineering Dept",
    description: "Blocked stormwater drains, open manholes & sewage overflow."
  },
  {
    id: "streetlights",
    label: "Streetlight Problems",
    icon: "lightbulb",
    department: "Electrical Maintenance Division",
    description: "Non-functional lights, broken poles, dark zones & exposed wiring."
  },
  {
    id: "other",
    label: "Other Civic Issues",
    icon: "shieldAlert",
    department: "Municipal Enforcement & Civil Wing",
    description: "Encroachments, damaged public property, fallen branches & hazards."
  }
]

export const mockReports = [
  {
    id: "CF-2024-9102",
    title: "Hazardous sagging overhead wire near Sector 17 Plaza",
    category: "Streetlight Problems",
    categoryKey: "streetlights",
    location: "Plaza Central Walkway, near Fountain, Sector 17, Chandigarh",
    coordinates: { lat: 30.7415, lng: 76.7794 },
    pincode: "160017",
    date: "22 Nov 2024",
    submittedDate: "22 Nov 2024",
    lastUpdated: "22 Nov 2024",
    time: "10:15 AM",
    status: "Submitted",
    statusKey: "submitted",
    urgency: "High",
    upvotes: 8,
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
    ],
    photoCount: 1,
    description: "An overhead optical fiber / lighting cable has snapped loose and is drooping 5 feet above the walking plaza. Serious hazard for evening shoppers and children.",
    department: "Electrical Maintenance Division",
    assignedOfficer: "Awaiting Officer Allocation",
    estimatedResolution: "Within 24 hours",
    officialRemarks: [
      {
        id: "rem-9102-1",
        author: "MCC Central Citizen Grievance Cell",
        role: "Control Room Dispatcher",
        date: "22 Nov 2024, 10:20 AM",
        message: "Your complaint has been received and registered under ticket #CF-2024-9102. Automated alert transmitted to Duty Engineer (Electrical Safety)."
      }
    ],
    timeline: [
      {
        stage: "Submitted",
        status: "Submitted",
        step: "Complaint Submitted",
        date: "22 Nov 2024, 10:15 AM",
        done: true,
        desc: "Citizen Aarav Sharma filed the hazard report via CivicFix web portal.",
        adminRemarks: "Ticket generated and GPS geotag verified."
      },
      {
        stage: "Under Review",
        status: "Under Review",
        step: "Field Officer Triage",
        date: "Pending",
        done: false,
        desc: "Electrical Maintenance Division reviewing site jurisdiction.",
        adminRemarks: ""
      },
      {
        stage: "In Progress",
        status: "In Progress",
        step: "Repair Crew Deployment",
        date: "Pending",
        done: false,
        desc: "Field technician team scheduled to bundle and tension sagging cable.",
        adminRemarks: ""
      },
      {
        stage: "Resolved",
        status: "Resolved",
        step: "Final Resolution & Sign-off",
        date: "Pending",
        done: false,
        desc: "Cable secured above required height clearance.",
        adminRemarks: ""
      }
    ]
  },
  {
    id: "CF-2024-8921",
    title: "Deep pothole cluster on Madhya Marg approach",
    category: "Potholes",
    categoryKey: "potholes",
    location: "Madhya Marg, near Sector 17-C Roundabout, Chandigarh",
    coordinates: { lat: 30.7420, lng: 76.7820 },
    pincode: "160017",
    date: "20 Nov 2024",
    submittedDate: "20 Nov 2024",
    lastUpdated: "21 Nov 2024",
    time: "09:30 AM",
    status: "In Progress",
    statusKey: "in_progress",
    urgency: "High",
    upvotes: 28,
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
    ],
    photoCount: 1,
    description: "A series of 3 deep potholes developed after heavy rain right before the Sector 17-C roundabout. Severe risk for two-wheelers during rush hours.",
    department: "MCC Road Wing (Zone 1)",
    assignedOfficer: "Er. Ramesh Verma (Executive Engineer)",
    estimatedResolution: "24 Nov 2024",
    officialRemarks: [
      {
        id: "rem-8921-1",
        author: "MCC Central Grievance Desk",
        role: "Control Room",
        date: "20 Nov 2024, 09:32 AM",
        message: "Your complaint has been received and verified. Priority escalated to High due to peak traffic conditions on Madhya Marg artery."
      },
      {
        id: "rem-8921-2",
        author: "Er. Ramesh Verma",
        role: "Executive Engineer (MCC Road Wing)",
        date: "21 Nov 2024, 11:20 AM",
        message: "The concerned department has been notified. Site inspected by Junior Engineer; cold asphalt mix work order dispatched to Road Maintenance Crew #3."
      },
      {
        id: "rem-8921-3",
        author: "MCC Works Control",
        role: "Field Dispatch",
        date: "21 Nov 2024, 03:45 PM",
        message: "Repair work has been scheduled. Bitumen roller and hot-mix patching truck deployed on site for evening low-traffic window."
      }
    ],
    timeline: [
      {
        stage: "Submitted",
        status: "Submitted",
        step: "Report Submitted",
        date: "20 Nov 2024, 09:30 AM",
        done: true,
        desc: "Received via CivicFix citizen portal by Citizen Aarav Sharma.",
        adminRemarks: "Complaint logged and ticket issued."
      },
      {
        stage: "Under Review",
        status: "Under Review",
        step: "Automated AI Triage & Verification",
        date: "20 Nov 2024, 09:32 AM",
        done: true,
        desc: "Category verified: Potholes; Geotag confirmed inside MCC Zone 1.",
        adminRemarks: "Assigned high priority status."
      },
      {
        stage: "In Progress",
        status: "In Progress",
        step: "Asphalt Work Order Dispatched",
        date: "21 Nov 2024, 03:45 PM",
        done: true,
        desc: "Field repair team dispatched with asphalt cold-mix repair truck.",
        adminRemarks: "Work order #ROADS-2024-4029 active."
      },
      {
        stage: "Resolved",
        status: "Resolved",
        step: "Final Resolution & Citizen Sign-off",
        date: "Pending (Est. 24 Nov 2024)",
        done: false,
        desc: "Awaiting final asphalt rolling and photographic verification.",
        adminRemarks: "Awaiting on-site citizen sign-off."
      }
    ]
  },
  {
    id: "CF-2024-8745",
    title: "Overflowing secondary garbage dump behind market",
    category: "Garbage Accumulation",
    categoryKey: "garbage",
    location: "Sector 22-B Market Inner Lane, Chandigarh",
    coordinates: { lat: 30.7298, lng: 76.7712 },
    pincode: "160022",
    date: "18 Nov 2024",
    submittedDate: "18 Nov 2024",
    lastUpdated: "19 Nov 2024",
    time: "02:15 PM",
    status: "Under Review",
    statusKey: "under_review",
    urgency: "Medium",
    upvotes: 14,
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80"
    ],
    photoCount: 1,
    description: "Commercial cardboard boxes and wet waste overflowing the municipal skip bin. Stray cattle gathering and foul odor spreading across nearby residential flats.",
    department: "Sanitation & Swachh Bharat Cell",
    assignedOfficer: "S. Baljit Singh (Sanitary Inspector)",
    estimatedResolution: "23 Nov 2024",
    officialRemarks: [
      {
        id: "rem-8745-1",
        author: "Swachh Bharat Control Cell",
        role: "Central Operator",
        date: "18 Nov 2024, 02:20 PM",
        message: "Your complaint has been received. Ticket #CF-2024-8745 forwarded to Ward 17 Sanitary Inspector."
      },
      {
        id: "rem-8745-2",
        author: "S. Baljit Singh",
        role: "Sanitary Inspector",
        date: "19 Nov 2024, 10:00 AM",
        message: "The concerned department has been notified. Physical inspection conducted. Secondary compactor truck route diverted for immediate morning collection."
      }
    ],
    timeline: [
      {
        stage: "Submitted",
        status: "Submitted",
        step: "Report Submitted",
        date: "18 Nov 2024, 02:15 PM",
        done: true,
        desc: "Citizen uploaded complaint with on-site photo evidence.",
        adminRemarks: "Complaint logged."
      },
      {
        stage: "Under Review",
        status: "Under Review",
        step: "Sanitary Route Planning",
        date: "19 Nov 2024, 10:00 AM",
        done: true,
        desc: "Sanitary Inspector verified bin overflow. Extra dumper vehicle assigned.",
        adminRemarks: "Scheduled for priority lift."
      },
      {
        stage: "In Progress",
        status: "In Progress",
        step: "Waste Lifting & Disinfection",
        date: "Pending",
        done: false,
        desc: "Compactor vehicle clearing commercial and domestic waste.",
        adminRemarks: ""
      },
      {
        stage: "Resolved",
        status: "Resolved",
        step: "Cleared & Sanitized",
        date: "Pending",
        done: false,
        desc: "Bin area cleaned, washed, and disinfected with lime powder.",
        adminRemarks: ""
      }
    ]
  },
  {
    id: "CF-2024-8114",
    title: "Overhanging dead tree branches near power cables",
    category: "Other Civic Issues",
    categoryKey: "other",
    location: "Sector 8-C Inner Residential Lane, Chandigarh",
    coordinates: { lat: 30.7380, lng: 76.7950 },
    pincode: "160008",
    date: "28 Oct 2024",
    submittedDate: "28 Oct 2024",
    lastUpdated: "21 Nov 2024",
    time: "04:30 PM",
    status: "In Progress",
    statusKey: "in_progress",
    urgency: "Medium",
    upvotes: 11,
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80"
    ],
    photoCount: 1,
    description: "Large dry eucalyptus limb resting directly on high-tension wire. Sparks observed during windy nights.",
    department: "MCC Horticulture & Forestry Wing",
    assignedOfficer: "R.S. Rana (Forest Ranger)",
    estimatedResolution: "25 Nov 2024",
    officialRemarks: [
      {
        id: "rem-8114-1",
        author: "Joint Utility Cell",
        role: "Coordinator",
        date: "02 Nov 2024, 09:30 AM",
        message: "The concerned department has been notified. Joint site survey completed with Electricity Department."
      },
      {
        id: "rem-8114-2",
        author: "R.S. Rana",
        role: "Forest Ranger",
        date: "21 Nov 2024, 11:00 AM",
        message: "Repair work has been scheduled. Hydraulic bucket crane scheduled with 45-minute controlled power outage."
      }
    ],
    timeline: [
      {
        stage: "Submitted",
        status: "Submitted",
        step: "Report Submitted",
        date: "28 Oct 2024, 04:30 PM",
        done: true,
        desc: "Registered with residential association endorsement.",
        adminRemarks: "Complaint logged."
      },
      {
        stage: "Under Review",
        status: "Under Review",
        step: "Joint Forest & Electrical Survey",
        date: "02 Nov 2024, 11:30 AM",
        done: true,
        desc: "Danger to 11kV conductor line confirmed.",
        adminRemarks: "Shutdown clearance requested."
      },
      {
        stage: "In Progress",
        status: "In Progress",
        step: "Hydraulic Crane Scheduled",
        date: "21 Nov 2024, 02:00 PM",
        done: true,
        desc: "Bucket crane crew mobilising for safe selective limb pruning.",
        adminRemarks: "Safety equipment deployed."
      },
      {
        stage: "Resolved",
        status: "Resolved",
        step: "Pruning Execution & Clearance",
        date: "Pending (Est. 25 Nov 2024)",
        done: false,
        desc: "Trimming complete and wood debris removed from street.",
        adminRemarks: ""
      }
    ]
  },
  {
    id: "CF-2024-8612",
    title: "Dark zone: Non-functional LED streetlights along park",
    category: "Streetlight Problems",
    categoryKey: "streetlights",
    location: "Model Town, Main Park Perimeter, Karnal",
    coordinates: { lat: 29.6857, lng: 76.9905 },
    pincode: "132001",
    date: "14 Nov 2024",
    submittedDate: "14 Nov 2024",
    lastUpdated: "17 Nov 2024",
    time: "07:40 PM",
    status: "Resolved",
    statusKey: "resolved",
    urgency: "High",
    upvotes: 39,
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80"
    ],
    photoCount: 2,
    description: "Four consecutive solar-LED poles went dark following thunderstorm. Women and senior citizens unable to use evening walking track.",
    department: "Electrical Maintenance Division",
    assignedOfficer: "Er. Amit Kumar (Asst. Engineer)",
    resolvedDate: "17 Nov 2024",
    officialRemarks: [
      {
        id: "rem-8612-1",
        author: "KMC Electrical Wing",
        role: "Control Room",
        date: "14 Nov 2024, 08:00 PM",
        message: "Your complaint has been received. Ticket #CF-2024-8612 generated for Model Town sector."
      },
      {
        id: "rem-8612-2",
        author: "Er. Amit Kumar",
        role: "Assistant Engineer (Electrical)",
        date: "15 Nov 2024, 09:10 AM",
        message: "The concerned department has been notified. Fault traced to lightning surge tripper in main feeder box."
      },
      {
        id: "rem-8612-3",
        author: "Er. Amit Kumar",
        role: "Assistant Engineer (Electrical)",
        date: "17 Nov 2024, 06:15 PM",
        message: "The issue has been successfully addressed. 4 solar-LED fixtures and main feeder box timer replaced. Verified on site with local RWA."
      }
    ],
    timeline: [
      {
        stage: "Submitted",
        status: "Submitted",
        step: "Report Submitted",
        date: "14 Nov 2024, 07:40 PM",
        done: true,
        desc: "Citizen logged outage of 4 streetlights on park walkway.",
        adminRemarks: "Complaint logged."
      },
      {
        stage: "Under Review",
        status: "Under Review",
        step: "Feeder Box Inspection",
        date: "15 Nov 2024, 09:10 AM",
        done: true,
        desc: "Burnt fuse and timer contactor malfunction diagnosed.",
        adminRemarks: "Parts requisition approved."
      },
      {
        stage: "In Progress",
        status: "In Progress",
        step: "Component Replacement",
        date: "16 Nov 2024, 01:30 PM",
        done: true,
        desc: "Electrician crew replaced 4 LED drivers and ground earthing.",
        adminRemarks: "Field testing underway."
      },
      {
        stage: "Resolved",
        status: "Resolved",
        step: "Illumination Restored",
        date: "17 Nov 2024, 06:00 PM",
        done: true,
        desc: "All 4 luminaires illuminated at 100% capacity. Joint inspection verified.",
        adminRemarks: "Issue successfully resolved."
      }
    ],
    resolution: {
      beforeImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80",
      afterImage: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80",
      date: "17 Nov 2024, 06:00 PM",
      description: "Municipal electrical team replaced 4 faulty solar-LED luminaires, restored the central circuit breaker in feeder box #KMC-14, and re-aligned ground earthing. Night visibility fully restored.",
      verifiedBy: "Er. Amit Kumar (Assistant Divisional Engineer) & Model Town RWA General Secretary"
    }
  },
  {
    id: "CF-2024-8490",
    title: "Stormwater drain choked with plastic & silt",
    category: "Drainage and Sewage",
    categoryKey: "drainage",
    location: "Phase 7 Industrial Area Approach Road, Mohali",
    coordinates: { lat: 30.7046, lng: 76.7179 },
    pincode: "160062",
    date: "09 Nov 2024",
    submittedDate: "09 Nov 2024",
    lastUpdated: "12 Nov 2024",
    time: "11:05 AM",
    status: "Resolved",
    statusKey: "resolved",
    urgency: "Medium",
    upvotes: 19,
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80"
    ],
    photoCount: 2,
    description: "Monsoon drain grill clogged with plastic waste causing backflow during showers and stagnant pools of water on the shoulder.",
    department: "Public Health Engineering Dept",
    assignedOfficer: "S. Gurpreet Singh (Junior Engineer)",
    resolvedDate: "12 Nov 2024",
    officialRemarks: [
      {
        id: "rem-8490-1",
        author: "GMADA Public Health Cell",
        role: "Control Desk",
        date: "09 Nov 2024, 11:30 AM",
        message: "Your complaint has been received. Ticket #CF-2024-8490 registered."
      },
      {
        id: "rem-8490-2",
        author: "S. Gurpreet Singh",
        role: "Junior Engineer",
        date: "12 Nov 2024, 04:30 PM",
        message: "The issue has been successfully addressed. Heavy suction jetting machine desilted 120m of culvert and newly welded safety grills installed."
      }
    ],
    timeline: [
      {
        stage: "Submitted",
        status: "Submitted",
        step: "Report Submitted",
        date: "09 Nov 2024, 11:05 AM",
        done: true,
        desc: "Citizen uploaded complaint with exact GPS geotag.",
        adminRemarks: "Complaint logged."
      },
      {
        stage: "Under Review",
        status: "Under Review",
        step: "Culvert Inspection",
        date: "10 Nov 2024, 10:30 AM",
        done: true,
        desc: "Severe plastic choking detected inside underground culvert section.",
        adminRemarks: "Suction machine scheduled."
      },
      {
        stage: "In Progress",
        status: "In Progress",
        step: "Jetting & Silt Removal",
        date: "11 Nov 2024, 02:00 PM",
        done: true,
        desc: "High pressure water jetting cleared debris blockage.",
        adminRemarks: "Work in progress."
      },
      {
        stage: "Resolved",
        status: "Resolved",
        step: "Drain Flowing Freely",
        date: "12 Nov 2024, 04:00 PM",
        done: true,
        desc: "Stormwater flow test completed successfully. Steel grill refitted.",
        adminRemarks: "Issue successfully addressed."
      }
    ],
    resolution: {
      beforeImage: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
      afterImage: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
      date: "12 Nov 2024, 04:00 PM",
      description: "Culvert de-silted with heavy suction jetting machine. Drain covers cleared of plastic debris and reinforced with new galvanized steel grills.",
      verifiedBy: "S. Gurpreet Singh (Junior Engineer, GMADA)"
    }
  },
  {
    id: "CF-2024-8301",
    title: "Broken pavement slab & open cable trench near Rose Garden",
    category: "Damaged Roads",
    categoryKey: "damaged_roads",
    location: "Sector 16 Walkway, near Rose Garden Gate 2, Chandigarh",
    coordinates: { lat: 30.7485, lng: 76.7820 },
    pincode: "160016",
    date: "02 Nov 2024",
    submittedDate: "02 Nov 2024",
    lastUpdated: "05 Nov 2024",
    time: "08:15 AM",
    status: "Resolved",
    statusKey: "resolved",
    urgency: "Critical",
    upvotes: 43,
    image: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=600&q=80"
    ],
    photoCount: 2,
    description: "Pedestrian walkway tiles broken exposing underground electrical duct. High tripping hazard for tourists and morning joggers.",
    department: "MCC Highway & Infrastructure Wing",
    assignedOfficer: "Er. K.L. Sharma (Sub-Divisional Officer)",
    resolvedDate: "05 Nov 2024",
    officialRemarks: [
      {
        id: "rem-8301-1",
        author: "MCC Control Room",
        role: "Emergency Desk",
        date: "02 Nov 2024, 08:30 AM",
        message: "Your complaint has been received. Critical hazard alert issued due to tourist footfall at Rose Garden."
      },
      {
        id: "rem-8301-2",
        author: "Er. K.L. Sharma",
        role: "Sub-Divisional Officer",
        date: "05 Nov 2024, 11:45 AM",
        message: "The issue has been successfully addressed. Underground duct recapped with reinforced slabs and pavers reset."
      }
    ],
    timeline: [
      {
        stage: "Submitted",
        status: "Submitted",
        step: "Emergency Report Logged",
        date: "02 Nov 2024, 08:15 AM",
        done: true,
        desc: "Citizen raised alert for open cable hazard.",
        adminRemarks: "Complaint logged."
      },
      {
        stage: "Under Review",
        status: "Under Review",
        step: "Barricading & Assessment",
        date: "02 Nov 2024, 12:00 PM",
        done: true,
        desc: "Safety tape barricade erected to protect pedestrians.",
        adminRemarks: "Immediate safety secured."
      },
      {
        stage: "In Progress",
        status: "In Progress",
        step: "RCC Slab Casting & Masonry",
        date: "04 Nov 2024, 03:00 PM",
        done: true,
        desc: "Masonry crew recast heavy concrete slab and relaid interlocking tiles.",
        adminRemarks: "Masonry work active."
      },
      {
        stage: "Resolved",
        status: "Resolved",
        step: "Walkway Fully Reopened",
        date: "05 Nov 2024, 11:30 AM",
        done: true,
        desc: "Surface leveled and inspected safe for tourist traffic.",
        adminRemarks: "Issue successfully resolved."
      }
    ],
    resolution: {
      beforeImage: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80",
      afterImage: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=600&q=80",
      date: "05 Nov 2024, 11:30 AM",
      description: "Exposed utility duct covered with heavy-duty RCC precast slabs. Walkway leveled and finished with non-slip red sandstone interlocking pavers.",
      verifiedBy: "Er. K.L. Sharma (Sub-Divisional Officer, MCC)"
    }
  },
  {
    id: "CF-2024-8029",
    title: "Internal driveway resurfacing inside residential society",
    category: "Damaged Roads",
    categoryKey: "damaged_roads",
    location: "Gulmohar Enclave Internal Lane 3, Sector 21-A, Chandigarh",
    coordinates: { lat: 30.7250, lng: 76.7750 },
    pincode: "160022",
    date: "24 Oct 2024",
    submittedDate: "24 Oct 2024",
    lastUpdated: "26 Oct 2024",
    time: "03:40 PM",
    status: "Rejected",
    statusKey: "rejected",
    urgency: "Low",
    upvotes: 3,
    image: "https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=600&q=80"
    ],
    photoCount: 1,
    description: "Request for municipal hot mix asphalt overlay on private society inner driveway near Building B parking area.",
    department: "MCC Road Wing (Zone 2)",
    assignedOfficer: "Er. Deepak Jindal (Sub-Divisional Engineer)",
    officialRemarks: [
      {
        id: "rem-8029-1",
        author: "MCC Central Citizen Grievance Cell",
        role: "Control Room",
        date: "24 Oct 2024, 03:50 PM",
        message: "Your complaint has been received and ticket #CF-2024-8029 generated."
      },
      {
        id: "rem-8029-2",
        author: "Er. Deepak Jindal",
        role: "Sub-Divisional Engineer (MCC)",
        date: "26 Oct 2024, 11:15 AM",
        message: "Complaint Rejected: The reported location lies inside private gated society property. Municipal Corporation Chandigarh maintains public sector roads only as per Section 34 of Punjab Municipal Corporation Act. Please contact your Society Resident Welfare Association Management."
      }
    ],
    timeline: [
      {
        stage: "Submitted",
        status: "Submitted",
        step: "Report Submitted",
        date: "24 Oct 2024, 03:40 PM",
        done: true,
        desc: "Citizen Aarav Sharma filed internal road request.",
        adminRemarks: "Complaint logged."
      },
      {
        stage: "Under Review",
        status: "Under Review",
        step: "Jurisdiction & Title Verification",
        date: "25 Oct 2024, 02:00 PM",
        done: true,
        desc: "Municipal GIS boundary mapping revealed location inside private society perimeter.",
        adminRemarks: "Private property flagged."
      },
      {
        stage: "Rejected",
        status: "Rejected",
        step: "Complaint Rejected",
        date: "26 Oct 2024, 11:15 AM",
        done: true,
        desc: "Outside Municipal Corporation jurisdiction as per Section 34 of Municipal Act.",
        adminRemarks: "Referred to Society RWA Management."
      }
    ]
  }
]

export const mockNotifications = [
  {
    id: "notif-1",
    title: "Work Order Dispatched",
    message: "Your report CF-2024-8921 (Madhya Marg Pothole) has been assigned to MCC Road Crew #3. Patching scheduled.",
    time: "2 hours ago",
    read: false,
    type: "progress",
    reportId: "CF-2024-8921"
  },
  {
    id: "notif-2",
    title: "Complaint Under Review",
    message: "Sanitary Inspector visited Sector 22-B regarding your report CF-2024-8745. Waste pickup arranged.",
    time: "1 day ago",
    read: false,
    type: "review",
    reportId: "CF-2024-8745"
  },
  {
    id: "notif-3",
    title: "Issue Successfully Resolved!",
    message: "Streetlights at Model Town, Karnal (CF-2024-8612) have been repaired and verified. Rate the work!",
    time: "5 days ago",
    read: true,
    type: "resolved",
    reportId: "CF-2024-8612"
  },
  {
    id: "notif-4",
    title: "Community Upvote Milestone",
    message: "25 citizens in Sector 17 upvoted your road hazard report. Priority automatically boosted.",
    time: "1 week ago",
    read: true,
    type: "community",
    reportId: "CF-2024-8921"
  }
]

export const mockCommunityImpact = {
  totalResolved: 1428,
  activeReports: 84,
  avgDaysToResolve: 4.2,
  satisfactionRate: "94.6%",
  communityQuote: "Over 85% of verified street hazard reports in Chandigarh, Mohali & Karnal were acted upon within 72 hours this month.",
  topSectors: [
    { name: "Sector 17, Chandigarh", resolved: 214, rating: "92% Positive", change: "+14% vs last month" },
    { name: "Sector 22, Chandigarh", resolved: 138, rating: "88% Positive", change: "+9% vs last month" },
    { name: "Model Town, Karnal", resolved: 121, rating: "85% Positive", change: "+19% vs last month" },
    { name: "Phase 7, Mohali", resolved: 104, rating: "90% Positive", change: "+12% vs last month" },
    { name: "Sector 15, Chandigarh", resolved: 86, rating: "79% Positive", change: "+6% vs last month" }
  ]
}
