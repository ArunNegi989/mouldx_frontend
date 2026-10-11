export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface TechnicalForm {
  length: string;
  breadth: string;
  height: string;
  weight: string;
  cavities: string;
  cycleTime: string;
  hourlyProduction: string;
  tonnage: string;
  maxInjectionVolume: string;
  runnerType: "Hot Runner" | "Cold Runner";
  coolingTemp: string;
  changeableLogo: "Yes" | "No";
}

export interface GeneralForm {
  mouldNameOrId: string;
  mouldType: string;
  condition: string;
  year: string;
  manufacturer: string;
  invoice: File | null;
  existingInvoiceName: string | null;
  actualValue: string;
  setOfMouldsInvolved: string;
  salesStateEligibility: string;
  perDayCharges: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface ProductForm {
  productName: string;
  category: string;
  image: File | null;
  existingImageUrl: string | null;
  video: File | null;
  existingVideoName: string | null;
  length: string;
  breadth: string;
  height: string;
  weight: string;
  material: string;
  finish: string;
  geo: GeoPoint | null;
}

export interface ListingIssue {
  label: string;
  flagged: boolean;
}

export interface ApprovalInfo {
  status: ApprovalStatus;
  submittedAt?: string;
  etaHours?: number;
  remarks?: string;
  issues?: ListingIssue[];
}

export interface MouldListing {
  id: string;
  code: string;
  technical: TechnicalForm;
  general: GeneralForm;
  product: ProductForm;
  approval: ApprovalInfo;
  stats: {
    views: number;
    enquiries: number;
    bookings: number;
  };
}