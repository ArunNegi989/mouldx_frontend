import Header from "@/app/components/layout/Header";
import BottomNav from "@/app/components/layout/BottomNav";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white pb-20">
      <Header />
      {children}
      <BottomNav />
    </div>
  );
}