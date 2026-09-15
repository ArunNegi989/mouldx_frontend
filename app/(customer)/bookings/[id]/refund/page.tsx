"use client";

import { use } from "react";
import Link from "next/link";
import styles from "./Refund.module.css";

// TEMP — real booking/refund API se aayega
const DEPOSIT_HELD = 15000;
const DEDUCTIONS = 0;
const OWNER_NAME = "Sharma Industries";

export default function RefundPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const refunded = DEPOSIT_HELD - DEDUCTIONS;
  const fullyRefunded = DEDUCTIONS === 0;

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
        {/* ---------- Success icon ---------- */}
        <div className={styles.iconWrap}>
          <span className={styles.iconCircle} aria-hidden>
            ₹
          </span>
        </div>

        <h1 className={styles.title}>Deposit refunded</h1>
        <p className={styles.subtitle}>
          {fullyRefunded
            ? "Condition matched — full deposit released."
            : "Inspection complete — deposit released after deductions."}
        </p>

        {/* ---------- Breakdown ---------- */}
        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Deposit held</span>
            <span className={styles.rowValue}>
              ₹{DEPOSIT_HELD.toLocaleString("en-IN")}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Deductions</span>
            <span className={styles.rowValue}>
              ₹{DEDUCTIONS.toLocaleString("en-IN")}
            </span>
          </div>

          <div className={styles.divider} />

          <div className={styles.row}>
            <span className={styles.totalLabel}>Refunded to source</span>
            <span className={styles.totalValue}>
              ₹{refunded.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Sticky CTA ---------- */}
      <div className={styles.ctaBar}>
        <Link href={`/bookings/${id}/rate`} className={styles.ctaBtn}>
          Rate this Booking →
        </Link>
      </div>
    </div>
  );
}