import styles from "./Stepper.module.css";

const STEPS = ["Basic", "Technical", "General", "Product"];

export default function Stepper({ current }: { current: number }) {
  return (
    <ol className={styles.stepper} aria-label="Listing progress">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const state =
          step < current ? "done" : step === current ? "active" : "upcoming";

        return (
          <li
            key={label}
            className={`${styles.step} ${styles[state]}`}
            aria-current={state === "active" ? "step" : undefined}
          >
            <span className={styles.circle}>
              {state === "done" ? "✓" : step}
            </span>
            <span className={styles.label}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}