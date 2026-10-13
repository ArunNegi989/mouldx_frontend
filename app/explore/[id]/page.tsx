"use client";

import { useMemo, useState, useRef, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMouldDetail } from "@/app/data/moulds";
import type { Dimensions, MouldInfo } from "@/app/data/moulds";
import styles from "./MouldDetail.module.css";

const formatDimensions = (d: Dimensions) =>
  `${d.length} × ${d.breadth} × ${d.height} mm`;

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mould = useMemo(() => getMouldDetail(id), [id]);

  // 0 = Product, 1..N = Component 1..N
  const [activeTab, setActiveTab] = useState(0);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

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

  const { product, components } = mould;
  const hasComponents = components.length > 0;
  const activeComponent = activeTab > 0 ? components[activeTab - 1] : null;

  const tabs = [
    { label: "Product" },
    ...components.map((_, i) => ({ label: `Component ${i + 1}` })),
  ];

  const photos = activeComponent ? activeComponent.photos : product.photos;
  const videos = activeComponent ? activeComponent.videos : product.videos;
  const galleryLabel = activeComponent ? activeComponent.componentName : product.productName;

  const media = [
    ...photos.map((src) => ({ type: "image" as const, src })),
    ...videos.map((src) => ({ type: "video" as const, src })),
  ];

  const safeMediaIndex = Math.min(activeMediaIndex, Math.max(media.length - 1, 0));
  const activeMedia = media[safeMediaIndex];

  const badgeClass =
    mould.availability === "2 LEFT" ? styles.badgeLow : styles.badgeBooked;
  const showAvailabilityBadge = mould.availability !== "FREE";
  const isCTADisabled = mould.availability === "BOOKED";

  const selectTab = (index: number) => {
    setActiveTab(index);
    setActiveMediaIndex(0);
  };

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
    if (deltaX > SWIPE_THRESHOLD) goToMedia(safeMediaIndex - 1);
    else if (deltaX < -SWIPE_THRESHOLD) goToMedia(safeMediaIndex + 1);
    touchStartX.current = null;
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* ---------- Gallery (changes with the selected tab) ---------- */}
        <div className={styles.gallery}>
          <div
            className={styles.galleryMain}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {activeMedia &&
              (activeMedia.type === "image" ? (
                <Image
                  key={`${activeTab}-${safeMediaIndex}`}
                  src={activeMedia.src}
                  alt={`${galleryLabel} photo ${safeMediaIndex + 1}`}
                  fill
                  className={styles.galleryImage}
                  priority
                />
              ) : (
                <div className={styles.galleryVideoWrap}>
                  <Image
                    key={`${activeTab}-${safeMediaIndex}`}
                    src={activeMedia.src}
                    alt={`${galleryLabel} video thumbnail`}
                    fill
                    className={styles.galleryImage}
                  />
                  <span className={styles.playIcon} aria-hidden>
                    ▶
                  </span>
                </div>
              ))}

            {media.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goToMedia(safeMediaIndex - 1)}
                  disabled={safeMediaIndex === 0}
                  className={`${styles.galleryNav} ${styles.galleryNavLeft}`}
                  aria-label="Previous media"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => goToMedia(safeMediaIndex + 1)}
                  disabled={safeMediaIndex === media.length - 1}
                  className={`${styles.galleryNav} ${styles.galleryNavRight}`}
                  aria-label="Next media"
                >
                  ›
                </button>
              </>
            )}

            {activeMedia && (
              <span className={styles.galleryCounter}>
                {activeMedia.type === "video" ? "Video" : "Photo"} · {safeMediaIndex + 1}/
                {media.length}
              </span>
            )}
          </div>

          {media.length > 1 && (
            <div className={styles.thumbStrip}>
              {media.map((item, index) => (
                <button
                  key={`${activeTab}-${item.type}-${index}`}
                  type="button"
                  onClick={() => goToMedia(index)}
                  className={`${styles.thumb} ${
                    index === safeMediaIndex ? styles.thumbActive : ""
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

        {/* ---------- Title + quick specs + price ---------- */}
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{mould.name}</h1>
        </div>

        <p className={styles.metaRow}>{mould.code}</p>

        <div className={styles.quickSpecs}>
          {mould.quickSpecs.map((spec) => (
            <div key={spec.label} className={styles.quickSpecCard}>
              <p className={styles.quickSpecValue}>{spec.value}</p>
              <p className={styles.quickSpecLabel}>{spec.label}</p>
            </div>
          ))}
        </div>

        <div className={styles.priceRow}>
          <p className={styles.priceValue}>
            {mould.price.split("/")[0]}
            <span className={styles.pricePeriod}> / day</span>
          </p>
          {showAvailabilityBadge && (
            <span className={`${styles.availabilityBadge} ${badgeClass}`}>
              {mould.availability}
            </span>
          )}
        </div>
        <div className={styles.depositRow}>
          <span className={styles.depositBadge}>{mould.deposit}</span>
        </div>

        {/* ---------- Tabs: Product + one tab per component ---------- */}
        {hasComponents && (
          <div className={styles.tabsRow} role="tablist">
            {tabs.map((tab, index) => (
              <button
                key={tab.label}
                type="button"
                role="tab"
                aria-selected={activeTab === index}
                onClick={() => selectTab(index)}
                className={`${styles.tabBtn} ${activeTab === index ? styles.tabBtnActive : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* ---------- Product tab ---------- */}
        {activeTab === 0 && (
          <>
            <Section key="product" title="Product Details">
              <Row label="Product Name" value={product.productName} />
              <Row label="Category" value={product.category} />
              <Row label="Sub Category" value={product.subCategory} />
              <Row label="Dimensions (L × B × H)" value={formatDimensions(product.dimensions)} />
              <Row label="Weight" value={product.weight} />
              <Row label="Material" value={product.material} />
              <Row label="Surface Finish" value={product.surfaceFinish} />
              <Row label="Per Day Rental Charges" value={product.perDayRentalCharges} />
              <Row label="Security Deposit Amount" value={product.securityDeposit} isLast />
            </Section>

            {/* Single mould: mould details follow the product details */}
            {!hasComponents && mould.mould && (
              <Section key="single-mould" title="Mould Details">
                <MouldRows info={mould.mould} />
              </Section>
            )}
          </>
        )}

        {/* ---------- Component tabs ---------- */}
        {activeComponent && (
          <>
            <Section key={`${activeComponent.id}-component`} title="Component Details">
              <Row label="Component Name" value={activeComponent.componentName} />
              <Row label="Dimensions (L × B × H)" value={formatDimensions(activeComponent.dimensions)} />
              <Row label="Weight" value={activeComponent.weight} />
              <Row label="Surface Finish" value={activeComponent.surfaceFinish} isLast />
            </Section>

            <Section key={`${activeComponent.id}-mould`} title="Mould Details">
              <MouldRows info={activeComponent.mould} />
            </Section>
          </>
        )}
      </div>

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

/* =====================================================================
   SMALL PIECES
===================================================================== */
function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.sectionHeader}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.sectionTitle}>{title}</span>
        <span
          className={`${styles.sectionChevron} ${open ? styles.sectionChevronOpen : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
}

function MouldRows({ info }: { info: MouldInfo }) {
  return (
    <>
      <Row label="Mould Name / ID" value={info.mouldNameOrId} />
      <Row label="Mould Type" value={info.mouldType} />
      <Row label="Year of Manufacturing" value={info.yearOfManufacturing} />
      <Row label="Dimensions (L × B × H)" value={formatDimensions(info.dimensions)} />
      <Row label="Weight" value={info.weight} />
      <Row label="No. of Cavities / Core" value={info.cavities} />
      <Row label="Expected Cycle Time (virgin material)" value={info.expectedCycleTime} />
      <Row label="Recommended Machine Tonnage" value={info.recommendedMachineTonnage} />
      <Row label="Hot Runner / Cold Runner" value={info.runnerType} />
      <Row label="Changeable Brand Logo" value={info.changeableBrandLogo} isLast />
    </>
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