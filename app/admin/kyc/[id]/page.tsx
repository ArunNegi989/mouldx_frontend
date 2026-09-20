"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./KycReviewDetail.module.css";

interface KycDetail {
  id: string;
  status: "PENDING REVIEW" | "RESUBMITTED" | "APPROVED" | "REJECTED";
  personal: {
    name: string;
    phone: string;
    emailPoc: string;
  };
  firm: {
    pan: string;
    firmEmail: string;
    firmName: string;
    address: string;
    gstNo: string;
    msmeNo: string;
  };
  payout: {
    bankAccount: string;
    ifsc: string;
    accountHolder: string;
    bankName: string;
    upiId: string;
  };
  documents: { label: string; fileName: string; previewUrl: string }[];
}

// TEMP dummy data — real owner-onboarding API se aayega
const KYC_DETAILS: Record<string, KycDetail> = {
  "1": {
    id: "1",
    status: "PENDING REVIEW",
    personal: {
      name: "Rohit Sharma",
      phone: "+91 98XXXXXX10",
      emailPoc: "rohit@sharmaind.com",
    },
    firm: {
      pan: "ABCDE1234F",
      firmEmail: "info@sharmaind.com",
      firmName: "Sharma Industries",
      address: "Plot 12, MIDC Industrial Area, Pune, Maharashtra 411019",
      gstNo: "27ABCDE1234F1Z5",
      msmeNo: "UDYAM-MH-03-1122334",
    },
    payout: {
      bankAccount: "•••• •••• 4021",
      ifsc: "HDFC0001234",
      accountHolder: "Rohit Sharma",
      bankName: "HDFC Bank",
      upiId: "rohit@hdfcbank",
    },
    documents: [
      { label: "PAN Card", fileName: "pan_card.pdf", previewUrl: "https://picsum.photos/seed/pan/900/600" },
      { label: "GST Certificate", fileName: "gst_certificate.pdf", previewUrl: "https://picsum.photos/seed/gst/900/600" },
      { label: "Electricity Bill", fileName: "electricity_bill.pdf", previewUrl: "https://picsum.photos/seed/eb/900/600" },
    ],
  },
};

export default function KycReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const kyc = KYC_DETAILS[id];

  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeDoc, setActiveDoc] = useState<{ label: string; previewUrl: string } | null>(null);

  if (!kyc) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundText}>KYC request not found.</p>
        <Link href="/admin/kyc" className={styles.notFoundLink}>
          ← Back to KYC Approvals
        </Link>
      </div>
    );
  }

  const handleApprove = () => {
    if (submitting) return;
    setSubmitting(true);
    // TODO: call approve-kyc API with { ownerId: id }
    router.push("/admin/kyc");
  };

  const handleReject = () => {
    if (submitting) return;
    if (!remarks.trim()) {
      alert("Please add remarks explaining the rejection.");
      return;
    }
    setSubmitting(true);
    // TODO: call reject-kyc API with { ownerId: id, remarks }
    router.push("/admin/kyc");
  };

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <div className={styles.headerRow}>
        <div className="min-w-0">
          <h1 className={styles.title}>
            {kyc.personal.name} · {kyc.firm.firmName}
          </h1>
        </div>
        <span className={styles.statusPill}>{kyc.status}</span>
      </div>

      {/* ---------- Grid layout: Documents | Decision — then Details spans full width ---------- */}
      <div className={styles.layout}>
        {/* Documents */}
        <div className={`${styles.card} ${styles.docsArea}`}>
          <h2 className={styles.cardTitle}>Submitted Documents</h2>
          <div className={styles.docsGrid}>
            {kyc.documents.map((doc) => (
              <button
                key={doc.label}
                type="button"
                className={styles.docThumb}
                onClick={() => setActiveDoc(doc)}
              >
                <span className={styles.docIcon} aria-hidden>
                  📄
                </span>
                <span className={styles.docLabel}>{doc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Decision panel */}
        <div className={styles.decisionArea}>
          <div className={styles.decisionCard}>
            <h2 className={styles.cardTitle}>Decision</h2>

            <label className={styles.fieldLabel}>Remarks (sent to owner)</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks if rejecting..."
              rows={4}
              className={styles.textarea}
            />

            <button
              type="button"
              onClick={handleApprove}
              disabled={submitting}
              className={styles.approveBtn}
            >
              ✓ Approve KYC
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={submitting}
              className={styles.rejectBtn}
            >
              ✕ Reject with Remarks
            </button>
          </div>
        </div>

        {/* Personal / Firm / Payout — full width row */}
        <div className={styles.detailsArea}>
          <div className={styles.detailsGrid}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Personal Details</h2>
              <Row label="Name" value={kyc.personal.name} />
              <Row label="Phone No." value={kyc.personal.phone} />
              <Row label="Email ID – POC" value={kyc.personal.emailPoc} isLast />
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Firm Details</h2>
              <Row label="PAN" value={kyc.firm.pan} />
              <Row label="Email ID" value={kyc.firm.firmEmail} />
              <Row label="Firm Name" value={kyc.firm.firmName} />
              <Row label="Address" value={kyc.firm.address} />
              <Row label="GST No." value={kyc.firm.gstNo} />
              <Row label="MSME No." value={kyc.firm.msmeNo} isLast />
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Payout Details</h2>
              <Row label="Bank A/C No." value={kyc.payout.bankAccount} />
              <Row label="IFSC Code" value={kyc.payout.ifsc} />
              <Row label="Account Holder" value={kyc.payout.accountHolder} />
              <Row label="Bank Name" value={kyc.payout.bankName} />
              <Row label="UPI ID" value={kyc.payout.upiId} isLast />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Document preview modal ---------- */}
      {activeDoc && (
        <div className={styles.modalOverlay} onClick={() => setActiveDoc(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{activeDoc.label}</h3>
              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                className={styles.modalCloseBtn}
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeDoc.previewUrl} alt={activeDoc.label} className={styles.modalImage} />
            </div>
          </div>
        </div>
      )}
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