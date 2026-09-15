"use client";

import { useMemo, useState, useRef, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMouldDetail } from "@/app/data/moulds";
import styles from "./MouldDetailsFull.module.css";

// TEMP mapping — booking ID se mould ID nikalne ke liye
// real API mein booking record se hi mouldId aa jayega, ye lookup zaroori nahi hoga
const BOOKING_TO_MOULD_ID: Record<string, string> = {
  "BK-24581": "1",
  "BK-24512": "2",
};

export default function ReceivedMouldDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: bookingId } = use(params);
  const mouldId = BOOKING_TO_MOULD_ID[bookingId] ?? "1";
  const mould = useMemo(() => getMouldDetail(mouldId), [mouldId]);

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (!mould) {
    return (
      <div className={styles.notFoundWrap}>
        <p className={styles.notFoundText}>Mould details not found.</p>
        <Link href={`/bookings/${bookingId}`} className={styles.notFoundLink}>
          ← Back to Booking
        </Link>
      </div>
    );
  }

  const media = [
    ...mould.photos.map((src) => ({ type: "image" as const, src })),
    ...mould.videos.map((src) => ({ type: "video" as const, src })),
  ];
  const activeMedia = media[activeMediaIndex];

  const goToMedia = (index: number) => {
    if (index < 0 || index >= media.length) return;
    setActiveMediaIndex(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 40) goToMedia(activeMediaIndex - 1);
    else if (deltaX < -40) goToMedia(activeMediaIndex + 1);
    touchStartX.current = null;
  };

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <header className={styles.header}>
        <Link href={`/bookings/${bookingId}`} className={styles.iconBtn} aria-label="Go back">
          ←
        </Link>
        <span className={styles.brand}>
          Mould<span className={styles.brandAccent}>X</span>
        </span>
        <span className={styles.headerSpacer} aria-hidden />
      </header>

      <div className={styles.content}>
        {/* ---------- Received banner ---------- */}
        <div className={styles.receivedBanner}>
          <span className={styles.receivedIcon} aria-hidden>✓</span>
          <div>
            <p className={styles.receivedTitle}>Mould received</p>
            <p className={styles.receivedSubtitle}>
              Here are the full specifications for your reference during the rental.
            </p>
          </div>
        </div>

        {/* ---------- Media gallery ---------- */}
        <div className={styles.gallery}>
          <div
            className={styles.galleryMain}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {activeMedia.type === "image" ? (
              <Image
                src={activeMedia.src}
                alt={`${mould.name} photo ${activeMediaIndex + 1}`}
                fill
                className={styles.galleryImage}
                priority
              />
            ) : (
              <div className={styles.galleryVideoWrap}>
                <Image
                  src={activeMedia.src}
                  alt={`${mould.name} video thumbnail`}
                  fill
                  className={styles.galleryImage}
                />
                <span className={styles.playIcon} aria-hidden>▶</span>
              </div>
            )}

            {media.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goToMedia(activeMediaIndex - 1)}
                  disabled={activeMediaIndex === 0}
                  className={`${styles.galleryNav} ${styles.galleryNavLeft}`}
                  aria-label="Previous media"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => goToMedia(activeMediaIndex + 1)}
                  disabled={activeMediaIndex === media.length - 1}
                  className={`${styles.galleryNav} ${styles.galleryNavRight}`}
                  aria-label="Next media"
                >
                  ›
                </button>
              </>
            )}

            <span className={styles.galleryCounter}>
              {activeMedia.type === "video" ? "Video" : "Photo"} · {activeMediaIndex + 1}/{media.length}
            </span>
          </div>

          {media.length > 1 && (
            <div className={styles.thumbStrip}>
              {media.map((item, index) => (
                <button
                  key={`${item.type}-${index}`}
                  type="button"
                  onClick={() => goToMedia(index)}
                  className={`${styles.thumb} ${index === activeMediaIndex ? styles.thumbActive : ""}`}
                  aria-label={`View ${item.type} ${index + 1}`}
                >
                  <Image src={item.src} alt="" fill className={styles.thumbImage} />
                  {item.type === "video" && <span className={styles.thumbPlay}>▶</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Title ---------- */}
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{mould.name}</h1>
        </div>
        <p className={styles.metaRow}>
          {mould.code} · Owned by {mould.owner}
          {mould.verified && <span className={styles.verifiedTag}> ✓ Verified</span>}
        </p>

        {/* ---------- General details ---------- */}
        <h2 className={styles.sectionHeading}>Mould Details (General)</h2>
        <div className={styles.detailsCard}>
          <Row label="Mould Name / ID" value={mould.general.mouldNameOrId} />
          <Row label="Mould Type" value={mould.general.mouldType} />
          <Row label="Mould Condition" value={mould.general.mouldCondition} />
          <Row label="Year of Manufacturing" value={mould.general.yearOfManufacturing} />
          <Row label="Mould Manufacturer" value={mould.general.mouldManufacturer} />
          <Row label="Mould Invoice" value={mould.general.mouldInvoice} />
          <Row label="Mould Actual Value" value={mould.general.mouldActualValue} />
          <Row label="Set of Moulds Involved" value={mould.general.setOfMouldsInvolved} />
          <Row label="Sales / State Eligibility" value={mould.general.salesStateEligibility} />
          <Row label="Per Day Rental Charges" value={mould.general.perDayRentalCharges} isLast />
        </div>

        {/* ---------- Technical details ---------- */}
        <h2 className={styles.sectionHeading}>Mould Details (Technical)</h2>
        <div className={styles.detailsCard}>
          <Row
            label="Dimensions (L × B × H)"
            value={`${mould.technical.dimensions.length} × ${mould.technical.dimensions.breadth} × ${mould.technical.dimensions.height} mm`}
          />
          <Row label="Weight" value={mould.technical.weight} />
          <Row label="No. of Cavities / Core" value={mould.technical.cavities} />
          <Row label="Expected Cycle Time (virgin material)" value={mould.technical.expectedCycleTime} />
          <Row label="Estimated Hourly Production" value={mould.technical.estimatedHourlyProduction} />
          <Row label="Recommended Machine Tonnage" value={mould.technical.recommendedMachineTonnage} />
          <Row label="Max. Injection Volume Required" value={mould.technical.maxInjectionVolume} />
          <Row label="Hot Runner / Cold Runner" value={mould.technical.runnerType} />
          <Row label="Recommended Cooling Water Temperature" value={mould.technical.recommendedCoolingWaterTemp} />
          <Row label="Changeable Brand Logo" value={mould.technical.changeableBrandLogo} isLast />
        </div>

        {/* ---------- Product details ---------- */}
        <h2 className={styles.sectionHeading}>Product Details</h2>
        <div className={styles.detailsCard}>
          <Row label="Product Name" value={mould.product.productName} />
          <Row label="Category" value={mould.product.category} />
          <Row
            label="Dimensions (L × B × H)"
            value={`${mould.product.dimensions.length} × ${mould.product.dimensions.breadth} × ${mould.product.dimensions.height} mm`}
          />
          <Row label="Weight" value={mould.product.weight} />
          <Row label="Material" value={mould.product.material} />
          <Row label="Surface Finish" value={mould.product.surfaceFinish} isLast />
        </div>
      </div>

      {/* ---------- Sticky CTA ---------- */}
      <div className={styles.ctaBar}>
        <Link href={`/bookings/${bookingId}`} className={styles.ctaBtn}>
          Back to Booking
        </Link>
      </div>
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