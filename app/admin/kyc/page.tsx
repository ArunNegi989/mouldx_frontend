"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./KycApprovals.module.css";

type KycStatus = "PENDING" | "RESUBMITTED" | "APPROVED" | "REJECTED";
type StatusFilter = KycStatus | "ALL";
type Role = "Owner" | "Customer";

interface KycRequest {
  id: string;
  ownerName: string;
  role: Role;
  firmName: string;
  submittedDate: string;
  submittedDateISO: string;
  submittedTime: string;
  docs: string[];
  status: KycStatus;
  initial: string;
  gradient: string;
}

const TABS = ["All", "Owners", "Customers"] as const;

// TEMP dummy data - will come from the real admin API
const KYC_REQUESTS: KycRequest[] = [
  {
    id: "1",
    ownerName: "Rohit Sharma",
    role: "Owner",
    firmName: "Sharma Industries",
    submittedDate: "14 Sep",
    submittedDateISO: "2026-09-14",
    submittedTime: "10:22 AM",
    docs: ["PAN", "GST", "EB"],
    status: "PENDING",
    initial: "R",
    gradient: "linear-gradient(135deg, #22d3ee, #2563eb)",
  },
  {
    id: "2",
    ownerName: "Neha Kapoor",
    role: "Owner",
    firmName: "Nova Plastics",
    submittedDate: "13 Sep",
    submittedDateISO: "2026-09-13",
    submittedTime: "4:10 PM",
    docs: ["PAN", "GST", "MSME"],
    status: "PENDING",
    initial: "N",
    gradient: "linear-gradient(135deg, #818cf8, #7c3aed)",
  },
  {
    id: "3",
    ownerName: "Vikram Rao",
    role: "Owner",
    firmName: "Vector Molds",
    submittedDate: "12 Sep",
    submittedDateISO: "2026-09-12",
    submittedTime: "9:05 AM",
    docs: ["PAN", "GST"],
    status: "RESUBMITTED",
    initial: "V",
    gradient: "linear-gradient(135deg, #34d399, #059669)",
  },
  {
    id: "4",
    ownerName: "Anjali Deshpande",
    role: "Owner",
    firmName: "Apex Poly",
    submittedDate: "11 Sep",
    submittedDateISO: "2026-09-11",
    submittedTime: "1:40 PM",
    docs: ["PAN", "GST", "EB"],
    status: "PENDING",
    initial: "A",
    gradient: "linear-gradient(135deg, #22d3ee, #2563eb)",
  },
  {
    id: "5",
    ownerName: "Sanjay Verma",
    role: "Customer",
    firmName: "Individual",
    submittedDate: "14 Sep",
    submittedDateISO: "2026-09-14",
    submittedTime: "11:15 AM",
    docs: ["PAN", "Aadhaar"],
    status: "PENDING",
    initial: "S",
    gradient: "linear-gradient(135deg, #fb923c, #ea580c)",
  },
  {
    id: "6",
    ownerName: "Pooja Singh",
    role: "Customer",
    firmName: "Individual",
    submittedDate: "13 Sep",
    submittedDateISO: "2026-09-13",
    submittedTime: "2:30 PM",
    docs: ["PAN", "Aadhaar"],
    status: "APPROVED",
    initial: "P",
    gradient: "linear-gradient(135deg, #f472b6, #db2777)",
  },
  {
    id: "7",
    ownerName: "Amit Khanna",
    role: "Customer",
    firmName: "Khanna Traders",
    submittedDate: "10 Sep",
    submittedDateISO: "2026-09-10",
    submittedTime: "5:45 PM",
    docs: ["PAN", "GST"],
    status: "REJECTED",
    initial: "A",
    gradient: "linear-gradient(135deg, #34d399, #059669)",
  },
];

const STATUS_CLASS: Record<KycStatus, string> = {
  PENDING: "statusPending",
  RESUBMITTED: "statusResubmitted",
  APPROVED: "statusApproved",
  REJECTED: "statusRejected",
};

