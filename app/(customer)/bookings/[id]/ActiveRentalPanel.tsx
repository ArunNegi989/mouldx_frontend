"use client";

import Link from "next/link";
import styles from "./ActiveRental.module.css";

interface ActiveRentalPanelProps {
  bookingId: string;
  mouldName: string;
  mouldCode: string;
  returnDueAt: string;
  lateFeePerDay?: number;
}

function formatDue(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const time = d
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
    .toUpperCase();
  return `${date} · ${time}`;
}

function daysLeft(iso: string) {
  const due = new Date(iso);
  const now = new Date();
  const startOfDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((startOfDue.getTime() - startOfNow.getTime()) / 86400000);
}

export default function ActiveRentalPanel({
  bookingId,
  mouldName,
  mouldCode,
  returnDueAt,
  lateFeePerDay = 500,
}: ActiveRentalPanelProps) {
  const left = daysLeft(returnDueAt);
  const isOverdue = left < 0;
  const isDueToday = left === 0;

  const headline = isOverdue
    ? `${Math.abs(left)} ${Math.abs(left) === 1 ? "day" : "days"} overdue`
    : isDueToday
    ? "Due today"
    : `${left} ${left === 1 ? "day" : "days"} left`;

  return (
    <div className={styles.wrap}>
      {/* ---------- Countdown hero ---------- */}
      <section
        className={`${styles.hero} ${isOverdue ? styles.heroOverdue : ""}`}
        aria-label="Rental status"
      >
        <span className={styles.heroOrb} aria-hidden />
        <span className={styles.heroBadge}>
          {isOverdue ? "Return overdue" : "Rental active"}
        </span>
        <p className={styles.heroCount}>{headline}</p>
        <p className={styles.heroDue}>Return due {formatDue(returnDueAt)}</p>
      </section>

      {/* ---------- Mould in use ---------- */}
      <section className={styles.useCard}>
        <h2 className={styles.useTitle}>Mould in use</h2>
        <div className={styles.useRow}>
          <p className={styles.useName}>{mouldName}</p>
          <Link
            href={`/bookings/${bookingId}/mould-details`}
            className={styles.useCode}
            aria-label={`View full specifications for ${mouldCode}`}
          >
            {mouldCode}
          </Link>
        </div>
      </section>

      {/* ---------- Actions ---------- */}
      <div className={styles.actions}>
        <Link href={`/bookings/${bookingId}/extend`} className={styles.btnGhost}>
          Extend rental
        </Link>
        <Link href={`/bookings/${bookingId}/return`} className={`${styles.btnPrimary} btn-primary`}>
          Start return
        </Link>
      </div>

      {/* ---------- Late fee notice ---------- */}
      <aside className={styles.notice}>
        <span className={styles.noticeIcon} aria-hidden>
          i
        </span>
        <div>
          <p className={styles.noticeTitle}>Late returns cost extra</p>
          <p className={styles.noticeText}>
            ₹{lateFeePerDay.toLocaleString("en-IN")} is charged for every day past the due
            date, deducted from your security deposit.
          </p>
        </div>
      </aside>
    </div>
  );
}