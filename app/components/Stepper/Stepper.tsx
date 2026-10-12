import styles from "./Stepper.module.css";

// Flow: Basic → Product (product + components/moulds, technical & general inside) → Submit
const DEFAULT_STEPS = ["Kyc", "Product", "Submit"];

export default function Stepper({
  current,
  steps = DEFAULT_STEPS,
}: {
  current: number;
  steps?: string[];
}) {
  return (
    <ol className={styles.stepper} aria-label="Progress">
      {steps.map((label, i) => {
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