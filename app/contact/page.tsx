import type { Metadata } from "next";
import ContactUs from "@/app/components/contact/ContactUs";

export const metadata: Metadata = {
  title: "Contact Us | MouldX",
  description:
    "Call, WhatsApp or visit MouldX in Jaspur, Uttarakhand. We help manufacturers across North India rent verified moulds.",
};

export default function ContactPage() {
  return <ContactUs />;
}