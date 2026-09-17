"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ProductDetails.module.css";

const REGEX = {
  productName: /^[a-zA-Z0-9\s.,'\-()]{2,80}$/,
  dimension: /^\d+(\.\d{1,2})?$/,
  weight: /^\d+(\.\d{1,2})?$/,
  material: /^[a-zA-Z0-9\s.,'\-\/]{2,60}$/,
  finish: /^[a-zA-Z0-9\s.,'\-\/]{2,60}$/,
};

const CATEGORIES = ["Chair", "Table", "Baby Chair", "Stool", "Fix Table", "Folding Table"];

interface FormState {
  productName: string;
  category: string;
  image: File | null;
  video: File | null;
  length: string;
  breadth: string;
  height: string;
  weight: string;
  material: string;
  finish: string;
}

const INITIAL_STATE: FormState = {
  productName: "",
  category: CATEGORIES[0],
  image: null,
  video: null,
  length: "",
  breadth: "",
  height: "",
  weight: "",
  material: "",
  finish: "",
};

const REQUIRED_TEXT_FIELDS: (keyof FormState)[] = [
  "productName",
  "length",
  "breadth",
  "height",
  "weight",
  "material",
  "finish",
];

export default function ProductDetailsPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);

  // ---------- Geo-tag state ----------
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "fetching" | "done" | "denied">(
    "idle"
  );

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const markTouched = (key: string) => setTouched((prev) => ({ ...prev, [key]: true }));

  const errors: Partial<Record<keyof FormState, string>> = {
    productName:
      form.productName.trim() === ""
        ? "Required"
        : !REGEX.productName.test(form.productName.trim())
        ? "2–80 characters, letters/numbers only"
        : "",
    image: !form.image ? "At least one image is required" : "",
    length:
      form.length.trim() === ""
        ? "Required"
        : !REGEX.dimension.test(form.length.trim())
        ? "Numeric value only"
        : "",
    breadth:
      form.breadth.trim() === ""
        ? "Required"
        : !REGEX.dimension.test(form.breadth.trim())
        ? "Numeric value only"
        : "",
    height:
      form.height.trim() === ""
        ? "Required"
        : !REGEX.dimension.test(form.height.trim())
        ? "Numeric value only"
        : "",
    weight:
      form.weight.trim() === ""
        ? "Required"
        : !REGEX.weight.test(form.weight.trim())
        ? "Numeric value only"
        : "",
    material:
      form.material.trim() === ""
        ? "Required"
        : !REGEX.material.test(form.material.trim())
        ? "Enter a valid material"
        : "",
    finish:
      form.finish.trim() === ""
        ? "Required"
        : !REGEX.finish.test(form.finish.trim())
        ? "Enter a valid finish"
        : "",
  };

  const isValid = [...REQUIRED_TEXT_FIELDS, "image"].every(
    (key) => !errors[key as keyof FormState]
  );

  const handleDimensionChange = (key: "length" | "breadth" | "height" | "weight", raw: string) => {
    let cleaned = raw.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("");
    update(key, cleaned);
  };

  const handleImageChange = (file: File | null) => {
    update("image", file);
    markTouched("image");
    setImagePreview(file ? URL.createObjectURL(file) : null);

    // Capture geolocation the moment a photo is taken/selected
    if (file && locationStatus === "idle" && "geolocation" in navigator) {
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

  const handleVideoChange = (file: File | null) => {
    update("video", file);
    setVideoName(file?.name ?? null);
  };

  const handleSubmit = () => {
    setTouched(Object.fromEntries([...REQUIRED_TEXT_FIELDS, "image"].map((f) => [f, true])));
    if (!isValid) return;
    // TODO: submit full listing (technical + general + product + imageGeoLocation: coords) for admin approval
    router.push("/owner/moulds/new/submitted");
  };

  return (
    <div className={styles.page}>
      {/* ---------- Header ---------- */}
      <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <Link
          href="/owner/moulds/new/general"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-900 no-underline"
          aria-label="Go back"
        >
          ‹
        </Link>
        <span className="text-[15px] font-extrabold text-gray-900">
          Mould<span className="text-cyan-500">X</span>
        </span>
        <span className="w-9" />
      </header>

      <div className={styles.content}>
        <h1 className="text-[26px] font-extrabold text-gray-900">Product Details</h1>
        <p className="mt-1 text-sm text-gray-400">Step 3 · Add the product this mould makes.</p>

        {/* ---------- Progress bar (Step 4 of 4) ---------- */}
        <div className="mt-4 flex gap-1.5">
          <span className={styles.progressBarActive} />
          <span className={styles.progressBarActive} />
          <span className={styles.progressBarActive} />
          <span className={styles.progressBarActive} />
        </div>

        {/* ---------- Card ---------- */}
        <div className={styles.card}>
          <label className={styles.fieldLabel}>Product Name</label>
          <input
            type="text"
            value={form.productName}
            onChange={(e) => update("productName", e.target.value)}
            onBlur={() => markTouched("productName")}
            placeholder="28mm PET Bottle Cap"
            className={`${styles.input} ${touched.productName && errors.productName ? styles.inputError : ""}`}
          />
          {touched.productName && errors.productName && (
            <p className={styles.errorText}>{errors.productName}</p>
          )}

          <div className="mt-3">
            <label className={styles.fieldLabel}>Category</label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className={styles.select}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* ---------- Image (geo-tagged) + Video upload ---------- */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className={`${styles.mediaBox} ${touched.image && errors.image ? styles.mediaBoxError : ""}`}>
              {imagePreview ? (
                <div className={styles.mediaPreviewWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Product preview" className={styles.mediaPreview} />
                  {locationStatus === "done" && coords && (
                    <span className={styles.geoBadge}>
                      📍 {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
                    </span>
                  )}
                  {locationStatus === "fetching" && (
                    <span className={styles.geoBadge}>📍 Locating…</span>
                  )}
                </div>
              ) : (
                <>
                  <span className={styles.mediaPlus}>📷</span>
                  <span className={styles.mediaLabel}>Image</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                className={styles.mediaInput}
              />
            </label>

            <label className={styles.mediaBox}>
              {videoName ? (
                <span className={styles.mediaFileName}>🎥 {videoName}</span>
              ) : (
                <>
                  <span className={styles.mediaPlus}>+</span>
                  <span className={styles.mediaLabel}>Video</span>
                </>
              )}
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoChange(e.target.files?.[0] ?? null)}
                className={styles.mediaInput}
              />
            </label>
          </div>
          {touched.image && errors.image && <p className={styles.errorText}>{errors.image}</p>}

         
          {/* ---------- Location capture info ---------- */}
<div className={styles.geoFlag}>
  <span className={styles.geoFlagIcon} aria-hidden>
    i
  </span>
  <div>
    <p className={styles.geoFlagTitle}>Location capture</p>
    <p className={styles.geoFlagMsg}>
      {locationStatus === "idle" && "Location will be auto-attached once the photo is captured."}
      {locationStatus === "fetching" && "Capturing location…"}
      {locationStatus === "done" &&
        coords &&
        `Captured at ${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(
          4
        )}°E — visible to customer with the listing.`}
      {locationStatus === "denied" &&
        "Location permission was not granted — photo will upload without a geotag."}
    </p>
  </div>
</div>

          {/* ---------- Dimensions ---------- */}
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <label className={styles.fieldLabel}>L (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                value={form.length}
                onChange={(e) => handleDimensionChange("length", e.target.value)}
                onBlur={() => markTouched("length")}
                placeholder="28"
                className={`${styles.input} ${touched.length && errors.length ? styles.inputError : ""}`}
              />
            </div>
            <div>
              <label className={styles.fieldLabel}>B (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                value={form.breadth}
                onChange={(e) => handleDimensionChange("breadth", e.target.value)}
                onBlur={() => markTouched("breadth")}
                placeholder="28"
                className={`${styles.input} ${touched.breadth && errors.breadth ? styles.inputError : ""}`}
              />
            </div>
            <div>
              <label className={styles.fieldLabel}>H (mm)</label>
              <input
                type="text"
                inputMode="decimal"
                value={form.height}
                onChange={(e) => handleDimensionChange("height", e.target.value)}
                onBlur={() => markTouched("height")}
                placeholder="14"
                className={`${styles.input} ${touched.height && errors.height ? styles.inputError : ""}`}
              />
            </div>
          </div>
          {(errors.length || errors.breadth || errors.height) &&
            (touched.length || touched.breadth || touched.height) && (
              <p className={styles.errorText}>All dimensions must be numeric</p>
            )}

          <div className="mt-3">
            <label className={styles.fieldLabel}>Weight (g)</label>
            <input
              type="text"
              inputMode="decimal"
              value={form.weight}
              onChange={(e) => handleDimensionChange("weight", e.target.value)}
              onBlur={() => markTouched("weight")}
              placeholder="3.2"
              className={`${styles.input} ${touched.weight && errors.weight ? styles.inputError : ""}`}
            />
            {touched.weight && errors.weight && <p className={styles.errorText}>{errors.weight}</p>}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className={styles.fieldLabel}>Material</label>
              <input
                type="text"
                value={form.material}
                onChange={(e) => update("material", e.target.value)}
                onBlur={() => markTouched("material")}
                placeholder="HDPE"
                className={`${styles.input} ${touched.material && errors.material ? styles.inputError : ""}`}
              />
              {touched.material && errors.material && <p className={styles.errorText}>{errors.material}</p>}
            </div>
            <div>
              <label className={styles.fieldLabel}>Finish</label>
              <input
                type="text"
                value={form.finish}
                onChange={(e) => update("finish", e.target.value)}
                onBlur={() => markTouched("finish")}
                placeholder="Matte"
                className={`${styles.input} ${touched.finish && errors.finish ? styles.inputError : ""}`}
              />
              {touched.finish && errors.finish && <p className={styles.errorText}>{errors.finish}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Sticky Submit ---------- */}
      <div className={styles.ctaBar}>
        <button type="button" onClick={handleSubmit} className={styles.ctaBtn}>
          Submit Listing for Approval
        </button>
      </div>
    </div>
  );
}