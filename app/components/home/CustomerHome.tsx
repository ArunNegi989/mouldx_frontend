import Image from "next/image";
import Link from "next/link";
import StatsBar from "./StatsBar";
import MouldExplore from "./MouldExplore";
import styles from "./CustomerHome.module.css";
import mouldchair from "@/public/images/mould-and-chair.png"

export default function CustomerHome() {
  return (
    <div className={styles.page}>
      {/* Header hata diya — ab layout.tsx se aa raha hai */}

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
            <Link href="/explore" className={styles.primaryCta}>
              View our moulds <span aria-hidden>→</span>
            </Link>
            <button className={styles.watchBtn}>
              <span aria-hidden>▶</span> Watch video
            </button>
          </div>
        </div>
      </section>

      <StatsBar />
      <MouldExplore />
    </div>
  );
}