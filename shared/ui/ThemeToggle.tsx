"use client";

import { useTheme } from "@/core/theme/ThemeProvider";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggle}
      className="px-4 py-2 border rounded-button"
    >
      Switch to {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}
