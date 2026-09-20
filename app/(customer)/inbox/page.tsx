"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./Inbox.module.css";

type TabKey = "all" | "booking" | "support";
type ThreadType = "owner" | "admin";

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

const THREADS: Thread[] = [
  {
    id: "owner-sharma-BK24581",
    type: "owner",
    name: "Sharma Industries",
    bookingCode: "BK-24581",
    dateRange: "14 – 20 Sep",
    lastMessage: "Mould dispatched, arriving tomorrow.",
    unreadCount: 1,
    initial: "S",
    gradient: "linear-gradient(135deg, #22d3ee, #2563eb)",
  },
  {
    id: "admin-support",
    type: "admin",
    name: "MouldX Support",
    lastMessage: "Your payment of ₹27,850 was successful.",
    unreadCount: 0,
    initial: "M",
    gradient: "linear-gradient(135deg, #34d399, #059669)",
  },
  {
    id: "owner-vector-BK24102",
    type: "owner",
    name: "Vector Molds",
    bookingCode: "BK-24102",
    dateRange: "Completed",
    lastMessage: "Thanks for renting with us again!",
    unreadCount: 0,
    initial: "V",
    gradient: "linear-gradient(135deg, #818cf8, #7c3aed)",
  },
];

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filtered = useMemo(() => {
    if (activeTab === "all") return THREADS;
    if (activeTab === "booking") return THREADS.filter((t) => t.type === "owner");
    return THREADS.filter((t) => t.type === "admin");
  }, [activeTab]);

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

      <h1 className={styles.title}>Inbox</h1>

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
        {filtered.map((t) => (
          <Link key={t.id} href={`/inbox/${t.id}`} className={styles.card}>
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
              {t.type === "admin" && <p className={styles.cardMeta}>Payment Confirmation</p>}
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