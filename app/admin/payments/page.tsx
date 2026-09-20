"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Payments.module.css";

type TxnStatus = "CAPTURED" | "PROCESSED" | "PROCESSING" | "DISPUTED" | "FAILED";
type TxnType = "Booking Payment" | "Deposit Refund" | "Deposit Deduction" | "Payout";

interface Transaction {
  id: string;
  txnId: string;
  bookingId: string;
  type: TxnType;
  amount: number;
  status: TxnStatus;
  date: string;
}

// TEMP dummy data — real Razorpay/ledger API se aayega
const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    txnId: "rzp_29xk1",
    bookingId: "BK-24581",
    type: "Booking Payment",
    amount: 27850,
    status: "CAPTURED",
    date: "14 Sep",
  },
  {
    id: "2",
    txnId: "rzp_29xl9",
    bookingId: "BK-24102",
    type: "Deposit Refund",
    amount: 13500,
    status: "PROCESSED",
    date: "13 Sep",
  },
  {
    id: "3",
    txnId: "rzp_29xm2",
    bookingId: "BK-24611",
    type: "Booking Payment",
    amount: 31200,
    status: "PROCESSING",
    date: "12 Sep",
  },
  {
    id: "4",
    txnId: "rzp_29xn7",
    bookingId: "BK-23990",
    type: "Deposit Deduction",
    amount: 4200,
    status: "DISPUTED",
    date: "11 Sep",
  },
];

const STATUS_CLASS: Record<TxnStatus, string> = {
  CAPTURED: "statusCaptured",
  PROCESSED: "statusProcessed",
  PROCESSING: "statusProcessing",
  DISPUTED: "statusDisputed",
  FAILED: "statusFailed",
};

const DATE_FILTERS = ["All time", "Today", "Last 7 days", "Last 30 days"];
const STATUS_FILTERS = ["All statuses", "Captured", "Processed", "Processing", "Disputed", "Failed"];

export default function PaymentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState(DATE_FILTERS[0]);
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTERS[0]);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = TRANSACTIONS;
    if (statusFilter !== "All statuses") {
      list = list.filter((t) => t.status.toLowerCase() === statusFilter.toLowerCase());
    }
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.txnId.toLowerCase().includes(q) ||
          t.bookingId.toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, statusFilter]);

  const handleExportCsv = () => {
    // TODO: generate and download CSV from filtered transactions
    const header = "Txn ID,Booking,Type,Amount,Status,Date\n";
    const rows = filtered
      .map((t) => `${t.txnId},${t.bookingId},${t.type},${t.amount},${t.status},${t.date}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mouldx-payments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleView = (id: string) => {
    router.push(`/admin/payments/${id}`);
  };

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Payments &amp; Refunds</h1>
        <button type="button" onClick={handleExportCsv} className={styles.exportBtn}>
          ⬇ Export CSV
        </button>
      </div>

      {/* ---------- Search + Filter ---------- */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by transaction ID, booking, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterWrap}>
          <button type="button" onClick={() => setFilterOpen((p) => !p)} className={styles.filterBtn}>
            {dateFilter === "All time" && statusFilter === "All statuses"
              ? "Date · Status"
              : `${dateFilter !== "All time" ? dateFilter : "Date"} · ${
                  statusFilter !== "All statuses" ? statusFilter : "Status"
                }`}{" "}
            <span aria-hidden>▾</span>
          </button>

          {filterOpen && (
            <>
              <div className={styles.filterBackdrop} onClick={() => setFilterOpen(false)} />
              <div className={styles.filterDropdown}>
                <p className={styles.filterGroupLabel}>Date range</p>
                {DATE_FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setDateFilter(f)}
                    className={`${styles.filterOption} ${dateFilter === f ? styles.filterOptionActive : ""}`}
                  >
                    {f}
                  </button>
                ))}
                <p className={styles.filterGroupLabel}>Status</p>
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setStatusFilter(f)}
                    className={`${styles.filterOption} ${statusFilter === f ? styles.filterOptionActive : ""}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---------- Table (desktop) ---------- */}
      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Booking</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className={styles.txnIdCell}>{t.txnId}</td>
                  <td className={styles.mutedCell}>{t.bookingId}</td>
                  <td className={styles.mutedCell}>{t.type}</td>
                  <td className={styles.amountCell}>₹{t.amount.toLocaleString("en-IN")}</td>
                  <td>
                    <span className={`${styles.statusPill} ${styles[STATUS_CLASS[t.status]]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className={styles.mutedCell}>{t.date}</td>
                  <td className={styles.actionCell}>
                    <button
                      type="button"
                      onClick={() => handleView(t.id)}
                      className={styles.eyeBtn}
                      aria-label={`View ${t.txnId}`}
                    >
                      👁
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && <p className={styles.emptyText}>No transactions match your search.</p>}
        </div>
      </div>

      {/* ---------- Cards (mobile) ---------- */}
      <div className={styles.mobileList}>
        {filtered.map((t) => (
          <div key={t.id} className={styles.mobileCard}>
            <div className={styles.mobileCardTop}>
              <div className="min-w-0 flex-1">
                <p className={styles.txnIdCell}>{t.txnId}</p>
                <p className={styles.mobileMeta}>
                  {t.bookingId} · {t.type}
                </p>
              </div>
              <span className={`${styles.statusPill} ${styles[STATUS_CLASS[t.status]]}`}>
                {t.status}
              </span>
            </div>
            <div className={styles.mobileCardBottom}>
              <span className={styles.amountCell}>₹{t.amount.toLocaleString("en-IN")}</span>
              <div className="flex items-center gap-2">
                <span className={styles.mobileMeta}>{t.date}</span>
                <button
                  type="button"
                  onClick={() => handleView(t.id)}
                  className={styles.eyeBtn}
                  aria-label={`View ${t.txnId}`}
                >
                  👁 View
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && <p className={styles.emptyText}>No transactions match your search.</p>}
      </div>
    </div>
  );
}