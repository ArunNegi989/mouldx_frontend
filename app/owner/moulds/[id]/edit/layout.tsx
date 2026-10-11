import { ReactNode } from "react";
import { EditMouldProvider } from "./EditMouldProvider";

export default function EditMouldLayout({ children }: { children: ReactNode }) {
  return <EditMouldProvider>{children}</EditMouldProvider>;
}