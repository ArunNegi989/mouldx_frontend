"use client";

import { use } from "react";
import Link from "next/link";
import styles from "./BookingDetail.module.css";

interface TimelineStep {
  id: string;
  title: string;
  status: "done" | "pending" | "upcoming";
  meta: string;
}

interface BookingDetail {
  id: string;
  code: string;
  name: string;
  image: string;
  city: string;
  dateRange: string;
  days: number;
  pricePerDay: number;
  securityDeposit: number;
  platformFee: number;
  paymentMethod: "Platform" | "Direct to Owner";
  status: string;
  steps: TimelineStep[];
}

// TEMP dummy data — real booking API se aayega, id se fetch hoga
const DUMMY_BOOKINGS: Record<string, BookingDetail> = {
  "BK-24581": {
    id: "BK-24581",
    code: "MX-000123",
    name: "2-Cavity Injection Mould",
    image: "https://picsum.photos/seed/mould1/300/300",
    city: "Pune",
    dateRange: "14 – 20 Sep",
    days: 7,
    pricePerDay: 1800,
    securityDeposit: 15000,
    platformFee: 250,
    paymentMethod: "Platform",
    status: "Approval Pending",
    steps: [
      { id: "payment", title: "Payment received", status: "done", meta: "Just now" },
      { id: "approval", title: "Owner approval", status: "pending", meta: "Pending · ETA 6h" },
      { id: "dispatch", title: "Dispatch", status: "upcoming", meta: "Scheduled after approval" },
    ],
  },
  "BK-24512": {
    id: "BK-24512",
    code: "MX-000198",
    name: "Blow Mould — 5L Can",
    image: "https://picsum.photos/seed/mould2/300/300",
    city: "Nashik",
    dateRange: "22 – 28 Sep",
    days: 6,
    pricePerDay: 2400,
    securityDeposit: 18000,
    platformFee: 250,
    paymentMethod: "Platform",
    status: "Confirmed",
    steps: [
      { id: "payment", title: "Payment received", status: "done", meta: "2 days ago" },
      { id: "approval", title: "Owner approval", status: "done", meta: "Approved" },
      { id: "dispatch", title: "Dispatch", status: "pending", meta: "Scheduled · 22 Sep" },
    ],
  },
};

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const booking = DUMMY_BOOKINGS[id];

  if (!booking) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundText}>Booking not found.</p>
        <Link href="/bookings" className={styles.notFoundLink}>
          ← Back to My Bookings
        </Link>
      </div>
    );
  }

  const rent = booking.pricePerDay * booking.days;
  const total = rent + booking.securityDeposit + booking.platformFee;

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <header className={styles.header}>
        <Link href="/bookings" className={styles.iconBtn} aria-label="Go back">
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
        {/* ---------- Mould summary ---------- */}
        <div className={styles.summaryRow}>
          <div className={styles.thumbWrap}>
            <img src={booking.image} alt={booking.name} className={styles.thumb} />
          </div>
          <div className={styles.summaryInfo}>
            <p className={styles.mouldName}>{booking.name}</p>
            <p className={styles.mouldMeta}>
              {booking.code} · {booking.city}
            </p>
            <p className={styles.mouldMeta}>
              {booking.dateRange} · {booking.days} days
            </p>
          </div>
          <span className={styles.statusBadge}>{booking.status}</span>
        </div>

        {/* ---------- Timeline ---------- */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Booking Status</h2>
          {booking.steps.map((step, i) => (
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
                {i < booking.steps.length - 1 && <span className={styles.connector} />}
              </div>
              <div className={styles.timelineText}>
                <p className={styles.stepTitle}>{step.title}</p>
                <p className={styles.stepMeta}>{step.meta}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- Fare breakdown ---------- */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Fare Breakdown</h2>

          <div className={styles.fareRow}>
            <span className={styles.fareLabel}>
              Rent ({booking.days} × ₹{booking.pricePerDay.toLocaleString("en-IN")})
            </span>
            <span className={styles.fareValue}>₹{rent.toLocaleString("en-IN")}</span>
          </div>

          <div className={styles.fareRow}>
            <span className={styles.fareLabel}>Security deposit</span>
            <span className={styles.fareValue}>
              ₹{booking.securityDeposit.toLocaleString("en-IN")}
            </span>
          </div>

          <div className={styles.fareRow}>
            <span className={styles.fareLabel}>Platform fee</span>
            <span className={styles.fareValue}>₹{booking.platformFee.toLocaleString("en-IN")}</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.fareRow}>
            <span className={styles.totalLabel}>Total paid</span>
            <span className={styles.totalValue}>₹{total.toLocaleString("en-IN")}</span>
          </div>

          <p className={styles.paymentMethodText}>Paid via {booking.paymentMethod}</p>
        </div>

        {/* ---------- Support ---------- */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Need help?</h2>
          <div className={styles.supportRow}>
            <Link href="/inbox" className={styles.supportBtn}>
              Message Owner
            </Link>
            <button type="button" className={styles.supportBtnOutline}>
              Raise an Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}