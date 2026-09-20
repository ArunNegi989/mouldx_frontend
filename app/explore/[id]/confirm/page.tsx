"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ConfirmPay.module.css";

type PaymentMethod = "platform" | "direct";

// TEMP dummy data — real booking summary API se aayega
const BOOKING_SUMMARY = {
  dateRange: "14 – 20 Sep",
  days: 7,
  pricePerDay: 1800,
  securityDeposit: 15000,
  platformFee: 250,
};

export default function ConfirmPayPage() {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>("platform");
  const [acknowledged, setAcknowledged] = useState(false);

  const rent = BOOKING_SUMMARY.pricePerDay * BOOKING_SUMMARY.days;
  const total = rent + BOOKING_SUMMARY.securityDeposit + BOOKING_SUMMARY.platformFee;

  const canProceed = method === "platform" || (method === "direct" && acknowledged);

  const handleSelectMethod = (next: PaymentMethod) => {
    setMethod(next);
    if (next === "platform") setAcknowledged(false);
  };

  const handleProceed = () => {
  if (!canProceed) return;
  if (method === "platform") {
    // TODO: trigger Razorpay checkout, redirect only after payment success callback
    router.push("/booking-success");
  } else {
    // TODO: submit booking for owner approval (no payment yet)
    router.push("/booking-success?status=pending-approval");
  }
};

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" onClick={() => router.back()} className={styles.iconBtn} aria-label="Go back">
          ←
        </button>
        <span className={styles.brand}>
          Mould<span className={styles.brandAccent}>X</span>
        </span>
        <button type="button" className={styles.iconBtn} aria-label="Help">
          ?
        </button>
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>Confirm &amp; pay</h1>
        <p className={styles.subtitle}>
          {BOOKING_SUMMARY.dateRange} · {BOOKING_SUMMARY.days} days
        </p>

        {/* ---------- Fare breakdown ---------- */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Fare Breakdown</h2>

          <div className={styles.fareRow}>
            <span className={styles.fareLabel}>
              Rent ({BOOKING_SUMMARY.days} × ₹{BOOKING_SUMMARY.pricePerDay.toLocaleString("en-IN")})
            </span>
            <span className={styles.fareValue}>₹{rent.toLocaleString("en-IN")}</span>
          </div>

          <div className={styles.fareRow}>
            <span className={styles.fareLabel}>Security deposit</span>
            <span className={styles.fareValue}>
              ₹{BOOKING_SUMMARY.securityDeposit.toLocaleString("en-IN")}
            </span>
          </div>

          <div className={styles.fareRow}>
            <span className={styles.fareLabel}>Platform fee</span>
            <span className={styles.fareValue}>
              ₹{BOOKING_SUMMARY.platformFee.toLocaleString("en-IN")}
            </span>
          </div>

          <div className={styles.divider} />

          <div className={styles.fareRow}>
            <span className={styles.totalLabel}>Total payable</span>
            <span className={styles.totalValue}>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* ---------- Payment method selection ---------- */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>How do you want to pay?</h2>

          <label className={`${styles.methodOption} ${method === "platform" ? styles.methodOptionActive : ""}`}>
            <input
              type="radio"
              name="paymentMethod"
              checked={method === "platform"}
              onChange={() => handleSelectMethod("platform")}
              className={styles.radio}
            />
            <div className={styles.methodInfo}>
              <p className={styles.methodTitle}>Pay via Platform</p>
              <p className={styles.methodDesc}>
                Secure payment, deposit protection &amp; dispute support from MouldX.
              </p>
            </div>
          </label>

          {method === "platform" && (
            <div className={styles.payViaRow}>
              <span className={styles.payViaDot} aria-hidden />
              <div className={styles.payViaInfo}>
                <p className={styles.payViaTitle}>Pay via</p>
                <p className={styles.payViaText}>Razorpay — UPI / Card / NetBanking</p>
              </div>
              <span className={styles.secureBadge}>SECURE</span>
            </div>
          )}

          <label className={`${styles.methodOption} ${method === "direct" ? styles.methodOptionActive : ""}`}>
            <input
              type="radio"
              name="paymentMethod"
              checked={method === "direct"}
              onChange={() => handleSelectMethod("direct")}
              className={styles.radio}
            />
            <div className={styles.methodInfo}>
              <p className={styles.methodTitle}>Pay Direct to Owner</p>
              <p className={styles.methodDesc}>
                Settle rent &amp; deposit directly with the owner outside the platform.
              </p>
            </div>
          </label>

          {method === "direct" && (
            <div className={styles.warningBox}>
              <p className={styles.warningText}>
                If you pay the owner directly, MouldX will not be responsible for any
                issues with the payment, deposit, or mould condition. Your booking will
                be sent for owner approval instead of payment.
              </p>
              <label className={styles.ackRow}>
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className={styles.checkbox}
                />
                I understand and agree to proceed without platform protection.
              </label>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Sticky CTA ---------- */}
      <div className={styles.ctaBar}>
        <button
  type="button"
  disabled={!canProceed}
  onClick={handleProceed}
  className={`${styles.ctaBtn} ${canProceed ? "btn-primary" : styles.ctaBtnDisabled}`}
>
  {method === "platform"
    ? `Pay ₹${total.toLocaleString("en-IN")} →`
    : "Send for Approval →"}
</button>
      </div>
    </div>
  );
}