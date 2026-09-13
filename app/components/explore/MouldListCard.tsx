import Image from "next/image";
import Link from "next/link";
import styles from "./MouldListCard.module.css";

interface MouldListCardProps {
  id: string;
  code: string;
  name: string;
  city: string;
  price: string;
  availability: "FREE" | "2 LEFT" | "BOOKED";
  image: string;
}

export default function MouldListCard({ id, code, name, city, price, availability, image }: MouldListCardProps) {
  const badgeClass =
    availability === "FREE"
      ? styles.badgeFree
      : availability === "2 LEFT"
      ? styles.badgeLow
      : styles.badgeBooked;

  return (
    <Link href={`/explore/${id}`} className={styles.card}>
      <div className={styles.thumbWrap}>
        <Image src={image} alt={name} fill className={styles.thumb} />
      </div>

      <div className={styles.cardInfo}>
        <p className={styles.cardName}>{name}</p>
        <p className={styles.cardMeta}>
          {code} · {city} · {price}
        </p>
      </div>

      <span className={`${styles.badge} ${badgeClass}`}>{availability}</span>
    </Link>
  );
}