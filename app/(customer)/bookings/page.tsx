"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./Bookings.module.css";

type TabKey = "upcoming" | "active" | "completed";
type BookingStatus =
  | "APPROVAL PENDING"
  | "CONFIRMED"
  | "ARRIVED"
  | "IN PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

interface Booking {
  id: string;
  code: string;
  name: string;
  dateRange: string;
  status: BookingStatus;
  tab: TabKey;
  image: string;
  rating?: number;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

const BOOKINGS: Booking[] = [
  {
    id: "BK-24581",
    code: "MX-000123",
    name: "2-Cavity Injection Mould",
    dateRange: "14 – 20 Sep",
    status: "APPROVAL PENDING",
    tab: "upcoming",
    image: "https://picsum.photos/seed/mould-1/800/600",
  },
  {
    id: "BK-24512",
    code: "MX-000198",
    name: "Blow Mould — 5L Can",
    dateRange: "22 – 28 Sep",
    status: "ARRIVED",
    tab: "upcoming",
    image: "https://picsum.photos/seed/mould-2/800/600",
  },
  {
    id: "BK-24390",
    code: "MX-000077",
    name: "Die-Cast Housing Mould",
    dateRange: "5 – 12 Sep",
    status: "IN PROGRESS",
    tab: "active",
    image: "https://picsum.photos/seed/mould-3/800/600",
  },
  {
    id: "BK-23988",
    code: "MX-000045",
    name: "Single Cavity Chair Mould",
    dateRange: "10 – 15 Aug",
    status: "COMPLETED",
    tab: "completed",
    image: "https://picsum.photos/seed/mould-4/800/600",
  },
  {
    id: "BK-23700",
    code: "MX-000156",
    name: "Die-Cast Gear Mould",
    dateRange: "20 – 26 Jul",
    status: "COMPLETED",
    tab: "completed",
    image: "https://picsum.photos/seed/mould-6/800/600",
    rating: 4,
  },
  {
    id: "BK-23850",
    code: "MX-000210",
    name: "Blow Mould — Bottle 1L",
    dateRange: "1 – 6 Aug",
    status: "CANCELLED",
    tab: "completed",
    image: "https://picsum.photos/seed/mould-5/800/600",
  },
];

const STATUS_CLASS: Record<BookingStatus, string> = {
  "APPROVAL PENDING": "badgePending",
  CONFIRMED: "badgeConfirmed",
  ARRIVED: "badgeArrived",
  "IN PROGRESS": "badgeActive",
  COMPLETED: "badgeCompleted",
  CANCELLED: "badgeCancelled",
};

function BookingImage({ booking }: { booking: Booking }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={styles.imageWrap}>
      {!imgError ? (
        <img
          src={booking.image}
          alt={booking.name}
          className={styles.image}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={styles.placeholder} aria-hidden>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.5" />
            <path d="M21 16l-5-5-8 8" />
          </svg>
        </div>
      )}

      <span className={`${styles.badge} ${styles[STATUS_CLASS[booking.status]]}`}>
        {booking.status}
      </span>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className={styles.stars} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? styles.starFilled : styles.starEmpty} aria-hidden>
          ★
        </span>
      ))}
    </span>
  );
}

function ReviewCta({ booking }: { booking: Booking }) {
  const rated = typeof booking.rating === "number";

  return (
    <div className={styles.reviewBox}>
      <div className={styles.reviewInfo}>
        <Stars value={booking.rating ?? 0} />
        <span className={styles.reviewText}>
          {rated ? `Your rating · ${booking.rating?.toFixed(1)}` : "How was your experience?"}
        </span>
      </div>

      <Link
        href={`/bookings/${booking.id}/review`}
        className={rated ? styles.reviewBtnOutline : styles.reviewBtn}
      >
        {rated ? "Edit review" : "Rate & Review"}
      </Link>
    </div>
  );
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");

  const filtered = useMemo(
    () => BOOKINGS.filter((b) => b.tab === activeTab),
    [activeTab]
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Bookings</h1>

      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.map((b) => (
          <div key={b.id} className={styles.cardWrap}>
            <Link href={`/bookings/${b.id}`} className={styles.card}>
              <BookingImage booking={b} />

              <div className={styles.cardInfo}>
                <p className={styles.cardName}>{b.name}</p>
                <p className={styles.cardMeta}>
                  {b.code} · {b.dateRange}
                </p>
              </div>
            </Link>

            {b.status === "COMPLETED" && <ReviewCta booking={b} />}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className={styles.emptyText}>No bookings in this tab yet.</p>
        )}
      </div>
    </div>
  );
}