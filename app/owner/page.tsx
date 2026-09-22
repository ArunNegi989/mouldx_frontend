"use client";

import Link from "next/link";
import styles from "./OwnerHome.module.css";

const OWNER = {
  name: "Rohit",
  earningsMonth: "SEP",
  totalEarnings: 248500,
  vsLastMonth: 18.4,
  utilization: 72,
  totalMoulds: 8,
  available: 3,
  rented: 4,
  maintenance: 1,
  actionRequiredCount: 3,
  bookingRequests: [
    { id: "1", mouldCode: "MX-000123", customerName: "Nova Plastics" },
  ],
  rating: 4.8,
  reviewCount: 32,
  upcoming: [
    { id: "u1", type: "Pickup", mouldCode: "MX-000198", customer: "Vector Molds", date: "18 Sep" },
    { id: "u2", type: "Return", mouldCode: "MX-000077", customer: "Sharma Industries", date: "20 Sep" },
  ],
  activity: [
    { id: "a1", text: "Payout of ₹12,600 credited to your account", time: "2h ago" },
    { id: "a2", text: "Nova Plastics requested to book MX-000123", time: "5h ago" },
    { id: "a3", text: "MX-000045 returned in good condition", time: "1d ago" },
  ],
};

export default function OwnerHomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Good morning, {OWNER.name}</h1>
        <p className={styles.subtitle}>Your MouldX business at a glance.</p>

        {/* ---------- Earnings hero card ---------- */}
        <div className={styles.earningsCard}>
          <span className={styles.earningsPill}>TOTAL EARNINGS · {OWNER.earningsMonth}</span>
          <p className={styles.earningsValue}>₹{OWNER.totalEarnings.toLocaleString("en-IN")}</p>
          <p className={styles.earningsDelta}>↑ {OWNER.vsLastMonth}% vs last month</p>
        </div>

        {/* ---------- Quick actions ---------- */}
        <div className={styles.quickActions}>
          <Link href="/owner/moulds/new" className={styles.quickAction}>
            <span className={styles.quickActionIcon} aria-hidden>➕</span>
            <span className={styles.quickActionLabel}>List a Mould</span>
          </Link>
          <Link href="/owner/bookings" className={styles.quickAction}>
            <span className={styles.quickActionIcon} aria-hidden>📋</span>
            <span className={styles.quickActionLabel}>Bookings</span>
          </Link>
          <Link href="/owner/earnings" className={styles.quickAction}>
            <span className={styles.quickActionIcon} aria-hidden>💸</span>
            <span className={styles.quickActionLabel}>Withdraw</span>
          </Link>
          <Link href="/owner/moulds" className={styles.quickAction}>
            <span className={styles.quickActionIcon} aria-hidden>🗂️</span>
            <span className={styles.quickActionLabel}>My Moulds</span>
          </Link>
        </div>

        {/* ---------- Mould utilization ---------- */}
        <div className={styles.card}>
          <div className={styles.utilizationHeader}>
            <h2 className={styles.cardTitle}>Mould Utilization</h2>
            <span className={styles.utilizationPercent}>{OWNER.utilization}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${OWNER.utilization}%` }} />
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statChip}>
              <span className={styles.statValue}>{String(OWNER.totalMoulds).padStart(2, "0")}</span>
              <span className={styles.statLabel}>Total Moulds</span>
            </div>
            <div className={styles.statChip}>
              <span className={`${styles.statValue} ${styles.statValueGreen}`}>
                {String(OWNER.available).padStart(2, "0")}
              </span>
              <span className={styles.statLabel}>Available</span>
            </div>
            <div className={styles.statChip}>
              <span className={`${styles.statValue} ${styles.statValueAmber}`}>
                {String(OWNER.rented).padStart(2, "0")}
              </span>
              <span className={styles.statLabel}>Rented</span>
            </div>
            <div className={styles.statChip}>
              <span className={`${styles.statValue} ${styles.statValueRed}`}>
                {String(OWNER.maintenance).padStart(2, "0")}
              </span>
              <span className={styles.statLabel}>Maintenance</span>
            </div>
          </div>
        </div>

        {/* ---------- Rating summary ---------- */}
        <Link href="/owner/reviews" className={styles.ratingCard}>
          <div>
            <p className={styles.ratingLabel}>Your Rating</p>
            <div className={styles.ratingRow}>
              <span className={styles.ratingValue}>{OWNER.rating.toFixed(1)}</span>
              <span className={styles.ratingStars} aria-hidden>★★★★★</span>
            </div>
            <p className={styles.ratingMeta}>Based on {OWNER.reviewCount} reviews</p>
          </div>
          <span className={styles.ratingArrow} aria-hidden>→</span>
        </Link>

        {/* ---------- Action required ---------- */}
        <div className={styles.actionHeader}>
          <h2 className={styles.actionTitle}>Action Required</h2>
          {OWNER.actionRequiredCount > 0 && (
            <span className={styles.actionBadge}>{OWNER.actionRequiredCount}</span>
          )}
        </div>

        {OWNER.bookingRequests.map((req) => (
          <Link key={req.id} href={`/owner/bookings/${req.id}`} className={styles.requestCard}>
            <span className={styles.requestIcon} aria-hidden>!</span>
            <div className="min-w-0 flex-1">
              <p className={styles.requestTitle}>New Booking Request</p>
              <p className={styles.requestMeta}>
                {req.mouldCode} · {req.customerName}
              </p>
            </div>
            <span className={styles.newPill}>NEW</span>
          </Link>
        ))}

        {/* ---------- Upcoming pickups / returns ---------- */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.actionTitle}>Upcoming</h2>
          <Link href="/owner/bookings" className={styles.sectionLink}>
            View all →
          </Link>
        </div>

        <div className={styles.card}>
          {OWNER.upcoming.map((item, i) => (
            <div
              key={item.id}
              className={`${styles.upcomingRow} ${i < OWNER.upcoming.length - 1 ? styles.upcomingRowBorder : ""}`}
            >
              <span
                className={`${styles.upcomingTag} ${
                  item.type === "Pickup" ? styles.upcomingTagPickup : styles.upcomingTagReturn
                }`}
              >
                {item.type}
              </span>
              <div className="min-w-0 flex-1">
                <p className={styles.upcomingTitle}>
                  {item.mouldCode} · {item.customer}
                </p>
              </div>
              <span className={styles.upcomingDate}>{item.date}</span>
            </div>
          ))}
        </div>

        {/* ---------- Recent activity ---------- */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.actionTitle}>Recent Activity</h2>
        </div>

        <div className={styles.card}>
          {OWNER.activity.map((item, i) => (
            <div
              key={item.id}
              className={`${styles.activityRow} ${i < OWNER.activity.length - 1 ? styles.upcomingRowBorder : ""}`}
            >
              <span className={styles.activityDot} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className={styles.activityText}>{item.text}</p>
                <p className={styles.activityTime}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}