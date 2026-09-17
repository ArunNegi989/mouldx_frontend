"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./OwnerBookingDetail.module.css";

interface OwnerBookingDetail {
  id: string;
  code: string;
  productName: string;
  productMeta: string;
  customer: string;
  dateRange: string;
  days: number;
  total: number;
  status: "REQUESTED" | "UPCOMING" | "ACTIVE" | "COMPLETED";
  gradient: string;
}

// TEMP dummy data — real bookings API se aayega
const DUMMY_BOOKINGS: Record<string, OwnerBookingDetail> = {
  "1": {
    id: "1",
    code: "MX-000123",
    productName: "Bottle Cap Mould",
    productMeta: "28mm PET · Injection · 4 cav",
    customer: "Nova Plastics",
    dateRange: "14 – 21 Sep",
    days: 7,
    total: 126000,
    status: "REQUESTED",
    gradient: "linear-gradient(135deg, #22d3ee, #2563eb)",
  },
  "2": {
    id: "2",
    code: "MX-000198",
    productName: "5L Can Mould",
    productMeta: "HDPE · Blow · 1 cav",
    customer: "Vector Molds",
    dateRange: "08 – 12 Sep",
    days: 4,
    total: 72000,
    status: "ACTIVE",
    gradient: "linear-gradient(135deg, #818cf8, #7c3aed)",
  },
  "3": {
    id: "3",
    code: "MX-000077",
    productName: "Housing Mould",
    productMeta: "Aluminium · Die-Cast · 2 cav",
    customer: "Apex Poly",
    dateRange: "01 – 05 Sep",
    days: 4,
    total: 90000,
    status: "COMPLETED",
    gradient: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
  },
  "4": {
    id: "4",
    code: "MX-000045",
    productName: "Chair Mould",
    productMeta: "PP · Injection · 1 cav",
    customer: "Orbit Plast",
    dateRange: "20 – 27 Sep",
    days: 7,
    total: 108000,
    status: "REQUESTED",
    gradient: "linear-gradient(135deg, #22d3ee, #2563eb)",
  },
};

export default function OwnerBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const booking = DUMMY_BOOKINGS[id];
  const [decision, setDecision] = useState<"accepted" | "declined" | null>(null);

  if (!booking) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundText}>Booking not found.</p>
        <Link href="/owner/bookings" className={styles.notFoundLink}>
          ← Back to Bookings
        </Link>
      </div>
    );
  }

  const isNewRequest = booking.status === "REQUESTED";

  const handleAccept = () => {
    // TODO: call accept-booking API
    setDecision("accepted");
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* ---------- Header row with back button ---------- */}
        <div className={styles.titleRow}>
          <Link href="/owner/bookings" className={styles.backBtn} aria-label="Go back">
            ‹
          </Link>
          <h1 className={styles.title}>Booking Detail</h1>
        </div>

        {/* ---------- Booking summary card ---------- */}
        <div className={styles.card}>
          <div className={styles.cardTopRow}>
            {isNewRequest && !decision && (
              <span className={styles.newRequestPill}>NEW REQUEST</span>
            )}
            {decision === "accepted" && <span className={styles.acceptedPill}>ACCEPTED</span>}
            {decision === "declined" && <span className={styles.declinedPill}>DECLINED</span>}
            {!isNewRequest && !decision && <span />}
            <span className={styles.codeText}>{booking.code}</span>
          </div>

          <div className={styles.productRow}>
            <div className={styles.productIcon} style={{ background: booking.gradient }}>
              <span aria-hidden>✻</span>
            </div>
            <div className="min-w-0">
              <p className={styles.productName}>{booking.productName}</p>
              <p className={styles.productMeta}>{booking.productMeta}</p>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div>
              <p className={styles.detailLabel}>Customer</p>
              <p className={styles.detailValue}>{booking.customer}</p>
            </div>
            <div>
              <p className={styles.detailLabel}>Rental</p>
              <p className={styles.detailValue}>{booking.dateRange}</p>
            </div>
            <div>
              <p className={styles.detailLabel}>Days</p>
              <p className={styles.detailValue}>{booking.days} days</p>
            </div>
            <div>
              <p className={styles.detailLabel}>Total</p>
              <p className={styles.detailValueAccent}>₹{booking.total.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* ---------- Rent agreement ---------- */}
        <Link href="/owner/onboarding/rent-agreement" className={styles.agreementBtn}>
          <span aria-hidden>📄</span> View Rent Agreement
        </Link>

        {/* ---------- Pre-dispatch media notice ---------- */}
        <div className={styles.infoFlag}>
          <span className={styles.infoIcon} aria-hidden>
            i
          </span>
          <div>
            <p className={styles.infoTitle}>Pre-dispatch media</p>
            <p className={styles.infoText}>Photo/video will be uploaded before dispatch.</p>
          </div>
        </div>
      </div>

      {/* ---------- Sticky Accept/Decline (only for new requests) ---------- */}
      {isNewRequest && !decision && (
        <div className={styles.ctaBar}>
          <button type="button" onClick={handleAccept} className={styles.acceptBtn}>
            <span aria-hidden>✓</span> Accept
          </button>
          <button
            type="button"
            onClick={() => router.push(`/owner/bookings/${booking.id}/decline`)}
            className={styles.declineBtn}
          >
            <span aria-hidden>✕</span> Decline
          </button>
        </div>
      )}

      {decision && (
        <div className={styles.ctaBar}>
          <button
            type="button"
            onClick={() => router.push("/owner/bookings")}
            className={styles.backToListBtn}
          >
            Back to Bookings
          </button>
        </div>
      )}
    </div>
  );
}