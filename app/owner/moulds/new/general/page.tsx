"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./MouldGeneral.module.css";

const REGEX = {
  mouldNameOrId: /^[a-zA-Z0-9\s.,'\-·]{3,80}$/,
  year: /^(19|20)\d{2}$/, // 1900–2099
  manufacturer: /^[a-zA-Z0-9\s.,'&-]{2,80}$/,
  actualValue: /^\d+(\.\d{1,2})?$/,
  perDayCharges: /^\d+(\.\d{1,2})?$/,
};

const MOULD_TYPES = ["Injection", "Blow", "Die-Cast", "Compression"];
const CONDITIONS = ["Excellent", "Good", "Fair", "Needs Repair"];
const ELIGIBILITY_OPTIONS = ["Pan India", "State-restricted", "Neighbouring States Only"];

interface FormState {
  mouldNameOrId: string;
  mouldType: string;
  condition: string;
  year: string;
  manufacturer: string;
  invoice: File | null;
  actualValue: string;
  setOfMouldsInvolved: string;
  salesStateEligibility: string;
  perDayCharges: string;
}

const INITIAL_STATE: FormState = {
  mouldNameOrId: "",
  mouldType: MOULD_TYPES[0],
  condition: CONDITIONS[0],
  year: "",
  manufacturer: "",
  invoice: null,
  actualValue: "",
  setOfMouldsInvolved: "",
  salesStateEligibility: ELIGIBILITY_OPTIONS[0],
  perDayCharges: "",
};

const REQUIRED_FIELDS: (keyof FormState)[] = [
  "mouldNameOrId",
  "year",
  "manufacturer",
  "actualValue",
  "setOfMouldsInvolved",
  "perDayCharges",
];

export default function MouldGeneralPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const markTouched = (key: string) => setTouched((prev) => ({ ...prev, [key]: true }));

  const errors: Partial<Record<keyof FormState, string>> = {
    mouldNameOrId:
      form.mouldNameOrId.trim() === ""
        ? "Required"
        : !REGEX.mouldNameOrId.test(form.mouldNameOrId.trim())
        ? "3–80 characters, letters/numbers only"
        : "",
    year:
      form.year.trim() === ""
        ? "Required"
        : !REGEX.year.test(form.year.trim())
        ? "Enter a valid year (e.g. 2022)"
        : "",
    manufacturer:
      form.manufacturer.trim() === ""
        ? "Required"
        : !REGEX.manufacturer.test(form.manufacturer.trim())
        ? "Enter a valid manufacturer name"
        : "",
    invoice: !form.invoice ? "Invoice upload is required" : "",
    actualValue:
      form.actualValue.trim() === ""
        ? "Required"
        : !REGEX.actualValue.test(form.actualValue.trim())
        ? "Numeric value only"
        : "",
    setOfMouldsInvolved: form.setOfMouldsInvolved.trim() === "" ? "Required" : "",
    perDayCharges:
      form.perDayCharges.trim() === ""
        ? "Required"
        : !REGEX.perDayCharges.test(form.perDayCharges.trim())
        ? "Numeric value only"
        : "",
  };

  const isValid = [...REQUIRED_FIELDS, "invoice"].every(
    (key) => !errors[key as keyof FormState]
  );

  const handleNumericChange = (key: keyof FormState, raw: string) => {
    let cleaned = raw.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("");
    update(key, cleaned as FormState[typeof key]);
  };

  const handleNext = () => {
    setTouched(
      Object.fromEntries([...REQUIRED_FIELDS, "invoice"].map((f) => [f, true]))
    );
    if (!isValid) return;
    // TODO: persist general details, then continue
    router.push("/owner/moulds/new/product");
  };

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <Link
          href="/owner/moulds/new"
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
        <p className="mt-1 text-sm text-gray-400">General, commercial &amp; eligibility.</p>

        {/* ---------- Progress bar (Step 3 of 4) ---------- */}
        <div className="mt-4 flex gap-1.5">
          <span className={styles.progressBarActive} />
          <span className={styles.progressBarActive} />
          <span className={styles.progressBarActive} />
          <span className={styles.progressBar} />
        </div>

        {/* ---------- Card ---------- */}
        <div className={styles.card}>
          <label className={styles.fieldLabel}>Mould Name / ID</label>
          <input
            type="text"
            value={form.mouldNameOrId}
            onChange={(e) => update("mouldNameOrId", e.target.value)}
            onBlur={() => markTouched("mouldNameOrId")}
            placeholder="Bottle Cap Mould · MX-000123"
            className={`${styles.input} ${touched.mouldNameOrId && errors.mouldNameOrId ? styles.inputError : ""}`}
          />
          {touched.mouldNameOrId && errors.mouldNameOrId && (
            <p className={styles.errorText}>{errors.mouldNameOrId}</p>
          )}

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className={styles.fieldLabel}>Type</label>
              <select
                value={form.mouldType}
                onChange={(e) => update("mouldType", e.target.value)}
                className={styles.select}
              >
                {MOULD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.fieldLabel}>Condition</label>
              <select
                value={form.condition}
                onChange={(e) => update("condition", e.target.value)}
                className={styles.select}
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className={styles.fieldLabel}>Year</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.year}
                onChange={(e) => update("year", e.target.value.replace(/\D/g, "").slice(0, 4))}
                onBlur={() => markTouched("year")}
                placeholder="2022"
                className={`${styles.input} ${touched.year && errors.year ? styles.inputError : ""}`}
              />
              {touched.year && errors.year && <p className={styles.errorText}>{errors.year}</p>}
            </div>
            <div>
              <label className={styles.fieldLabel}>Manufacturer</label>
              <input
                type="text"
                value={form.manufacturer}
                onChange={(e) => update("manufacturer", e.target.value)}
                onBlur={() => markTouched("manufacturer")}
                placeholder="Precision Ltd."
                className={`${styles.input} ${touched.manufacturer && errors.manufacturer ? styles.inputError : ""}`}
              />
              {touched.manufacturer && errors.manufacturer && (
                <p className={styles.errorText}>{errors.manufacturer}</p>
              )}
            </div>
          </div>

          <div className="mt-3">
            <label className={`${styles.uploadBox} ${touched.invoice && errors.invoice ? styles.uploadBoxError : ""}`}>
              {form.invoice ? (
                <span className={styles.uploadFileName}>📎 {form.invoice.name}</span>
              ) : (
                <span className={styles.uploadPlaceholder}>+ Upload Mould Invoice</span>
              )}
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => {
                  update("invoice", e.target.files?.[0] ?? null);
                  markTouched("invoice");
                }}
                className={styles.uploadInput}
              />
            </label>
            {touched.invoice && errors.invoice && <p className={styles.errorText}>{errors.invoice}</p>}
          </div>

          <div className="mt-3">
            <label className={styles.fieldLabel}>Mould Actual Value (₹)</label>
            <input
              type="text"
              inputMode="decimal"
              value={form.actualValue}
              onChange={(e) => handleNumericChange("actualValue", e.target.value)}
              onBlur={() => markTouched("actualValue")}
              placeholder="450000"
              className={`${styles.input} ${touched.actualValue && errors.actualValue ? styles.inputError : ""}`}
            />
            {touched.actualValue && errors.actualValue && (
              <p className={styles.errorText}>{errors.actualValue}</p>
            )}
          </div>

          <div className="mt-3">
            <label className={styles.fieldLabel}>Set of Moulds Involved</label>
            <input
              type="text"
              value={form.setOfMouldsInvolved}
              onChange={(e) => update("setOfMouldsInvolved", e.target.value)}
              onBlur={() => markTouched("setOfMouldsInvolved")}
              placeholder="e.g. Single mould / Cap + Body set"
              className={`${styles.input} ${
                touched.setOfMouldsInvolved && errors.setOfMouldsInvolved ? styles.inputError : ""
              }`}
            />
            {touched.setOfMouldsInvolved && errors.setOfMouldsInvolved && (
              <p className={styles.errorText}>{errors.setOfMouldsInvolved}</p>
            )}
          </div>

          <div className="mt-3">
            <label className={styles.fieldLabel}>Sales / State Eligibility</label>
            <select
              value={form.salesStateEligibility}
              onChange={(e) => update("salesStateEligibility", e.target.value)}
              className={styles.select}
            >
              {ELIGIBILITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ---------- Rental price hero card ---------- */}
        <div className={styles.rentalCard}>
          <span className={styles.rentalPill}>RENTAL</span>
          <div className={styles.rentalPriceRow}>
            <span className={styles.rentalPrice}>
              ₹{form.perDayCharges || "0"}
            </span>
            <span className={styles.rentalPeriod}>/ day</span>
          </div>
          <p className={styles.rentalSubtext}>Per day rental charges</p>

          <input
            type="text"
            inputMode="decimal"
            value={form.perDayCharges}
            onChange={(e) => handleNumericChange("perDayCharges", e.target.value)}
            onBlur={() => markTouched("perDayCharges")}
            placeholder="Enter amount"
            className={styles.rentalInput}
          />
          {touched.perDayCharges && errors.perDayCharges && (
            <p className={styles.rentalError}>{errors.perDayCharges}</p>
          )}
        </div>
      </div>

      {/* ---------- Sticky Next ---------- */}
      <div className={styles.ctaBar}>
        <button type="button" onClick={handleNext} className={styles.ctaBtn}>
          Next: Product Details <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}