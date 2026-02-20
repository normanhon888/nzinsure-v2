import type { HTMLAttributes } from "react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
};

const levelClasses: Record<HeadingLevel, string> = {
  1: "text-h1 leading-tight",
  2: "text-h2 leading-tight",
  3: "text-h2 leading-tight",
  4: "text-h2 leading-tight",
  5: "text-h2 leading-tight",
  6: "text-h2 leading-tight",
};

export default function Heading({ className = "", level = 2, ...props }: HeadingProps) {
  const classes = ["font-semibold text-primary", levelClasses[level], className].filter(Boolean).join(" ");

  if (level === 1) return <h1 className={classes} {...props} />;
  if (level === 2) return <h2 className={classes} {...props} />;
  if (level === 3) return <h3 className={classes} {...props} />;
  if (level === 4) return <h4 className={classes} {...props} />;
  if (level === 5) return <h5 className={classes} {...props} />;
  return <h6 className={classes} {...props} />;
}
