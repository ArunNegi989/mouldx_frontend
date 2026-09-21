"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ListingReviewDetail.module.css";

interface MediaItem {
  type: "photo" | "video";
  label: string;
  previewUrl: string;
  coords?: { lat: number; lng: number };
  duration?: string;
}

interface ListingDetail {
  id: string;
  mouldCode: string;
  productName: string;
  status: "PENDING REVIEW" | "RESUBMITTED" | "APPROVED" | "REJECTED";
  owner: string;
  media: MediaItem[];
  technical: {
    tonnage: string;
    cavities: string;
    steel: string;
    dimensions: string;
    weight: string;
    cycleTime: string;
    hourlyProduction: string;
    runnerType: string;
    coolingTemp: string;
    changeableLogo: string;
  };
  general: {
    mouldNameOrId: string;
    mouldType: string;
    condition: string;
    year: string;
    manufacturer: string;
    actualValue: string;
    setOfMoulds: string;
    eligibility: string;
    perDayCharges: string;
  };
  product: {
    productName: string;
    category: string;
    dimensions: string;
    weight: string;
    material: string;
    finish: string;
  };
}

// TEMP dummy data — real owner-listing API se aayega
const LISTING_DETAILS: Record<string, ListingDetail> = {
  "1": {
    id: "1",
    mouldCode: "MX-000123",
    productName: "2-Cavity Injection Mould",
    status: "PENDING REVIEW",
    owner: "Sharma Industries",
    media: [
      { type: "photo", label: "Photo", previewUrl: "https://picsum.photos/seed/mx1a/900/600", coords: { lat: 19.07, lng: 72.87 } },
      { type: "photo", label: "Photo", previewUrl: "https://picsum.photos/seed/mx1b/900/600", coords: { lat: 19.07, lng: 72.87 } },
      { type: "video", label: "Video", previewUrl: "https://picsum.photos/seed/mx1c/900/600", duration: "0:42" },
    ],
    technical: {
      tonnage: "120T",
      cavities: "2",
      steel: "P20",
      dimensions: "420 × 310 × 280 mm",
      weight: "185 kg",
      cycleTime: "28 s",
      hourlyProduction: "120",
      runnerType: "Hot Runner",
      coolingTemp: "18 °C",
      changeableLogo: "No",
    },
    general: {
      mouldNameOrId: "Bottle Cap Mould · MX-000123",
      mouldType: "Injection",
      condition: "Excellent",
      year: "2022",
      manufacturer: "Precision Ltd.",
      actualValue: "₹4,50,000",
      setOfMoulds: "Single mould",
      eligibility: "Pan India",
      perDayCharges: "₹1,800",
    },
    product: {
      productName: "28mm PET Bottle Cap",
      category: "Chair",
      dimensions: "28 × 28 × 14 mm",
      weight: "3.2 g",
      material: "HDPE",
      finish: "Matte",
    },
  },
};

