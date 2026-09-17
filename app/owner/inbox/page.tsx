"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./OwnerInbox.module.css";

type TabKey = "all" | "booking" | "support";
type ThreadType = "customer" | "admin";

interface Thread {
  id: string;
  type: ThreadType;
  name: string;
  bookingCode?: string;
  dateRange?: string;
  lastMessage: string;
  unreadCount: number;
  initial: string;
  gradient: string;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "booking", label: "Booking" },
  { key: "support", label: "Support" },
];

// TEMP dummy data — real conversations API se aayega
const THREADS: Thread[] = [
  {
    id: "customer-nova-MX000123",
    type: "customer",
    name: "Nova Plastics",
    bookingCode: "MX-000123",
    dateRange: "14–21 Sep",
    lastMessage: "Please confirm dispatch timing.",
    unreadCount: 2,
    initial: "N",
    gradient: "linear-gradient(135deg, #818cf8, #7c3aed)",
  },
  {
    id: "admin-support",
    type: "admin",
    name: "MouldX Support",
    lastMessage: "Your mould listing has been approved.",
    unreadCount: 0,
    initial: "M",
    gradient: "linear-gradient(135deg, #34d399, #059669)",
  },
  {
    id: "customer-vector-MX000198",
    type: "customer",
    name: "Vector Molds",
    bookingCode: "MX-000198",
    dateRange: "08–12 Sep",
    lastMessage: "Return scheduled for tomorrow.",
    unreadCount: 0,
    initial: "V",
    gradient: "linear-gradient(135deg, #22d3ee, #2563eb)",
  },
  {
    id: "customer-apex-MX000077",
    type: "customer",
    name: "Apex Poly",
    bookingCode: "MX-000077",
    dateRange: "Completed",
    lastMessage: "Thanks for the smooth transaction!",
    unreadCount: 0,
    initial: "A",
    gradient: "linear-gradient(135deg, #818cf8, #7c3aed)",
  },
];

export default function OwnerInboxPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filtered = useMemo(() => {
    if (activeTab === "all") return THREADS;
    if (activeTab === "booking") return THREADS.filter((t) => t.type === "customer");
    return THREADS.filter((t) => t.type === "admin");
  }, [activeTab]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Inbox</h1>

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

      {/* ---------- Thread list ---------- */}
      <div className={styles.list}>
        {filtered.map((t) => (
          <Link key={t.id} href={`/owner/inbox/${t.id}`} className={styles.card}>
            <div className={styles.avatar} style={{ background: t.gradient }}>
              {t.type === "admin" ? "🛡" : t.initial}
            </div>

            <div className={styles.cardInfo}>
              <p className={styles.cardName}>{t.name}</p>
              {t.bookingCode && (
                <p className={styles.cardMeta}>
                  {t.bookingCode} · {t.dateRange}
                </p>
              )}
              {t.type === "admin" && <p className={styles.cardMeta}>Listing Approval</p>}
              <p className={styles.cardMessage}>{t.lastMessage}</p>
            </div>

            {t.unreadCount > 0 ? (
              <span className={styles.unreadBadge}>{t.unreadCount}</span>
            ) : t.type === "admin" ? (
              <span className={styles.supportBadge}>SUPPORT</span>
            ) : null}
          </Link>
        ))}

        {filtered.length === 0 && <p className={styles.emptyText}>No conversations here yet.</p>}
      </div>
    </div>
  );
}