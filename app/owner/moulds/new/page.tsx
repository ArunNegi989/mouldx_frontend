"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./MouldTechnical.module.css";

const REGEX = {
  positiveInt: /^[1-9]\d*$/, // whole numbers, no decimals — cavities, cycle time, cooling temp
  positiveDecimal: /^\d+(\.\d{1,2})?$/, // dimensions, weight, tonnage, production, volume — allows decimals
};

interface FormState {
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

const INITIAL_STATE: FormState = {
  length: "",
  breadth: "",
  height: "",
  weight: "",
  cavities: "",
  cycleTime: "",
  hourlyProduction: "",
  tonnage: "",
  maxInjectionVolume: "",
  runnerType: "Hot Runner",
  coolingTemp: "",
  changeableLogo: "No",
};

const REQUIRED_NUMERIC_FIELDS: (keyof FormState)[] = [
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
];

export default function MouldTechnicalPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const markTouched = (key: string) => setTouched((prev) => ({ ...prev, [key]: true }));

  // Whole-number-only fields (no decimals make sense here)
  const wholeNumberFields: (keyof FormState)[] = ["cavities", "cycleTime", "coolingTemp"];

  const validateField = (key: keyof FormState, value: string): string => {
    if (value.trim() === "") return "Required";
    const regex = wholeNumberFields.includes(key) ? REGEX.positiveInt : REGEX.positiveDecimal;
    if (!regex.test(value.trim())) return "Numeric value only";
    return "";
  };

  const errors: Partial<Record<keyof FormState, string>> = Object.fromEntries(
    REQUIRED_NUMERIC_FIELDS.map((key) => [key, validateField(key, form[key] as string)])
  );

  const isValid = REQUIRED_NUMERIC_FIELDS.every((key) => !errors[key]);

  const handleNumericChange = (key: keyof FormState, raw: string, allowDecimal: boolean) => {
    // strip anything that isn't a digit (and a single dot, if decimals allowed)
    let cleaned = allowDecimal ? raw.replace(/[^0-9.]/g, "") : raw.replace(/\D/g, "");
    if (allowDecimal) {
      const parts = cleaned.split(".");
      if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("");
    }
    update(key, cleaned as FormState[typeof key]);
  };

  const handleNext = () => {
    setTouched(Object.fromEntries(REQUIRED_NUMERIC_FIELDS.map((f) => [f, true])));
    if (!isValid) return;
    // TODO: persist technical details, then continue
    router.push("/owner/moulds/new/general");
  };

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <Link
          href="/owner/onboarding/approved"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-900 no-underline"
          aria-label="Go back"
        >
          ‹
        </Link>
        <span className="text-[15px] font-extrabold text-gray-900">
          Mould<span className="text-cyan-500">X</span>
        </span>
        <span className="w-9" />
      </header>

      <div className={styles.content}>
        <h1 className="text-[26px] font-extrabold text-gray-900">Mould Details</h1>
        <p className="mt-1 text-sm text-gray-400">Step 2 · Technical specifications.</p>

        {/* ---------- Progress bar (2 of 4) ---------- */}
        <div className="mt-4 flex gap-1.5">
          <span className={styles.progressBarActive} />
          <span className={styles.progressBarActive} />
          <span className={styles.progressBar} />
          <span className={styles.progressBar} />
        </div>

        {/* ---------- Dimensions ---------- */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Dimensions (mm)</h2>
          <div className="grid grid-cols-3 gap-3">
            <NumField
              label="Length"
              value={form.length}
              onChange={(v) => handleNumericChange("length", v, true)}
              onBlur={() => markTouched("length")}
              error={touched.length ? errors.length : ""}
              placeholder="420"
            />
            <NumField
              label="Breadth"
              value={form.breadth}
              onChange={(v) => handleNumericChange("breadth", v, true)}
              onBlur={() => markTouched("breadth")}
              error={touched.breadth ? errors.breadth : ""}
              placeholder="310"
            />
            <NumField
              label="Height"
              value={form.height}
              onChange={(v) => handleNumericChange("height", v, true)}
              onBlur={() => markTouched("height")}
              error={touched.height ? errors.height : ""}
              placeholder="280"
            />
          </div>
        </div>

        {/* ---------- Rest of technical specs ---------- */}
        <div className={styles.card}>
          <div className="grid grid-cols-2 gap-3">
            <NumField
              label="Weight (kg)"
              value={form.weight}
              onChange={(v) => handleNumericChange("weight", v, true)}
              onBlur={() => markTouched("weight")}
              error={touched.weight ? errors.weight : ""}
              placeholder="185"
            />
            <NumField
              label="No. of Cavities / Core"
              value={form.cavities}
              onChange={(v) => handleNumericChange("cavities", v, false)}
              onBlur={() => markTouched("cavities")}
              error={touched.cavities ? errors.cavities : ""}
              placeholder="4"
            />
            <NumField
              label="Expected Cycle Time (s)"
              value={form.cycleTime}
              onChange={(v) => handleNumericChange("cycleTime", v, false)}
              onBlur={() => markTouched("cycleTime")}
              error={touched.cycleTime ? errors.cycleTime : ""}
              placeholder="28"
            />
            <NumField
              label="Estimated Hourly Production"
              value={form.hourlyProduction}
              onChange={(v) => handleNumericChange("hourlyProduction", v, true)}
              onBlur={() => markTouched("hourlyProduction")}
              error={touched.hourlyProduction ? errors.hourlyProduction : ""}
              placeholder="120"
            />
            <NumField
              label="Recommended Tonnage (T)"
              value={form.tonnage}
              onChange={(v) => handleNumericChange("tonnage", v, true)}
              onBlur={() => markTouched("tonnage")}
              error={touched.tonnage ? errors.tonnage : ""}
              placeholder="220"
            />
            <NumField
              label="Max. Injection Volume (cm³)"
              value={form.maxInjectionVolume}
              onChange={(v) => handleNumericChange("maxInjectionVolume", v, true)}
              onBlur={() => markTouched("maxInjectionVolume")}
              error={touched.maxInjectionVolume ? errors.maxInjectionVolume : ""}
              placeholder="650"
            />
          </div>

          <div className="mt-3">
            <label className={styles.fieldLabel}>Hot Runner / Cold Runner</label>
            <select
              value={form.runnerType}
              onChange={(e) => update("runnerType", e.target.value as FormState["runnerType"])}
              className={styles.select}
            >
              <option value="Hot Runner">Hot Runner</option>
              <option value="Cold Runner">Cold Runner</option>
            </select>
          </div>

          <div className="mt-3">
            <NumField
              label="Recommended Cooling Water Temp (°C)"
              value={form.coolingTemp}
              onChange={(v) => handleNumericChange("coolingTemp", v, false)}
              onBlur={() => markTouched("coolingTemp")}
              error={touched.coolingTemp ? errors.coolingTemp : ""}
              placeholder="18"
            />
          </div>

          <div className="mt-3">
            <label className={styles.fieldLabel}>Changeable Brand Logo</label>
            <select
              value={form.changeableLogo}
              onChange={(e) => update("changeableLogo", e.target.value as FormState["changeableLogo"])}
              className={styles.select}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>
      </div>

      {/* ---------- Sticky Next ---------- */}
      <div className={styles.ctaBar}>
        <button type="button" onClick={handleNext} className={styles.ctaBtn}>
          Next: General Details <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}