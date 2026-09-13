import Image from "next/image";
import Link from "next/link";
import styles from "./MouldCard.module.css";

interface MouldCardProps {
  id: string;
  name: string;
  image: string;
  material?: string;
  cavity?: string;
  machine?: string;
  compact?: boolean;
}

export default function MouldCard({
  id,
  name,
  image,
  material,
  cavity,
  machine,
  compact,
}: MouldCardProps) {
  if (compact) {
    return (
      <Link href={`/explore/${id}`} className={styles.card}>
        <div className={styles.imageWrap}>
          <Image src={image} alt={name} fill className={styles.image} />
        </div>
      </Link>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <Image src={image} alt={name} fill className={styles.image} />
      </div>

      <p className={styles.name}>{name}</p>

      <div className={styles.specs}>
        <p>Material : {material}</p>
        <p>Cavity : {cavity}</p>
        <p>Machine : {machine}</p>
      </div>

      <Link href={`/explore/${id}`} className={styles.viewDetail}>
        View Detail <span aria-hidden>→</span>
      </Link>
    </div>
  );
}