import type { HTMLAttributes } from "react";

type SectionVariant = "default" | "muted" | "dark";

type SectionProps = HTMLAttributes<HTMLElement> & {
  variant?: SectionVariant;
  compact?: boolean;
};

export default function Section({
  variant = "default",
  compact = false,
  className = "",
  ...props
}: SectionProps) {
  const spacing = compact ? "py-12 md:py-16" : "py-16 md:py-24";

  const variants: Record<SectionVariant, string> = {
    default: "bg-background",
    muted: "bg-surface/40",
    dark: "bg-primary text-surface",
  };

  return (
    <section
      className={[spacing, variants[variant], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
