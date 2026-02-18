import type { ReactNode } from "react";

type TypographyProps = {
  children: ReactNode;
  className?: string;
};

export function H1({ children, className = "" }: TypographyProps) {
  return (
    <h1 className={["text-5xl font-semibold leading-[1.2] lg:text-h1", className].filter(Boolean).join(" ")}>
      {children}
    </h1>
  );
}

export function H2({ children, className = "" }: TypographyProps) {
  return (
    <h2 className={["text-3xl font-semibold lg:text-h2", className].filter(Boolean).join(" ")}>
      {children}
    </h2>
  );
}

export function Body({ children, className = "" }: TypographyProps) {
  return (
    <p className={["text-base leading-relaxed text-primary/80 lg:text-lg", className].filter(Boolean).join(" ")}>
      {children}
    </p>
  );
}

export function Label({ children, className = "" }: TypographyProps) {
  return (
    <p className={["text-sm font-semibold uppercase tracking-wide text-accent", className].filter(Boolean).join(" ")}>
      {children}
    </p>
  );
}
