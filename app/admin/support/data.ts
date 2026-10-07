export type Role = "customer" | "owner";

export interface SupportMessage {
  id: string;
  sender: "user" | "admin";
  text: string;
  time: string;
}

export interface SupportThread {
  id: string;
  name: string;
  role: Role;
  initial: string;
  color: string;
  online: boolean;
  topic: string;
  bookingCode?: string;
  status: "open" | "resolved";
  unreadCount: number;
  messages: SupportMessage[];
}

// Dummy data - replace with API data later
export const SUPPORT_THREADS: SupportThread[] = [
  {
    id: "sup-rahul-sharma",
    name: "Rahul Sharma",
    role: "customer",
    initial: "R",
    color: "#2563eb",
    online: true,
    topic: "Payment confirmation",
    bookingCode: "BK-24581",
    status: "open",
    unreadCount: 2,
    messages: [
      { id: "m1", sender: "user", text: "My payment of ₹27,850 was deducted but booking still shows pending.", time: "10:02 AM" },
      { id: "m2", sender: "user", text: "Please check urgently.", time: "10:03 AM" },
    ],
  },
  {
    id: "sup-nova-plastics",
    name: "Nova Plastics",
    role: "owner",
    initial: "N",
    color: "#2563eb",
    online: false,
    topic: "Listing approval",
    status: "open",
    unreadCount: 0,
    messages: [
      { id: "m1", sender: "user", text: "When will my Bottle Cap Mould listing be approved?", time: "Yesterday" },
      { id: "m2", sender: "admin", text: "We are verifying the documents, will update shortly.", time: "Yesterday" },
    ],
  },
  {
    id: "sup-vector-molds",
    name: "Vector Molds",
    role: "owner",
    initial: "V",
    color: "#2563eb",
    online: false,
    topic: "Damage claim",
    bookingCode: "BK-24102",
    status: "resolved",
    unreadCount: 0,
    messages: [
      { id: "m1", sender: "user", text: "Thanks, claim received.", time: "3 days ago" },
    ],
  },
];