const ROLE_CLASS: Record<Role, string> = {
  Owner: "roleOwner",
  Customer: "roleCustomer",
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
  // BOM so Excel reads UTF-8 correctly
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

export default function KycApprovalsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const filtered = useMemo(() => {
    return KYC_REQUESTS.filter((r) => {
      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Owners" && r.role === "Owner") ||
        (activeTab === "Customers" && r.role === "Customer");

      const q = search.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        r.ownerName.toLowerCase().includes(q) ||
        r.firmName.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.docs.some((d) => d.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;

      const matchesDate =
        (!dateRange.start || r.submittedDateISO >= dateRange.start) &&
        (!dateRange.end || r.submittedDateISO <= dateRange.end);

      return matchesTab && matchesSearch && matchesStatus && matchesDate;
    });
  }, [search, activeTab, statusFilter, dateRange]);

  const pendingCount = KYC_REQUESTS.filter(
    (r) => r.status === "PENDING" || r.status === "RESUBMITTED"
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
      ["Name", "Role", "Firm Name", "Submitted Date", "Submitted Time", "Documents", "Status"],
      ...filtered.map((r) => [
        r.ownerName,
        r.role,
        r.firmName,
        r.submittedDateISO,
        r.submittedTime,
        r.docs.join(" | "),
        r.status,
      ]),
    ];

    const parts = ["kyc-requests"];
    if (activeTab !== "All") parts.push(activeTab.toLowerCase());
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
      <div className={styles.headerRow}>
        <h1 className={styles.title}>KYC Approvals</h1>
        <span className={styles.pendingPill}>{pendingCount} PENDING</span>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name, role, PAN, GST..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""}`}
            >
              {tab}
            </button>
          ))}
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

      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Firm</th>
                <th>Submitted</th>
                <th>Docs</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className={styles.ownerCell}>
                      <span className={styles.avatar} style={{ background: row.gradient }}>
                        {row.initial}
                      </span>
                      <span className={styles.ownerName}>{row.ownerName}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.rolePill} ${styles[ROLE_CLASS[row.role]]}`}>
                      {row.role}
                    </span>
                  </td>
                  <td className={styles.mutedCell}>{row.firmName}</td>
                  <td className={styles.mutedCell}>
                    {row.submittedDate} · {row.submittedTime}
                  </td>
                  <td className={styles.mutedCell}>{row.docs.join(", ")}</td>
                  <td>
                    <span className={`${styles.statusPill} ${styles[STATUS_CLASS[row.status]]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    <Link href={`/admin/kyc/${row.id}`} className={styles.reviewBtn}>
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className={styles.emptyText}>No KYC requests match your search.</p>
          )}
        </div>
      </div>

      <div className={styles.mobileList}>
        {filtered.map((row) => (
          <Link key={row.id} href={`/admin/kyc/${row.id}`} className={styles.mobileCard}>
            <div className={styles.mobileCardTop}>
              <span className={styles.avatar} style={{ background: row.gradient }}>
                {row.initial}
              </span>
              <div className="min-w-0 flex-1">
                <p className={styles.ownerName}>{row.ownerName}</p>
                <p className={styles.mobileMeta}>{row.firmName}</p>
              </div>
              <span className={`${styles.statusPill} ${styles[STATUS_CLASS[row.status]]}`}>
                {row.status}
              </span>
            </div>
            <div className={styles.mobileCardBottom}>
              <span className={`${styles.rolePill} ${styles[ROLE_CLASS[row.role]]}`}>
                {row.role}
              </span>
              <span className={styles.mobileMeta}>
                {row.submittedDate} · {row.submittedTime}
              </span>
              <span className={styles.mobileMeta}>{row.docs.join(", ")}</span>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className={styles.emptyText}>No KYC requests match your search.</p>
        )}
      </div>
    </div>
  );
}