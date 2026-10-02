"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Search, Mic, X } from "lucide-react";
import MouldListCard from "@/app/components/explore/MouldListCard";
import { DUMMY_MOULDS } from "@/app/data/moulds";
import styles from "./SearchOverlay.module.css";

const POPULAR = ["Chair", "Table", "Stool", "Crate", "Bucket", "Injection", "Blow"];
const MAX_RESULTS = 50;

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
};

// "tables" -> "table", plural likhne par bhi match ho
function normalizeToken(t: string) {
  return t.length > 3 ? t.replace(/s$/, "") : t;
}

interface Props {
  open: boolean;
  query: string;
  onQueryChange: (q: string) => void;
  onClose: () => void;
}

export default function SearchOverlay({ open, query, onQueryChange, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [listening, setListening] = useState(false);

  // Open hone par input focus, background scroll lock, Esc se close
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const tokens = query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(normalizeToken);

    if (tokens.length === 0) return DUMMY_MOULDS;

    return DUMMY_MOULDS.filter((m) => {
      const haystack = `${m.name} ${m.code} ${m.city} ${m.category}`.toLowerCase();
      return tokens.every((t) => haystack.includes(t));
    });
  }, [query]);

  const hasQuery = query.trim().length > 0;

  const handleVoice = () => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.onresult = (e) => onQueryChange(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search moulds"
        >
          {/* Top bar */}
          <div className={styles.topBar}>
            <button type="button" onClick={onClose} className={styles.backBtn} aria-label="Back">
              <ArrowLeft size={22} />
            </button>

            <form
              className={styles.field}
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                inputRef.current?.blur(); // keyboard band
              }}
            >
              <Search size={18} className={styles.fieldIcon} aria-hidden />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search chair, table, stool mould..."
                className={styles.input}
                autoComplete="off"
                enterKeyHint="search"
                aria-label="Search moulds"
              />
              {hasQuery && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => {
                    onQueryChange("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={handleVoice}
                className={`${styles.micBtn} ${listening ? styles.micActive : ""}`}
                aria-label="Voice search"
              >
                <Mic size={16} />
              </button>
            </form>
          </div>

          {/* Body */}
          <div className={styles.body}>
            {!hasQuery && (
              <div className={styles.popular}>
                <p className={styles.sectionLabel}>Popular searches</p>
                <div className={styles.chips}>
                  {POPULAR.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={styles.chip}
                      onClick={() => onQueryChange(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className={styles.sectionLabel}>
              {hasQuery
                ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query.trim()}”`
                : "All moulds"}
            </p>

            <div className={styles.list}>
              {results.slice(0, MAX_RESULTS).map((m) => (
                <MouldListCard key={m.id} {...m} />
              ))}

              {results.length === 0 && (
                <div className={styles.empty}>
                  <p className={styles.emptyTitle}>No moulds found</p>
                  <p className={styles.emptyText}>Try a different name, like “chair” or “table”.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}