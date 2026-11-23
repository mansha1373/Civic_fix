/**
 * CivicFix AI Assistant - Simulated Image Classification Module
 *
 * NOTE: This is an extensible simulation module for demo purposes.
 * In production, this function will dispatch the uploaded image File / Base64
 * to a real multi-modal vision endpoint (e.g., Google Gemini 1.5 Flash Vision API
 * or a TensorFlow civic hazard classifier) to return real-time bounding boxes
 * and hazard classification.
 */

export const AI_CATEGORY_MAP = {
  potholes: {
    categoryKey: "potholes",
    label: "Potholes",
    confidence: 94,
    explanation:
      "Deep asphalt depression and surface cavity detected. Poses immediate hazard to two-wheelers and vehicular alignment.",
    tags: ["Surface Depression", "Depth > 8cm", "High Risk"]
  },
  damaged_roads: {
    categoryKey: "damaged_roads",
    label: "Damaged Roads",
    confidence: 91,
    explanation:
      "Extensive alligator cracking, broken road edges and eroded shoulder detected along vehicular lane.",
    tags: ["Tarmac Erosion", "Cracking", "Road Margin"]
  },
  garbage: {
    categoryKey: "garbage",
    label: "Garbage Accumulation",
    confidence: 96,
    explanation:
      "Uncollected solid municipal waste, secondary overflow and loose plastic debris detected on pedestrian corridor.",
    tags: ["Organic Waste", "Overflow", "Sanitation Required"]
  },
  drainage: {
    categoryKey: "drainage",
    label: "Drainage and Sewage",
    confidence: 89,
    explanation:
      "Stagnant water ponding, choked stormwater runoff grill, and sediment blockage identified.",
    tags: ["Standing Water", "Grill Choked", "Public Health Risk"]
  },
  streetlights: {
    categoryKey: "streetlights",
    label: "Streetlight Problems",
    confidence: 93,
    explanation:
      "Public lighting pole malfunction, dark zone perimeter or exposed wiring near junction box detected.",
    tags: ["Illumination Outage", "Pole Fault", "Night Safety"]
  },
  other: {
    categoryKey: "other",
    label: "Other Civic Issues",
    confidence: 82,
    explanation:
      "General civic infrastructure anomaly detected. Recommended for municipal inspector manual review.",
    tags: ["General Civic", "Public Property", "Inspection Queue"]
  }
}

/**
 * Simulates analyzing an image file to predict the civic issue category.
 * Analyzes filename keywords or falls back to a realistic simulated inference.
 *
 * @param {File} file
 * @returns {Promise<typeof AI_CATEGORY_MAP[keyof typeof AI_CATEGORY_MAP]>}
 */
export async function simulateAiCategoryAnalysis(file) {
  // Simulate realistic network / AI inference latency (600ms - 900ms)
  await new Promise((resolve) => setTimeout(resolve, 750))

  const name = (file?.name || "").toLowerCase()

  if (name.includes("pothole") || name.includes("hole") || name.includes("crater") || name.includes("asphalt")) {
    return AI_CATEGORY_MAP.potholes
  }
  if (name.includes("trash") || name.includes("garbage") || name.includes("waste") || name.includes("dump") || name.includes("litter")) {
    return AI_CATEGORY_MAP.garbage
  }
  if (name.includes("light") || name.includes("lamp") || name.includes("dark") || name.includes("pole") || name.includes("bulb")) {
    return AI_CATEGORY_MAP.streetlights
  }
  if (name.includes("drain") || name.includes("water") || name.includes("sewer") || name.includes("flood") || name.includes("pipe")) {
    return AI_CATEGORY_MAP.drainage
  }
  if (name.includes("road") || name.includes("crack") || name.includes("pavement") || name.includes("street")) {
    return AI_CATEGORY_MAP.damaged_roads
  }

  // Realistic fallback: cycle or default to Potholes (most common civic issue in Chandigarh/Karnal)
  return AI_CATEGORY_MAP.potholes
}
