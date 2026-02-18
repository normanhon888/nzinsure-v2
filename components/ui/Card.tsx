import type { ElementType, HTMLAttributes, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
} & HTMLAttributes<HTMLElement>;

export function Card({ children, className = "", as: Component = "div", ...props }: CardProps) {
  return (
    <Component
      className={[
        "rounded-card border border-primary/10 bg-surface p-cardPadding",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}
