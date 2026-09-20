"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./UserManagement.module.css";

type Role = "Owner" | "Customer";
type KycStatus = "VERIFIED" | "PENDING" | "N/A";

interface UserRow {
  id: string;
  name: string;
  role: Role;
  joined: string;
  activityCount: number;
  activityLabel: string;
  kyc: KycStatus;
  initial: string;
  gradient: string;
}

const TABS = ["All", "Owners", "Customers"] as const;

// TEMP dummy data — real users API se aayega
const INITIAL_USERS: UserRow[] = [
  {
    id: "1",
    name: "Rohit Sharma",
    role: "Owner",
    joined: "2 Mar 2026",
    activityCount: 12,
    activityLabel: "listings",
    kyc: "VERIFIED",
    initial: "R",
    gradient: "linear-gradient(135deg, #22d3ee, #2563eb)",
  },
  {
    id: "2",
    name: "Neha Kapoor",
    role: "Customer",
    joined: "18 Apr 2026",
    activityCount: 9,
    activityLabel: "bookings",
    kyc: "N/A",
    initial: "N",
    gradient: "linear-gradient(135deg, #34d399, #059669)",
  },
  {
    id: "3",
    name: "Vikram Rao",
    role: "Owner",
    joined: "30 Jan 2026",
    activityCount: 6,
    activityLabel: "listings",
    kyc: "VERIFIED",
    initial: "V",
    gradient: "linear-gradient(135deg, #818cf8, #7c3aed)",
  },
];

const KYC_CLASS: Record<KycStatus, string> = {
  VERIFIED: "kycVerified",
  PENDING: "kycPending",
  "N/A": "kycNa",
};

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = users;
    if (activeTab === "Owners") list = list.filter((u) => u.role === "Owner");
    if (activeTab === "Customers") list = list.filter((u) => u.role === "Customer");
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q));
    }
    return list;
  }, [users, search, activeTab]);

  const handleView = (id: string) => {
    router.push(`/admin/users/${id}`);
  };

  const handleDelete = (id: string) => {
    // TODO: call delete-user API
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setConfirmDeleteId(null);
  };

  const userToDelete = users.find((u) => u.id === confirmDeleteId);

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>User Management</h1>
        <span className={styles.countPill}>{users.length.toLocaleString("en-IN")} TOTAL</span>
      </div>

      {/* ---------- Search + Tabs ---------- */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name, phone, email..."
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
      </div>

      {/* ---------- Table (desktop) ---------- */}
      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Bookings/Listings</th>
                <th>KYC</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className={styles.userCell}>
                      <span className={styles.avatar} style={{ background: u.gradient }}>
                        {u.initial}
                      </span>
                      <span className={styles.userName}>{u.name}</span>
                    </div>
                  </td>
                  <td className={styles.mutedCell}>{u.role}</td>
                  <td className={styles.mutedCell}>{u.joined}</td>
                  <td className={styles.mutedCell}>
                    {u.activityCount} {u.activityLabel}
                  </td>
                  <td>
                    <span className={`${styles.kycPill} ${styles[KYC_CLASS[u.kyc]]}`}>{u.kyc}</span>
                  </td>
                  <td className={styles.actionCell}>
                    <button
                      type="button"
                      onClick={() => handleView(u.id)}
                      className={styles.eyeBtn}
                      aria-label={`View ${u.name}`}
                    >
                      👁
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(u.id)}
                      className={`${styles.eyeBtn} ${styles.deleteBtn}`}
                      aria-label={`Delete ${u.name}`}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && <p className={styles.emptyText}>No users match your search.</p>}
        </div>
      </div>

      {/* ---------- Cards (mobile) ---------- */}
      <div className={styles.mobileList}>
        {filtered.map((u) => (
          <div key={u.id} className={styles.mobileCard}>
            <div className={styles.mobileCardTop}>
              <span className={styles.avatar} style={{ background: u.gradient }}>
                {u.initial}
              </span>
              <div className="min-w-0 flex-1">
                <p className={styles.userName}>{u.name}</p>
                <p className={styles.mobileMeta}>
                  {u.role} · {u.joined}
                </p>
              </div>
              <span className={`${styles.kycPill} ${styles[KYC_CLASS[u.kyc]]}`}>{u.kyc}</span>
            </div>
            <div className={styles.mobileCardBottom}>
              <span className={styles.mobileMeta}>
                {u.activityCount} {u.activityLabel}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleView(u.id)}
                  className={styles.eyeBtn}
                  aria-label={`View ${u.name}`}
                >
                  👁 View
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(u.id)}
                  className={`${styles.eyeBtn} ${styles.deleteBtn}`}
                  aria-label={`Delete ${u.name}`}
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && <p className={styles.emptyText}>No users match your search.</p>}
      </div>

      {/* ---------- Delete confirmation modal ---------- */}
      {confirmDeleteId && userToDelete && (
        <div className={styles.confirmOverlay} onClick={() => setConfirmDeleteId(null)}>
          <div className={styles.confirmContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIcon}>⚠</div>
            <h3 className={styles.confirmTitle}>Delete this user?</h3>
            <p className={styles.confirmText}>
              This will permanently remove <strong>{userToDelete.name}</strong> (
              {userToDelete.role}) and all their {userToDelete.activityLabel} from the platform.
              This cannot be undone.
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className={styles.confirmCancelBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                className={styles.confirmDeleteBtn}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}