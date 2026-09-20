"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./Bookings.module.css";

type TabKey = "upcoming" | "active" | "completed";
type BookingStatus = "APPROVAL PENDING" | "CONFIRMED" | "ARRIVED" | "IN PROGRESS" | "COMPLETED" | "CANCELLED";

interface Booking {
  id: string;
  code: string;
  name: string;
  dateRange: string;
  status: BookingStatus;
  tab: TabKey;
  initial: string;
  gradient: string;
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
    initial: "M",
    gradient: "linear-gradient(135deg, #22d3ee, #2563eb)",
  },
  {
    id: "BK-24512",
    code: "MX-000198",
    name: "Blow Mould — 5L Can",
    dateRange: "22 – 28 Sep",
    status: "ARRIVED",
    tab: "upcoming",
    initial: "B",
    gradient: "linear-gradient(135deg, #818cf8, #7c3aed)",
  },
  {
    id: "BK-24390",
    code: "MX-000077",
    name: "Die-Cast Housing Mould",
    dateRange: "5 – 12 Sep",
    status: "IN PROGRESS",
    tab: "active",
    initial: "D",
    gradient: "linear-gradient(135deg, #34d399, #059669)",
  },
  {
    id: "BK-23988",
    code: "MX-000045",
    name: "Single Cavity Chair Mould",
    dateRange: "10 – 15 Aug",
    status: "COMPLETED",
    tab: "completed",
    initial: "S",
    gradient: "linear-gradient(135deg, #fb923c, #ea580c)",
  },
  {
    id: "BK-23850",
    code: "MX-000210",
    name: "Blow Mould — Bottle 1L",
    dateRange: "1 – 6 Aug",
    status: "CANCELLED",
    tab: "completed",
    initial: "B",
    gradient: "linear-gradient(135deg, #f87171, #dc2626)",
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

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");

  const filtered = useMemo(
    () => BOOKINGS.filter((b) => b.tab === activeTab),
    [activeTab]
  );

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <span className={styles.spacer} />
        <span className={styles.brand}>
          Mould<span className={styles.brandAccent}>X</span>
        </span>
        <button type="button" className={styles.iconBtn} aria-label="Help">
          ?
        </button>
      </div>

      <h1 className={styles.title}>My Bookings</h1>

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
          <Link key={b.id} href={`/bookings/${b.id}`} className={styles.card}>
            <div className={styles.avatar} style={{ background: b.gradient }}>
              {b.initial}
            </div>

            <div className={styles.cardInfo}>
              <p className={styles.cardName}>{b.name}</p>
              <p className={styles.cardMeta}>
                {b.code} · {b.dateRange}
              </p>
            </div>

            <span className={`${styles.badge} ${styles[STATUS_CLASS[b.status]]}`}>
              {b.status}
            </span>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className={styles.emptyText}>No bookings in this tab yet.</p>
        )}
      </div>
    </div>
  );
}