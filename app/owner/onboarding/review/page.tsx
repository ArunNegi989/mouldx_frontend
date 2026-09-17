"use client";

import Link from "next/link";
import styles from "./ProfileReview.module.css";

interface TimelineStep {
  id: string;
  title: string;
  status: "done" | "pending" | "upcoming";
  meta: string;
}

// TEMP dummy data — real profile-submission API se aayega
const REVIEW = {
  submittedAt: "14 Sep · 10:22 AM",
  etaHours: 24,
  steps: [
    { id: "submitted", title: "Profile submitted", status: "done", meta: "14 Sep · 10:22 AM" },
    { id: "approval", title: "Admin approval", status: "pending", meta: "Pending · ETA 24h" },
    { id: "moulds", title: "Mould details", status: "upcoming", meta: "Available after approval" },
  ] as TimelineStep[],
};

export default function ProfileReviewPage() {
  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <header className={styles.header}>
        <Link href="/owner/onboarding" className={styles.iconBtn} aria-label="Go back">
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
        <h1 className={styles.title}>Profile / KYC Review</h1>
        <p className={styles.subtitle}>MouldX admin reviews the submitted owner profile.</p>

        {/* ---------- Status card ---------- */}
        <div className={styles.statusCard}>
          <span className={styles.statusPill}>UNDER REVIEW</span>
          <h2 className={styles.statusHeading}>Approval pending</h2>
          <p className={styles.statusRemark}>Remarks, if any, sent to POC &amp; company email.</p>
        </div>

        {/* ---------- Progress timeline ---------- */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Progress Timeline</h2>

          {REVIEW.steps.map((step, i) => (
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
                />
                {i < REVIEW.steps.length - 1 && <span className={styles.connector} />}
              </div>
              <div className={styles.timelineText}>
                <p className={styles.stepTitle}>{step.title}</p>
                <p className={styles.stepMeta}>{step.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}