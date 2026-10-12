"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./MyMoulds.module.css";

type AvailabilityStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE";
type EditableStatus = Exclude<AvailabilityStatus, "RENTED">;
type StatusFilter = "ALL" | AvailabilityStatus;

interface Mould {
  id: string;
  name: string;
  code: string;
  rating: number;
  status: AvailabilityStatus;
  pricePerDay: number;
  image: string;
  maintenanceNote?: string;
  maintenanceUntil?: string;
}

const PAGE_SIZE = 10;

// TEMP dummy data (24 records so pagination can be tested) — will be replaced by the real moulds API
const MOULD_NAMES = [
  "Bottle Cap Mould",
  "PET Preform Mould",
  "Chair Leg Mould",
  "Blow Mould — 5L Can",
  "Die-Cast Housing Mould",
  "Bucket Handle Mould",
];

const STATUS_CYCLE: AvailabilityStatus[] = ["AVAILABLE", "RENTED", "MAINTENANCE", "AVAILABLE"];

const MAINTENANCE_NOTES = [
  "Cooling channel cleaning",
  "Cavity polishing",
  "Ejector pin replacement",
];

const INITIAL_MOULDS: Mould[] = Array.from({ length: 24 }, (_, i) => {
  const status = STATUS_CYCLE[i % STATUS_CYCLE.length];
  const isMaintenance = status === "MAINTENANCE";

  return {
    id: String(i + 1),
    name: MOULD_NAMES[i % MOULD_NAMES.length],
    code: `MX-${String(100 + i * 7).padStart(6, "0")}`,
    rating: Number((4.3 + ((i * 3) % 7) / 10).toFixed(1)),
    status,
    pricePerDay: 15000 + (i % 5) * 2000,
    image: `https://picsum.photos/seed/owner-mould-${i + 1}/600/600`,
    maintenanceNote: isMaintenance ? MAINTENANCE_NOTES[i % MAINTENANCE_NOTES.length] : undefined,
    maintenanceUntil: isMaintenance ? "2026-10-20" : undefined,
  };
});

const STATUS_CLASS: Record<AvailabilityStatus, string> = {
  AVAILABLE: "badgeAvailable",
  RENTED: "badgeRented",
  MAINTENANCE: "badgeMaintenance",
};

// The owner can only switch between these two. "Rented" is set automatically by bookings.
const STATUS_OPTIONS: {
  value: EditableStatus;
  label: string;
  description: string;
  dot: string;
}[] = [
  {
    value: "AVAILABLE",
    label: "Available",
    description: "Visible to customers and open for booking",
    dot: "dotAvailable",
  },
  {
    value: "MAINTENANCE",
    label: "Under maintenance",
    description: "Hidden from booking until you mark it available",
    dot: "dotMaintenance",
  },
];

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "AVAILABLE", label: "Available" },
  { value: "RENTED", label: "Rented" },
  { value: "MAINTENANCE", label: "Maintenance" },
];

