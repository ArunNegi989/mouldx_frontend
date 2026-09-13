import Link from "next/link";
import MouldCard from "@/app/components/explore/MouldCard";
import styles from "./FeaturedMoulds.module.css";
import img1 from "@/public/images/dummyimages/49f2854298835f44981451e3abe49bdac00583f2.png";
import img2 from "@/public/images/dummyimages/49f2854298835f44981451e3abe49bdac00583f2.png";

interface Mould {
  id: string;
  name: string;
  image: string;
}

interface Category {
  id: string;
  title: string;
  viewAllHref: string;
  moulds: Mould[];
}

const CATEGORIES: Category[] = [
  {
    id: "chair",
    title: "Our Chair MOULDS",
    viewAllHref: "/explore?category=chair",
    moulds: [
      { id: "1", name: "Plastic Home Chair Mould", image: img1 },
      { id: "2", name: "Office Chair Mould", image: img2 },
    ],
  },
  {
    id: "table",
    title: "Our Table MOULDS",
    viewAllHref: "/explore?category=table",
    moulds: [
      { id: "3", name: "Plastic Dining Table Mould", image: img1 },
      { id: "4", name: "Folding Table Mould", image: img2 },
    ],
  },
  // naya category yahan add karo — apna section apne aap ban jayega
];

export default function FeaturedMoulds() {
  return (
    <div className={styles.wrapper}>
      {CATEGORIES.map((category) => (
        <section key={category.id} className={styles.categorySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{category.title}</h2>
            <Link href={category.viewAllHref} className={styles.viewAll}>
              View all
              <span className={styles.viewAllIcon} aria-hidden>→</span>
            </Link>
          </div>

          <div className={styles.grid}>
            {category.moulds.map((m) => (
              <MouldCard key={m.id} {...m} compact />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}