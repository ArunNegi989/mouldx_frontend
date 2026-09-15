"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./ReceiveMould.module.css";

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "packaging", label: "Packaging intact", checked: false },
  { id: "matches", label: "Matches dispatch photos", checked: false },
  { id: "damage", label: "Visible damage noted", checked: false },
];

export default function ReceiveMouldPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: bookingId } = use(params);
  const router = useRouter();

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "fetching" | "done" | "denied">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));

    // photo select hote hi geotag try karo
    if (locationStatus === "idle" && "geolocation" in navigator) {
      setLocationStatus("fetching");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationStatus("done");
        },
        () => setLocationStatus("denied"),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const canSubmit = mediaFile !== null;

  const handleConfirm = () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    // TEMP: real API yahan call hoga (media upload + checklist + geotag submit)
    // real integration hone tak seedha mould-details page pe le jaa rahe hain
    router.push(`/bookings/${bookingId}/mould-details`);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href={`/bookings/${bookingId}`} className={styles.iconBtn} aria-label="Go back">
          ←
        </Link>
        <span className={styles.brand}>
          Mould<span className={styles.brandAccent}>X</span>
        </span>
        <span className={styles.headerSpacer} aria-hidden />
      </header>

      <div className={styles.content}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Confirm receipt</h1>
          <p className={styles.subtitle}>
            Upload a photo of the mould on arrival — geo-tagged automatically.
          </p>
        </div>

        <label className={styles.uploadBox} htmlFor="receiptMedia">
          {mediaPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaPreview} alt="Selected receipt media" className={styles.uploadPreview} />
          ) : (
            <>
              <span className={styles.uploadIcon} aria-hidden>📷</span>
              <span className={styles.uploadText}>Tap to capture photo/video</span>
              <span className={styles.uploadHint}>Geotag auto-attached</span>
            </>
          )}
          <input
            id="receiptMedia"
            type="file"
            accept="image/*,video/*"
            capture="environment"
            onChange={handleFileChange}
            className={styles.uploadInput}
          />
        </label>

        {mediaPreview && (
          <button
            type="button"
            onClick={() => {
              setMediaFile(null);
              setMediaPreview(null);
            }}
            className={styles.retakeBtn}
          >
            Retake
          </button>
        )}

        <div className={styles.checklistCard}>
          {checklist.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleCheck(item.id)}
              className={styles.checkRow}
            >
              <span className={`${styles.checkBox} ${item.checked ? styles.checkBoxOn : ""}`}>
                {item.checked && "✓"}
              </span>
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.flag}>
          <span className={styles.flagIcon} aria-hidden>i</span>
          <div>
            <p className={styles.flagTitle}>Location capture</p>
            <p className={styles.flagMsg}>
              {locationStatus === "idle" && "Photo select karte hi location capture hogi."}
              {locationStatus === "fetching" && "Location capture ho rahi hai…"}
              {locationStatus === "done" && coords &&
                `Lat/long recorded at ${coords.lat.toFixed(2)}°N, ${coords.lng.toFixed(2)}°E — auto attached to record.`}
              {locationStatus === "denied" &&
                "Location permission nahi mili — bina geotag ke record submit hoga."}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.ctaBar}>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!canSubmit || isSubmitting}
          className={styles.ctaBtn}
        >
          {isSubmitting ? "Confirming…" : "Confirm Received"}
        </button>
        {!canSubmit && <p className={styles.ctaHint}>Photo/video upload karna zaroori hai</p>}
      </div>
    </div>
  );
}