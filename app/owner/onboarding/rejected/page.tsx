"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ProfileRejected.module.css";

// TEMP dummy data — real admin review API se aayega
const REJECTION = {
  remarks: "Please upload a clearer GST Certificate and the latest electricity bill.",
  documentsToFix: ["GST Certificate", "Electricity Bill (last month)"],
};

export default function ProfileRejectedPage() {
  const router = useRouter();

  const handleResubmit = () => {
    // TODO: prefill the form with previous data if available
    router.push("/owner/onboarding/profile");
  };

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <header className={styles.header}>
        <Link href="/owner/onboarding" className={styles.iconBtn} aria-label="Go back">
          ‹
        </Link>
        <span className={styles.brand}>
          Mould<span className={styles.brandAccent}>X</span>
        </span>
        <button type="button" className={styles.iconBtn} aria-label="Help">
          ?
        </button>
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>Profile rejected</h1>
        <p className={styles.subtitle}>Please review the admin remarks and resubmit.</p>

        {/* ---------- Admin remarks card ---------- */}
        <div className={styles.remarksCard}>
          <span className={styles.reviewPill}>REVIEW REQUIRED</span>
          <h2 className={styles.remarksTitle}>Admin Remarks</h2>
          <p className={styles.remarksText}>{REJECTION.remarks}</p>
        </div>

        {/* ---------- Documents to fix ---------- */}
        <div className={styles.docsCard}>
          <span className={styles.docsIcon} aria-hidden>
            !
          </span>
          <div>
            <p className={styles.docsTitle}>Documents to fix</p>
            <p className={styles.docsList}>{REJECTION.documentsToFix.join(" · ")}</p>
          </div>
        </div>
      </div>

      {/* ---------- Sticky actions ---------- */}
      <div className={styles.ctaBar}>
        <button type="button" onClick={handleResubmit} className={styles.resubmitBtn}>
          Resubmit Profile
        </button>
        <Link href="/inbox/admin-support" className={styles.supportBtn}>
          Contact Support
        </Link>
      </div>
    </div>
  );
}