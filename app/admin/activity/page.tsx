import styles from "./ActivityLog.module.css";

interface ActivityEntry {
  text: string;
  by: string;
  time: string;
  tone: "cyan" | "amber";
}

// TEMP dummy data — real activity-log API se aayega
const ACTIVITY: ActivityEntry[] = [
  {
    text: "KYC approved — Sharma Industries",
    by: "By admin@mouldx.com · 10:41 AM",
    time: "",
    tone: "cyan",
  },
  {
    text: "Listing MX-000123 approved",
    by: "By admin@mouldx.com · 10:12 AM",
    time: "",
    tone: "cyan",
  },
  {
    text: "Damage claim BK-24102 settled — ₹6,500 deducted",
    by: "By admin@mouldx.com · Yesterday, 5:02 PM",
    time: "",
    tone: "cyan",
  },
  {
    text: "Booking BK-24611 flagged for manual payment check",
    by: "Pending · Auto-flagged",
    time: "",
    tone: "amber",
  },
];

export default function ActivityLogPage() {
  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Admin Activity Log</h1>
        <span className={styles.pill}>LAST 24H</span>
      </div>

      {/* ---------- Timeline card ---------- */}
      <div className={styles.card}>
        {ACTIVITY.map((entry, i) => (
          <div key={i} className={`${styles.row} ${i < ACTIVITY.length - 1 ? styles.rowBorder : ""}`}>
            <span className={`${styles.dot} ${entry.tone === "amber" ? styles.dotAmber : styles.dotCyan}`} />
            <div>
              <p className={styles.text}>{entry.text}</p>
              <p className={styles.meta}>{entry.by}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}