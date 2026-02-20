import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/core/theme/ThemeProvider";
import { AuthProvider } from "@/platform/auth";
import { getServerAuthContext } from "@/platform/auth/server";

export const metadata: Metadata = {
  title: "iCura Platform",
  description: "Structured Insurance Advisory",
};

type Theme = "light" | "dark";

function normalizeTheme(value: string | undefined): Theme {
  return value === "dark" ? "dark" : "light";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const serverTheme = normalizeTheme(cookieStore.get("theme")?.value);
  const initialSession = await getServerAuthContext();

  return (
    <html
      lang="en"
      className={`theme-${serverTheme}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem("theme");
                  var cookie = document.cookie.match(/(?:^|; )theme=(light|dark)/);
                  var theme = stored === "light" || stored === "dark"
                    ? stored
                    : (cookie && cookie[1]) || "light";
                  var root = document.documentElement;
                  root.classList.remove("theme-light", "theme-dark");
                  root.classList.add("theme-" + theme);
                  root.style.colorScheme = theme;
                } catch (e) {
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider initialSession={initialSession}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
