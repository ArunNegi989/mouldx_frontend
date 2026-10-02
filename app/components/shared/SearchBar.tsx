"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Mic, X } from "lucide-react";
import styles from "./SearchBar.module.css";

const SUGGESTIONS = [
  "chair mould",
  "table mould",
  "stool mould",
  "crate mould",
  "bucket mould",
];

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onOpen: () => void; // tap par search page kholne ke liye
}

export default function SearchBar({ value, onChange, onOpen }: SearchBarProps) {
  const [index, setIndex] = useState(0);

  // rotating placeholder
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SUGGESTIONS.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.wrap} role="search">
      <div
        className={styles.bar}
        onClick={onOpen}
        role="button"
        tabIndex={0}
        aria-label="Open search"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
      >
        <Search size={18} className={styles.searchIcon} aria-hidden />

        <div className={styles.inputArea}>
          {value ? (
            <span className={styles.valueText}>{value}</span>
          ) : (
            <span className={styles.placeholder} aria-hidden>
              Search&nbsp;
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={styles.placeholderWord}
                >
                  &ldquo;{SUGGESTIONS[index]}&rdquo;
                </motion.span>
              </AnimatePresence>
            </span>
          )}
        </div>

        {value && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}

        <span className={styles.divider} aria-hidden />

        <span className={styles.micBtn} aria-hidden>
          <Mic size={16} />
        </span>
      </div>
    </div>
  );
}