const MAX_NOTE = 140;

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function todayISO() {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

async function updateMouldStatus(payload: {
  mouldId: string;
  status: AvailabilityStatus;
  maintenanceNote?: string;
  maintenanceUntil?: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return payload;
}

/* ---------- Status bottom sheet ---------- */

interface StatusSheetProps {
  mould: Mould;
  onClose: () => void;
  onSave: (
    status: AvailabilityStatus,
    note: string,
    until: string
  ) => Promise<void>;
}

function StatusSheet({ mould, onClose, onSave }: StatusSheetProps) {
  const [status, setStatus] = useState<AvailabilityStatus>(mould.status);
  const [note, setNote] = useState(mould.maintenanceNote ?? "");
  const [until, setUntil] = useState(mould.maintenanceUntil ?? "");
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const isRented = mould.status === "RENTED";

  // Lock the page scroll while the sheet is open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Escape closes the confirmation popup first, then the sheet
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || saving) return;
      if (confirming) {
        setConfirming(false);
      } else {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, confirming, saving]);

  const unchanged =
    status === mould.status &&
    (status !== "MAINTENANCE" ||
      (note === (mould.maintenanceNote ?? "") &&
        until === (mould.maintenanceUntil ?? "")));

  const handleSaveClick = () => {
    if (unchanged || saving || isRented) return;
    setError("");
    setConfirming(true);
  };

  const handleConfirm = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await onSave(status, note.trim(), until);
      onClose();
    } catch {
      setConfirming(false);
      setSaving(false);
      setError("Could not update the status. Please try again.");
    }
  };

  const confirmTitle =
    status === "MAINTENANCE" ? "Mark as under maintenance?" : "Mark as available?";

  const confirmText =
    status === "MAINTENANCE"
      ? `${mould.name} will be hidden from booking until you mark it available.${
          until ? ` Expected back on ${formatDate(until)}.` : ""
        }`
      : `${mould.name} will be visible to customers and open for booking.`;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label="Update mould status"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.sheetHandle} aria-hidden />

        <h2 className={styles.sheetTitle}>Update status</h2>
        <p className={styles.sheetSub}>
          {mould.name} · {mould.code}
        </p>

        {isRented && (
          <p className={styles.notice}>
            This mould is currently rented. Its status updates automatically once it is
            returned.
          </p>
        )}

        <div className={styles.options} role="radiogroup" aria-label="Status">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={status === opt.value}
              disabled={isRented}
              className={`${styles.option} ${
                status === opt.value ? styles.optionActive : ""
              }`}
              onClick={() => setStatus(opt.value)}
            >
              <span className={`${styles.dot} ${styles[opt.dot]}`} aria-hidden />
              <span className={styles.optionText}>
                <span className={styles.optionLabel}>{opt.label}</span>
                <span className={styles.optionDesc}>{opt.description}</span>
              </span>
              <span
                className={`${styles.radio} ${
                  status === opt.value ? styles.radioOn : ""
                }`}
                aria-hidden
              />
            </button>
          ))}
        </div>

        {status === "MAINTENANCE" && !isRented && (
          <div className={styles.maintenanceFields}>
            <label htmlFor="maintenance-note" className={styles.fieldLabel}>
              Reason <span className={styles.optional}>(optional)</span>
            </label>
            <textarea
              id="maintenance-note"
              className={styles.textarea}
              rows={2}
              maxLength={MAX_NOTE}
              placeholder="e.g. Cavity polishing, cooling line repair"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <label htmlFor="maintenance-until" className={styles.fieldLabel}>
              Expected back on <span className={styles.optional}>(optional)</span>
            </label>
            <input
              id="maintenance-until"
              type="date"
              className={styles.dateInput}
              min={todayISO()}
              value={until}
              onChange={(e) => setUntil(e.target.value)}
            />
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.sheetActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSaveClick}
            disabled={unchanged || saving || isRented}
          >
            Save status
          </button>
        </div>
      </div>

      {/* ---------- Confirmation popup ---------- */}
      {confirming && (
        <div
          className={styles.confirmOverlay}
          onClick={(e) => {
            e.stopPropagation();
            if (!saving) setConfirming(false);
          }}
        >
          <div
            className={styles.confirmBox}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-text"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className={`${styles.confirmIcon} ${
                status === "MAINTENANCE" ? styles.confirmIconRed : styles.confirmIconGreen
              }`}
              aria-hidden
            >
              {status === "MAINTENANCE" ? "🔧" : "✓"}
            </span>

            <h3 id="confirm-title" className={styles.confirmTitle}>
              {confirmTitle}
            </h3>
            <p id="confirm-text" className={styles.confirmText}>
              {confirmText}
            </p>

            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setConfirming(false)}
                disabled={saving}
              >
                Go back
              </button>
              <button
                type="button"
                className={styles.saveBtn}
                onClick={handleConfirm}
                disabled={saving}
              >
                {saving ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Mould image with placeholder fallback ---------- */

function MouldImage({ src, alt }: { src: string; alt: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={styles.imageWrap}>
      {!imgError ? (
        <img
          src={src}
          alt={alt}
          className={styles.image}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={styles.placeholder} aria-hidden>
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.5" />
            <path d="M21 16l-5-5-8 8" />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ---------- Mould card (same design as the review card) ---------- */

function MouldCard({
  mould,
  onEditStatus,
}: {
  mould: Mould;
  onEditStatus: (id: string) => void;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <MouldImage src={mould.image} alt={mould.name} />

        <div className={styles.cardInfo}>
          <h3 className={styles.mouldName}>{mould.name}</h3>
          <p className={styles.mouldMeta}>
            {mould.code} · <span className={styles.ratingStar}>★</span> {mould.rating}
          </p>
          <p className={styles.mouldLine}>
            <strong>Rent:</strong> ₹{mould.pricePerDay.toLocaleString("en-IN")}/day
          </p>
          <span className={`${styles.badge} ${styles[STATUS_CLASS[mould.status]]}`}>
            {mould.status}
          </span>
        </div>
      </div>

      {mould.status === "MAINTENANCE" && (mould.maintenanceNote || mould.maintenanceUntil) && (
        <div className={styles.maintenanceInfo}>
          {mould.maintenanceNote && (
            <p className={styles.maintenanceNote}>{mould.maintenanceNote}</p>
          )}
          {mould.maintenanceUntil && (
            <p className={styles.maintenanceUntil}>
              Back on {formatDate(mould.maintenanceUntil)}
            </p>
          )}
        </div>
      )}

      <hr className={styles.divider} />

      <div className={styles.actionsRow}>
        <Link href={`/owner/moulds/${mould.id}/calendar`} className={styles.actionBtn}>
          <span aria-hidden>📅</span> Calendar
        </Link>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => onEditStatus(mould.id)}
        >
          <span aria-hidden>🔧</span> Status
        </button>
        <Link href={`/owner/moulds/${mould.id}/edit`} className={styles.actionBtn}>
          <span aria-hidden>✎</span> Edit
        </Link>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function MyMouldsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [moulds, setMoulds] = useState<Mould[]>(INITIAL_MOULDS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const counts = useMemo(() => {
    const base: Record<StatusFilter, number> = {
      ALL: moulds.length,
      AVAILABLE: 0,
      RENTED: 0,
      MAINTENANCE: 0,
    };
    moulds.forEach((m) => {
      base[m.status] += 1;
    });
    return base;
  }, [moulds]);

  const filtered = useMemo(() => {
    const tokens = search.toLowerCase().trim().split(/\s+/).filter(Boolean);

    return moulds.filter((m) => {
      const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;
      const haystack = `${m.name} ${m.code} ${m.status}`.toLowerCase();
      const matchesSearch = tokens.every((t) => haystack.includes(t));
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter, moulds]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const activeFilterCount = statusFilter !== "ALL" ? 1 : 0;
  const isFiltering = search.trim() !== "" || activeFilterCount > 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const clearAll = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPage(1);
  };

  const goToPage = (next: number) => {
    setPage(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const editingMould = moulds.find((m) => m.id === editingId) ?? null;

  const handleSave = async (
    status: AvailabilityStatus,
    note: string,
    until: string
  ) => {
    if (!editingMould) return;
    const id = editingMould.id;
    const previous = moulds;

    setMoulds((list) =>
      list.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              maintenanceNote: status === "MAINTENANCE" ? note : undefined,
              maintenanceUntil:
                status === "MAINTENANCE" && until ? until : undefined,
            }
          : m
      )
    );

    try {
      await updateMouldStatus({
        mouldId: id,
        status,
        maintenanceNote: status === "MAINTENANCE" ? note : undefined,
        maintenanceUntil: status === "MAINTENANCE" && until ? until : undefined,
      });
      const label = STATUS_OPTIONS.find((o) => o.value === status)?.label;
      setToast(`${editingMould.name} marked as ${label?.toLowerCase()}`);
    } catch (err) {
      setMoulds(previous);
      throw err;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>My Products</h1>

        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon} aria-hidden>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search Moulds"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={styles.searchInput}
              aria-label="Search moulds"
            />
            {search && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => handleSearchChange("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="button"
            className={`${styles.filterBtn} ${
              isFilterOpen || activeFilterCount > 0 ? styles.filterBtnActive : ""
            }`}
            onClick={() => setIsFilterOpen((v) => !v)}
            aria-expanded={isFilterOpen}
            aria-label="Filter moulds"
          >
            <span aria-hidden>▽</span>
            {activeFilterCount > 0 && (
              <span className={styles.filterCount}>{activeFilterCount}</span>
            )}
          </button>
        </div>

        {isFilterOpen && (
          <div className={styles.filterPanel}>
            <p className={styles.filterLabel}>Status</p>
            <div className={styles.chipsRow}>
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleStatusFilterChange(opt.value)}
                  className={`${styles.chip} ${
                    statusFilter === opt.value ? styles.chipActive : ""
                  }`}
                >
                  {opt.label}
                  <span className={styles.chipCount}>{counts[opt.value]}</span>
                </button>
              ))}
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                className={styles.clearFilters}
                onClick={() => handleStatusFilterChange("ALL")}
              >
                Clear filter
              </button>
            )}
          </div>
        )}

        {/* ---------- Add New Listing button (below search + filter) ---------- */}
        <Link href="/owner/moulds/new/product" className={`${styles.addBtn} btn-primary`}>
          + Add New Listing
        </Link>

        {isFiltering && (
          <p className={styles.resultsText}>
            {filtered.length} mould{filtered.length === 1 ? "" : "s"} found
          </p>
        )}

        <div className={styles.list}>
          {pageItems.map((m) => (
            <MouldCard key={m.id} mould={m} onEditStatus={setEditingId} />
          ))}

          {filtered.length === 0 && (
            <div className={styles.emptyBox}>
              <p className={styles.emptyText}>No moulds match your search or filter.</p>
              {isFiltering && (
                <button type="button" className={styles.clearFilters} onClick={clearAll}>
                  Clear search &amp; filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* ---------- Pagination (only when there is more than one page) ---------- */}
        {totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Moulds pagination">
            <p className={styles.paginationInfo}>
              Showing {startIndex + 1}–{startIndex + pageItems.length} of {filtered.length}
            </p>

            <div className={styles.paginationControls}>
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <span className={styles.pageIndicator}>
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                className={`${styles.pageBtn} ${styles.pageBtnPrimary}`}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          </nav>
        )}
      </div>

      {editingMould && (
        <StatusSheet
          key={editingMould.id}
          mould={editingMould}
          onClose={() => setEditingId(null)}
          onSave={handleSave}
        />
      )}

      {toast && (
        <div className={styles.toast} role="status">
          {toast}
        </div>
      )}
    </div>
  );
}