import { ReactNode } from "react";
import Header from "./Header";

export default function PageShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-background text-primary min-h-screen">
      <Header />
      <main>{children}</main>
    </div>
  );
}
