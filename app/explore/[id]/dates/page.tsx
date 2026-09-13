"use client";

import { useMemo, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMouldDetail, getBookedDaysForMonth } from "@/app/data/moulds";
import styles from "./SelectDates.module.css";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type CellStatus =
  | "muted"
  | "past"
  | "booked"
  | "single"
  | "start"
  | "end"
  | "inRange"
  | "free";

interface DayCell {
  date: Date;
  day: number;
  inCurrentMonth: boolean;
  isPast: boolean;
  isBooked: boolean;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function sameDay(a: Date, b: Date) {
  return a.getTime() === b.getTime();
}

function formatShort(d: Date) {
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)}`;
}

function formatRangeLabel(start: Date, end: Date) {
  return start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
    ? `${start.getDate()}–${formatShort(end)}`
    : `${formatShort(start)} – ${formatShort(end)}`;
}

export default function SelectDatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const mould = useMemo(() => getMouldDetail(id), [id]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bookedDaysThisView = useMemo(
    () => (mould ? getBookedDaysForMonth(mould.id, viewYear, viewMonth) : new Set<number>()),
    [mould, viewYear, viewMonth]
  );

  const isRangeClean = (start: Date, end: Date) => {
    if (!mould) return false;
    const cursor = new Date(start);
    while (cursor <= end) {
      const monthBooked = getBookedDaysForMonth(mould.id, cursor.getFullYear(), cursor.getMonth());
      if (monthBooked.has(cursor.getDate())) return false;
      cursor.setDate(cursor.getDate() + 1);
    }
    return true;
  };

  const cells = useMemo<DayCell[]>(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const leading = firstOfMonth.getDay();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const list: DayCell[] = [];

    for (let i = leading - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      list.push({
        date: new Date(viewYear, viewMonth - 1, day),
        day,
        inCurrentMonth: false,
        isPast: true,
        isBooked: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewYear, viewMonth, day);
      list.push({
        date,
        day,
        inCurrentMonth: true,
        isPast: startOfDay(date) < today,
        isBooked: bookedDaysThisView.has(day),
      });
    }

    const trailing = (7 - (list.length % 7)) % 7;
    for (let day = 1; day <= trailing; day++) {
      list.push({
        date: new Date(viewYear, viewMonth + 1, day),
        day,
        inCurrentMonth: false,
        isPast: false,
        isBooked: false,
      });
    }

    return list;
  }, [viewYear, viewMonth, bookedDaysThisView, today]);

  const handleDayClick = (cell: DayCell) => {
    if (!cell.inCurrentMonth || cell.isPast || cell.isBooked) return;
    setError(null);
    const clicked = cell.date;

    const startFresh = () => {
      setRangeStart(clicked);
      setRangeEnd(null);
    };

    if (!rangeStart || (rangeStart && rangeEnd && clicked >= rangeStart && clicked <= rangeEnd)) {
      startFresh();
      return;
    }

    if (rangeStart && !rangeEnd) {
      if (clicked.getTime() < rangeStart.getTime()) {
        if (!isRangeClean(clicked, rangeStart)) {
          setError("Some dates in this range are already booked.");
          return;
        }
        setRangeEnd(rangeStart);
        setRangeStart(clicked);
      } else {
        if (!isRangeClean(rangeStart, clicked)) {
          setError("Some dates in this range are already booked.");
          return;
        }
        setRangeEnd(clicked);
      }
      return;
    }

    if (rangeStart && rangeEnd) {
      if (clicked.getTime() > rangeEnd.getTime()) {
        if (!isRangeClean(rangeStart, clicked)) {
          setError("Some dates in this range are already booked.");
          return;
        }
        setRangeEnd(clicked);
      } else if (clicked.getTime() < rangeStart.getTime()) {
        if (!isRangeClean(clicked, rangeEnd)) {
          setError("Some dates in this range are already booked.");
          return;
        }
        setRangeStart(clicked);
      }
    }
  };

  const getCellStatus = (cell: DayCell): CellStatus => {
    if (!cell.inCurrentMonth) return "muted";
    if (cell.isPast) return "past";
    if (cell.isBooked) return "booked";
    if (rangeStart && !rangeEnd && sameDay(cell.date, rangeStart)) return "single";
    if (rangeStart && rangeEnd) {
      if (sameDay(cell.date, rangeStart) && sameDay(cell.date, rangeEnd)) return "single";
      if (sameDay(cell.date, rangeStart)) return "start";
      if (sameDay(cell.date, rangeEnd)) return "end";
      if (cell.date > rangeStart && cell.date < rangeEnd) return "inRange";
    }
    return "free";
  };

  const goToPrevMonth = () => {
    setError(null);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    setError(null);
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const clearSelection = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setError(null);
  };

  const handleContinue = () => {
    if (!rangeStart || !rangeEnd) return;

    const checkIn = rangeStart.toISOString().split("T")[0];
    const checkOut = rangeEnd.toISOString().split("T")[0];

    router.push(`/explore/${id}/confirm?checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  const selectedDaysCount =
    rangeStart && rangeEnd
      ? Math.round((rangeEnd.getTime() - rangeStart.getTime()) / 86400000) + 1
      : 0;

  const pricePerDay = useMemo(
    () => (mould ? Number(mould.price.replace(/[^0-9]/g, "")) || 0 : 0),
    [mould]
  );
  const totalPrice = pricePerDay * selectedDaysCount;

  if (!mould) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <p className="text-sm text-gray-500">Mould not found.</p>
        <Link href="/explore" className="text-sm font-semibold text-blue-600">
          ← Back to Explore
        </Link>
      </div>
    );
  }

  const canContinue = Boolean(rangeStart && rangeEnd);

  return (
    <div className={styles.page}>
      {/* ---------- Sticky header ---------- */}
      <header className={styles.header}>
        <Link href={`/explore/${id}`} className={styles.iconBtn} aria-label="Go back">
          ←
        </Link>
        <span className="text-[15px] font-extrabold text-gray-900 sm:text-[16px]">
          Mould<span className="text-cyan-500">X</span>
        </span>
        <button type="button" className={styles.iconBtn} aria-label="Help">
          ?
        </button>
      </header>

      <div className={styles.content}>
        <h1 className={styles.pageTitle}>Select rental dates</h1>
        <p className={styles.pageSubtitle}>
          {mould.code} · {mould.name}
        </p>

        {/* ---------- Trip summary strip (appears once a range is picked) ---------- */}
        {canContinue && (
          <div className={styles.summaryCard}>
            <div className={styles.summaryDates}>
              <div className={styles.summaryDateBlock}>
                <span className={styles.summaryDateLabel}>Pickup</span>
                <span className={styles.summaryDateValue}>
                  {formatShort(rangeStart as Date)}
                </span>
              </div>
              <span className={styles.summaryArrow}>→</span>
              <div className={styles.summaryDateBlock}>
                <span className={styles.summaryDateLabel}>Return</span>
                <span className={styles.summaryDateValue}>{formatShort(rangeEnd as Date)}</span>
              </div>
            </div>
            <span className={styles.summaryDaysPill}>
              {selectedDaysCount} DAY{selectedDaysCount > 1 ? "S" : ""}
            </span>
          </div>
        )}

        {/* ---------- Calendar card ---------- */}
        <div className={styles.calendarCard}>
          <div className={styles.calendarHeader}>
            <div className={styles.monthNav}>
              <button
                type="button"
                onClick={goToPrevMonth}
                className={styles.monthNavBtn}
                aria-label="Previous month"
              >
                ‹
              </button>
              <p className={styles.monthLabel}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </p>
              <button
                type="button"
                onClick={goToNextMonth}
                className={styles.monthNavBtn}
                aria-label="Next month"
              >
                ›
              </button>
            </div>

            {!canContinue && (
              <span className={styles.pickDatesPill}>
                {rangeStart ? "PICK RETURN DATE" : "PICK PICKUP DATE"}
              </span>
            )}
          </div>

          <div className={styles.weekdaysRow}>
            {WEEKDAYS.map((w, i) => (
              <span key={`${w}-${i}`} className={styles.weekdayLabel}>
                {w}
              </span>
            ))}
          </div>

          <div className={styles.daysGrid}>
            {cells.map((cell, index) => {
              const status = getCellStatus(cell);

              const statusClass =
                status === "muted"
                  ? styles.dayMuted
                  : status === "past"
                  ? styles.dayPast
                  : status === "booked"
                  ? styles.dayBooked
                  : status === "single"
                  ? styles.daySingle
                  : status === "start"
                  ? styles.dayStart
                  : status === "end"
                  ? styles.dayEnd
                  : status === "inRange"
                  ? styles.dayInRange
                  : styles.dayFree;

              return (
                <button
                  key={`${cell.date.toISOString()}-${index}`}
                  type="button"
                  onClick={() => handleDayClick(cell)}
                  disabled={status === "muted" || status === "past" || status === "booked"}
                  className={`${styles.dayCell} ${statusClass}`}
                >
                  <span className={styles.dayNumber}>{cell.day}</span>
                </button>
              );
            })}
          </div>

          {(rangeStart || rangeEnd) && (
            <button type="button" onClick={clearSelection} className={styles.clearBtn}>
              Clear dates
            </button>
          )}
        </div>

        {error && <p className={styles.errorBanner}>{error}</p>}

        {/* ---------- Legend ---------- */}
        <div className={styles.legendCard}>
          <span className={`${styles.legendPill} ${styles.legendFree}`}>
            <span className={styles.legendDot} /> FREE
          </span>
          <span className={`${styles.legendPill} ${styles.legendBooked}`}>
            <span className={styles.legendDot} /> BOOKED
          </span>
          <span className={`${styles.legendPill} ${styles.legendSelected}`}>
            <span className={styles.legendDot} /> SELECTED
          </span>
        </div>
      </div>

      {/* ---------- Sticky CTA ---------- */}
      <div className={styles.ctaBar}>
        {canContinue && (
          <div className={styles.ctaPriceRow}>
            <span className={styles.ctaPriceLabel}>
              ₹{pricePerDay.toLocaleString("en-IN")} × {selectedDaysCount} day
              {selectedDaysCount > 1 ? "s" : ""}
            </span>
            <span className={styles.ctaPriceValue}>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
        )}

        <button
          type="button"
          disabled={!canContinue}
          onClick={handleContinue}
          className={`${styles.ctaBtn} ${canContinue ? styles.ctaBtnActive : styles.ctaBtnDisabled}`}
        >
          {canContinue
            ? `Continue with ${formatRangeLabel(rangeStart as Date, rangeEnd as Date)} →`
            : "Select check-in & check-out dates"}
        </button>
      </div>
    </div>
  );
}