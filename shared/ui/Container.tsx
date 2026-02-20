import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export default function Container({ className = "", ...props }: ContainerProps) {
  return (
    <div className={["mx-auto w-full max-w-7xl px-cardPadding", className].filter(Boolean).join(" ")} {...props} />
  );
}
