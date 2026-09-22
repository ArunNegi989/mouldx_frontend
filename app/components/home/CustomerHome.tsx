"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import StatsBar from "./StatsBar";
import MouldExplore from "./MouldExplore";
import GetStartedModal from "./GetStartedModal";
import styles from "./CustomerHome.module.css";
import mouldchair from "@/public/images/mould-and-chair.png";

export default function CustomerHome() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={styles.page}>
      {/* Hero section with background image */}
      <section className={styles.heroSection}>
        <Image
          src={mouldchair}
          alt="Chair mould factory"
          fill
          priority
          className={styles.heroBg}
        />
        <div className={styles.heroOverlay} />

        <div className={styles.content}>
          <p className={styles.eyebrow}>Precision Engineered</p>

          <h1 className={styles.heading}>
            <span className={styles.headingAccent}>chair moulds</span>
            <br />
            <span className={styles.headingUnderline}>for Global Manufacturers</span>
          </h1>

          <p className={styles.description}>
            We design and manufacture high-quality plastic chair moulds that
            deliver precision, durability and consistency performance
          </p>

          <div className={styles.ctaRow}>
            <button type="button" onClick={() => setModalOpen(true)} className="btn-primary">
              Get Started <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </section>

      <StatsBar />
      <MouldExplore />

      <GetStartedModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}