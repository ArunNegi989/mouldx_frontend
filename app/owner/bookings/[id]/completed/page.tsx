"use client";

import { use } from "react";
import Link from "next/link";
import styles from "./BookingCompleted.module.css";

// TEMP dummy data — real payout API se aayega
const PAYOUT: Record<string, { rental: number; platformFeePercent: number; gstPercent: number }> = {
  "1": { rental: 126000, platformFeePercent: 10, gstPercent: 1 },
  "2": { rental: 72000, platformFeePercent: 10, gstPercent: 1 },
  "4": { rental: 108000, platformFeePercent: 10, gstPercent: 1 },
};

export default function BookingCompletedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const payout = PAYOUT[id];

  if (!payout) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundText}>Booking not found.</p>
        <Link href="/owner/bookings" className={styles.notFoundLink}>
          ← Back to Bookings
        </Link>
      </div>
    );
  }

  const platformFee = Math.round((payout.rental * payout.platformFeePercent) / 100);
  const gstAdjustment = Math.round((payout.rental * payout.gstPercent) / 100);
  const netPayout = payout.rental - platformFee - gstAdjustment;

  return (
    <div className={`${styles.page} flex h-screen flex-col justify-between overflow-hidden bg-white`}>
      <div>
        <div className={styles.topRow}>
          <Link href={`/owner/bookings/${id}`} className={styles.backBtn} aria-label="Go back">
            ‹
          </Link>
          <span className={styles.brand}>
            Mould<span className={styles.brandAccent}>X</span>
          </span>
          <span className={styles.headerSpacer} />
        </div>

        <div className={styles.content}>
          {/* ---------- Success icon ---------- */}
          <div className={styles.heroSection}>
            <div className={styles.iconWrap}>
              <span className={styles.pulseRing} />
              <span className={styles.pulseRing2} />
              <svg
                className={styles.checkSvg}
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className={styles.checkCircle}
                  cx="26"
                  cy="26"
                  r="24"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                />
                <path
                  className={styles.checkMark}
                  d="M15 27L22.5 34.5L37.5 18"
                  stroke="#22c55e"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className={styles.title}>Booking Completed</h1>
            <p className={styles.subtitle}>Booking status has been marked Completed.</p>
          </div>

          {/* ---------- Settlement hero card ---------- */}
          <div className={styles.settlementCard}>
            <span className={styles.settlementPill}>SETTLEMENT</span>
            <p className={styles.settlementAmount}>₹{netPayout.toLocaleString("en-IN")}</p>
            <p className={styles.settlementSubtext}>
              Net payout after platform fee &amp; deductions.
            </p>
          </div>

          {/* ---------- Payout breakdown ---------- */}
          <div className={styles.card}>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Rental</span>
              <span className={styles.breakdownValue}>₹{payout.rental.toLocaleString("en-IN")}</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>
                Platform fee ({payout.platformFeePercent}%)
              </span>
              <span className={styles.breakdownValueRed}>
                − ₹{platformFee.toLocaleString("en-IN")}
              </span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>GST adjustment</span>
              <span className={styles.breakdownValueRed}>
                − ₹{gstAdjustment.toLocaleString("en-IN")}
              </span>
            </div>

            <div className={styles.divider} />

            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabelBold}>Net Payout</span>
              <span className={styles.breakdownValueAccent}>
                ₹{netPayout.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- CTA ---------- */}
      <div className={styles.ctaWrap}>
        <Link href="/owner/bookings" className={styles.ctaBtn}>
          Back to Bookings
        </Link>
      </div>
    </div>
  );
}