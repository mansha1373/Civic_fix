// Illustrative demo data: % of reported issues fixed per category, per area.
export const metrics = ["Overall", "Roads", "Waste", "Drainage", "Lights"]

export const areas = [
  { id: "s17", name: "Sector 17", x: 25, y: 29, w: 33, h: 33, roads: 92, waste: 84, drainage: 78, lights: 88, fixed: 214, days: 4, before: "Potholes outside the school gate and overflowing bins.", after: "Smooth roads, daily waste pickup and working streetlights.", quote: "The morning commute feels safer.", who: "Parent" },
  { id: "s22", name: "Sector 22", x: 62, y: 29, w: 24, h: 33, roads: 61, waste: 90, drainage: 55, lights: 70, fixed: 138, days: 6, before: "Rubbish piling up at the corner and a broken footpath.", after: "Cleared pavements and regular collection. Drains next.", quote: "Small fixes really add up.", who: "Resident" },
  { id: "s16", name: "Sector 16", x: 25, y: 69, w: 33, h: 27, roads: 58, waste: 66, drainage: 94, lights: 60, fixed: 121, days: 5, before: "A blocked drain flooded the market entrance.", after: "Drains cleaned and the entrance is dry again.", quote: "We can finally use the entrance properly.", who: "Shopkeeper" },
  { id: "s18", name: "Sector 18", x: 3, y: 29, w: 19, h: 33, roads: 38, waste: 42, drainage: 30, lights: 52, fixed: 54, days: 9, before: "Dark lanes, cracked roads and open drains.", after: "Lights repaired. Roads and drains are still in progress.", quote: "Better at night already. More to do.", who: "Resident" },
  { id: "s15", name: "Sector 15", x: 62, y: 69, w: 24, h: 27, roads: 12, waste: 20, drainage: 8, lights: 25, fixed: 17, days: 14, before: "Few reports so far, many problems unreported.", after: "Just getting started. Be the first to report.", quote: "Nobody told us we could report these.", who: "Resident" },
]

export const levelOf = (p) => (p >= 75 ? "high" : p >= 45 ? "mid" : "low")
export const levelLabel = { high: "Greatly improved", mid: "Improving", low: "Just starting" }

export const scoreOf = (a, metric) => {
  if (metric === "Overall") return Math.round((a.roads + a.waste + a.drainage + a.lights) / 4)
  return a[metric.toLowerCase()]
}
