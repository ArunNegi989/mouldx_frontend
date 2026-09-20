"use client";

import { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Chat.module.css";

type Sender = "me" | "other";

interface Message {
  id: string;
  sender: Sender;
  text: string;
  time: string;
}

interface ThreadInfo {
  id: string;
  type: "owner" | "admin";
  name: string;
  subtitle: string;
  initial: string;
  gradient: string;
  online: boolean;
  mould?: {
    name: string;
    code: string;
    image: string;
    bookingId: string;
    status: string;
  };
}

const THREAD_INFO: Record<string, ThreadInfo> = {
  "owner-sharma-BK24581": {
    id: "owner-sharma-BK24581",
    type: "owner",
    name: "Sharma Industries",
    subtitle: "BK-24581 · 2-Cavity Injection Mould",
    initial: "S",
    gradient: "linear-gradient(135deg, #22d3ee, #2563eb)",
    online: true,
    mould: {
      name: "2-Cavity Injection Mould",
      code: "MX-000123",
      image: "https://picsum.photos/seed/mould1/200/200",
      bookingId: "BK-24581",
      status: "Approval Pending",
    },
  },
  "admin-support": {
    id: "admin-support",
    type: "admin",
    name: "MouldX Support",
    subtitle: "We usually reply within a few hours",
    initial: "M",
    gradient: "linear-gradient(135deg, #34d399, #059669)",
    online: true,
  },
  "owner-vector-BK24102": {
    id: "owner-vector-BK24102",
    type: "owner",
    name: "Vector Molds",
    subtitle: "BK-24102 · Completed",
    initial: "V",
    gradient: "linear-gradient(135deg, #818cf8, #7c3aed)",
    online: false,
    mould: {
      name: "Blow Mould — 5L Can",
      code: "MX-000198",
      image: "https://picsum.photos/seed/mould2/200/200",
      bookingId: "BK-24102",
      status: "Completed",
    },
  },
};

const DUMMY_MESSAGES: Record<string, Message[]> = {
  "owner-sharma-BK24581": [
    { id: "m1", sender: "me", text: "Hi, when will the mould be dispatched?", time: "10:02 AM" },
    { id: "m2", sender: "other", text: "Dispatching today evening, will share tracking.", time: "10:15 AM" },
    { id: "m3", sender: "other", text: "Mould dispatched, arriving tomorrow.", time: "6:40 PM" },
  ],
  "admin-support": [
    { id: "m1", sender: "other", text: "Your payment of ₹27,850 was successful.", time: "Yesterday" },
    { id: "m2", sender: "me", text: "Thanks! Can I get an invoice for this?", time: "Yesterday" },
    { id: "m3", sender: "other", text: "Sure, sending it to your registered email shortly.", time: "Yesterday" },
  ],
  "owner-vector-BK24102": [
    { id: "m1", sender: "other", text: "Thanks for renting with us again!", time: "3 days ago" },
  ],
};

export default function ChatThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const info = THREAD_INFO[id];
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES[id] ?? []);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!info) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <p className="text-sm text-gray-500">Conversation not found.</p>
        <Link href="/inbox" className="text-sm font-bold text-blue-600 no-underline">
          ← Back to Inbox
        </Link>
      </div>
    );
  }

  const handleSend = () => {
    if (!draft.trim()) return;
    const newMessage: Message = {
      id: `m${Date.now()}`,
      sender: "me",
      text: draft.trim(),
      time: "Just now",
    };
    setMessages((prev) => [...prev, newMessage]);
    setDraft("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `m${Date.now() + 1}`,
          sender: "other",
          text:
            info.type === "admin"
              ? "Got it, our team will look into this."
              : "Noted, will update you shortly.",
          time: "Just now",
        },
      ]);
    }, 1400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* ---------- Header ---------- */}
      <header className="flex flex-shrink-0 items-center gap-3 border-b border-gray-100 px-4 py-3">
        <Link
          href="/inbox"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-900 no-underline"
          aria-label="Go back"
        >
          ←
        </Link>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className={styles.avatarWrap}>
            <div className={styles.headerAvatar} style={{ background: info.gradient }}>
              {info.type === "admin" ? "🛡" : info.initial}
            </div>
            {info.online && <span className={styles.onlineDot} />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900">{info.name}</p>
            <p className="truncate text-[11px] text-gray-400">
              {isTyping ? (
                <span className="font-semibold text-cyan-500">typing…</span>
              ) : info.online ? (
                <span className="text-emerald-500">Online</span>
              ) : (
                info.subtitle
              )}
            </p>
          </div>
        </div>

        <span className="w-9 flex-shrink-0" />
      </header>

      {/* ---------- Mould context card ---------- */}
      {info.mould && (
        <Link href={`/bookings/${info.mould.bookingId}`} className={styles.mouldCard}>
          <div className={styles.mouldThumbWrap}>
            <Image src={info.mould.image} alt={info.mould.name} fill className={styles.mouldThumb} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-gray-900">{info.mould.name}</p>
            <p className="truncate text-[11px] text-gray-400">
              {info.mould.code} · {info.mould.bookingId}
            </p>
          </div>
          <span className={styles.mouldStatusPill}>{info.mould.status}</span>
        </Link>
      )}

      {/* ---------- Messages ---------- */}
      <div className={styles.messages}>
        <div className="mb-2 flex justify-center">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold text-gray-400">
            Today
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div className={msg.sender === "me" ? styles.bubbleMe : styles.bubbleOther}>
              <p className="m-0 text-[13px] leading-snug">{msg.text}</p>
              <span
                className={`mt-1 block text-[10px] ${msg.sender === "me" ? "text-right text-cyan-50/80" : "text-gray-400"
                  }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className={styles.typingBubble}>
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ---------- Input bar ---------- */}
      <div className="flex flex-shrink-0 items-center gap-2 border-t border-gray-100 bg-white px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${info.type === "admin" ? "Support" : info.name}...`}
          className="flex-1 rounded-full border border-transparent bg-gray-100 px-4 py-2.5 text-[13px] text-gray-900 outline-none transition-colors focus:border-cyan-400 focus:bg-white"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!draft.trim()}
          className={styles.sendBtn}
          aria-label="Send message"
        >
          →
        </button>
      </div>
    </div>
  );
}