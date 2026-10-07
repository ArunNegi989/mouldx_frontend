"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ProfileRejected.module.css";

// TEMP dummy data — will come from the real admin review API
const REJECTION = {
  remarks: "Please upload a clearer ID document photo.",
  documentsToFix: ["ID Document"],
};

export default function CustomerProfileRejectedPage() {
  const router = useRouter();

  const handleResubmit = () => {
    // TODO: prefill the form with previous data if available
    router.push("/onboarding/profile");
  };

  return (
    <div className={styles.page}>
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
        <button type="button" onClick={handleResubmit} className={`${styles.resubmitBtn} btn-primary`}>
          Resubmit Profile
        </button>
        <Link href="/inbox/admin-support" className={styles.supportBtn}>
          Contact Support
        </Link>
      </div>
    </div>
  );
}