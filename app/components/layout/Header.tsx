"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bell, User } from "lucide-react";
import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isOwner = pathname.startsWith("/owner");

  const homeHref = isOwner ? "/owner" : "/home";
  const profileHref = isOwner ? "/owner/profile" : "/profile";

  const menuItems = [
    { label: "Notifications", href: "#", icon: Bell },
    { label: "Profile", href: profileHref, icon: User },
  ];

  return (
    <header className={styles.header}>
      <Link href={homeHref} className={styles.logoLink}>
        <Image
          src="/images/logo.png"
          alt="MouldX"
          width={140}
          height={32}
          priority
          className={styles.logoImg}
        />
      </Link>

      <button
        aria-label={open ? "Close menu" : "Open menu"}
        className={styles.menuBtn}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <>
          {/* click outside to close */}
          <div className={styles.backdrop} onClick={() => setOpen(false)} />

          <div className={styles.dropdown}>
            {menuItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className={styles.dropdownItem}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </div>
        </>
      )}
    </header>
  );
}