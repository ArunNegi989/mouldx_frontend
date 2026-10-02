"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/components/layout/Header";
import SplashLoader from "@/app/components/shared/SplashLoader";
import Footer from "./Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // All admin pages should NOT show website Header/SplashLoader
  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <SplashLoader>
      <Header />
      {children}
      <Footer />
    </SplashLoader>
  );
}