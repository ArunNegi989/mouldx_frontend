// data/moulds.ts
// Single source of truth — MouldExplore list aur detail page dono yahi se data lenge.
// Jab real API aayega, sirf yeh file replace karni hogi, components untouched rahenge.

export type Category = "Injection" | "Blow" | "Die-Cast";
export type Availability = "FREE" | "2 LEFT" | "BOOKED";
export type MouldStatus = "LIVE" | "PAUSED" | "PENDING_APPROVAL";
export type RunnerType = "Hot Runner" | "Cold Runner";
export type ProductCategory =
  | "Chair"
  | "Table"
  | "Baby Chair"
  | "Stool"
  | "Fix Table"
  | "Folding Table";

export interface MouldBase {
  id: string;
  code: string;
  name: string;
  city: string;
  price: string;
  category: Category;
  availability: Availability;
  image: string;
}

export interface Dimensions {
  length: string; // mm
  breadth: string; // mm
  height: string; // mm
}

export interface MouldDetail extends MouldBase {
  status: MouldStatus;
  owner: string;
  verified: boolean;
  deposit: string;
  photos: string[];
  videos: string[];
  quickSpecs: { label: string; value: string; sub: string }[];

  general: {
    mouldNameOrId: string;
    mouldType: string;
    mouldCondition: string;
    yearOfManufacturing: string;
    mouldManufacturer: string;
    mouldInvoice: string;
    mouldActualValue: string;
    setOfMouldsInvolved: string;
    salesStateEligibility: string;
    perDayRentalCharges: string;
  };

  technical: {
    dimensions: Dimensions;
    weight: string;
    cavities: string;
    expectedCycleTime: string;
    estimatedHourlyProduction: string;
    recommendedMachineTonnage: string;
    maxInjectionVolume: string;
    runnerType: RunnerType;
    recommendedCoolingWaterTemp: string;
    changeableBrandLogo: "Yes" | "No";
  };

  product: {
    productName: string;
    category: ProductCategory;
    dimensions: Dimensions;
    weight: string;
    material: string;
    surfaceFinish: string;
  };
}

// ---------------------------------------------------------------------------
// Base list — same 24 dummy moulds as before (MouldExplore ab yahi import karega)
// ---------------------------------------------------------------------------
export const DUMMY_MOULDS: MouldBase[] = [
  { id: "1", code: "MX-000123", name: "2-Cavity Injection Mould", city: "Pune", price: "₹1,800/day", category: "Injection", availability: "FREE", image: "https://picsum.photos/seed/mould1/400/400" },
  { id: "2", code: "MX-000198", name: "Blow Mould — 5L Can", city: "Nashik", price: "₹2,400/day", category: "Blow", availability: "FREE", image: "https://picsum.photos/seed/mould2/400/400" },
  { id: "3", code: "MX-000077", name: "Die-Cast Housing Mould", city: "Aurangabad", price: "₹3,100/day", category: "Die-Cast", availability: "2 LEFT", image: "https://picsum.photos/seed/mould3/400/400" },
  { id: "4", code: "MX-000045", name: "Single Cavity Chair Mould", city: "Rajkot", price: "₹2,000/day", category: "Injection", availability: "FREE", image: "https://picsum.photos/seed/mould4/400/400" },
  { id: "5", code: "MX-000210", name: "Blow Mould — Bottle 1L", city: "Indore", price: "₹1,500/day", category: "Blow", availability: "BOOKED", image: "https://picsum.photos/seed/mould5/400/400" },
  { id: "6", code: "MX-000512", name: "4-Cavity Bucket Mould", city: "Surat", price: "₹2,900/day", category: "Injection", availability: "FREE", image: "https://picsum.photos/seed/mould6/400/400" },
  { id: "7", code: "MX-000633", name: "Die-Cast Motor Housing", city: "Chennai", price: "₹4,200/day", category: "Die-Cast", availability: "FREE", image: "https://picsum.photos/seed/mould7/400/400" },
  { id: "8", code: "MX-000714", name: "Blow Mould — Jerry Can 10L", city: "Vadodara", price: "₹2,600/day", category: "Blow", availability: "2 LEFT", image: "https://picsum.photos/seed/mould8/400/400" },
  { id: "9", code: "MX-000825", name: "Crate Mould — Heavy Duty", city: "Ludhiana", price: "₹3,400/day", category: "Injection", availability: "FREE", image: "https://picsum.photos/seed/mould9/400/400" },
  { id: "10", code: "MX-000936", name: "Die-Cast Bracket Mould", city: "Coimbatore", price: "₹1,950/day", category: "Die-Cast", availability: "BOOKED", image: "https://picsum.photos/seed/mould10/400/400" },
  { id: "11", code: "MX-001047", name: "Blow Mould — Bottle 500ml", city: "Ahmedabad", price: "₹1,300/day", category: "Blow", availability: "FREE", image: "https://picsum.photos/seed/mould11/400/400" },
  { id: "12", code: "MX-001158", name: "Stool Mould — Single Cavity", city: "Jaipur", price: "₹1,700/day", category: "Injection", availability: "FREE", image: "https://picsum.photos/seed/mould12/400/400" },
  { id: "13", code: "MX-001269", name: "Die-Cast Gear Cover", city: "Faridabad", price: "₹3,800/day", category: "Die-Cast", availability: "2 LEFT", image: "https://picsum.photos/seed/mould13/400/400" },
  { id: "14", code: "MX-001370", name: "Blow Mould — Drum 20L", city: "Nagpur", price: "₹3,600/day", category: "Blow", availability: "FREE", image: "https://picsum.photos/seed/mould14/400/400" },
  { id: "15", code: "MX-001481", name: "Table Mould — Folding", city: "Bhopal", price: "₹2,300/day", category: "Injection", availability: "FREE", image: "https://picsum.photos/seed/mould15/400/400" },
  { id: "16", code: "MX-001592", name: "Die-Cast Pump Body", city: "Kanpur", price: "₹4,500/day", category: "Die-Cast", availability: "FREE", image: "https://picsum.photos/seed/mould16/400/400" },
  { id: "17", code: "MX-001603", name: "Blow Mould — Bottle 2L", city: "Lucknow", price: "₹1,850/day", category: "Blow", availability: "BOOKED", image: "https://picsum.photos/seed/mould17/400/400" },
  { id: "18", code: "MX-001714", name: "Basket Mould — Perforated", city: "Patna", price: "₹1,450/day", category: "Injection", availability: "FREE", image: "https://picsum.photos/seed/mould18/400/400" },
  { id: "19", code: "MX-001825", name: "Die-Cast Cover Plate", city: "Ranchi", price: "₹2,750/day", category: "Die-Cast", availability: "2 LEFT", image: "https://picsum.photos/seed/mould19/400/400" },
  { id: "20", code: "MX-001936", name: "Blow Mould — Tank 50L", city: "Bhubaneswar", price: "₹5,100/day", category: "Blow", availability: "FREE", image: "https://picsum.photos/seed/mould20/400/400" },
  { id: "21", code: "MX-002047", name: "Bench Mould — Outdoor", city: "Guwahati", price: "₹2,950/day", category: "Injection", availability: "FREE", image: "https://picsum.photos/seed/mould21/400/400" },
  { id: "22", code: "MX-002158", name: "Die-Cast Engine Mount", city: "Amritsar", price: "₹3,300/day", category: "Die-Cast", availability: "FREE", image: "https://picsum.photos/seed/mould22/400/400" },
  { id: "23", code: "MX-002269", name: "Blow Mould — Bottle 250ml", city: "Varanasi", price: "₹1,100/day", category: "Blow", availability: "2 LEFT", image: "https://picsum.photos/seed/mould23/400/400" },
  { id: "24", code: "MX-002370", name: "Crate Mould — Stackable", city: "Meerut", price: "₹2,650/day", category: "Injection", availability: "BOOKED", image: "https://picsum.photos/seed/mould24/400/400" },
];

