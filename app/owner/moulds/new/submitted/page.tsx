"use client";

import Link from "next/link";
import styles from "./ListingSubmitted.module.css";

interface TimelineStep {
  id: string;
  title: string;
  status: "done" | "pending" | "upcoming";
  meta: string;
}

// TEMP dummy data — will come from the real listing-submission API
const LISTING = {
  code: "MX-000231",
  productName: "28mm PET Bottle Cap",
  submittedAt: "17 Sep · 3:42 PM",
  etaHours: 12,
  steps: [
    { id: "submitted", title: "Listing submitted", status: "done", meta: "17 Sep · 3:42 PM" },
    { id: "review", title: "Admin review", status: "pending", meta: "Pending · ETA 12h" },
    { id: "live", title: "Live to customers", status: "upcoming", meta: "Visible in Explore after approval" },
  ] as TimelineStep[],
};

export default function ListingSubmittedPage() {
  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <header className={styles.header}>
        <Link href="/owner" className={styles.iconBtn} aria-label="Go back">
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
        <h1 className={styles.title}>Listing Review</h1>
        <p className={styles.subtitle}>MouldX admin reviews every listing before it goes live.</p>

        {/* ---------- Status card ---------- */}
        <div className={styles.statusCard}>
          <span className={styles.statusPill}>UNDER REVIEW</span>
          <h2 className={styles.statusHeading}>Approval pending</h2>
          <p className={styles.listingName}>{LISTING.productName}</p>
          <p className={styles.listingCode}>{LISTING.code}</p>
        </div>

        {/* ---------- Progress timeline ---------- */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Progress Timeline</h2>

          {LISTING.steps.map((step, i) => (
            <div key={step.id} className={styles.timelineRow}>
              <div className={styles.timelineDotCol}>
                <span
                  className={`${styles.dot} ${
                    step.status === "done"
                      ? styles.dotDone
                      : step.status === "pending"
                      ? styles.dotPending
                      : styles.dotUpcoming
                  }`}
                >
                  {step.status === "done" && <span className={styles.dotCheck}>✓</span>}
                </span>
                {i < LISTING.steps.length - 1 && <span className={styles.connector} />}
              </div>
              <div className={styles.timelineText}>
                <p className={styles.stepTitle}>{step.title}</p>
                <p className={styles.stepMeta}>{step.meta}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- Info note ---------- */}
        <div className={styles.infoFlag}>
          <span className={styles.infoIcon} aria-hidden>
            i
          </span>
          <p className={styles.infoText}>
            This mould will not appear in customer search or Explore until admin approval is complete.
          </p>
        </div>
      </div>

      {/* ---------- Actions ---------- */}
      <div className={styles.ctaBar}>
        <Link href="/owner" className={`${styles.dashboardBtn} btn-primary`}>
          Go to Dashboard
        </Link>
        <Link href="/owner/moulds" className={styles.myMouldsLink}>
          View My Moulds
        </Link>
      </div>
    </div>
  );
}