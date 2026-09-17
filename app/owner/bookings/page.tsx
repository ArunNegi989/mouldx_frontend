"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./OwnerBookings.module.css";

type TabKey = "all" | "upcoming" | "active" | "done";
type BookingStatus = "UPCOMING" | "ACTIVE" | "COMPLETED" | "REQUESTED";

interface Booking {
  id: string;
  code: string;
  customer: string;
  dateRange: string;
  amount: number;
  status: BookingStatus;
  tab: Exclude<TabKey, "all">;
  gradient: string;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "active", label: "Active" },
  { key: "done", label: "Done" },
];

// TEMP dummy data — real bookings API se aayega
const BOOKINGS: Booking[] = [
  {
    id: "1",
    code: "MX-000123",
    customer: "Nova Plastics",
    dateRange: "14–21 Sep",
    amount: 126000,
    status: "UPCOMING",
    tab: "upcoming",
    gradient: "linear-gradient(135deg, #22d3ee, #2563eb)",
  },
  {
    id: "2",
    code: "MX-000198",
    customer: "Vector Molds",
    dateRange: "08–12 Sep",
    amount: 72000,
    status: "ACTIVE",
    tab: "active",
    gradient: "linear-gradient(135deg, #818cf8, #7c3aed)",
  },
  {
    id: "3",
    code: "MX-000077",
    customer: "Apex Poly",
    dateRange: "01–05 Sep",
    amount: 90000,
    status: "COMPLETED",
    tab: "done",
    gradient: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
  },
  {
    id: "4",
    code: "MX-000045",
    customer: "Orbit Plast",
    dateRange: "20–27 Sep",
    amount: 108000,
    status: "REQUESTED",
    tab: "upcoming",
    gradient: "linear-gradient(135deg, #22d3ee, #2563eb)",
  },
];

const STATUS_CLASS: Record<BookingStatus, string> = {
  UPCOMING: "badgeUpcoming",
  ACTIVE: "badgeActive",
  COMPLETED: "badgeCompleted",
  REQUESTED: "badgeRequested",
};

export default function OwnerBookingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filtered = useMemo(() => {
    if (activeTab === "all") return BOOKINGS;
    return BOOKINGS.filter((b) => b.tab === activeTab);
  }, [activeTab]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Bookings</h1>

      {/* ---------- Tabs ---------- */}
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

      {/* ---------- Booking list ---------- */}
      <div className={styles.list}>
        {filtered.map((b) => (
          <Link key={b.id} href={`/owner/bookings/${b.id}`} className={styles.card}>
            <div className={styles.avatar} style={{ background: b.gradient }}>
              <span aria-hidden>✻</span>
            </div>

            <div className={styles.cardInfo}>
              <p className={styles.cardCode}>{b.code}</p>
              <p className={styles.cardMeta}>
                {b.customer} · {b.dateRange}
              </p>
            </div>

            <div className={styles.cardRight}>
              <span className={`${styles.badge} ${styles[STATUS_CLASS[b.status]]}`}>
                {b.status}
              </span>
              <span className={styles.amount}>₹{b.amount.toLocaleString("en-IN")}</span>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && <p className={styles.emptyText}>No bookings in this tab yet.</p>}
      </div>
    </div>
  );
}