// ---------------------------------------------------------------------------
// Ek fully hand-crafted example (id "1") — screenshot ke exact values ke saath.
// Baaki sab ids ke liye buildMouldDetail() consistent dummy detail generate karta hai
// taaki koi bhi card click karo, detail page break na ho. Real API aane pe
// yeh poora override object hata dena, sirf fetch call rakhna.
// ---------------------------------------------------------------------------
const HAND_CRAFTED: Record<string, Partial<MouldDetail>> = {
  "1": {
    status: "LIVE",
    owner: "Sharma Industries",
    verified: true,
    deposit: "₹15,000 DEPOSIT",
    photos: [
      "https://picsum.photos/seed/mould1-a/900/700",
      "https://picsum.photos/seed/mould1-b/900/700",
      "https://picsum.photos/seed/mould1-c/900/700",
      "https://picsum.photos/seed/mould1-d/900/700",
    ],
    videos: ["https://picsum.photos/seed/mould1-vid/900/700"],
    quickSpecs: [
      { label: "TONNAGE", value: "120T", sub: "" },
      { label: "CAVITY", value: "2", sub: "" },
      { label: "STEEL", value: "P20", sub: "" },
    ],
    general: {
      mouldNameOrId: "2-Cavity Injection Mould / MX-000123",
      mouldType: "Injection Mould",
      mouldCondition: "Good — minor wear",
      yearOfManufacturing: "2019",
      mouldManufacturer: "Precision Tool & Die, Pune",
      mouldInvoice: "Available on request",
      mouldActualValue: "₹4,20,000",
      setOfMouldsInvolved: "Single set",
      salesStateEligibility: "Maharashtra, Gujarat, MP",
      perDayRentalCharges: "₹1,800/day",
    },
    technical: {
      dimensions: { length: "480", breadth: "380", height: "420" },
      weight: "640 kg",
      cavities: "2 Cavity",
      expectedCycleTime: "28 sec (virgin material)",
      estimatedHourlyProduction: "~257 pcs/hr",
      recommendedMachineTonnage: "120T",
      maxInjectionVolume: "185 cm³",
      runnerType: "Cold Runner",
      recommendedCoolingWaterTemp: "18–22°C",
      changeableBrandLogo: "Yes",
    },
    product: {
      productName: "Plastic Chair — Armless",
      category: "Chair",
      dimensions: { length: "560", breadth: "540", height: "820" },
      weight: "2.1 kg",
      material: "PP (Polypropylene)",
      surfaceFinish: "Matte, textured back panel",
    },
  },
};

