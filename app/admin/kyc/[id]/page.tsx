"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./KycReviewDetail.module.css";

type Role = "Owner" | "Customer";
type DetailStatus = "PENDING REVIEW" | "RESUBMITTED" | "APPROVED" | "REJECTED";

interface KycDetail {
  id: string;
  role: Role;
  status: DetailStatus;
  personal: {
    name: string;
    phone: string;
    email: string;
    address?: string;
  };
  firm?: {
    pan: string;
    firmEmail: string;
    firmName: string;
    address: string;
    gstNo: string;
    msmeNo: string;
  };
  identity?: {
    pan: string;
    aadhaar: string;
    gstNo?: string;
  };
  payout?: {
    bankAccount: string;
    ifsc: string;
    accountHolder: string;
    bankName: string;
    upiId: string;
  };
  documents: { label: string; fileName: string; previewUrl: string }[];
}

const preview = (seed: string) => `https://picsum.photos/seed/${seed}/900/600`;

// TEMP dummy data - will come from the real onboarding API
const KYC_DETAILS: Record<string, KycDetail> = {
  "1": {
    id: "1",
    role: "Owner",
    status: "PENDING REVIEW",
    personal: { name: "Rohit Sharma", phone: "+91 98XXXXXX10", email: "rohit@sharmaind.com" },
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
      { label: "PAN Card", fileName: "pan_card.pdf", previewUrl: preview("pan1") },
      { label: "GST Certificate", fileName: "gst_certificate.pdf", previewUrl: preview("gst1") },
      { label: "Electricity Bill", fileName: "electricity_bill.pdf", previewUrl: preview("eb1") },
    ],
  },
  "2": {
    id: "2",
    role: "Owner",
    status: "PENDING REVIEW",
    personal: { name: "Neha Kapoor", phone: "+91 97XXXXXX22", email: "neha@novaplastics.com" },
    firm: {
      pan: "FGHIJ5678K",
      firmEmail: "hello@novaplastics.com",
      firmName: "Nova Plastics",
      address: "Unit 4, Sector 58, Noida, Uttar Pradesh 201301",
      gstNo: "09FGHIJ5678K1Z2",
      msmeNo: "UDYAM-UP-12-4455667",
    },
    payout: {
      bankAccount: "•••• •••• 7788",
      ifsc: "ICIC0004321",
      accountHolder: "Nova Plastics",
      bankName: "ICICI Bank",
      upiId: "nova@icici",
    },
    documents: [
      { label: "PAN Card", fileName: "pan_card.pdf", previewUrl: preview("pan2") },
      { label: "GST Certificate", fileName: "gst_certificate.pdf", previewUrl: preview("gst2") },
      { label: "MSME Certificate", fileName: "msme_certificate.pdf", previewUrl: preview("msme2") },
    ],
  },
  "3": {
    id: "3",
    role: "Owner",
    status: "RESUBMITTED",
    personal: { name: "Vikram Rao", phone: "+91 99XXXXXX35", email: "vikram@vectormolds.com" },
    firm: {
      pan: "KLMNO9012P",
      firmEmail: "info@vectormolds.com",
      firmName: "Vector Molds",
      address: "Shed 7, Peenya Industrial Area, Bengaluru, Karnataka 560058",
      gstNo: "29KLMNO9012P1Z8",
      msmeNo: "UDYAM-KA-18-7788990",
    },
    payout: {
      bankAccount: "•••• •••• 1190",
      ifsc: "SBIN0005678",
      accountHolder: "Vector Molds",
      bankName: "State Bank of India",
      upiId: "vector@sbi",
    },
    documents: [
      { label: "PAN Card", fileName: "pan_card.pdf", previewUrl: preview("pan3") },
      { label: "GST Certificate", fileName: "gst_certificate.pdf", previewUrl: preview("gst3") },
    ],
  },
  "4": {
    id: "4",
    role: "Owner",
    status: "PENDING REVIEW",
    personal: { name: "Anjali Deshpande", phone: "+91 98XXXXXX48", email: "anjali@apexpoly.com" },
    firm: {
      pan: "PQRST3456U",
      firmEmail: "contact@apexpoly.com",
      firmName: "Apex Poly",
      address: "Gala 21, Bhosari MIDC, Pune, Maharashtra 411026",
      gstNo: "27PQRST3456U1Z4",
      msmeNo: "UDYAM-MH-03-9988776",
    },
    payout: {
      bankAccount: "•••• •••• 5502",
      ifsc: "AXIS0007890",
      accountHolder: "Apex Poly",
      bankName: "Axis Bank",
      upiId: "apex@axisbank",
    },
    documents: [
      { label: "PAN Card", fileName: "pan_card.pdf", previewUrl: preview("pan4") },
      { label: "GST Certificate", fileName: "gst_certificate.pdf", previewUrl: preview("gst4") },
      { label: "Electricity Bill", fileName: "electricity_bill.pdf", previewUrl: preview("eb4") },
    ],
  },
  "5": {
    id: "5",
    role: "Customer",
    status: "PENDING REVIEW",
    personal: {
      name: "Sanjay Verma",
      phone: "+91 96XXXXXX61",
      email: "sanjay.verma@gmail.com",
      address: "B-14, Rajouri Garden, New Delhi 110027",
    },
    identity: { pan: "UVWXY7890Z", aadhaar: "XXXX XXXX 4821" },
    documents: [
      { label: "PAN Card", fileName: "pan_card.pdf", previewUrl: preview("pan5") },
      { label: "Aadhaar Card", fileName: "aadhaar_card.pdf", previewUrl: preview("aadhaar5") },
    ],
  },
  "6": {
    id: "6",
    role: "Customer",
    status: "APPROVED",
    personal: {
      name: "Pooja Singh",
      phone: "+91 95XXXXXX74",
      email: "pooja.singh@gmail.com",
      address: "12, Model Town, Ludhiana, Punjab 141002",
    },
    identity: { pan: "ABCPS1234Q", aadhaar: "XXXX XXXX 9035" },
    documents: [
      { label: "PAN Card", fileName: "pan_card.pdf", previewUrl: preview("pan6") },
      { label: "Aadhaar Card", fileName: "aadhaar_card.pdf", previewUrl: preview("aadhaar6") },
    ],
  },
  "7": {
    id: "7",
    role: "Customer",
    status: "REJECTED",
    personal: {
      name: "Amit Khanna",
      phone: "+91 94XXXXXX87",
      email: "amit@khannatraders.com",
      address: "Shop 3, Sector 17, Chandigarh 160017",
    },
    identity: { pan: "KHANA5566R", aadhaar: "XXXX XXXX 2210", gstNo: "04KHANA5566R1Z1" },
    documents: [
      { label: "PAN Card", fileName: "pan_card.pdf", previewUrl: preview("pan7") },
      { label: "GST Certificate", fileName: "gst_certificate.pdf", previewUrl: preview("gst7") },
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

  const isOwner = kyc.role === "Owner";
  const isFinal = kyc.status === "APPROVED" || kyc.status === "REJECTED";
  const headerSubtitle = kyc.firm?.firmName ?? kyc.role;

  const handleApprove = () => {
    if (submitting || isFinal) return;
    setSubmitting(true);
    // TODO: call approve-kyc API with { userId: id, role: kyc.role }
    router.push("/admin/kyc");
  };

  const handleReject = () => {
    if (submitting || isFinal) return;
    if (!remarks.trim()) {
      alert("Please add remarks explaining the rejection.");
      return;
    }
    setSubmitting(true);
    // TODO: call reject-kyc API with { userId: id, role: kyc.role, remarks }
    router.push("/admin/kyc");
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div className="min-w-0">
          <h1 className={styles.title}>
            {kyc.personal.name} · {headerSubtitle}
          </h1>
        </div>
        <div className={styles.headerPills}>
          <span
            className={`${styles.rolePill} ${isOwner ? styles.roleOwner : styles.roleCustomer}`}
          >
            {kyc.role}
          </span>
          <span className={styles.statusPill}>{kyc.status}</span>
        </div>
      </div>

      <div className={styles.layout}>
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

        <div className={styles.decisionArea}>
          <div className={styles.decisionCard}>
            <h2 className={styles.cardTitle}>Decision</h2>

            <label className={styles.fieldLabel}>
              Remarks (sent to {isOwner ? "owner" : "customer"})
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks if rejecting..."
              rows={4}
              className={styles.textarea}
              disabled={isFinal}
            />

            <button
              type="button"
              onClick={handleApprove}
              disabled={submitting || isFinal}
              className={`${styles.approveBtn} btn-primary`}
            >
              ✓ Approve KYC
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={submitting || isFinal}
              className={styles.rejectBtn}
            >
              ✕ Reject with Remarks
            </button>
          </div>
        </div>

        <div className={styles.detailsArea}>
          <div className={styles.detailsGrid}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Personal Details</h2>
              <Row label="Name" value={kyc.personal.name} />
              <Row label="Phone No." value={kyc.personal.phone} />
              <Row
                label={isOwner ? "Email ID – POC" : "Email ID"}
                value={kyc.personal.email}
                isLast={!kyc.personal.address}
              />
              {kyc.personal.address && (
                <Row label="Address" value={kyc.personal.address} isLast />
              )}
            </div>

            {kyc.firm && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Firm Details</h2>
                <Row label="PAN" value={kyc.firm.pan} />
                <Row label="Email ID" value={kyc.firm.firmEmail} />
                <Row label="Firm Name" value={kyc.firm.firmName} />
                <Row label="Address" value={kyc.firm.address} />
                <Row label="GST No." value={kyc.firm.gstNo} />
                <Row label="MSME No." value={kyc.firm.msmeNo} isLast />
              </div>
            )}

            {kyc.identity && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Identity Details</h2>
                <Row label="PAN" value={kyc.identity.pan} />
                <Row
                  label="Aadhaar No."
                  value={kyc.identity.aadhaar}
                  isLast={!kyc.identity.gstNo}
                />
                {kyc.identity.gstNo && <Row label="GST No." value={kyc.identity.gstNo} isLast />}
              </div>
            )}

            {kyc.payout && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Payout Details</h2>
                <Row label="Bank A/C No." value={kyc.payout.bankAccount} />
                <Row label="IFSC Code" value={kyc.payout.ifsc} />
                <Row label="Account Holder" value={kyc.payout.accountHolder} />
                <Row label="Bank Name" value={kyc.payout.bankName} />
                <Row label="UPI ID" value={kyc.payout.upiId} isLast />
              </div>
            )}
          </div>
        </div>
      </div>

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