import styles from "./Overview.module.css";

const STATS = [
  { label: "Total Users", value: "3,482", delta: "6.2% MoM", progress: 68 },
  { label: "Active Listings", value: "1,240", delta: "3.1% MoM", progress: 45 },
  { label: "Bookings (30D)", value: "642", delta: "11% MoM", progress: 82 },
  { label: "Revenue (30D)", value: "₹18.4L", delta: "8.7% MoM", progress: 74 },
];

const PENDING_ACTIONS = [
  { queue: "KYC Approvals", pending: 4, oldest: "2 days", action: "REVIEW", tone: "amber" },
  { queue: "Listing Approvals", pending: 7, oldest: "18 hrs", action: "REVIEW", tone: "amber" },
  { queue: "Booking Approvals", pending: 3, oldest: "4 hrs", action: "REVIEW", tone: "cyan" },
  { queue: "Damage Claims", pending: 2, oldest: "1 day", action: "URGENT", tone: "red" },
] as const;

const TOP_OWNERS = [
  { name: "Sharma Industries", moulds: 12, bookings: 38, revenue: "₹4.2L", initial: "S", gradient: "#2563eb" },
  { name: "Vector Molds", moulds: 9, bookings: 27, revenue: "₹3.1L", initial: "V", gradient: "#2563eb" },
  { name: "Precision Ltd.", moulds: 7, bookings: 21, revenue: "₹2.6L", initial: "P", gradient: "#2563eb" },
];

const RECENT_ACTIVITY = [
  { text: "Nova Plastics booking approved for MX-000123", time: "12 min ago", tone: "green" },
  { text: "Sharma Industries KYC submitted for review", time: "48 min ago", tone: "amber" },
  { text: "Damage claim raised on MX-000198 — ₹4,000", time: "2 hrs ago", tone: "red" },
  { text: "New owner signup: Precision Ltd.", time: "5 hrs ago", tone: "cyan" },
] as const;

const QUICK_ACTIONS = [
  { label: "Review KYC", icon: "🪪", href: "/admin/kyc" },
  { label: "Review Listings", icon: "▦", href: "/admin/listings" },
  { label: "Payouts", icon: "₹", href: "/admin/payments" },
  { label: "Broadcast", icon: "📣", href: "/admin/broadcast" },
];

export default function AdminOverviewPage() {
  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Platform Overview</h1>
          <p className={styles.subtitle}>Welcome back — here&apos;s what needs attention today.</p>
        </div>
        <span className={styles.livePill}>
          <span className={styles.liveDot} aria-hidden /> All systems live
        </span>
      </div>

      {/* ---------- Stat cards with progress bars ---------- */}
      <div className={styles.statsGrid}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <p className={styles.statValue}>{s.value}</p>
            <p className={styles.statLabel}>{s.label}</p>
            <p className={styles.statDelta}>▲ {s.delta}</p>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${s.progress}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Quick actions ---------- */}
      <div className={styles.quickActionsRow}>
        {QUICK_ACTIONS.map((a) => (
          <a key={a.label} href={a.href} className={styles.quickAction}>
            <span className={styles.quickActionIcon}>{a.icon}</span>
            <span className={styles.quickActionLabel}>{a.label}</span>
          </a>
        ))}
      </div>

      {/* ---------- Pending actions table ---------- */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Pending Actions</h2>
          <span className={styles.cardHeaderMeta}>{PENDING_ACTIONS.length} queues</span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Queue</th>
                <th>Pending</th>
                <th>Oldest</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {PENDING_ACTIONS.map((row) => (
                <tr key={row.queue}>
                  <td className={styles.queueCell}>{row.queue}</td>
                  <td>{row.pending}</td>
                  <td className={styles.mutedCell}>{row.oldest}</td>
                  <td className={styles.actionCell}>
                    <button
                      type="button"
                      className={`${styles.actionPill} ${
                        row.tone === "red"
                          ? styles.actionRed
                          : row.tone === "cyan"
                          ? styles.actionCyan
                          : styles.actionAmber
                      }`}
                    >
                      {row.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- Two-column layout: Top owners + Recent activity ---------- */}
      <div className={styles.twoColGrid}>
        {/* Top performing owners */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Top Performing Owners</h2>
            <a href="/admin/users" className={styles.cardHeaderLink}>
              View all →
            </a>
          </div>

          <div className={styles.ownersList}>
            {TOP_OWNERS.map((owner, i) => (
              <div key={owner.name} className={styles.ownerRow}>
                <span className={styles.ownerRank}>{i + 1}</span>
                <div className={styles.ownerAvatar} style={{ background: owner.gradient }}>
                  {owner.initial}
                </div>
                <div className={styles.ownerInfo}>
                  <p className={styles.ownerName}>{owner.name}</p>
                  <p className={styles.ownerMeta}>
                    {owner.moulds} moulds · {owner.bookings} bookings
                  </p>
                </div>
                <span className={styles.ownerRevenue}>{owner.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Recent Activity</h2>
          <div className={styles.activityList}>
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className={styles.activityRow}>
                <span
                  className={`${styles.activityDot} ${
                    item.tone === "green"
                      ? styles.dotGreen
                      : item.tone === "red"
                      ? styles.dotRed
                      : item.tone === "amber"
                      ? styles.dotAmber
                      : styles.dotCyan
                  }`}
                />
                <div>
                  <p className={styles.activityText}>{item.text}</p>
                  <p className={styles.activityTime}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}