const STATS = [
  { icon: "◎", label: "High\nPrecision" },
  { icon: "⏱", label: "Long\nMould Life" },
  { icon: "🚚", label: "Global\nShipping" },
];

export default function StatsBar() {
  return (
    <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-[#111827]">
      {STATS.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-1 py-5 text-center text-xs">
          <span className="text-xl">{s.icon}</span>
          <span className="whitespace-pre-line">{s.label}</span>
        </div>
      ))}
    </div>
  );
}