"use client";

import Link from "next/link";
import styles from "./EditForm.module.css";
import { useEditMould } from "./EditMouldProvider";

interface EditTopProps {
  backHref?: string;
  backLabel?: string;
}

export default function EditTop({ backHref, backLabel }: EditTopProps) {
  const { listing } = useEditMould();

  return (
    <>
      {backHref && (
        <Link href={backHref} className={styles.backLink}>
          ← {backLabel}
        </Link>
      )}
      <p className={styles.editingTag}>Editing · {listing.code}</p>
    </>
  );
}