"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./OwnerReviews.module.css";

const RATINGS = {
  // counts per star (5 → 1)
  counts: { 5: 27, 4: 4, 3: 1, 2: 0, 1: 0 } as Record<number, number>,
};

interface Review {
  id: string;
  customer: string;
  company: string;
  product: string;
  mould: string;
  rating: number;
  booking: string;
  comment: string;
  reviewedOn: string;
  image: string;
  ownerReply?: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: "r1",
    customer: "Rahul Sharma",
    company: "ABC Manufacturing Pvt. Ltd.",
    product: "Plastic Component",
    mould: "MX104",
    rating: 5,
    booking: "28 Sep 2026 · 5–8 Oct",
    comment: "Timely delivery and careful handling. Great experience!",
    reviewedOn: "8 Oct 2026",
    image: "https://picsum.photos/seed/mould-review-1/600/600",
  },
  {
    id: "r2",
    customer: "Nova Plastics",
    company: "Nova Plastics Pvt. Ltd.",
    product: "Bottle Cap",
    mould: "MX123",
    rating: 4,
    booking: "20 Sep 2026 · 22–26 Sep",
    comment: "Good product overall. Delivery coordination could be better.",
    reviewedOn: "6 Oct 2026",
    image: "https://picsum.photos/seed/mould-review-2/600/600",
  },
];

const MAX_REPLY = 500;

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className={styles.stars} style={{ fontSize: size }} aria-label={`${value} out of 5`}>
      <span className={styles.starsBase} aria-hidden>★★★★★</span>
      <span className={styles.starsFill} style={{ width: `${pct}%` }} aria-hidden>★★★★★</span>
    </span>
  );
}

function ReviewCard({
  review,
  onReply,
}: {
  review: Review;
  onReply: (id: string, text: string) => Promise<void>;
}) {
  const [imgError, setImgError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(review.ownerReply ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const openEditor = () => {
    setDraft(review.ownerReply ?? "");
    setError("");
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setError("");
  };

  const submit = async () => {
    const text = draft.trim();
    if (!text) return;
    try {
      setSaving(true);
      setError("");
      await onReply(review.id, text);
      setEditing(false);
    } catch {
      setError("Could not send your reply. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className={styles.reviewCard}>
      <div className={styles.reviewTop}>
        <div className={styles.reviewImageWrap}>
          {!imgError ? (
            <img
              src={review.image}
              alt={`Mould ${review.mould}`}
              className={styles.reviewImage}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={styles.reviewPlaceholder} aria-hidden>
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="10" r="1.5" />
                <path d="M21 16l-5-5-8 8" />
              </svg>
            </div>
          )}
        </div>

        <div className={styles.reviewInfo}>
          <h3 className={styles.reviewName}>{review.customer}</h3>
          <p className={styles.reviewCompany}>{review.company}</p>
          <p className={styles.reviewLine}>
            <strong>Product:</strong> {review.product}
          </p>
          <p className={styles.reviewLine}>
            <strong>Mould:</strong> {review.mould}
          </p>
          <div className={styles.reviewRating}>
            <Stars value={review.rating} />
            <span className={styles.reviewRatingNum}>{review.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      <p className={styles.booking}>
        <span aria-hidden>🗓</span> Booking: {review.booking}
      </p>
      <p className={styles.comment}>“{review.comment}”</p>
      <p className={styles.reviewedOn}>Reviewed {review.reviewedOn}</p>

      {/* ---------- Owner reply ---------- */}
      {review.ownerReply && !editing && (
        <div className={styles.replyBox}>
          <div className={styles.replyHead}>
            <span className={styles.replyLabel}>Your reply</span>
            <button type="button" className={styles.replyEdit} onClick={openEditor}>
              Edit
            </button>
          </div>
          <p className={styles.replyText}>{review.ownerReply}</p>
        </div>
      )}

      {editing ? (
        <div className={styles.replyForm}>
          <textarea
            className={styles.replyInput}
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX_REPLY))}
            placeholder={`Reply to ${review.customer}…`}
            rows={4}
            autoFocus
          />
          <div className={styles.replyFormMeta}>
            <span className={styles.replyError}>{error}</span>
            <span className={styles.replyCount}>
              {draft.length}/{MAX_REPLY}
            </span>
          </div>
          <div className={styles.replyActions}>
            <button type="button" className={styles.replyCancel} onClick={cancel} disabled={saving}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.replySend}
              onClick={submit}
              disabled={saving || !draft.trim()}
            >
              {saving ? "Sending…" : review.ownerReply ? "Update reply" : "Send reply"}
            </button>
          </div>
        </div>
      ) : (
        !review.ownerReply && (
          <button type="button" className={styles.replyButton} onClick={openEditor}>
            Reply to review
          </button>
        )
      )}
    </article>
  );
}

export default function OwnerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const total = Object.values(RATINGS.counts).reduce((a, b) => a + b, 0);
  const sum = Object.entries(RATINGS.counts).reduce((a, [star, c]) => a + Number(star) * c, 0);
  const average = total ? sum / total : 0;

  // TODO: replace with your API call, e.g.
  // await fetch(`/api/owner/reviews/${id}/reply`, { method: "POST", body: JSON.stringify({ text }) });
  const handleReply = async (id: string, text: string) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ownerReply: text } : r)));
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
        
          <h1 className={styles.title}>Your Ratings</h1>
        </header>

        <section className={styles.summary}>
          <p className={styles.summaryLabel}>Overall rating</p>
          <div className={styles.summaryRow}>
            <span className={styles.summaryValue}>{average.toFixed(1)}</span>
            <div>
              <Stars value={average} size={18} />
              <p className={styles.summaryMeta}>Based on {total} reviews</p>
            </div>
          </div>

          <div className={styles.bars}>
            {[5, 4, 3, 2, 1].map((star) => {
              const pct = total ? Math.round((RATINGS.counts[star] / total) * 100) : 0;
              return (
                <div key={star} className={styles.barRow}>
                  <span className={styles.barLabel}>{star} ★</span>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={styles.barPercent}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </section>

        <h2 className={styles.sectionTitle}>Recent Reviews</h2>

        <div className={styles.reviewList}>
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} onReply={handleReply} />
          ))}
        </div>
      </div>
    </div>
  );
}