export type Category = "Injection" | "Blow" | "Die-Cast";
export type Availability = "FREE" | "2 LEFT" | "BOOKED";
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
  length: string;
  breadth: string;
  height: string;
}

export interface MouldInfo {
  mouldNameOrId: string;
  mouldType: string;
  yearOfManufacturing: string;
  dimensions: Dimensions;
  weight: string;
  cavities: string;
  expectedCycleTime: string;
  recommendedMachineTonnage: string;
  runnerType: RunnerType;
  changeableBrandLogo: "Yes" | "No";
}

export interface ComponentDetail {
  id: string;
  componentName: string;
  photos: string[];
  videos: string[];
  dimensions: Dimensions;
  weight: string;
  surfaceFinish: string;
  mould: MouldInfo;
}

export interface ProductInfo {
  productName: string;
  category: ProductCategory;
  subCategory: string;
  photos: string[];
  videos: string[];
  dimensions: Dimensions;
  weight: string;
  material: string;
  surfaceFinish: string;
  perDayRentalCharges: string;
  securityDeposit: string;
}

export interface MouldDetail extends MouldBase {
  deposit: string;
  quickSpecs: { label: string; value: string; sub: string }[];
  product: ProductInfo;
  /** Set only when a single mould is involved. */
  mould: MouldInfo | null;
  /** Filled only when more than one component / mould is involved. */
  components: ComponentDetail[];
}

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

const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Chair",
  "Table",
  "Baby Chair",
  "Stool",
  "Fix Table",
  "Folding Table",
];

// Placeholder values, replace with the real sub categories from the Excel sheet.
const SUB_CATEGORIES: Record<ProductCategory, string[]> = {
  Chair: ["Armless Chair", "Arm Chair", "Plastic Chair"],
  Table: ["Dining Table", "Side Table", "Center Table"],
  "Baby Chair": ["High Chair", "Feeding Chair"],
  Stool: ["Bar Stool", "Round Stool"],
  "Fix Table": ["Study Table", "Utility Table"],
  "Folding Table": ["Portable Table", "Picnic Table"],
};

const COMPONENT_NAMES = ["Cap", "Body", "Bottom", "Top", "Handle", "Base"];

interface HandCrafted {
  deposit?: string;
  quickSpecs?: MouldDetail["quickSpecs"];
  product?: Partial<ProductInfo>;
}

const HAND_CRAFTED: Record<string, HandCrafted> = {
  "1": {
    deposit: "₹15,000 DEPOSIT",
    quickSpecs: [
      { label: "TONNAGE", value: "120T", sub: "" },
      { label: "CAVITY", value: "2", sub: "" },
      { label: "STEEL", value: "P20", sub: "" },
    ],
    product: {
      productName: "Plastic Chair — Armless",
      category: "Chair",
      subCategory: "Armless Chair",
      dimensions: { length: "560", breadth: "540", height: "820" },
      weight: "2.1 kg",
      material: "PP (Polypropylene)",
      surfaceFinish: "Matte, textured back panel",
      perDayRentalCharges: "₹1,800/day",
      securityDeposit: "₹15,000",
    },
  },
};

function componentCountFor(id: string): number {
  if (id === "1") return 4;
  const seed = Number(id);
  return [1, 2, 4, 3][seed % 4];
}

function buildMouldInfo(args: {
  name: string;
  code: string;
  category: Category;
  salt: number;
}): MouldInfo {
  const { name, code, category, salt } = args;
  const tonnage = [80, 120, 150, 200, 250][salt % 5];
  const cavities = (salt % 4) + 1;
  const cycle = 20 + (salt % 15);

  return {
    mouldNameOrId: `${name} / ${code}`,
    mouldType: `${category} Mould`,
    yearOfManufacturing: `${2015 + (salt % 9)}`,
    dimensions: {
      length: `${400 + salt * 3}`,
      breadth: `${320 + salt * 2}`,
      height: `${360 + salt}`,
    },
    weight: `${500 + salt * 12} kg`,
    cavities: `${cavities} Cavity`,
    expectedCycleTime: `${cycle} sec (virgin material)`,
    recommendedMachineTonnage: `${tonnage}T`,
    runnerType: salt % 2 === 0 ? "Cold Runner" : "Hot Runner",
    changeableBrandLogo: salt % 2 === 0 ? "Yes" : "No",
  };
}

