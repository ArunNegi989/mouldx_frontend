"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./EditStatus.module.css";
import { fetchListing, submitListing } from "./api";
import { GeneralForm, MouldListing, ProductForm, TechnicalForm } from "./types";

interface EditMouldContextValue {
  id: string;
  listing: MouldListing;
  technical: TechnicalForm;
  setTechnical: Dispatch<SetStateAction<TechnicalForm>>;
  general: GeneralForm;
  setGeneral: Dispatch<SetStateAction<GeneralForm>>;
  product: ProductForm;
  setProduct: Dispatch<SetStateAction<ProductForm>>;
  submitting: boolean;
  submit: () => Promise<void>;
}

const EditMouldContext = createContext<EditMouldContextValue | null>(null);

export function useEditMould() {
  const ctx = useContext(EditMouldContext);
  if (!ctx) throw new Error("useEditMould must be used inside EditMouldProvider");
  return ctx;
}

function Loaded({ initial, children }: { initial: MouldListing; children: ReactNode }) {
  const [listing, setListing] = useState(initial);
  const [technical, setTechnical] = useState(initial.technical);
  const [general, setGeneral] = useState(initial.general);
  const [product, setProduct] = useState(initial.product);
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(async () => {
    setSubmitting(true);
    try {
      const result = await submitListing(listing.id, { technical, general, product });
      setListing((prev) => ({
        ...prev,
        approval: {
          status: "PENDING",
          submittedAt: result.submittedAt,
          etaHours: 12,
        },
      }));
    } finally {
      setSubmitting(false);
    }
  }, [listing.id, technical, general, product]);

  return (
    <EditMouldContext.Provider
      value={{
        id: listing.id,
        listing,
        technical,
        setTechnical,
        general,
        setGeneral,
        product,
        setProduct,
        submitting,
        submit,
      }}
    >
      {children}
    </EditMouldContext.Provider>
  );
}

type LoadResult =
  | { state: "loading" }
  | { state: "ready"; listing: MouldListing }
  | { state: "notfound" }
  | { state: "error" };

export function EditMouldProvider({ children }: { children: ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<LoadResult>({ state: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setResult({ state: "loading" });
    fetchListing(id)
      .then((listing) => {
        if (cancelled) return;
        setResult(listing ? { state: "ready", listing } : { state: "notfound" });
      })
      .catch(() => {
        if (!cancelled) setResult({ state: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  if (result.state === "loading") {
    return (
      <div className={styles.state}>
        <span className={styles.spinner} aria-hidden />
        <p className={styles.stateText}>Loading mould details…</p>
      </div>
    );
  }

  if (result.state === "notfound") {
    return (
      <div className={styles.state}>
        <h1 className={styles.stateTitle}>Mould not found</h1>
        <p className={styles.stateText}>This mould does not exist or you do not have access to it.</p>
        <Link href="/owner/moulds" className={styles.stateBtn}>
          Back to My Moulds
        </Link>
      </div>
    );
  }

  if (result.state === "error") {
    return (
      <div className={styles.state}>
        <h1 className={styles.stateTitle}>Could not load mould</h1>
        <p className={styles.stateText}>Check your connection and try again.</p>
        <button type="button" className={styles.stateBtn} onClick={() => setAttempt((n) => n + 1)}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <Loaded key={result.listing.id} initial={result.listing}>
      {children}
    </Loaded>
  );
}