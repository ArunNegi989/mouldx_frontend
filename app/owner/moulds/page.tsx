"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./MyMoulds.module.css";

type AvailabilityStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE";

interface Mould {
  id: string;
  name: string;
  code: string;
  rating: number;
  status: AvailabilityStatus;
  pricePerDay: number;
  gradient: string;
}

// TEMP dummy data — will come from the real moulds API
const MOULDS: Mould[] = [
  {
    id: "1",
    name: "Bottle Cap Mould",
    code: "MX-000123",
    rating: 4.8,
    status: "AVAILABLE",
    pricePerDay: 18000,
    gradient: "#2563eb",
  },
  {
    id: "2",
    name: "PET Preform Mould",
    code: "MX-000198",
    rating: 4.6,
    status: "RENTED",
    pricePerDay: 22000,
    gradient: "#2563eb",
  },
];

const STATUS_CLASS: Record<AvailabilityStatus, string> = {
  AVAILABLE: "badgeAvailable",
  RENTED: "badgeRented",
  MAINTENANCE: "badgeMaintenance",
};

export default function MyMouldsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (search.trim() === "") return MOULDS;
    return MOULDS.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Moulds</h1>

      {/* ---------- Search + Filter ---------- */}
      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search Moulds"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button type="button" className={styles.filterBtn}>
          <span aria-hidden>⚙</span> Filter
        </button>
      </div>

      {/* ---------- Mould list ---------- */}
      <div className={styles.list}>
        {filtered.map((m) => (
          <div key={m.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.avatar} style={{ background: m.gradient }}>
                <span aria-hidden>✻</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className={styles.mouldName}>{m.name}</p>
                <p className={styles.mouldMeta}>
                  {m.code} · <span className={styles.ratingStar}>★</span> {m.rating}
                </p>
              </div>
              <span className={`${styles.badge} ${styles[STATUS_CLASS[m.status]]}`}>
                {m.status}
              </span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Rent</span>
              <span className={styles.priceValue}>
                ₹{m.pricePerDay.toLocaleString("en-IN")}/day
              </span>
            </div>

            <div className={styles.actionsRow}>
              <Link href={`/owner/moulds/${m.id}/calendar`} className={styles.actionBtn}>
                <span aria-hidden>📅</span> Calendar
              </Link>
              <Link href={`/owner/moulds/${m.id}/edit`} className={styles.actionBtn}>
                <span aria-hidden>✎</span> Edit
              </Link>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className={styles.emptyText}>No moulds match your search.</p>
        )}
      </div>

      {/* ---------- Add new listing ---------- */}
      <Link href="/owner/moulds/new" className={`${styles.addBtn} btn-primary`}>
        + Add New Listing
      </Link>
    </div>
  );
}