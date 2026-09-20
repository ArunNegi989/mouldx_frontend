// app/explore/[id]/page.tsx
"use client";

import { useMemo, useState, useRef, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMouldDetail } from "@/app/data/moulds";
import styles from "./MouldDetail.module.css";
import logo from "@/public/images/logo.png"; // ⚠️ apna actual logo path daalo

type TabKey = "general" | "technical" | "product";

const TABS: { key: TabKey; label: string }[] = [
  { key: "general", label: "General" },
  { key: "technical", label: "Technical" },
  { key: "product", label: "Product" },
];

export default function MouldDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mould = useMemo(() => getMouldDetail(id), [id]);

  const [activeTab, setActiveTab] = useState<TabKey>("technical");
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Touch-swipe support for the gallery
  const touchStartX = useRef<number | null>(null);

  if (!mould) {
    return (
      <div className={styles.notFoundWrap}>
        <p className={styles.notFoundText}>Mould not found.</p>
        <Link href="/explore" className={styles.notFoundLink}>
          ← Back to Explore
        </Link>
      </div>
    );
  }

  // Combine photos + videos into one gallery, videos tagged so we can show a play icon
  const media = [
    ...mould.photos.map((src) => ({ type: "image" as const, src })),
    ...mould.videos.map((src) => ({ type: "video" as const, src })),
  ];

  const badgeClass =
    mould.availability === "FREE"
      ? styles.badgeFree
      : mould.availability === "2 LEFT"
      ? styles.badgeLow
      : styles.badgeBooked;

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
    const SWIPE_THRESHOLD = 40;
    if (deltaX > SWIPE_THRESHOLD) goToMedia(activeMediaIndex - 1);
    else if (deltaX < -SWIPE_THRESHOLD) goToMedia(activeMediaIndex + 1);
    touchStartX.current = null;
  };

  const activeMedia = media[activeMediaIndex];
  const isCTADisabled = mould.availability === "BOOKED";

  return (
    <div className={styles.page}>
     
     {/* ---------- Sticky header ---------- */}
<header className={styles.header}>
  <Link href="/explore" className={styles.iconBtn} aria-label="Go back">
    ←
  </Link>

  <div className="relative w-[90px] h-[26px] shrink-0">
    <Image
      src={logo}
      alt="MouldX"
      fill
      sizes="90px"
      className="object-contain"
      priority
    />
  </div>

  <span className={styles.headerSpacer} aria-hidden />
</header>

      <div className={styles.content}>
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
                <span className={styles.playIcon} aria-hidden>
                  ▶
                </span>
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
              {activeMedia.type === "video" ? "Video" : "Photo"} · {activeMediaIndex + 1}/
              {media.length}
            </span>
          </div>

          {media.length > 1 && (
            <div className={styles.thumbStrip}>
              {media.map((item, index) => (
                <button
                  key={`${item.type}-${index}`}
                  type="button"
                  onClick={() => goToMedia(index)}
                  className={`${styles.thumb} ${
                    index === activeMediaIndex ? styles.thumbActive : ""
                  }`}
                  aria-label={`View ${item.type} ${index + 1}`}
                >
                  <Image src={item.src} alt="" fill className={styles.thumbImage} />
                  {item.type === "video" && <span className={styles.thumbPlay}>▶</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Title + status ---------- */}
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{mould.name}</h1>
          <span className={styles.statusBadge}>{mould.status}</span>
        </div>

        <p className={styles.metaRow}>
          {mould.code} · Owned by {mould.owner}
          {mould.verified && <span className={styles.verifiedTag}> ✓ Verified</span>}
        </p>

        {/* ---------- Quick specs ---------- */}
        <div className={styles.quickSpecs}>
          {mould.quickSpecs.map((spec) => (
            <div key={spec.label} className={styles.quickSpecCard}>
              <p className={styles.quickSpecValue}>{spec.value}</p>
              <p className={styles.quickSpecLabel}>{spec.label}</p>
            </div>
          ))}
        </div>

        {/* ---------- Price row ---------- */}
        <div className={styles.priceRow}>
          <p className={styles.priceValue}>
            {mould.price.split("/")[0]}
            <span className={styles.pricePeriod}> / day</span>
          </p>
          <span className={`${styles.availabilityBadge} ${badgeClass}`}>
            {mould.availability}
          </span>
        </div>
        <div className={styles.depositRow}>
          <span className={styles.depositBadge}>{mould.deposit}</span>
        </div>

        {/* ---------- Tabs ---------- */}
        <div className={styles.tabsRow}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ---------- Tab content ---------- */}
        <div className={styles.detailsCard}>
          {activeTab === "general" && (
            <>
              <Row label="Mould Name / ID" value={mould.general.mouldNameOrId} />
              <Row label="Mould Type" value={mould.general.mouldType} />
              <Row label="Mould Condition" value={mould.general.mouldCondition} />
              <Row label="Year of Manufacturing" value={mould.general.yearOfManufacturing} />
              <Row label="Mould Manufacturer" value={mould.general.mouldManufacturer} />
              <Row label="Mould Invoice" value={mould.general.mouldInvoice} />
              <Row label="Mould Actual Value" value={mould.general.mouldActualValue} />
              <Row label="Set of Moulds Involved" value={mould.general.setOfMouldsInvolved} />
              <Row label="Sales / State Eligibility" value={mould.general.salesStateEligibility} />
              <Row
                label="Per Day Rental Charges"
                value={mould.general.perDayRentalCharges}
                isLast
              />
            </>
          )}

          {activeTab === "technical" && (
            <>
              <Row
                label="Dimensions (L × B × H)"
                value={`${mould.technical.dimensions.length} × ${mould.technical.dimensions.breadth} × ${mould.technical.dimensions.height} mm`}
              />
              <Row label="Weight" value={mould.technical.weight} />
              <Row label="No. of Cavities / Core" value={mould.technical.cavities} />
              <Row
                label="Expected Cycle Time (virgin material)"
                value={mould.technical.expectedCycleTime}
              />
              <Row
                label="Estimated Hourly Production"
                value={mould.technical.estimatedHourlyProduction}
              />
              <Row
                label="Recommended Machine Tonnage"
                value={mould.technical.recommendedMachineTonnage}
              />
              <Row
                label="Max. Injection Volume Required"
                value={mould.technical.maxInjectionVolume}
              />
              <Row label="Runner Type" value={mould.technical.runnerType} />
              <Row
                label="Recommended Cooling Water Temperature"
                value={mould.technical.recommendedCoolingWaterTemp}
              />
              <Row
                label="Changeable Brand Logo"
                value={mould.technical.changeableBrandLogo}
                isLast
              />
            </>
          )}

          {activeTab === "product" && (
            <>
              <Row label="Product Name" value={mould.product.productName} />
              <Row label="Category" value={mould.product.category} />
              <Row
                label="Dimensions (L × B × H)"
                value={`${mould.product.dimensions.length} × ${mould.product.dimensions.breadth} × ${mould.product.dimensions.height} mm`}
              />
              <Row label="Weight" value={mould.product.weight} />
              <Row label="Material" value={mould.product.material} />
              <Row label="Surface Finish" value={mould.product.surfaceFinish} isLast />
            </>
          )}
        </div>
      </div>

      {/* ---------- Sticky bottom CTA ---------- */}
      {/* ---------- Sticky bottom CTA ---------- */}
<div className={styles.ctaBar}>
  {isCTADisabled ? (
    <button type="button" disabled className={styles.ctaBtn}>
      Currently Booked
    </button>
  ) : (
    <Link
      href={`/explore/${id}/dates`}
      className={`${styles.ctaBtn} flex items-center justify-center no-underline btn-primary`}
    >
      Select Dates →
    </Link>
  )}
</div>
    </div>
  );
}

function Row({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div className={`${styles.detailRow} ${isLast ? styles.detailRowLast : ""}`}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}