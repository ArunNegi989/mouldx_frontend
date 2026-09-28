"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./ListingApprovals.module.css";

type ListingStatus = "PENDING" | "RESUBMITTED" | "APPROVED" | "REJECTED";
type StatusFilter = ListingStatus | "ALL";

interface ListingRequest {
  id: string;
  mouldId: string;
  type: string;
  owner: string;
  pricePerDay: number;
  mediaCount: number;
  submittedDateISO: string; // yyyy-mm-dd — used for date-range filtering + CSV
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
    submittedDateISO: "2026-09-14",
    status: "PENDING",
  },
  {
    id: "2",
    mouldId: "MX-000198",
    type: "Blow · 5L Can",
    owner: "Nova Plastics",
    pricePerDay: 2400,
    mediaCount: 4,
    submittedDateISO: "2026-09-13",
    status: "PENDING",
  },
  {
    id: "3",
    mouldId: "MX-000077",
    type: "Die-Cast Housing",
    owner: "Apex Poly",
    pricePerDay: 3100,
    mediaCount: 8,
    submittedDateISO: "2026-09-12",
    status: "RESUBMITTED",
  },
  {
    id: "4",
    mouldId: "MX-000212",
    type: "Injection · 4-Cavity",
    owner: "Vector Molds",
    pricePerDay: 2050,
    mediaCount: 5,
    submittedDateISO: "2026-09-11",
    status: "PENDING",
  },
];

const STATUS_CLASS: Record<ListingStatus, string> = {
  PENDING: "statusPending",
  RESUBMITTED: "statusResubmitted",
  APPROVED: "statusApproved",
  REJECTED: "statusRejected",
};

const STATUS_FILTER_OPTIONS: { key: StatusFilter; label: string }[] = [
  { key: "ALL", label: "All Statuses" },
  { key: "PENDING", label: "Pending" },
  { key: "RESUBMITTED", label: "Resubmitted" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

function csvEscape(v: string | number) {
  const str = String(v);
  return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  // BOM so Excel reads UTF-8 correctly (· etc.)
  const csv = "\uFEFF" + rows.map((r) => r.map(csvEscape).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ListingApprovalsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const filtered = useMemo(() => {
    return LISTINGS.filter((l) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        l.mouldId.toLowerCase().includes(q) ||
        l.owner.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "ALL" || l.status === statusFilter;

      const matchesDate =
        (!dateRange.start || l.submittedDateISO >= dateRange.start) &&
        (!dateRange.end || l.submittedDateISO <= dateRange.end);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [search, statusFilter, dateRange]);

  const pendingCount = LISTINGS.filter(
    (l) => l.status === "PENDING" || l.status === "RESUBMITTED"
  ).length;

  const isFilterActive = statusFilter !== "ALL";

  const handleStatusSelect = (key: StatusFilter) => {
    setStatusFilter(key);
    setIsFilterOpen(false);
  };

  const handleDateChange = (field: "start" | "end", value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const handleDownloadCsv = () => {
    if (filtered.length === 0) return;

    const rows: (string | number)[][] = [
      ["Mould ID", "Type", "Owner", "Price Per Day (INR)", "Media Files", "Submitted Date", "Status"],
      ...filtered.map((l) => [
        l.mouldId,
        l.type,
        l.owner,
        l.pricePerDay,
        l.mediaCount,
        l.submittedDateISO,
        l.status,
      ]),
    ];

    const parts = ["listing-requests"];
    if (statusFilter !== "ALL") parts.push(statusFilter.toLowerCase());
    if (dateRange.start || dateRange.end) {
      parts.push(`${dateRange.start || "start"}_to_${dateRange.end || "today"}`);
    } else {
      parts.push(new Date().toISOString().slice(0, 10));
    }

    downloadCsv(`${parts.join("_")}.csv`, rows);
  };

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

        <div className={styles.dateRangeGroup}>
          <input
            type="date"
            className={styles.dateInput}
            value={dateRange.start}
            onChange={(e) => handleDateChange("start", e.target.value)}
          />
          <span className={styles.dateSep}>→</span>
          <input
            type="date"
            className={styles.dateInput}
            value={dateRange.end}
            onChange={(e) => handleDateChange("end", e.target.value)}
          />
        </div>

        <div className={styles.filterWrap}>
          <button
            type="button"
            className={`${styles.filterBtn} ${isFilterActive ? styles.filterBtnActive : ""}`}
            onClick={() => setIsFilterOpen((v) => !v)}
          >
            <span aria-hidden>⚙</span>
            {isFilterActive && <span className={styles.filterDot} aria-hidden />}
          </button>

          {isFilterOpen && (
            <div className={styles.filterDropdown}>
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className={`${styles.filterOption} ${
                    statusFilter === opt.key ? styles.filterOptionActive : ""
                  }`}
                  onClick={() => handleStatusSelect(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className={styles.downloadBtn}
          onClick={handleDownloadCsv}
          disabled={filtered.length === 0}
          title="Download filtered records as CSV"
        >
          <span aria-hidden>⬇</span> Download CSV
          <span className={styles.downloadCount}>{filtered.length}</span>
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