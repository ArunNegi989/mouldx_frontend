"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ReturnInspection.module.css";

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "structure", label: "Physical structure intact", checked: true },
  { id: "cavities", label: "Cavities clean & undamaged", checked: true },
  { id: "accessories", label: "All accessories present", checked: true },
  { id: "cooling", label: "Cooling channels clear", checked: true },
  { id: "damage", label: "Damage / abnormal wear", checked: false },
];

// TEMP dummy data — real booking API se aayega
const BOOKING_REF: Record<string, { code: string }> = {
  "1": { code: "MX-000123" },
  "2": { code: "MX-000198" },
  "4": { code: "MX-000045" },
};

export default function ReturnInspectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const booking = BOOKING_REF[id];

  const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleFileChange = (file: File | null) => {
    setEvidenceFile(file);
    setEvidencePreview(file ? URL.createObjectURL(file) : null);
  };

  if (!booking) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundText}>Booking not found.</p>
        <Link href="/owner/bookings" className={styles.notFoundLink}>
          ← Back to Bookings
        </Link>
      </div>
    );
  }

  const hasDamage = checklist.find((c) => c.id === "damage")?.checked;

  const handleConditionOk = () => {
    if (submitting) return;
    setSubmitting(true);
    // TODO: call complete-booking API with { bookingId: id, checklist, evidenceFile }
    router.push(`/owner/bookings/${id}?status=completed`);
  };

  const handleRaiseClaim = () => {
    router.push(`/owner/bookings/${id}/claim`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* ---------- Header row with back button ---------- */}
        <div className={styles.titleRow}>
          <Link href={`/owner/bookings/${id}/active`} className={styles.backBtn} aria-label="Go back">
            ‹
          </Link>
          <h1 className={styles.title}>Inspect Returned Mould</h1>
        </div>
        <p className={styles.subtitle}>Record condition, evidence &amp; completion.</p>

        {/* ---------- Checklist card ---------- */}
        <div className={styles.card}>
          <div className={styles.cardTopRow}>
            <span className={styles.codeText}>{booking.code}</span>
            <span className={styles.returnedPill}>RETURNED</span>
          </div>

          <h2 className={styles.cardTitle}>Condition Checklist</h2>

          {checklist.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleCheck(item.id)}
              className={styles.checkRow}
            >
              <span className={`${styles.checkBox} ${item.checked ? styles.checkBoxOn : ""}`}>
                {item.checked && "✓"}
              </span>
              {item.label}
            </button>
          ))}
        </div>

        {/* ---------- Evidence upload ---------- */}
        <label className={styles.uploadBox}>
          {evidencePreview ? (
            <div className={styles.uploadPreviewWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={evidencePreview} alt="Return evidence" className={styles.uploadPreview} />
            </div>
          ) : (
            <span className={styles.uploadPlaceholder}>+ Capture / Upload returned mould evidence</span>
          )}
          <input
            type="file"
            accept="image/*,video/*"
            capture="environment"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            className={styles.uploadInput}
          />
        </label>
      </div>

      {/* ---------- Sticky actions ---------- */}
      <div className={styles.ctaBar}>
        <button
          type="button"
          onClick={handleConditionOk}
          disabled={submitting}
          className={styles.okBtn}
        >
          <span aria-hidden>✓</span> Condition OK
        </button>
        <button type="button" onClick={handleRaiseClaim} className={styles.claimBtn}>
          Raise Claim
        </button>
      </div>
    </div>
  );
}