"use client";

import { useEffect, useMemo, useState } from "react";
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
  maintenanceNote?: string;
  maintenanceUntil?: string;
}

const INITIAL_MOULDS: Mould[] = [
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
  {
    id: "3",
    name: "Chair Leg Mould",
    code: "MX-000077",
    rating: 4.7,
    status: "MAINTENANCE",
    pricePerDay: 15000,
    gradient: "#2563eb",
    maintenanceNote: "Cooling channel cleaning",
    maintenanceUntil: "2026-10-20",
  },
];

const STATUS_CLASS: Record<AvailabilityStatus, string> = {
  AVAILABLE: "badgeAvailable",
  RENTED: "badgeRented",
  MAINTENANCE: "badgeMaintenance",
};

const STATUS_OPTIONS: {
  value: AvailabilityStatus;
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
    value: "RENTED",
    label: "Rented",
    description: "Currently with a customer",
    dot: "dotRented",
  },
  {
    value: "MAINTENANCE",
    label: "Under maintenance",
    description: "Hidden from booking until you mark it available",
    dot: "dotMaintenance",
  },
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
  const [error, setError] = useState("");

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const unchanged =
    status === mould.status &&
    (status !== "MAINTENANCE" ||
      (note === (mould.maintenanceNote ?? "") &&
        until === (mould.maintenanceUntil ?? "")));

  const handleSave = async () => {
    if (unchanged || saving) return;
    setSaving(true);
    setError("");
    try {
      await onSave(status, note.trim(), until);
      onClose();
    } catch {
      setError("Could not update the status. Please try again.");
      setSaving(false);
    }
  };

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

        <div className={styles.options} role="radiogroup" aria-label="Status">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={status === opt.value}
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

        {status === "RENTED" && mould.status !== "RENTED" && (
          <p className={styles.notice}>
            Rentals booked through MouldX are marked automatically. Use this
            only for rentals you gave offline.
          </p>
        )}

        {status === "MAINTENANCE" && (
          <div className={styles.maintenanceFields}>
            {mould.status === "RENTED" && (
              <p className={styles.notice}>
                This mould is currently rented. Mark maintenance only after it
                has been returned.
              </p>
            )}

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
            onClick={handleSave}
            disabled={unchanged || saving}
          >
            {saving ? "Saving..." : "Save status"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyMouldsPage() {
  const [search, setSearch] = useState("");
  const [moulds, setMoulds] = useState<Mould[]>(INITIAL_MOULDS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q === "") return moulds;
    return moulds.filter(
      (m) => m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q)
    );
  }, [search, moulds]);

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
      <h1 className={styles.title}>My Moulds</h1>

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

      <div className={styles.list}>
        {filtered.map((m) => (
          <div key={m.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.avatar} style={{ background: m.gradient }}>
                <span aria-hidden>✻</span>
              </div>
              <div className={styles.cardInfo}>
                <p className={styles.mouldName}>{m.name}</p>
                <p className={styles.mouldMeta}>
                  {m.code} · <span className={styles.ratingStar}>★</span> {m.rating}
                </p>
              </div>
              <span className={`${styles.badge} ${styles[STATUS_CLASS[m.status]]}`}>
                {m.status}
              </span>
            </div>

            {m.status === "MAINTENANCE" && (m.maintenanceNote || m.maintenanceUntil) && (
              <div className={styles.maintenanceInfo}>
                {m.maintenanceNote && (
                  <p className={styles.maintenanceNote}>{m.maintenanceNote}</p>
                )}
                {m.maintenanceUntil && (
                  <p className={styles.maintenanceUntil}>
                    Back on {formatDate(m.maintenanceUntil)}
                  </p>
                )}
              </div>
            )}

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
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => setEditingId(m.id)}
              >
                <span aria-hidden>🔧</span> Status
              </button>
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

      <Link href="/owner/moulds/new" className={`${styles.addBtn} btn-primary`}>
        + Add New Listing
      </Link>

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