"use client";

import Link from "next/link";
import { useAuth } from "@/platform/auth";
import { Card, Heading } from "@/shared/ui";

export default function RoleAwareModulePanel() {
  const { visibleModules, canAccessModule } = useAuth();
  const canSeeAdminConsole = canAccessModule("admin-console");

  return (
    <Card variant="elevated" className="space-y-4">
      <Heading level={2}>Role-Aware Modules</Heading>

      <div className="space-y-2 text-primary/80">
        {visibleModules.map((module) => (
          <div key={module.id} className="flex items-center justify-between gap-4">
            <span>{module.label}</span>
            <Link href={module.href} className="text-accent hover:underline">
              Open
            </Link>
          </div>
        ))}
      </div>

      {canSeeAdminConsole ? (
        <div className="rounded-md border border-accent/50 bg-accent/10 p-3 text-sm">
          Admin-only sample module is visible for your role.
        </div>
      ) : (
        <div className="rounded-md border border-surface/60 bg-surface/20 p-3 text-sm text-primary/70">
          Admin-only sample module is hidden for this role.
        </div>
      )}
    </Card>
  );
}
