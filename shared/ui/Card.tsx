import { ElementType, ReactNode } from "react";

type CardVariant = "flat" | "elevated" | "dark";

type CardProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
};

export default function Card<T extends ElementType = "div">({
  as,
  children,
  className = "",
  variant = "flat",
}: CardProps<T>) {
  const Component = as || "div";

  const base = "rounded-card p-cardPadding transition-[background-color,box-shadow,color] duration-200";

  const variants: Record<CardVariant, string> = {
    flat: "bg-transparent",
    elevated: "bg-surface shadow-md hover:shadow-lg",
    dark: "bg-primary text-surface",
  };

  return (
    <Component
      className={[base, variants[variant], className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Component>
  );
}
