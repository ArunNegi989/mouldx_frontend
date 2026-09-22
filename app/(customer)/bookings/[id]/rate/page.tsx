"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Rate.module.css";

const OWNER_NAME = "Sharma Industries";
const OWNER_INITIAL = OWNER_NAME.charAt(0);

function StarRow({
  value,
  onChange,
  size = "lg",
}: {
  value: number;
  onChange: (v: number) => void;
  size?: "lg" | "sm";
}) {
  return (
    <div className={size === "lg" ? styles.starsLg : styles.starsSm}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={styles.starBtn}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <span className={n <= value ? styles.starFilled : styles.starEmpty}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export default function RatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [ownerRating, setOwnerRating] = useState(5);
  const [conditionRating, setConditionRating] = useState(4);
  const [review, setReview] = useState("");

  const canSubmit = ownerRating > 0 && conditionRating > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO: POST { ownerRating, conditionRating, review } to API
    router.push(`/bookings/${id}`);
  };

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <header className={styles.header}>
        <Link href={`/bookings/${id}`} className={styles.iconBtn} aria-label="Go back">
          ←
        </Link>
        <span className={styles.brand}>
          Mould<span className={styles.brandAccent}>X</span>
        </span>
        <button type="button" className={styles.iconBtn} aria-label="Help">
          ?
        </button>
      </header>

      <div className={styles.content}>
        {/* ---------- Owner avatar + rating ---------- */}
        <div className={styles.ownerBlock}>
          <div className={styles.avatar}>{OWNER_INITIAL}</div>
          <h1 className={styles.title}>Rate {OWNER_NAME}</h1>
          <StarRow value={ownerRating} onChange={setOwnerRating} size="lg" />
        </div>

        {/* ---------- Review ---------- */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Add a review</h2>
          <textarea
            className={styles.textarea}
            placeholder="Mould was in great condition, dispatch was on time…"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={3}
          />
        </div>

        {/* ---------- Condition rating ---------- */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Rate the mould condition</h2>
          <StarRow value={conditionRating} onChange={setConditionRating} size="sm" />
        </div>
      </div>

      {/* ---------- Sticky submit ---------- */}
      <div className={styles.ctaBar}>
        <button
          type="button"
          className={`${styles.ctaBtn} btn-primary`}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}