// Deterministic-but-varied dummy generator for every other mould.
function buildMouldDetail(base: MouldBase): MouldDetail {
  const seed = Number(base.id);
  const tonnage = [80, 120, 150, 200, 250][seed % 5];
  const cavities = (seed % 4) + 1;
  const isBlow = base.category === "Blow";
  const isDieCast = base.category === "Die-Cast";

  const runner: RunnerType = seed % 2 === 0 ? "Cold Runner" : "Hot Runner";
  const productCategoryOptions: ProductCategory[] = [
    "Chair", "Table", "Baby Chair", "Stool", "Fix Table", "Folding Table",
  ];

  return {
    ...base,
    status: base.availability === "BOOKED" ? "LIVE" : "LIVE",
    owner: `${base.city} Moulders Pvt. Ltd.`,
    verified: seed % 3 !== 0,
    deposit: `₹${(tonnage * 100).toLocaleString("en-IN")} DEPOSIT`,
    photos: [
      `https://picsum.photos/seed/mould${base.id}-a/900/700`,
      `https://picsum.photos/seed/mould${base.id}-b/900/700`,
      `https://picsum.photos/seed/mould${base.id}-c/900/700`,
    ],
    videos: seed % 2 === 0 ? [`https://picsum.photos/seed/mould${base.id}-vid/900/700`] : [],
    quickSpecs: isDieCast
      ? [
          { label: "TONNAGE", value: `${tonnage}T`, sub: "" },
          { label: "CAVITY", value: `${cavities}`, sub: "" },
          { label: "ALLOY", value: "Al A380", sub: "" },
        ]
      : isBlow
      ? [
          { label: "CAPACITY", value: "5L", sub: "" },
          { label: "CAVITY", value: `${cavities}`, sub: "" },
          { label: "MATERIAL", value: "HDPE", sub: "" },
        ]
      : [
          { label: "TONNAGE", value: `${tonnage}T`, sub: "" },
          { label: "CAVITY", value: `${cavities}`, sub: "" },
          { label: "STEEL", value: "P20", sub: "" },
        ],
    general: {
      mouldNameOrId: `${base.name} / ${base.code}`,
      mouldType: `${base.category} Mould`,
      mouldCondition: seed % 4 === 0 ? "Excellent" : "Good — minor wear",
      yearOfManufacturing: `${2015 + (seed % 9)}`,
      mouldManufacturer: `${base.city} Tool & Die Works`,
      mouldInvoice: "Available on request",
      mouldActualValue: `₹${(tonnage * 3200).toLocaleString("en-IN")}`,
      setOfMouldsInvolved: seed % 5 === 0 ? "2 sets (core + cavity spare)" : "Single set",
      salesStateEligibility: "All India",
      perDayRentalCharges: base.price,
    },
    technical: {
      dimensions: {
        length: `${400 + seed * 3}`,
        breadth: `${320 + seed * 2}`,
        height: `${360 + seed}`,
      },
      weight: `${500 + seed * 12} kg`,
      cavities: `${cavities} Cavity`,
      expectedCycleTime: `${20 + (seed % 15)} sec (virgin material)`,
      estimatedHourlyProduction: `~${Math.round((3600 / (20 + (seed % 15))) * cavities)} pcs/hr`,
      recommendedMachineTonnage: `${tonnage}T`,
      maxInjectionVolume: `${120 + seed * 4} cm³`,
      runnerType: runner,
      recommendedCoolingWaterTemp: "18–22°C",
      changeableBrandLogo: seed % 2 === 0 ? "Yes" : "No",
    },
    product: {
      productName: base.name,
      category: productCategoryOptions[seed % productCategoryOptions.length],
      dimensions: {
        length: `${500 + seed * 2}`,
        breadth: `${450 + seed}`,
        height: `${700 + seed * 3}`,
      },
      weight: `${1.5 + (seed % 5) * 0.3}`.slice(0, 4) + " kg",
      material: isBlow ? "HDPE" : isDieCast ? "Aluminium A380" : "PP (Polypropylene)",
      surfaceFinish: seed % 2 === 0 ? "Matte, textured" : "Glossy, smooth",
    },
    ...HAND_CRAFTED[base.id],
  } as MouldDetail;
}

export function getMouldDetail(id: string): MouldDetail | null {
  const base = DUMMY_MOULDS.find((m) => m.id === id);
  if (!base) return null;
  return buildMouldDetail(base);
}


export function getBookedDaysForMonth(
  mouldId: string,
  year: number,
  month: number // 0-indexed (Jan = 0)
): Set<number> {
  const seed = Number(mouldId) + year + month;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const booked = new Set<number>();
  for (let d = 1; d <= daysInMonth; d++) {
    if ((d * 7 + seed * 3) % 11 < 2) booked.add(d);
  }
  return booked;
}