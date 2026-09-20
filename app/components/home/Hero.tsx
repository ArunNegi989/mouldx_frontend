import Image from "next/image";
import Link from "next/link";
import heroimage from "@/public/images/mould-hero.png"
import logoimg from "@/public/images/logo.png"

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Background image */}
      <Image
        src={heroimage}
        alt="Precision chair mould in a factory"
        fill
        priority
        className="object-cover opacity-70"
      />

      {/* Dark gradient so text stays readable on any part of the image */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black/20" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col px-6 pt-8 pb-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
  <Image
    src={logoimg}
    alt="MouldX logo"
    width={140}
    height={32}
    priority
    className="h-8 w-auto"
  />
</div>
        <p className="mt-1 text-xs text-gray-400">Chair moulded Furniture</p>

        {/* Spacer pushes heading down like the reference */}
        <div className="flex-[0.6]" />

        {/* Heading */}
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl -mt-8">
          Premium
          <br />
          Chair Moulds
          <br />
          For a Stronger
          <br />
          <span className="text-blue-500">Tomorrow</span>
        </h1>

        {/* Subtext */}
        <p className="mt-4 max-w-sm text-sm text-gray-300">
          High precision chair moulds designed for longer life, better
          performance and higher production efficiency
        </p>

        {/* CTA */}
  <Link
  href="/home"
  style={{ textDecoration: "none" }}
  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#EFF6FF] hover:text-[#1E3A8A]"
>
          Explore Moulds
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}