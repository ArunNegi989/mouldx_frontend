import type { Metadata } from "next";
import Faqs from "@/app/components/faqs/Faqs";

export const metadata: Metadata = {
  title: "FAQs | MouldX",
  description: "Answers to common questions about renting moulds on MouldX.",
};

export default function FaqsPage() {
  return <Faqs />;
}