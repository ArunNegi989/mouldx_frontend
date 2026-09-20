"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./BookingApprovals.module.css";

type PaymentStatus = "CAPTURED" | "PROCESSING" | "FAILED";
type BookingStatus = "PENDING" | "APPROVED" | "REJECTED";

interface BookingRequest {
  id: string;
  bookingId: string;
  customer: string;
  owner: string;
  amount: number;
  payment: PaymentStatus;
  status: BookingStatus;
}

// TEMP dummy data — real admin API se aayega
const BOOKINGS: BookingRequest[] = [
  {
    id: "1",
    bookingId: "BK-24581",
    customer: "Rohit Sharma",
    owner: "Sharma Industries",
    amount: 27850,
    payment: "CAPTURED",
    status: "PENDING",
  },
  {
    id: "2",
    bookingId: "BK-24602",
    customer: "Neha Kapoor",
    owner: "Nova Plastics",
    amount: 19400,
    payment: "CAPTURED",
    status: "PENDING",
  },
  {
    id: "3",
    bookingId: "BK-24611",
    customer: "Vikram Rao",
    owner: "Vector Molds",
    amount: 31200,
    payment: "PROCESSING",
    status: "PENDING",
  },
];

const PAYMENT_CLASS: Record<PaymentStatus, string> = {
  CAPTURED: "paymentCaptured",
  PROCESSING: "paymentProcessing",
  FAILED: "paymentFailed",
};

const STATUS_CLASS: Record<BookingStatus, string> = {
  PENDING: "statusPending",
  APPROVED: "statusApproved",
  REJECTED: "statusRejected",
};

export default function BookingApprovalsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (search.trim() === "") return BOOKINGS;
    const q = search.toLowerCase();
    return BOOKINGS.filter(
      (b) =>
        b.bookingId.toLowerCase().includes(q) ||
        b.customer.toLowerCase().includes(q) ||
        b.owner.toLowerCase().includes(q)
    );
  }, [search]);

  const pendingCount = BOOKINGS.filter((b) => b.status === "PENDING").length;

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Booking Approvals</h1>
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
            placeholder="Search by booking ID, customer, owner..."
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
                <th>Customer</th>
                <th>Owner</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td className={styles.idCell}>{row.bookingId}</td>
                  <td className={styles.mutedCell}>{row.customer}</td>
                  <td className={styles.mutedCell}>{row.owner}</td>
                  <td className={styles.amountCell}>₹{row.amount.toLocaleString("en-IN")}</td>
                  <td>
                    <span className={`${styles.pill} ${styles[PAYMENT_CLASS[row.payment]]}`}>
                      {row.payment}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.pill} ${styles[STATUS_CLASS[row.status]]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    <Link href={`/admin/bookings/${row.id}`} className={styles.reviewBtn}>
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className={styles.emptyText}>No bookings match your search.</p>
          )}
        </div>
      </div>

      {/* ---------- Cards (mobile) ---------- */}
      <div className={styles.mobileList}>
        {filtered.map((row) => (
          <Link key={row.id} href={`/admin/bookings/${row.id}`} className={styles.mobileCard}>
            <div className={styles.mobileCardTop}>
              <div className="min-w-0 flex-1">
                <p className={styles.idCell}>{row.bookingId}</p>
                <p className={styles.mobileMeta}>
                  {row.customer} → {row.owner}
                </p>
              </div>
              <span className={`${styles.pill} ${styles[STATUS_CLASS[row.status]]}`}>
                {row.status}
              </span>
            </div>
            <div className={styles.mobileCardBottom}>
              <span className={styles.amountCell}>₹{row.amount.toLocaleString("en-IN")}</span>
              <span className={`${styles.pill} ${styles[PAYMENT_CLASS[row.payment]]}`}>
                {row.payment}
              </span>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className={styles.emptyText}>No bookings match your search.</p>
        )}
      </div>
    </div>
  );
}