"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProductDetails.module.css";
import Stepper from "@/app/components/Stepper/Stepper";

/* =====================================================================
   CONSTANTS
===================================================================== */
const REGEX = {
  name: /^[a-zA-Z0-9\s.,'\-()]{2,80}$/,
  mouldNameOrId: /^[a-zA-Z0-9\s.,'\-·]{3,80}$/,
  text: /^[a-zA-Z0-9\s.,'\-\/]{2,60}$/,
  year: /^(19|20)\d{2}$/,
  posInt: /^[1-9]\d*$/,
  posDec: /^\d+(\.\d{1,2})?$/,
};

const CATEGORIES = ["Chair", "Table", "Baby Chair", "Stool", "Fix Table", "Folding Table"];

// TODO: replace with the real values from the Excel sheet
const SUB_CATEGORIES: Record<string, string[]> = {
  Chair: ["Armless Chair", "Arm Chair", "Plastic Chair"],
  Table: ["Dining Table", "Side Table", "Center Table"],
  "Baby Chair": ["High Chair", "Feeding Chair"],
  Stool: ["Bar Stool", "Round Stool"],
  "Fix Table": ["Study Table", "Utility Table"],
  "Folding Table": ["Portable Table", "Picnic Table"],
};

const MOULD_TYPES = ["Injection", "Blow", "Die-Cast", "Compression"];
const RUNNER_TYPES = ["Hot Runner", "Cold Runner"];
const YES_NO = ["No", "Yes"];
const MAX_COMPONENTS = 10;

/* =====================================================================
   TYPES + INITIAL STATE
===================================================================== */
interface Coords {
  lat: number;
  lng: number;
}

type LocationStatus = "idle" | "fetching" | "done" | "denied";

interface ProductState {
  productName: string;
  category: string;
  subCategory: string;
  image: File | null;
  imagePreview: string | null;
  imageGeo: Coords | null;
  video: File | null;
  videoGeo: Coords | null;
  length: string;
  breadth: string;
  height: string;
  weight: string;
  material: string;
  surfaceFinish: string;
  perDayCharges: string;
  securityDeposit: string;
  componentCount: string;
}

interface ComponentState {
  name: string;
  image: File | null;
  imagePreview: string | null;
  imageGeo: Coords | null;
  video: File | null;
  videoGeo: Coords | null;
  length: string;
  breadth: string;
  height: string;
  weight: string;
  surfaceFinish: string;
}

interface MouldState {
  mouldNameOrId: string;
  mouldType: string;
  year: string;
  length: string;
  breadth: string;
  height: string;
  weight: string;
  cavities: string;
  cycleTime: string;
  tonnage: string;
  runnerType: string;
  changeableLogo: string;
}

const emptyProduct = (): ProductState => ({
  productName: "",
  category: CATEGORIES[0],
  subCategory: SUB_CATEGORIES[CATEGORIES[0]]?.[0] ?? "",
  image: null,
  imagePreview: null,
  imageGeo: null,
  video: null,
  videoGeo: null,
  length: "",
  breadth: "",
  height: "",
  weight: "",
  material: "",
  surfaceFinish: "",
  perDayCharges: "",
  securityDeposit: "",
  componentCount: "0", // 0 = nothing selected, component and mould forms stay hidden
});

const emptyComponent = (): ComponentState => ({
  name: "",
  image: null,
  imagePreview: null,
  imageGeo: null,
  video: null,
  videoGeo: null,
  length: "",
  breadth: "",
  height: "",
  weight: "",
  surfaceFinish: "",
});

const emptyMould = (): MouldState => ({
  mouldNameOrId: "",
  mouldType: MOULD_TYPES[0],
  year: "",
  length: "",
  breadth: "",
  height: "",
  weight: "",
  cavities: "",
  cycleTime: "",
  tonnage: "",
  runnerType: RUNNER_TYPES[0],
  changeableLogo: "No",
});

/* =====================================================================
   VALIDATION
===================================================================== */
const req = (v: string, re: RegExp, msg: string) =>
  v.trim() === "" ? "Required" : !re.test(v.trim()) ? msg : "";
const dec = (v: string) => req(v, REGEX.posDec, "Numeric value only");
const int = (v: string) => req(v, REGEX.posInt, "Whole number only");

function validateAll(product: ProductState, components: ComponentState[], moulds: MouldState[]) {
  const e: Record<string, string> = {};
  const add = (key: string, msg: string) => {
    if (msg) e[key] = msg;
  };

  const count = Number(product.componentCount);

  // ----- Product -----
  add("p.productName", req(product.productName, REGEX.name, "2–80 characters, letters/numbers only"));
  if ((SUB_CATEGORIES[product.category] ?? []).length > 0 && !product.subCategory) {
    add("p.subCategory", "Required");
  }
  add("p.image", product.image ? "" : "At least one image is required");
  add("p.length", dec(product.length));
  add("p.breadth", dec(product.breadth));
  add("p.height", dec(product.height));
  add("p.weight", dec(product.weight));
  add("p.material", req(product.material, REGEX.text, "Enter a valid material"));
  add("p.surfaceFinish", req(product.surfaceFinish, REGEX.text, "Enter a valid surface finish"));
  add("p.perDayCharges", dec(product.perDayCharges));
  add("p.securityDeposit", dec(product.securityDeposit));

  // ----- Count must be selected -----
  if (count < 1) {
    add("count", "Select at least 1 component / mould");
  }

  // ----- Components (only when more than 1) -----
  if (count > 1) {
    components.slice(0, count).forEach((c, i) => {
      const k = `c.${i}`;
      add(`${k}.name`, req(c.name, REGEX.name, "2–80 characters, letters/numbers only"));
      add(`${k}.image`, c.image ? "" : "Image is required");
      add(`${k}.length`, dec(c.length));
      add(`${k}.breadth`, dec(c.breadth));
      add(`${k}.height`, dec(c.height));
      add(`${k}.weight`, dec(c.weight));
      add(`${k}.surfaceFinish`, req(c.surfaceFinish, REGEX.text, "Enter a valid surface finish"));
    });
  }

  // ----- Moulds (one per component, or one for the product) -----
  if (count >= 1) {
    moulds.slice(0, count).forEach((m, i) => {
      const k = `m.${i}`;
      add(`${k}.mouldNameOrId`, req(m.mouldNameOrId, REGEX.mouldNameOrId, "3–80 characters, letters/numbers only"));
      add(`${k}.year`, req(m.year, REGEX.year, "Enter a valid year (e.g. 2022)"));
      add(`${k}.length`, dec(m.length));
      add(`${k}.breadth`, dec(m.breadth));
      add(`${k}.height`, dec(m.height));
      add(`${k}.weight`, dec(m.weight));
      add(`${k}.cavities`, int(m.cavities));
      add(`${k}.cycleTime`, int(m.cycleTime));
      add(`${k}.tonnage`, dec(m.tonnage));
    });
  }

  return e;
}

/* =====================================================================
   SMALL UI PIECES
===================================================================== */
interface Ctx {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  touch: (key: string) => void;
  locationStatus: LocationStatus;
}

type Mode = "text" | "int" | "dec";

const clean = (raw: string, mode: Mode) => {
  if (mode === "text") return raw;
  if (mode === "int") return raw.replace(/\D/g, "");
  let c = raw.replace(/[^0-9.]/g, "");
  const parts = c.split(".");
  if (parts.length > 2) c = parts[0] + "." + parts.slice(1).join("");
  return c;
};

const fmtGeo = (c: Coords) => `📍 ${c.lat.toFixed(4)}°N, ${c.lng.toFixed(4)}°E`;

/** Badge text for a media item (image or video) that has been picked. */
const geoLabel = (hasFile: boolean, geo: Coords | null, status: LocationStatus) => {
  if (!hasFile) return null;
  if (geo) return fmtGeo(geo);
  if (status === "fetching") return "📍 Locating…";
  if (status === "denied") return "📍 No geotag";
  return null;
};

function Field({
  ctx,
  id,
  label,
  value,
  onChange,
  mode = "text",
  placeholder,
  maxLength,
}: {
  ctx: Ctx;
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  mode?: Mode;
  placeholder?: string;
  maxLength?: number;
}) {
  const error = ctx.touched[id] ? ctx.errors[id] : "";
  return (
    <div>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        type="text"
        inputMode={mode === "text" ? undefined : mode === "int" ? "numeric" : "decimal"}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(clean(e.target.value, mode))}
        onBlur={() => ctx.touch(id)}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={styles.fieldLabel}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={styles.select}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function MediaPair({
  ctx,
  base,
  image,
  imagePreview,
  imageGeo,
  video,
  videoGeo,
  onImage,
  onVideo,
}: {
  ctx: Ctx;
  base: string;
  image: File | null;
  imagePreview: string | null;
  imageGeo: Coords | null;
  video: File | null;
  videoGeo: Coords | null;
  onImage: (f: File | null) => void;
  onVideo: (f: File | null) => void;
}) {
  const id = `${base}.image`;
  const imgError = ctx.touched[id] ? ctx.errors[id] : "";
  const imageBadge = geoLabel(!!image, imageGeo, ctx.locationStatus);
  const videoBadge = geoLabel(!!video, videoGeo, ctx.locationStatus);

  return (
    <>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label className={styles.fieldLabel}>Image</label>
          <label className={`${styles.mediaBox} ${imgError ? styles.mediaBoxError : ""}`}>
            {imagePreview ? (
              <div className={styles.mediaPreviewWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className={styles.mediaPreview} />
                {imageBadge && <span className={styles.geoBadge}>{imageBadge}</span>}
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
              onChange={(e) => {
                onImage(e.target.files?.[0] ?? null);
                ctx.touch(id);
              }}
              className={styles.mediaInput}
            />
          </label>
        </div>

        <div>
          <label className={styles.fieldLabel}>Videos</label>
          <label className={styles.mediaBox}>
            {video ? (
              <div className={styles.videoInfo}>
                <span className={styles.mediaFileName}>🎥 {video.name}</span>
                {videoBadge && <span className={styles.videoGeoBadge}>{videoBadge}</span>}
              </div>
            ) : (
              <>
                <span className={styles.mediaPlus}>+</span>
                <span className={styles.mediaLabel}>Video</span>
              </>
            )}
            <input
              type="file"
              accept="video/*"
              capture="environment"
              onChange={(e) => onVideo(e.target.files?.[0] ?? null)}
              className={styles.mediaInput}
            />
          </label>
        </div>
      </div>
      {imgError && <p className={styles.errorText}>{imgError}</p>}
    </>
  );
}

function DimensionsRow({
  ctx,
  base,
  values,
  onChange,
}: {
  ctx: Ctx;
  base: string;
  values: { length: string; breadth: string; height: string };
  onChange: (key: "length" | "breadth" | "height", v: string) => void;
}) {
  return (
    <div className="mt-3">
      <div className="grid grid-cols-3 gap-3">
        <Field ctx={ctx} id={`${base}.length`} label="Length (mm)" value={values.length} mode="dec" placeholder="420" onChange={(v) => onChange("length", v)} />
        <Field ctx={ctx} id={`${base}.breadth`} label="Breadth (mm)" value={values.breadth} mode="dec" placeholder="310" onChange={(v) => onChange("breadth", v)} />
        <Field ctx={ctx} id={`${base}.height`} label="Height (mm)" value={values.height} mode="dec" placeholder="280" onChange={(v) => onChange("height", v)} />
      </div>
    </div>
  );
}

function Accordion({
  title,
  subtitle,
  open,
  onToggle,
  hasError,
  children,
}: {
  title: string;
  subtitle?: string;
  open: boolean;
  onToggle: () => void;
  hasError: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.accordion} ${hasError ? styles.accordionError : ""}`}>
      <button type="button" onClick={onToggle} className={styles.accHeader} aria-expanded={open}>
        <div>
          <p className={styles.accTitle}>{title}</p>
          {subtitle && <p className={styles.accSubtitle}>{subtitle}</p>}
        </div>
        <div className={styles.accRight}>
          {hasError && <span className={styles.accBadge}>Fix errors</span>}
          <span className={`${styles.accChevron} ${open ? styles.accChevronOpen : ""}`} aria-hidden>
            ▾
          </span>
        </div>
      </button>
      {open && <div className={styles.accBody}>{children}</div>}
    </div>
  );
}

/* ---------- Mould Details block (re-used for every component) ---------- */
function MouldFields({
  ctx,
  base,
  m,
  set,
}: {
  ctx: Ctx;
  base: string;
  m: MouldState;
  set: (patch: Partial<MouldState>) => void;
}) {
  return (
    <>
      <Field ctx={ctx} id={`${base}.mouldNameOrId`} label="Mould Name / ID" value={m.mouldNameOrId} placeholder="Bottle Cap Mould · MX-000123" onChange={(v) => set({ mouldNameOrId: v })} />

      <div className="mt-3 grid grid-cols-2 gap-3">
        <SelectField label="Mould Type" value={m.mouldType} options={MOULD_TYPES} onChange={(v) => set({ mouldType: v })} />
        <Field ctx={ctx} id={`${base}.year`} label="Year of Manufacturing" value={m.year} mode="int" maxLength={4} placeholder="2022" onChange={(v) => set({ year: v })} />
      </div>

      <DimensionsRow
        ctx={ctx}
        base={base}
        values={m}
        onChange={(k, v) => set({ [k]: v } as Partial<MouldState>)}
      />

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Field ctx={ctx} id={`${base}.weight`} label="Weight (kg)" value={m.weight} mode="dec" placeholder="185" onChange={(v) => set({ weight: v })} />
        <Field ctx={ctx} id={`${base}.cavities`} label="No. of Cavities / Core" value={m.cavities} mode="int" placeholder="4" onChange={(v) => set({ cavities: v })} />
        <Field ctx={ctx} id={`${base}.cycleTime`} label="Expected Cycle Time (virgin material) (s)" value={m.cycleTime} mode="int" placeholder="28" onChange={(v) => set({ cycleTime: v })} />
        <Field ctx={ctx} id={`${base}.tonnage`} label="Recommended Machine Tonnage (T)" value={m.tonnage} mode="dec" placeholder="220" onChange={(v) => set({ tonnage: v })} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <SelectField label="Hot Runner / Cold Runner" value={m.runnerType} options={RUNNER_TYPES} onChange={(v) => set({ runnerType: v })} />
        <SelectField label="Changeable Brand Logo" value={m.changeableLogo} options={YES_NO} onChange={(v) => set({ changeableLogo: v })} />
      </div>
    </>
  );
}

/* =====================================================================
   PAGE
===================================================================== */
export default function ProductDetailsPage() {
  const router = useRouter();

  const [product, setProduct] = useState<ProductState>(emptyProduct);
  const [components, setComponents] = useState<ComponentState[]>([emptyComponent()]);
  const [moulds, setMoulds] = useState<MouldState[]>([emptyMould()]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<Record<number, boolean>>({});

  // ---------- Geo-tag state (shared by every image and video) ----------
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");

  const count = Number(product.componentCount);
  const hasSelection = count >= 1;
  const multiple = count > 1;

  const errors = validateAll(product, components, moulds);
  const ctx: Ctx = {
    errors,
    touched,
    touch: (key) => setTouched((prev) => ({ ...prev, [key]: true })),
    locationStatus,
  };

  /* ---------- updaters ---------- */
  const setP = (patch: Partial<ProductState>) => setProduct((prev) => ({ ...prev, ...patch }));
  const setComp = (i: number, patch: Partial<ComponentState>) =>
    setComponents((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const setMould = (i: number, patch: Partial<MouldState>) =>
    setMoulds((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));

  const handleCategoryChange = (category: string) => {
    setP({ category, subCategory: SUB_CATEGORIES[category]?.[0] ?? "" });
  };

  const handleCountChange = (value: string) => {
    const n = Number(value);
    setP({ componentCount: value });
    setTouched((prev) => ({ ...prev, count: true }));
    // arrays only grow, so typed data is kept when the count is reduced
    setComponents((prev) =>
      prev.length >= n ? prev : [...prev, ...Array.from({ length: n - prev.length }, emptyComponent)]
    );
    setMoulds((prev) =>
      prev.length >= n ? prev : [...prev, ...Array.from({ length: n - prev.length }, emptyMould)]
    );
  };

  /* ---------- Geolocation (cached after first success) ---------- */
  const fetchLocation = (): Promise<Coords | null> => {
    if (coords) return Promise.resolve(coords);
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setLocationStatus("denied");
      return Promise.resolve(null);
    }
    setLocationStatus("fetching");
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(c);
          setLocationStatus("done");
          resolve(c);
        },
        () => {
          setLocationStatus("denied");
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  };

  /* ---------- Product media ---------- */
  const handleProductImage = (file: File | null) => {
    setP({ image: file, imagePreview: file ? URL.createObjectURL(file) : null, imageGeo: null });
    if (file) fetchLocation().then((geo) => setP({ imageGeo: geo }));
  };

  const handleProductVideo = (file: File | null) => {
    setP({ video: file, videoGeo: null });
    if (file) fetchLocation().then((geo) => setP({ videoGeo: geo }));
  };

  /* ---------- Component media ---------- */
  const handleComponentImage = (i: number, file: File | null) => {
    setComp(i, { image: file, imagePreview: file ? URL.createObjectURL(file) : null, imageGeo: null });
    if (file) fetchLocation().then((geo) => setComp(i, { imageGeo: geo }));
  };

  const handleComponentVideo = (i: number, file: File | null) => {
    setComp(i, { video: file, videoGeo: null });
    if (file) fetchLocation().then((geo) => setComp(i, { videoGeo: geo }));
  };

  const isOpen = (i: number) => open[i] ?? i === 0;
  const toggle = (i: number) => setOpen((prev) => ({ ...prev, [i]: !isOpen(i) }));

  const sectionHasError = (i: number) =>
    Object.keys(errors).some(
      (k) => (k.startsWith(`c.${i}.`) || k.startsWith(`m.${i}.`)) && errors[k] && touched[k]
    );

  const handleSubmit = () => {
    setTouched(Object.fromEntries(Object.keys(errors).map((k) => [k, true])));
    if (Object.keys(errors).length > 0) {
      // open every component so every error is visible
      if (count > 0) {
        setOpen(Object.fromEntries(Array.from({ length: count }, (_, i) => [i, true])));
      }
      return;
    }
    // TODO: submit {
    //   product,                                                  // includes imageGeo / videoGeo
    //   components: multiple ? components.slice(0, count) : [],   // each has imageGeo / videoGeo
    //   moulds: moulds.slice(0, count),
    //   geoLocation: coords,
    // }
    router.push("/owner/moulds/new/submitted");
  };

  const subOptions = SUB_CATEGORIES[product.category] ?? [];
  const countError = touched["count"] ? errors["count"] : "";

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className="text-[26px] font-extrabold text-gray-900">Product Details</h1>
        <p className="mt-1 text-sm text-gray-400">Add the product, its components &amp; moulds.</p>

        <Stepper current={2} />

        {/* ================= PRODUCT DETAILS ================= */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Product Details</h2>

          <Field ctx={ctx} id="p.productName" label="Product Name" value={product.productName} placeholder="28mm PET Bottle Cap" onChange={(v) => setP({ productName: v })} />

          <div className="mt-3 grid grid-cols-2 gap-3">
            <SelectField label="Category" value={product.category} options={CATEGORIES} onChange={handleCategoryChange} />
            <div>
              <label className={styles.fieldLabel}>Sub Category</label>
              <select
                value={product.subCategory}
                onChange={(e) => setP({ subCategory: e.target.value })}
                className={styles.select}
                disabled={subOptions.length === 0}
              >
                {subOptions.length === 0 && <option value="">—</option>}
                {subOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <MediaPair
            ctx={ctx}
            base="p"
            image={product.image}
            imagePreview={product.imagePreview}
            imageGeo={product.imageGeo}
            video={product.video}
            videoGeo={product.videoGeo}
            onImage={handleProductImage}
            onVideo={handleProductVideo}
          />

          {/* ---------- Location capture info ---------- */}
          <div className={styles.geoFlag}>
            <span className={styles.geoFlagIcon} aria-hidden>
              i
            </span>
            <div>
              <p className={styles.geoFlagTitle}>Location capture</p>
              <p className={styles.geoFlagMsg}>
                {locationStatus === "idle" &&
                  "Location will be auto-attached to every photo and video (product and components) once captured."}
                {locationStatus === "fetching" && "Capturing location…"}
                {locationStatus === "done" &&
                  coords &&
                  `Captured at ${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(4)}°E — attached to all photos and videos and visible to customer with the listing.`}
                {locationStatus === "denied" &&
                  "Location permission was not granted — media will upload without a geotag."}
              </p>
            </div>
          </div>

          <DimensionsRow
            ctx={ctx}
            base="p"
            values={product}
            onChange={(k, v) => setP({ [k]: v } as Partial<ProductState>)}
          />

          <div className="mt-3">
            <Field ctx={ctx} id="p.weight" label="Weight (g)" value={product.weight} mode="dec" placeholder="3.2" onChange={(v) => setP({ weight: v })} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field ctx={ctx} id="p.material" label="Material" value={product.material} placeholder="HDPE" onChange={(v) => setP({ material: v })} />
            <Field ctx={ctx} id="p.surfaceFinish" label="Surface Finish" value={product.surfaceFinish} placeholder="Matte" onChange={(v) => setP({ surfaceFinish: v })} />
          </div>

          <div className="mt-3">
            <Field ctx={ctx} id="p.securityDeposit" label="Security Deposit Amount (₹)" value={product.securityDeposit} mode="dec" placeholder="50000" onChange={(v) => setP({ securityDeposit: v })} />
          </div>
        </div>

        {/* ---------- Rental price hero card ---------- */}
        <div className={styles.rentalCard}>
          <span className={styles.rentalPill}>RENTAL</span>
          <div className={styles.rentalPriceRow}>
            <span className={styles.rentalPrice}>₹{product.perDayCharges || "0"}</span>
            <span className={styles.rentalPeriod}>/ day</span>
          </div>
          <p className={styles.rentalSubtext}>Per day rental charges</p>

          <input
            type="text"
            inputMode="decimal"
            value={product.perDayCharges}
            onChange={(e) => setP({ perDayCharges: clean(e.target.value, "dec") })}
            onBlur={() => ctx.touch("p.perDayCharges")}
            placeholder="Enter amount"
            className={styles.rentalInput}
          />
          {touched["p.perDayCharges"] && errors["p.perDayCharges"] && (
            <p className={styles.rentalError}>{errors["p.perDayCharges"]}</p>
          )}
        </div>

        {/* ================= SET OF COMPONENTS / MOULDS ================= */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Set of Components / Moulds Involved</h2>
          <label className={styles.fieldLabel}>Number of components / moulds</label>
          <select
            value={product.componentCount}
            onChange={(e) => handleCountChange(e.target.value)}
            className={`${styles.select} ${countError ? styles.inputError : ""}`}
          >
            {Array.from({ length: MAX_COMPONENTS + 1 }, (_, i) => String(i)).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {countError && <p className={styles.errorText}>{countError}</p>}
          <p className={styles.helperText}>
            {!hasSelection
              ? "Select how many components / moulds are involved. The forms will appear below."
              : multiple
              ? `Fill details for all ${count} components below (example: Pen → Cap, Body, Bottom, Top).`
              : "Single mould. Fill the mould details below."}
          </p>
        </div>

        {/* ================= SINGLE MOULD ================= */}
        {count === 1 && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Mould Details</h2>
            <MouldFields ctx={ctx} base="m.0" m={moulds[0]} set={(patch) => setMould(0, patch)} />
          </div>
        )}

        {/* ================= MULTIPLE COMPONENTS (collapsible) ================= */}
        {multiple &&
          Array.from({ length: count }, (_, i) => {
            const c = components[i];
            const m = moulds[i];
            if (!c || !m) return null;
            const cBase = `c.${i}`;
            return (
              <Accordion
                key={i}
                title={`Component ${i + 1}`}
                subtitle={c.name || "Tap to fill component and mould details"}
                open={isOpen(i)}
                onToggle={() => toggle(i)}
                hasError={sectionHasError(i)}
              >
                {/* ----- Component Details ----- */}
                <p className={styles.subTitle}>Component Details</p>

                <div className="mt-3">
                  <Field ctx={ctx} id={`${cBase}.name`} label="Component Name" value={c.name} placeholder="Cap" onChange={(v) => setComp(i, { name: v })} />
                </div>

                <MediaPair
                  ctx={ctx}
                  base={cBase}
                  image={c.image}
                  imagePreview={c.imagePreview}
                  imageGeo={c.imageGeo}
                  video={c.video}
                  videoGeo={c.videoGeo}
                  onImage={(f) => handleComponentImage(i, f)}
                  onVideo={(f) => handleComponentVideo(i, f)}
                />

                <DimensionsRow
                  ctx={ctx}
                  base={cBase}
                  values={c}
                  onChange={(k, v) => setComp(i, { [k]: v } as Partial<ComponentState>)}
                />

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Field ctx={ctx} id={`${cBase}.weight`} label="Weight (g)" value={c.weight} mode="dec" placeholder="3.2" onChange={(v) => setComp(i, { weight: v })} />
                  <Field ctx={ctx} id={`${cBase}.surfaceFinish`} label="Surface Finish" value={c.surfaceFinish} placeholder="Matte" onChange={(v) => setComp(i, { surfaceFinish: v })} />
                </div>

                {/* ----- Mould Details ----- */}
                <div className={styles.divider} />
                <p className={styles.subTitle}>Mould Details</p>
                <div className="mt-3">
                  <MouldFields ctx={ctx} base={`m.${i}`} m={m} set={(patch) => setMould(i, patch)} />
                </div>
              </Accordion>
            );
          })}
      </div>

      {/* ---------- Sticky Submit ---------- */}
      <div className={styles.ctaBar}>
        <button type="button" onClick={handleSubmit} className={`${styles.ctaBtn} btn-primary`}>
          Submit Listing for Approval
        </button>
      </div>
    </div>
  );
}