"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ProfileCreation.module.css";

const REGEX = {
  name: /^[a-zA-Z\s.'-]{2,60}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  idNumber: /^[a-zA-Z0-9\s-]{4,20}$/,
};

const ID_TYPES = ["Aadhar Card", "PAN Card", "Driving License", "Voter ID"];

interface FormState {
  name: string;
  phone: string;
  email: string;
  address: string;
  idType: string;
  idNumber: string;
  idDocument: File | null;
}

const INITIAL_STATE: FormState = {
  name: "",
  phone: "",
  email: "",
  address: "",
  idType: ID_TYPES[0],
  idNumber: "",
  idDocument: null,
};

const REQUIRED_FIELDS: (keyof FormState)[] = ["name", "email", "address", "idNumber"];

export default function CustomerProfileCreationPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const markTouched = (key: string) =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  const errors: Partial<Record<keyof FormState, string>> = {
    name:
      form.name.trim() === ""
        ? "Name is required"
        : !REGEX.name.test(form.name.trim())
          ? "Enter a valid name"
          : "",
    email:
      form.email.trim() === ""
        ? "Email is required"
        : !REGEX.email.test(form.email.trim())
          ? "Enter a valid email"
          : "",
    address: form.address.trim() === "" ? "Address is required" : "",
    idNumber:
      form.idNumber.trim() === ""
        ? "ID number is required"
        : !REGEX.idNumber.test(form.idNumber.trim())
          ? "Enter a valid ID number"
          : "",
    idDocument: !form.idDocument ? "ID document upload is required" : "",
  };

  const isValid =
    !errors.name &&
    !errors.email &&
    !errors.address &&
    !errors.idNumber &&
    !errors.idDocument;

  const handleSubmit = () => {
    const allFields = [...REQUIRED_FIELDS, "idDocument"];
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));
    if (!isValid) return;
    // TODO: submit to KYC approval API
    router.push("/onboarding/review");
  };

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <header className={styles.header}>
        <Link href="/login" className={styles.iconBtn} aria-label="Go back">
          ‹
        </Link>
        <span className={styles.brand}>
          Mould<span className={styles.brandAccent}>X</span>
        </span>
        <button type="button" className={styles.iconBtn} aria-label="Help">
          ?
        </button>
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>Profile Creation</h1>
        <p className={styles.subtitle}>Step 1 of 2 — KYC details.</p>

        {/* ---------- Progress bar ---------- */}
        <div className={styles.progressRow}>
          <span className={`${styles.progressBar} ${styles.progressBarActive}`} />
          <span className={styles.progressBar} />
        </div>

        {/* ---------- Personal Details ---------- */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Personal Details</h2>

          <Field
            label="Name"
            required
            value={form.name}
            onChange={(v) => update("name", v)}
            onBlur={() => markTouched("name")}
            error={touched.name ? errors.name : ""}
            placeholder="Rohit Sharma"
          />

          <Field
            label="Phone No."
            value={form.phone}
            onChange={() => {}}
            placeholder="+91 98XXXXXX10"
            disabled
          />

          <Field
            label="Email ID"
            required
            value={form.email}
            onChange={(v) => update("email", v)}
            onBlur={() => markTouched("email")}
            error={touched.email ? errors.email : ""}
            placeholder="you@example.com"
          />

          <TextAreaField
            label="Address"
            required
            hint="Used for delivery of rented moulds."
            value={form.address}
            onChange={(v) => update("address", v)}
            onBlur={() => markTouched("address")}
            error={touched.address ? errors.address : ""}
            placeholder="Plot no., street, city, state, pincode"
          />
        </div>

        {/* ---------- Identity Verification ---------- */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Identity Verification</h2>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>ID Type</label>
            <select
              value={form.idType}
              onChange={(e) => update("idType", e.target.value)}
              className={styles.select}
            >
              {ID_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <Field
            label="ID Number"
            required
            value={form.idNumber}
            onChange={(v) => update("idNumber", v)}
            onBlur={() => markTouched("idNumber")}
            error={touched.idNumber ? errors.idNumber : ""}
            placeholder="XXXX XXXX XXXX"
          />

          <FileField
            label={`${form.idType} Upload`}
            required
            file={form.idDocument}
            onChange={(f) => {
              update("idDocument", f);
              markTouched("idDocument");
            }}
            error={touched.idDocument ? errors.idDocument : ""}
          />
        </div>
      </div>

      {/* ---------- Sticky submit ---------- */}
      <div className={styles.ctaBar}>
        <button
          type="button"
          onClick={handleSubmit}
          className={`${styles.ctaBtn} btn-primary`}
        >
          Submit for Approval
        </button>
      </div>
    </div>
  );
}

/* ---------- Reusable field components ---------- */

function Field({
  label,
  required,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  disabled,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`${styles.input} ${error ? styles.inputError : ""} ${disabled ? styles.inputDisabled : ""}`}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

function TextAreaField({
  label,
  required,
  hint,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={3}
        className={`${styles.textarea} ${error ? styles.inputError : ""}`}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

function FileField({
  label,
  required,
  file,
  onChange,
  error,
}: {
  label: string;
  required?: boolean;
  file: File | null;
  onChange: (f: File | null) => void;
  error?: string;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <label className={`${styles.uploadBox} ${error ? styles.uploadBoxError : ""}`}>
        {file ? (
          <span className={styles.uploadFileName}>📎 {file.name}</span>
        ) : (
          <span className={styles.uploadPlaceholder}>+ Upload {label} · PDF/Image</span>
        )}
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          className={styles.uploadInput}
        />
      </label>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}