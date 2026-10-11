import { GeneralForm, ProductForm, TechnicalForm } from "./types";

const REGEX = {
  positiveInt: /^[1-9]\d*$/,
  positiveDecimal: /^\d+(\.\d{1,2})?$/,
  decimal: /^\d+(\.\d{1,2})?$/,
  mouldNameOrId: /^[a-zA-Z0-9\s.,'\-·]{3,80}$/,
  year: /^(19|20)\d{2}$/,
  manufacturer: /^[a-zA-Z0-9\s.,'&-]{2,80}$/,
  productName: /^[a-zA-Z0-9\s.,'\-()]{2,80}$/,
  material: /^[a-zA-Z0-9\s.,'\-\/]{2,60}$/,
};

const TECHNICAL_KEYS = [
  "length",
  "breadth",
  "height",
  "weight",
  "cavities",
  "cycleTime",
  "hourlyProduction",
  "tonnage",
  "maxInjectionVolume",
  "coolingTemp",
] as const;

const WHOLE_NUMBER_KEYS: string[] = ["cavities", "cycleTime", "coolingTemp"];

export type TechnicalNumericKey = (typeof TECHNICAL_KEYS)[number];
export type TechnicalErrors = Record<TechnicalNumericKey, string>;

export type GeneralErrors = Record<
  | "mouldNameOrId"
  | "year"
  | "manufacturer"
  | "invoice"
  | "actualValue"
  | "setOfMouldsInvolved"
  | "perDayCharges",
  string
>;

export type ProductErrors = Record<
  | "productName"
  | "image"
  | "length"
  | "breadth"
  | "height"
  | "weight"
  | "material"
  | "finish",
  string
>;

export function hasErrors(errors: Record<string, string>) {
  return Object.values(errors).some(Boolean);
}

function numeric(value: string, regex: RegExp) {
  const v = value.trim();
  if (v === "") return "Required";
  return regex.test(v) ? "" : "Numeric value only";
}

function text(value: string, regex: RegExp, message: string) {
  const v = value.trim();
  if (v === "") return "Required";
  return regex.test(v) ? "" : message;
}

export function validateTechnical(form: TechnicalForm): TechnicalErrors {
  const errors = {} as TechnicalErrors;
  for (const key of TECHNICAL_KEYS) {
    errors[key] = numeric(
      form[key],
      WHOLE_NUMBER_KEYS.includes(key) ? REGEX.positiveInt : REGEX.positiveDecimal
    );
  }
  return errors;
}

export function validateGeneral(form: GeneralForm): GeneralErrors {
  return {
    mouldNameOrId: text(form.mouldNameOrId, REGEX.mouldNameOrId, "3–80 characters, letters/numbers only"),
    year: text(form.year, REGEX.year, "Enter a valid year (e.g. 2022)"),
    manufacturer: text(form.manufacturer, REGEX.manufacturer, "Enter a valid manufacturer name"),
    invoice: form.invoice || form.existingInvoiceName ? "" : "Invoice upload is required",
    actualValue: numeric(form.actualValue, REGEX.decimal),
    setOfMouldsInvolved: form.setOfMouldsInvolved.trim() === "" ? "Required" : "",
    perDayCharges: numeric(form.perDayCharges, REGEX.decimal),
  };
}

export function validateProduct(form: ProductForm): ProductErrors {
  return {
    productName: text(form.productName, REGEX.productName, "2–80 characters, letters/numbers only"),
    image: form.image || form.existingImageUrl ? "" : "At least one image is required",
    length: numeric(form.length, REGEX.decimal),
    breadth: numeric(form.breadth, REGEX.decimal),
    height: numeric(form.height, REGEX.decimal),
    weight: numeric(form.weight, REGEX.decimal),
    material: text(form.material, REGEX.material, "Enter a valid material"),
    finish: text(form.finish, REGEX.material, "Enter a valid finish"),
  };
}