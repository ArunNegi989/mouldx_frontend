"use client";

import { useState, useEffect } from "react";

export default function SplashLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fallback = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(fallback);
  }, []);

  const finishLoading = () => setLoading(false);

  if (!loading) return <>{children}</>;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}>
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