function buildMouldDetail(base: MouldBase): MouldDetail {
  const seed = Number(base.id);
  const tonnage = [80, 120, 150, 200, 250][seed % 5];
  const cavities = (seed % 4) + 1;
  const isBlow = base.category === "Blow";
  const isDieCast = base.category === "Die-Cast";
  const count = componentCountFor(base.id);

  const productCategory = PRODUCT_CATEGORIES[seed % PRODUCT_CATEGORIES.length];
  const subOptions = SUB_CATEGORIES[productCategory];
  const securityDeposit = `₹${(tonnage * 100).toLocaleString("en-IN")}`;

  const product: ProductInfo = {
    productName: base.name,
    category: productCategory,
    subCategory: subOptions[seed % subOptions.length],
    photos: [
      `https://picsum.photos/seed/mould${base.id}-a/900/700`,
      `https://picsum.photos/seed/mould${base.id}-b/900/700`,
      `https://picsum.photos/seed/mould${base.id}-c/900/700`,
    ],
    videos: seed % 2 === 0 ? [`https://picsum.photos/seed/mould${base.id}-vid/900/700`] : [],
    dimensions: {
      length: `${500 + seed * 2}`,
      breadth: `${450 + seed}`,
      height: `${700 + seed * 3}`,
    },
    weight: `${1.5 + (seed % 5) * 0.3}`.slice(0, 4) + " kg",
    material: isBlow ? "HDPE" : isDieCast ? "Aluminium A380" : "PP (Polypropylene)",
    surfaceFinish: seed % 2 === 0 ? "Matte, textured" : "Glossy, smooth",
    perDayRentalCharges: base.price,
    securityDeposit,
  };

  const components: ComponentDetail[] =
    count > 1
      ? Array.from({ length: count }, (_, i) => {
          const componentName = COMPONENT_NAMES[i % COMPONENT_NAMES.length];
          const salt = seed + i + 1;
          return {
            id: `${base.id}-c${i + 1}`,
            componentName,
            photos: [
              `https://picsum.photos/seed/mould${base.id}-c${i + 1}-a/900/700`,
              `https://picsum.photos/seed/mould${base.id}-c${i + 1}-b/900/700`,
            ],
            videos:
              (seed + i) % 2 === 0
                ? [`https://picsum.photos/seed/mould${base.id}-c${i + 1}-vid/900/700`]
                : [],
            dimensions: {
              length: `${120 + salt * 4}`,
              breadth: `${90 + salt * 3}`,
              height: `${60 + salt * 2}`,
            },
            weight: `${(0.3 + i * 0.2).toFixed(1)} kg`,
            surfaceFinish: (seed + i) % 2 === 0 ? "Matte" : "Glossy",
            mould: buildMouldInfo({
              name: `${componentName} Mould`,
              code: `${base.code}-C${i + 1}`,
              category: base.category,
              salt,
            }),
          };
        })
      : [];

  const mould: MouldInfo | null =
    count === 1
      ? buildMouldInfo({
          name: base.name,
          code: base.code,
          category: base.category,
          salt: seed,
        })
      : null;

  const quickSpecs: MouldDetail["quickSpecs"] = isDieCast
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
      ];

  return {
    ...base,
    deposit: `${securityDeposit} DEPOSIT`,
    quickSpecs,
    product,
    mould,
    components,
  };
}

export function getMouldDetail(id: string): MouldDetail | null {
  const base = DUMMY_MOULDS.find((m) => m.id === id);
  if (!base) return null;

  const detail = buildMouldDetail(base);
  const crafted = HAND_CRAFTED[id];
  if (!crafted) return detail;

  return {
    ...detail,
    deposit: crafted.deposit ?? detail.deposit,
    quickSpecs: crafted.quickSpecs ?? detail.quickSpecs,
    product: { ...detail.product, ...crafted.product },
  };
}

export function getBookedDaysForMonth(
  mouldId: string,
  year: number,
  month: number
): Set<number> {
  const seed = Number(mouldId) + year + month;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const booked = new Set<number>();
  for (let d = 1; d <= daysInMonth; d++) {
    if ((d * 7 + seed * 3) % 11 < 2) booked.add(d);
  }
  return booked;
}