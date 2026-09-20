"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./DamageClaims.module.css";

interface DamageClaim {
  id: string;
  bookingId: string;
  mouldCode: string;
  reportedBy: string;
  depositHeld: number;
  filedAgo: string;
}

// TEMP dummy data — real admin API se aayega
const CLAIMS: DamageClaim[] = [
  {
    id: "1",
    bookingId: "BK-24102",
    mouldCode: "MX-000077",
    reportedBy: "Owner — Apex Poly",
    depositHeld: 20000,
    filedAgo: "1 day ago",
  },
  {
    id: "2",
    bookingId: "BK-23990",
    mouldCode: "MX-000212",
    reportedBy: "Owner — Vector Molds",
    depositHeld: 18500,
    filedAgo: "2 days ago",
  },
];

export default function DamageClaimsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (search.trim() === "") return CLAIMS;
    const q = search.toLowerCase();
    return CLAIMS.filter(
      (c) =>
        c.bookingId.toLowerCase().includes(q) ||
        c.mouldCode.toLowerCase().includes(q) ||
        c.reportedBy.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Damage Claims</h1>
        <span className={styles.urgentPill}>{CLAIMS.length} URGENT</span>
      </div>

      {/* ---------- Search + Filter ---------- */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by booking ID, mould, owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button type="button" className={styles.filterBtn}>
          <span aria-hidden>⚙</span> Filter
        </button>
      </div>

      {/* ---------- Table (desktop) ---------- */}
      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking</th>
                <th>Mould</th>
                <th>Reported By</th>
                <th>Deposit Held</th>
                <th>Filed</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td className={styles.idCell}>{row.bookingId}</td>
                  <td className={styles.mutedCell}>{row.mouldCode}</td>
                  <td className={styles.mutedCell}>{row.reportedBy}</td>
                  <td className={styles.depositCell}>₹{row.depositHeld.toLocaleString("en-IN")}</td>
                  <td className={styles.mutedCell}>{row.filedAgo}</td>
                  <td className={styles.actionCell}>
                    <Link href={`/admin/damage-claims/${row.id}`} className={styles.reviewBtn}>
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className={styles.emptyText}>No damage claims match your search.</p>
          )}
        </div>
      </div>

      {/* ---------- Cards (mobile) ---------- */}
      <div className={styles.mobileList}>
        {filtered.map((row) => (
          <Link key={row.id} href={`/admin/damage-claims/${row.id}`} className={styles.mobileCard}>
            <div className={styles.mobileCardTop}>
              <div className="min-w-0 flex-1">
                <p className={styles.idCell}>{row.bookingId}</p>
                <p className={styles.mobileMeta}>{row.mouldCode} · {row.reportedBy}</p>
              </div>
              <span className={styles.reviewPillMobile}>REVIEW →</span>
            </div>
            <div className={styles.mobileCardBottom}>
              <span className={styles.depositCell}>₹{row.depositHeld.toLocaleString("en-IN")} held</span>
              <span className={styles.mobileMeta}>{row.filedAgo}</span>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className={styles.emptyText}>No damage claims match your search.</p>
        )}
      </div>
    </div>
  );
}