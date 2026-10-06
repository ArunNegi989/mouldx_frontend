"use client";

import { useState, useEffect } from "react";

const KEY = "splashShown";

export default function SplashLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const fallback = setTimeout(() => finishLoading(), 6000);
    return () => clearTimeout(fallback);
  }, []);

  const finishLoading = () => {
    sessionStorage.setItem(KEY, "1");
    setLoading(false);
  };

  if (loading === null) return null;

  if (!loading) return <>{children}</>;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <video
        autoPlay
        muted
        playsInline
        onEnded={finishLoading}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      >
        <source src="/videos/loader.mp4" type="video/mp4" />
      </video>
    </div>
  );
}