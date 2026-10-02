"use client";

import { useState } from "react";
import Image from "next/image";
import StatsBar from "./StatsBar";
import MouldExplore from "./MouldExplore";
import GetStartedModal from "./GetStartedModal";
import SearchBar from "../shared/SearchBar";
import SearchOverlay from "../shared/SearchOverlay";
import styles from "./CustomerHome.module.css";
import mouldchair from "@/public/images/mould-and-chair.png";

export default function CustomerHome() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className={styles.page}>
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
          <div className={styles.searchRow}>
            <SearchBar
              value={search}
              onChange={setSearch}
              onOpen={() => setSearchOpen(true)}
            />
          </div>

          <p className={styles.eyebrow}>Precision Engineered</p>

          <h1 className={styles.heading}>
            <span className={styles.headingAccent}>Turning Moulds</span>
            <br />
            <span className={styles.headingUnderline}>into Opportunities </span>
          </h1>

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

      {/* Zomato/Blinkit style full-screen search */}
      <SearchOverlay
        open={searchOpen}
        query={search}
        onQueryChange={setSearch}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}