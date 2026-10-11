import { ApprovalInfo, GeneralForm, MouldListing, ProductForm, TechnicalForm } from "./types";

function build(
  id: string,
  code: string,
  mouldName: string,
  productName: string,
  approval: ApprovalInfo
): MouldListing {
  return {
    id,
    code,
    technical: {
      length: "420",
      breadth: "310",
      height: "280",
      weight: "185",
      cavities: "4",
      cycleTime: "28",
      hourlyProduction: "120",
      tonnage: "220",
      maxInjectionVolume: "650",
      runnerType: "Hot Runner",
      coolingTemp: "18",
      changeableLogo: "No",
    },
    general: {
      mouldNameOrId: `${mouldName} · ${code}`,
      mouldType: "Injection",
      condition: "Good",
      year: "2022",
      manufacturer: "Precision Ltd.",
      invoice: null,
      existingInvoiceName: "invoice-2022.pdf",
      actualValue: "450000",
      setOfMouldsInvolved: "Single mould",
      salesStateEligibility: "Pan India",
      perDayCharges: "18000",
    },
    product: {
      productName,
      category: "Chair",
      image: null,
      existingImageUrl: `https://picsum.photos/seed/${code}/600/600`,
      video: null,
      existingVideoName: null,
      length: "28",
      breadth: "28",
      height: "14",
      weight: "3.2",
      material: "HDPE",
      finish: "Matte",
      geo: { lat: 30.3165, lng: 78.0322 },
    },
    approval,
    stats: { views: 128, enquiries: 9, bookings: 3 },
  };
}

const LISTINGS: Record<string, MouldListing> = {
  "1": build("1", "MX-000123", "Bottle Cap Mould", "28mm PET Bottle Cap", {
    status: "APPROVED",
  }),
  "2": build("2", "MX-000198", "PET Preform Mould", "PET Preform 28mm", {
    status: "REJECTED",
    remarks:
      "Photos are too dim. Please reshoot the product with better lighting and upload the mould invoice.",
    issues: [
      { label: "Product image quality", flagged: true },
      { label: "Missing invoice", flagged: true },
      { label: "Cavity count mismatch", flagged: false },
    ],
  }),
  "3": build("3", "MX-000077", "Chair Leg Mould", "Plastic Chair Leg", {
    status: "PENDING",
    submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    etaHours: 12,
  }),
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchListing(id: string): Promise<MouldListing | null> {
  await delay(500);
  return LISTINGS[id] ?? null;
}

export async function submitListing(
  id: string,
  data: { technical: TechnicalForm; general: GeneralForm; product: ProductForm }
): Promise<{ submittedAt: string }> {
  await delay(900);
  void id;
  void data;
  return { submittedAt: new Date().toISOString() };
}