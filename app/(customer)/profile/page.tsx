"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Profile.module.css";

// TEMP dummy data — real profile/booking API se aayega
const CUSTOMER = {
  name: "Rohit Sharma",
  phone: "+91 90XXXXXX45",
  city: "Pune",
  email: "rohit@example.com",
  gstin: "27ABCDE1234F1Z5",
  savedCard: "HDFC •• 4021",
  stats: {
    totalRented: 9,
    activeRentals: 1,
    completed: 7,
    ratingsGiven: 12,
  },
};

const MORE_LINKS = [
  { label: "Rent Agreement", href: "/profile/rent-agreement", icon: "📄" },
  { label: "FAQs", href: "/profile/faqs", icon: "❓" },
  { label: "Policy", href: "/profile/policy", icon: "🛡️" },
  { label: "Settings", href: "/profile/settings", icon: "⚙️" },
];

export default function CustomerProfilePage() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className={styles.page}>
      <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Profile</h1>

      {/* ---------- Identity card ---------- */}
      <div className={styles.identityCard}>
        <div className={styles.avatar}>
          {CUSTOMER.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-gray-900">{CUSTOMER.name}</p>
          <p className="truncate text-xs text-gray-400">
            {CUSTOMER.phone} · {CUSTOMER.city}
          </p>
        </div>
        <Link href="/profile/edit" className={styles.editBtn}>
          Edit
        </Link>
      </div>

      {/* ---------- Rental stats ---------- */}
      <div className={styles.statsCard}>
        <div className={styles.statsHeader}>
          <div>
            <p className={styles.statsLabel}>Total Moulds Rented</p>
            <p className={styles.statsValue}>{CUSTOMER.stats.totalRented}</p>
          </div>
          <Link href="/bookings" className={styles.statsCta}>
            View all bookings <span aria-hidden>→</span>
          </Link>
        </div>

        <div className={styles.statsGrid}>
          <Link href="/bookings?tab=active" className={styles.statChip}>
            <span className={styles.statChipValue}>{CUSTOMER.stats.activeRentals}</span>
            <span className={styles.statChipLabel}>Active</span>
          </Link>
          <Link href="/bookings?tab=completed" className={styles.statChip}>
            <span className={styles.statChipValue}>{CUSTOMER.stats.completed}</span>
            <span className={styles.statChipLabel}>Completed</span>
          </Link>
          <Link href="/profile/ratings" className={styles.statChip}>
            <span className={styles.statChipValue}>{CUSTOMER.stats.ratingsGiven}</span>
            <span className={styles.statChipLabel}>Ratings given</span>
          </Link>
        </div>
      </div>

      {/* ---------- Personal Details ---------- */}
      <Section title="Personal Details">
        <FieldList
          items={[
            { label: "Name", value: CUSTOMER.name },
            { label: "Phone No.", value: CUSTOMER.phone },
            { label: "Email ID", value: CUSTOMER.email },
            { label: "City", value: CUSTOMER.city },
          ]}
        />
      </Section>

      {/* ---------- Billing Details ---------- */}
      <Section title="Billing Details">
        <FieldList
          items={[
            { label: "GSTIN", value: CUSTOMER.gstin },
            { label: "Saved Payment Method", value: CUSTOMER.savedCard, badge: "Default" },
          ]}
        />
        <button type="button" className={styles.addPaymentBtn}>
          + Add Payment Method
        </button>
      </Section>

      {/* ---------- More (dropdown) ---------- */}
      <div className={styles.sectionCard}>
        <button
          type="button"
          onClick={() => setMoreOpen((prev) => !prev)}
          className={styles.moreToggle}
        >
          <span className={styles.sectionTitle} style={{ margin: 0 }}>
            More
          </span>
          <span className={`${styles.moreChevron} ${moreOpen ? styles.moreChevronOpen : ""}`}>
            ▾
          </span>
        </button>

        {moreOpen && (
          <div className={styles.moreGrid}>
            {MORE_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className={styles.moreCard}>
                <span className={styles.moreCardIcon} aria-hidden>
                  {item.icon}
                </span>
                <span className={styles.moreCardLabel}>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Logout + Switch Profile — always visible ---------- */}
      <button type="button" className={styles.logoutRow}>
        Logout
      </button>

      <Link href="/switch-profile" className={styles.switchProfileBtn}>
        Switch Profile — Customer ↔ Owner
      </Link>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.sectionCard}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

function FieldList({
  items,
}: {
  items: { label: string; value: string; badge?: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-x-1.5 gap-y-1 text-[13px] text-gray-500">
      {items.map((item, i) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          {item.value}
          {item.badge && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              {item.badge}
            </span>
          )}
          {i < items.length - 1 && <span className="text-gray-300">·</span>}
        </span>
      ))}
    </div>
  );
}