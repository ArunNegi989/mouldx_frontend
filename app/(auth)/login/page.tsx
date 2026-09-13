"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Login.module.css";

const TAGLINES = [
  "Chair moulded Furniture",
  "Precision. Durability. Trust.",
  "Moulds built for global manufacturers",
  "From design to delivery, engineered right.",
];

const REGEX = {
  phone: /^[6-9]\d{9}$/,
};

export default function LoginPage() {
  const router = useRouter();
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const error = phone.trim() === ""
    ? "Phone number is required"
    : !REGEX.phone.test(phone.trim())
    ? "Enter a valid 10-digit phone number"
    : "";

  const isValid = REGEX.phone.test(phone.trim());

  const handlePhoneChange = (value: string) => {
    setPhone(value.replace(/\D/g, "").slice(0, 10));
  };

  const handleContinue = () => {
    setTouched(true);
    if (!isValid) return;
    // TODO: call send-OTP API with { phone }
    router.push("/verify-otp");
  };

  return (
    <div className={styles.page}>
      <div className={styles.logoRow}>
        <div className={styles.logoWrap}>
          <Image src="/images/logo.png" alt="MouldX" fill priority className={styles.logo} />
        </div>

        <div className={styles.taglineWrap}>
          <AnimatePresence mode="wait">
            <motion.span
              key={taglineIndex}
              className={styles.tagline}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {TAGLINES[taglineIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <h1 className={styles.title}>Welcome Back</h1>
      <p className={styles.subtitle}>Login with your registered phone number</p>

      <div className={styles.form}>
        <label className={styles.label} htmlFor="phone">
          Phone Number <span className={styles.required}>*</span>
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          placeholder="98XXXXXX10"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onBlur={() => setTouched(true)}
          className={`${styles.input} ${touched && error ? styles.inputError : ""}`}
        />
        {touched && error && <p className={styles.errorText}>{error}</p>}

        <button
          type="button"
          disabled={!isValid}
          onClick={handleContinue}
          className={styles.loginBtn}
        >
          Continue with OTP <span aria-hidden>→</span>
        </button>
      </div>

      <p className={styles.signupText}>
        don&apos;t have any account yet ?{" "}
        <Link href="/signup" className={styles.signupLink}>Create one</Link>
      </p>
    </div>
  );
}