import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

export function Section({ children, className = "" }: SectionProps) {
  return (
    <section
      className={["mx-auto max-w-7xl px-6 py-section lg:px-12", className].filter(Boolean).join(" ")}
    >
      {children}
    </section>
  );
}
