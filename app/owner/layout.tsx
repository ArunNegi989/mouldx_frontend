import Header from "@/app/components/layout/Header";
import OwnerBottomNav from "@/app/components/layout/OwnerBottomNav";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white pb-20">
     
      {children}
      <OwnerBottomNav />
    </div>
  );
}