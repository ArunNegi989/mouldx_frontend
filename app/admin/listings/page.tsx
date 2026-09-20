"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./ListingApprovals.module.css";

type ListingStatus = "PENDING" | "RESUBMITTED" | "APPROVED" | "REJECTED";

interface ListingRequest {
  id: string;
  mouldId: string;
  type: string;
  owner: string;
  pricePerDay: number;
  mediaCount: number;
  status: ListingStatus;
}

// TEMP dummy data — real admin API se aayega
const LISTINGS: ListingRequest[] = [
  {
    id: "1",
    mouldId: "MX-000123",
    type: "Injection · 2-Cavity",
    owner: "Sharma Industries",
    pricePerDay: 1800,
    mediaCount: 6,
    status: "PENDING",
  },
  {
    id: "2",
    mouldId: "MX-000198",
    type: "Blow · 5L Can",
    owner: "Nova Plastics",
    pricePerDay: 2400,
    mediaCount: 4,
    status: "PENDING",
  },
  {
    id: "3",
    mouldId: "MX-000077",
    type: "Die-Cast Housing",
    owner: "Apex Poly",
    pricePerDay: 3100,
    mediaCount: 8,
    status: "RESUBMITTED",
  },
  {
    id: "4",
    mouldId: "MX-000212",
    type: "Injection · 4-Cavity",
    owner: "Vector Molds",
    pricePerDay: 2050,
    mediaCount: 5,
    status: "PENDING",
  },
];

const STATUS_CLASS: Record<ListingStatus, string> = {
  PENDING: "statusPending",
  RESUBMITTED: "statusResubmitted",
  APPROVED: "statusApproved",
  REJECTED: "statusRejected",
};

export default function ListingApprovalsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (search.trim() === "") return LISTINGS;
    const q = search.toLowerCase();
    return LISTINGS.filter(
      (l) =>
        l.mouldId.toLowerCase().includes(q) ||
        l.owner.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q)
    );
  }, [search]);

  const pendingCount = LISTINGS.filter(
    (l) => l.status === "PENDING" || l.status === "RESUBMITTED"
  ).length;

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Listing Approvals</h1>
        <span className={styles.pendingPill}>{pendingCount} PENDING</span>
      </div>

      {/* ---------- Search + Filter ---------- */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by mould ID, owner, category..."
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
                <th>Mould ID</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Price/Day</th>
                <th>Media</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td className={styles.idCell}>{row.mouldId}</td>
                  <td className={styles.mutedCell}>{row.type}</td>
                  <td className={styles.mutedCell}>{row.owner}</td>
                  <td className={styles.priceCell}>₹{row.pricePerDay.toLocaleString("en-IN")}</td>
                  <td className={styles.mutedCell}>{row.mediaCount} files</td>
                  <td>
                    <span className={`${styles.statusPill} ${styles[STATUS_CLASS[row.status]]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    <Link href={`/admin/listings/${row.id}`} className={styles.reviewBtn}>
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className={styles.emptyText}>No listings match your search.</p>
          )}
        </div>
      </div>

      {/* ---------- Cards (mobile) ---------- */}
      <div className={styles.mobileList}>
        {filtered.map((row) => (
          <Link key={row.id} href={`/admin/listings/${row.id}`} className={styles.mobileCard}>
            <div className={styles.mobileCardTop}>
              <div className="min-w-0 flex-1">
                <p className={styles.idCell}>{row.mouldId}</p>
                <p className={styles.mobileMeta}>{row.type}</p>
              </div>
              <span className={`${styles.statusPill} ${styles[STATUS_CLASS[row.status]]}`}>
                {row.status}
              </span>
            </div>
            <div className={styles.mobileCardBottom}>
              <span className={styles.mobileMeta}>{row.owner}</span>
              <span className={styles.mobileMeta}>
                ₹{row.pricePerDay.toLocaleString("en-IN")}/day · {row.mediaCount} files
              </span>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className={styles.emptyText}>No listings match your search.</p>
        )}
      </div>
    </div>
  );
}