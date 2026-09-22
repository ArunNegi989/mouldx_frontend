"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./MouldExplore.module.css";
import MouldListCard from "@/app/components/explore/MouldListCard";
import { DUMMY_MOULDS, type Category as MouldCategory } from "@/app/data/moulds";
interface Mould {
  id: string;
  code: string;
  name: string;
  city: string;
  price: string;
  category: "Injection" | "Blow" | "Die-Cast";
  availability: "FREE" | "2 LEFT" | "BOOKED";
  image: string;
}

const CATEGORIES = ["All", "Injection", "Blow", "Die-Cast", "Nearby"] as const;
const AVAILABILITY_OPTIONS = ["All", "FREE", "2 LEFT", "BOOKED"] as const;
const PRICE_RANGES = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Under ₹2,000", min: 0, max: 1999 },
  { label: "₹2,000 – ₹3,500", min: 2000, max: 3500 },
  { label: "Above ₹3,500", min: 3501, max: Infinity },
] as const;

const PAGE_SIZE = 10;

function parsePrice(price: string) {
  return Number(price.replace(/[^0-9]/g, "")) || 0;
}

export default function MouldExplore() {
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [activePriceLabel, setActivePriceLabel] = useState<(typeof PRICE_RANGES)[number]["label"]>("Any price");
  const [activeAvailability, setActiveAvailability] = useState<(typeof AVAILABILITY_OPTIONS)[number]>("All");
  const [page, setPage] = useState(1);

  const listTopRef = useRef<HTMLDivElement | null>(null);
  const prevPageRef = useRef(page);

  const activePriceRange = PRICE_RANGES.find((r) => r.label === activePriceLabel) ?? PRICE_RANGES[0];

  const filteredMoulds = useMemo(() => {
    return DUMMY_MOULDS.filter((m) => {
      const matchesCategory =
        activeCategory === "All" || activeCategory === "Nearby" || m.category === activeCategory;
      const matchesSearch =
        search.trim() === "" ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.code.toLowerCase().includes(search.toLowerCase()) ||
        m.city.toLowerCase().includes(search.toLowerCase());
      const priceValue = parsePrice(m.price);
      const matchesPrice = priceValue >= activePriceRange.min && priceValue <= activePriceRange.max;
      const matchesAvailability = activeAvailability === "All" || m.availability === activeAvailability;
      return matchesCategory && matchesSearch && matchesPrice && matchesAvailability;
    });
  }, [search, activeCategory, activePriceRange, activeAvailability]);

  // Reset to page 1 whenever search or filters change
  useEffect(() => {
    setPage(1);
  }, [search, activeCategory, activePriceLabel, activeAvailability]);

  // Scroll to the top of the list only when the page value actually changes.
  // Comparing against the previous value (instead of a "first render" flag)
  // keeps this safe under React Strict Mode's double-invoked effects.
  useEffect(() => {
    if (prevPageRef.current !== page) {
      listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    prevPageRef.current = page;
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(filteredMoulds.length / PAGE_SIZE));
  const paginatedMoulds = filteredMoulds.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const activeFilterCount =
    (activeCategory !== "All" ? 1 : 0) +
    (activePriceLabel !== "Any price" ? 1 : 0) +
    (activeAvailability !== "All" ? 1 : 0);

  const clearFilters = () => {
    setActiveCategory("All");
    setActivePriceLabel("Any price");
    setActiveAvailability("All");
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Find a mould</h2>
      <p className={styles.subtitle}>1,240+ verified listings across India</p>

      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden>🔍</span>
          <input
            type="text"
            placeholder="Search by mould type, cavity, size..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <button
          onClick={() => setIsFilterOpen((v) => !v)}
          className={`${styles.filterToggle} ${isFilterOpen ? styles.filterToggleActive : ""}`}
        >
          <span aria-hidden>⚙</span> Filters
          {activeFilterCount > 0 && <span className={styles.filterCount}>{activeFilterCount}</span>}
        </button>
      </div>

      {isFilterOpen && (
        <div className={styles.filterPanel}>
          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Category</p>
            <div className={styles.chipsRow}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`${styles.chip} ${activeCategory === cat ? styles.chipActive : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Price</p>
            <div className={styles.chipsRow}>
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setActivePriceLabel(range.label)}
                  className={`${styles.chip} ${activePriceLabel === range.label ? styles.chipActive : ""}`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Availability</p>
            <div className={styles.chipsRow}>
              {AVAILABILITY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setActiveAvailability(opt)}
                  className={`${styles.chip} ${activeAvailability === opt ? styles.chipActive : ""}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className={styles.clearFilters}>
              Clear all filters
            </button>
          )}
        </div>
      )}

      <div ref={listTopRef} className={styles.list}>
        {paginatedMoulds.map((m) => (
          <MouldListCard key={m.id} {...m} />
        ))}

        {filteredMoulds.length === 0 && (
          <p className={styles.emptyText}>No moulds match your search.</p>
        )}
      </div>

      {filteredMoulds.length > 0 && totalPages > 1 && (
        <div className={styles.pagination}>
          <button onClick={() => goToPage(page - 1)} disabled={page === 1} className={styles.pageBtn}>
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
            >
              {p}
            </button>
          ))}

          <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} className={styles.pageBtn}>
            Next →
          </button>
        </div>
      )}
    </section>
  );
}