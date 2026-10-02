import type { Metadata } from "next";
import AboutUs from "@/app/components/about/AboutUs";

export const metadata: Metadata = {
  title: "About Us | MouldX",
  description: "MouldX connects manufacturers with verified moulds across India.",
};

export default function AboutPage() {
  return <AboutUs />;
}