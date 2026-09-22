"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Signup.module.css";
import Image from "next/image";

const REGEX = {
  fullName: /^[a-zA-Z\s.'-]{2,60}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[6-9]\d{9}$/,
};

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState({ fullName: false, email: false, phone: false });

  const errors = {
    fullName: fullName.trim() === ""
      ? "Full name is required"
      : !REGEX.fullName.test(fullName.trim())
        ? "Enter a valid name (letters only, 2-60 chars)"
        : "",
    email: email.trim() === ""
      ? ""
      : !REGEX.email.test(email.trim())
        ? "Enter a valid email address"
        : "",
    phone: phone.trim() === ""
      ? "Phone number is required"
      : !REGEX.phone.test(phone.trim())
        ? "Enter a valid 10-digit phone number"
        : "",
  };

  const isValid =
    REGEX.fullName.test(fullName.trim()) &&
    REGEX.phone.test(phone.trim()) &&
    (email.trim() === "" || REGEX.email.test(email.trim()));

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);
  };

  const handleContinue = () => {
    setTouched({ fullName: true, email: true, phone: true });
    if (!isValid) return;
    // TODO: call send-OTP API with { fullName, email, phone }
    router.push("/verify-otp");
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.logoWrap}>
          <Image
            src="/images/logo.png"
            alt="MouldX"
            fill
            priority
            className={styles.logo}
          />
        </div>
      </div>


      <h1 className={styles.title}>Create Account</h1>
      <p className={styles.subtitle}>
        Sign up to explore and manage chair moulds with ease.
      </p>

      <div className={styles.card}>
        <label className={styles.label} htmlFor="fullName">
          Full Name <span className={styles.required}>*</span>
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onBlur={() => handleBlur("fullName")}
          className={`${styles.input} ${touched.fullName && errors.fullName ? styles.inputError : ""}`}
        />
        {touched.fullName && errors.fullName && (
          <p className={styles.errorText}>{errors.fullName}</p>
        )}

        <label className={styles.label} htmlFor="email">Email ID</label>
        <input
          id="email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur("email")}
          className={`${styles.inputMuted} ${touched.email && errors.email ? styles.inputError : ""}`}
        />
        {touched.email && errors.email && (
          <p className={styles.errorText}>{errors.email}</p>
        )}

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
          onBlur={() => handleBlur("phone")}
          className={`${styles.input} ${touched.phone && errors.phone ? styles.inputError : ""}`}
        />
        {touched.phone && errors.phone && (
          <p className={styles.errorText}>{errors.phone}</p>
        )}

        <button
          type="button"
          disabled={!isValid}
          onClick={handleContinue}
          className={`${styles.otpBtn} btn-primary`}
        >
          Continue with OTP <span aria-hidden>→</span>
        </button>
      </div>

      <p className={styles.loginText}>
        Already have an account?{" "}
        <Link href="/login" className={styles.loginLink}>Login</Link>
      </p>
    </div>
  );
}