export default function ListingReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const listing = LISTING_DETAILS[id];

  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  if (!listing) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundText}>Listing not found.</p>
        <Link href="/admin/listings" className={styles.notFoundLink}>
          ← Back to Listing Approvals
        </Link>
      </div>
    );
  }

  const handleApprove = () => {
    if (submitting) return;
    setSubmitting(true);
    // TODO: call approve-listing API with { listingId: id } — listing goes LIVE for customers
    router.push("/admin/listings");
  };

  const handleReject = () => {
    if (submitting) return;
    if (!remarks.trim()) {
      alert("Please add remarks explaining the rejection.");
      return;
    }
    setSubmitting(true);
    // TODO: call reject-listing API with { listingId: id, remarks }
    router.push("/admin/listings");
  };

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>
          {listing.mouldCode} · {listing.productName}
        </h1>
        <span className={styles.statusPill}>{listing.status}</span>
      </div>

      {/* ---------- Grid layout ---------- */}
      <div className={styles.layout}>
        {/* Media */}
        <div className={`${styles.card} ${styles.mediaArea}`}>
          <h2 className={styles.cardTitle}>Media (geo-tagged)</h2>
          <div className={styles.mediaGrid}>
            {listing.media.map((item, i) => (
              <button
                key={i}
                type="button"
                className={styles.mediaThumb}
                onClick={() => setActiveMedia(item)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.previewUrl} alt={item.label} className={styles.mediaThumbImg} />
                {item.type === "video" && <span className={styles.playIcon}>▶</span>}
                <span className={styles.mediaCaption}>
                  {item.label} ·{" "}
                  {item.type === "video" ? item.duration : `${item.coords?.lat.toFixed(2)}°N`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Decision panel */}
        <div className={styles.decisionArea}>
          <div className={styles.decisionCard}>
            <h2 className={styles.cardTitle}>Decision</h2>

            <label className={styles.fieldLabel}>Remarks (sent to owner)</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks if rejecting..."
              rows={4}
              className={styles.textarea}
            />

            <button
              type="button"
              onClick={handleApprove}
              disabled={submitting}
              className={`${styles.approveBtn} btn-primary`}
            >
              ✓ Approve Listing
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={submitting}
              className={styles.rejectBtn}
            >
              ✕ Reject with Remarks
            </button>
          </div>
        </div>

        {/* Technical stats */}
        <div className={`${styles.card} ${styles.techArea}`}>
          <h2 className={styles.cardTitle}>Technical Details</h2>
          <div className={styles.statsRow}>
            <div className={styles.statChip}>
              <span className={styles.statValue}>{listing.technical.tonnage}</span>
              <span className={styles.statLabel}>Tonnage</span>
            </div>
            <div className={styles.statChip}>
              <span className={styles.statValue}>{listing.technical.cavities}</span>
              <span className={styles.statLabel}>Cavity</span>
            </div>
            <div className={styles.statChip}>
              <span className={styles.statValue}>{listing.technical.steel}</span>
              <span className={styles.statLabel}>Steel</span>
            </div>
          </div>

          <Row label="Dimensions" value={listing.technical.dimensions} />
          <Row label="Weight" value={listing.technical.weight} />
          <Row label="Cycle Time" value={listing.technical.cycleTime} />
          <Row label="Hourly Production" value={listing.technical.hourlyProduction} />
          <Row label="Runner Type" value={listing.technical.runnerType} />
          <Row label="Cooling Temp" value={listing.technical.coolingTemp} />
          <Row label="Changeable Logo" value={listing.technical.changeableLogo} isLast />
        </div>

        {/* Full-width: General + Product details */}
        <div className={styles.detailsArea}>
          <div className={styles.detailsGrid}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>General Details</h2>
              <Row label="Mould Name / ID" value={listing.general.mouldNameOrId} />
              <Row label="Type" value={listing.general.mouldType} />
              <Row label="Condition" value={listing.general.condition} />
              <Row label="Year" value={listing.general.year} />
              <Row label="Manufacturer" value={listing.general.manufacturer} />
              <Row label="Actual Value" value={listing.general.actualValue} />
              <Row label="Set of Moulds" value={listing.general.setOfMoulds} />
              <Row label="Eligibility" value={listing.general.eligibility} />
              <Row label="Per Day Charges" value={listing.general.perDayCharges} isLast />
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Product Details</h2>
              <Row label="Product Name" value={listing.product.productName} />
              <Row label="Category" value={listing.product.category} />
              <Row label="Dimensions" value={listing.product.dimensions} />
              <Row label="Weight" value={listing.product.weight} />
              <Row label="Material" value={listing.product.material} />
              <Row label="Surface Finish" value={listing.product.finish} isLast />
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Owner</h2>
              <Row label="Firm Name" value={listing.owner} />
              <Row label="Mould ID" value={listing.mouldCode} isLast />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Media lightbox ---------- */}
      {activeMedia && (
        <div className={styles.lightboxOverlay} onClick={() => setActiveMedia(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.lightboxHeader}>
              <div>
                <h3 className={styles.lightboxTitle}>{activeMedia.label}</h3>
                {activeMedia.coords && (
                  <p className={styles.lightboxGeo}>
                    📍 {activeMedia.coords.lat.toFixed(4)}°N, {activeMedia.coords.lng.toFixed(4)}°E
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveMedia(null)}
                className={styles.lightboxCloseBtn}
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>
            <div className={styles.lightboxBody}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeMedia.previewUrl} alt={activeMedia.label} className={styles.lightboxImage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, isLast = false }: { label: string; value: string; isLast?: boolean }) {
  return (
    <div className={`${styles.detailRow} ${isLast ? styles.detailRowLast : ""}`}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}