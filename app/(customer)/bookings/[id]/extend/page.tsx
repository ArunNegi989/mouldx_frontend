"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Extend.module.css";

// TEMP — real booking API se aayega
const PRICE_PER_DAY = 2000;
const CURRENT_DUE = "2026-09-20T18:00:00";
const MAX_EXTRA_DAYS = 14;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ExtendPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [extraDays, setExtraDays] = useState(1);

  const newDueDate = new Date(CURRENT_DUE);
  newDueDate.setDate(newDueDate.getDate() + extraDays);

  const extraCost = extraDays * PRICE_PER_DAY;

  const decrease = () => setExtraDays((d) => Math.max(1, d - 1));
  const increase = () => setExtraDays((d) => Math.min(MAX_EXTRA_DAYS, d + 1));

  const handleConfirm = () => {
    // TODO: POST extension request (extraDays, newDueDate, payment) to API
    router.push(`/bookings/${id}`);
  };

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <header className={styles.header}>
        <Link href={`/bookings/${id}`} className={styles.iconBtn} aria-label="Go back">
          ←
        </Link>
        <span className={styles.brand}>
          Mould<span className={styles.brandAccent}>X</span>
        </span>
        <button type="button" className={styles.iconBtn} aria-label="Help">
          ?
        </button>
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>Extend rental</h1>
        <p className={styles.subtitle}>
          Add extra days before the mould needs to go back.
        </p>

        {/* ---------- Due dates ---------- */}
        <div className={styles.card}>
          <div className={styles.dueRow}>
            <span className={styles.dueLabel}>Current due date</span>
            <span className={styles.dueValue}>{formatDate(CURRENT_DUE)}</span>
          </div>
          <div className={styles.dueRow}>
            <span className={styles.dueLabel}>New due date</span>
            <span className={styles.dueValueHighlight}>
              {formatDate(newDueDate.toISOString())}
            </span>
          </div>
        </div>

        {/* ---------- Day stepper ---------- */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Extra days</h2>
          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={decrease}
              aria-label="Decrease days"
            >
              −
            </button>
            <span className={styles.stepperValue}>{extraDays}</span>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={increase}
              aria-label="Increase days"
            >
              +
            </button>
          </div>
        </div>

        {/* ---------- Cost ---------- */}
        <div className={styles.card}>
          <div className={styles.fareRow}>
            <span className={styles.fareLabel}>
              {extraDays} × ₹{PRICE_PER_DAY.toLocaleString("en-IN")}
            </span>
            <span className={styles.fareValue}>
              ₹{extraCost.toLocaleString("en-IN")}
            </span>
          </div>
          <div className={styles.divider} />
          <div className={styles.fareRow}>
            <span className={styles.totalLabel}>Additional charge</span>
            <span className={styles.totalValue}>
              ₹{extraCost.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Sticky confirm ---------- */}
      <div className={styles.ctaBar}>
        <button type="button" className={styles.ctaBtn} onClick={handleConfirm}>
          Confirm &amp; Pay ₹{extraCost.toLocaleString("en-IN")}
        </button>
      </div>
    </div>
  );
}