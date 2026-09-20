"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./KycApprovals.module.css";

type KycStatus = "PENDING" | "RESUBMITTED" | "APPROVED" | "REJECTED";

interface KycRequest {
  id: string;
  ownerName: string;
  firmName: string;
  submittedDate: string;
  submittedTime: string;
  docs: string[];
  status: KycStatus;
  initial: string;
  gradient: string;
}

// TEMP dummy data — real admin API se aayega
const KYC_REQUESTS: KycRequest[] = [
  {
    id: "1",
    ownerName: "Rohit Sharma",
    firmName: "Sharma Industries",
    submittedDate: "14 Sep",
    submittedTime: "10:22 AM",
    docs: ["PAN", "GST", "EB"],
    status: "PENDING",
    initial: "R",
    gradient: "linear-gradient(135deg, #22d3ee, #2563eb)",
  },
  {
    id: "2",
    ownerName: "Neha Kapoor",
    firmName: "Nova Plastics",
    submittedDate: "13 Sep",
    submittedTime: "4:10 PM",
    docs: ["PAN", "GST", "MSME"],
    status: "PENDING",
    initial: "N",
    gradient: "linear-gradient(135deg, #818cf8, #7c3aed)",
  },
  {
    id: "3",
    ownerName: "Vikram Rao",
    firmName: "Vector Molds",
    submittedDate: "12 Sep",
    submittedTime: "9:05 AM",
    docs: ["PAN", "GST"],
    status: "RESUBMITTED",
    initial: "V",
    gradient: "linear-gradient(135deg, #34d399, #059669)",
  },
  {
    id: "4",
    ownerName: "Anjali Deshpande",
    firmName: "Apex Poly",
    submittedDate: "11 Sep",
    submittedTime: "1:40 PM",
    docs: ["PAN", "GST", "EB"],
    status: "PENDING",
    initial: "A",
    gradient: "linear-gradient(135deg, #22d3ee, #2563eb)",
  },
];

const STATUS_CLASS: Record<KycStatus, string> = {
  PENDING: "statusPending",
  RESUBMITTED: "statusResubmitted",
  APPROVED: "statusApproved",
  REJECTED: "statusRejected",
};

export default function KycApprovalsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (search.trim() === "") return KYC_REQUESTS;
    const q = search.toLowerCase();
    return KYC_REQUESTS.filter(
      (r) =>
        r.ownerName.toLowerCase().includes(q) ||
        r.firmName.toLowerCase().includes(q) ||
        r.docs.some((d) => d.toLowerCase().includes(q))
    );
  }, [search]);

  const pendingCount = KYC_REQUESTS.filter(
    (r) => r.status === "PENDING" || r.status === "RESUBMITTED"
  ).length;

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>KYC Approvals</h1>
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
            placeholder="Search by owner name, PAN, GST..."
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
                <th>Owner</th>
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

          {filtered.length === 0 && <p className={styles.emptyText}>No KYC requests match your search.</p>}
        </div>
      </div>

      {/* ---------- Cards (mobile) ---------- */}
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
              <span className={styles.mobileMeta}>
                {row.submittedDate} · {row.submittedTime}
              </span>
              <span className={styles.mobileMeta}>{row.docs.join(", ")}</span>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && <p className={styles.emptyText}>No KYC requests match your search.</p>}
      </div>
    </div>
  );
}