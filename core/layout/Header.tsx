"use client";

import Link from "next/link";
import { useAuth } from "@/platform/auth";
import { Container } from "@/shared/ui";
import ThemeToggle from "@/shared/ui/ThemeToggle";

export default function Header() {
  const { role, userId, isAuthenticated } = useAuth();
  const roleLabel = role[0].toUpperCase() + role.slice(1);

  return (
    <header className="border-b border-surface/40">
      <Container>
        <div className="flex flex-col gap-4 py-6">
          <div className="flex items-center justify-between">
            <div className="font-semibold tracking-wide">
              iCura Platform
            </div>
            <ThemeToggle />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-primary/80">
              Role: {roleLabel}
            </span>
            <span className="text-primary/60">
              {isAuthenticated ? `User: ${userId}` : "User: Guest"}
            </span>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-sm text-primary/80">
            <Link href="/" className="transition-colors hover:text-accent">
              Home
            </Link>
            <Link href="/icura" className="transition-colors hover:text-accent">
              iCura
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
