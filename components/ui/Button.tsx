import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "dark";

type CommonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type AnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonProps = AnchorProps | NativeButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-primary hover:bg-accent/90",
  secondary: "border border-primary/20 bg-surface text-primary hover:border-accent",
  dark: "bg-primary text-surface hover:bg-primary/90",
};

export function Button(props: ButtonProps) {
  const { children, className = "", variant = "primary", ...rest } = props;
  const classes = [
    "inline-flex items-center justify-center rounded-button px-6 py-3 text-sm font-semibold transition-colors",
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props) {
    const { href, ...anchorProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
