import Link from "next/link";
import {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type LinkButtonProps = BaseProps & {
  href: string;
};

type NativeButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonProps = LinkButtonProps | NativeButtonProps;

export default function Button(props: ButtonProps) {
  const { children, variant = "primary", className = "" } = props;

  const base =
    "inline-flex items-center justify-center px-6 py-3 rounded-button font-semibold transition-colors";

  const styles = {
    primary: "bg-primary text-white",
    secondary: "bg-accent text-white",
    ghost: "bg-transparent text-primary",
  };

  const finalClass = `${base} ${styles[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={finalClass}>
        {children}
      </Link>
    );
  }

  return (
    <button {...props} className={finalClass}>
      {children}
    </button>
  );
}
