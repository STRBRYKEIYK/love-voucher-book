// Curated date ideas. Every category also offers "Chica's Pick" (a custom place).
export const CATEGORIES = [
  {
    id: "urban",
    title: "Urban Adventures & Grand Malls",
    vibe: "Bustling, massive variety, bright city lights.",
    glow: "#ff5c8a",
    places: [
      { id: "moa", name: "SM Mall of Asia (MOA)", area: "Seaside Blvd, Pasay", highlights: ["Sunset by the bay", "Ice skating", "Food hall"] },
      { id: "bgc", name: "Bonifacio High Street", area: "BGC, Taguig", highlights: ["Open-air window shopping", "Upscale dining", "Walking the strip"] },
      { id: "megamall", name: "SM Megamall", area: "Ortigas, Mandaluyong", highlights: ["Mega Fashion Hall", "Ice skating", "Endless food choices"] }
    ]
  },
  {
    id: "chill",
    title: "Chill & Familiar",
    vibe: "Laid-back, nostalgic, easy-going mall dates.",
    glow: "#ffb25b",
    places: [
      { id: "sta-lucia", name: "Sta. Lucia Mall", area: "Marikina-Infanta Hwy, Cainta", highlights: ["Bowling at Phase 1/2", "Casual dining", "Relaxing at iL Centro"] },
      { id: "robinsons-antipolo", name: "Robinsons Antipolo", area: "Sumulong Hwy, Antipolo", highlights: ["Quiet movie date", "Transport-friendly", "Breezy alfresco spots"] },
      { id: "up-town", name: "UP Town Center", area: "Katipunan Ave, Quezon City", highlights: ["Campus vibe", "Great cafes", "Open walkways"] }
    ]
  },
  {
    id: "scenic",
    title: "Scenic Walk Trips & Nature Breeze",
    vibe: "Outdoor breeze, walking hand-in-hand, active and relaxed.",
    glow: "#ff8a5b",
    places: [
      { id: "riverbanks", name: "Riverbanks Center", area: "Barangka, Marikina", highlights: ["Riverside sunset stroll", "Biking", "Amphitheater picnic"] },
      { id: "taktak", name: "Hinulugang Taktak", area: "Taktak Rd, Antipolo", highlights: ["Nature walk", "Waterfalls viewing", "Quiet escape"] },
      { id: "qmc", name: "Quezon Memorial Circle", area: "Elliptical Rd, Diliman", highlights: ["Rent a tandem bike", "Night market food stalls", "Park picnic"] }
    ]
  },
  {
    id: "food",
    title: "Cultural & Culinary Food Crawls",
    vibe: "Flavorful walk trips, historic spots, eating all day.",
    glow: "#f7a8d0",
    places: [
      { id: "binondo", name: "Binondo", area: "Manila", highlights: ["Xiao long bao at Dong Bei", "Fried siopao on Ongpin", "Coffee at 1919 Grand Cafe"] },
      { id: "lilac", name: "Lilac Street", area: "Concepcion Dos, Marikina", highlights: ["Suburban food crawl", "Artisan cafes", "Hole-in-the-wall eats"] },
      { id: "kapitolyo", name: "Kapitolyo Food Hub", area: "Pasig", highlights: ["Trendy gastropubs", "Hidden gems", "Taco and burger spots"] }
    ]
  },
  {
    id: "intimate",
    title: "Intimate Escapes & Staycations",
    vibe: "Private, cozy, uninterrupted time together.",
    glow: "#b38cff",
    places: [
      { id: "ava", name: "Hotel Ava", area: "Pasay or Malate", highlights: ["Movie marathon", "Ordering room service", "Thematic rooms"] },
      { id: "luljettas", name: "Luljetta's Hanging Gardens Spa", area: "Antipolo", highlights: ["Infinity pool", "Couples massage", "Scenic mountain views"] },
      { id: "privato", name: "Privato Hotel", area: "Ortigas / Quezon City", highlights: ["City skyline views", "Roof deck pool", "Quiet luxury"] }
    ]
  }
];

function buildTimes() {
  const out = [];
  for (let m = 9 * 60; m <= 22 * 60; m += 30) {
    const h24 = Math.floor(m / 60);
    const min = m % 60;
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    out.push(`${h12}:${min === 0 ? "00" : "30"} ${h24 < 12 ? "AM" : "PM"}`);
  }
  return out;
}
export const TIMES = buildTimes();
