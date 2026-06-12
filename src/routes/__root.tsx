import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  ScrollRestoration,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Nav } from "../components/site/Nav";
import { Footer } from "../components/site/Footer";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-2 mt-4">Page not found</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="display-3">This page didn't load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong. Try again or head home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

// Default language configuration for future localization
const APP_LOCALE = "en";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CityQlo — Smarter Property Decisions in Metro Manila" },
      {
        name: "description",
        content:
          "CityQlo helps Filipino professionals, investors, and OFWs make smarter property decisions in Metro Manila.",
      },
      {
        name: "keywords",
        content:
          "Metro Manila real estate, property advisory Philippines, DMCI Homes, condo investment Manila, OFW property investment, CityQlo",
      },
      { name: "author", content: "CityQlo" },
      { property: "og:title", content: "CityQlo — Smarter Property Decisions in Metro Manila" },
      {
        property: "og:description",
        content:
          "CityQlo helps Filipino professionals, investors, and OFWs make smarter property decisions in Metro Manila.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "CityQlo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "oklch(0.43 0.20 258)" },
      { name: "twitter:title", content: "CityQlo — Smarter Property Decisions in Metro Manila" },
      {
        name: "twitter:description",
        content:
          "CityQlo helps Filipino professionals, investors, and OFWs make smarter property decisions in Metro Manila.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cc5bb21b-e9f7-47c5-8886-07eed52e91f6/id-preview-8d313d68--6383a3c8-02fc-485a-ae50-11a763776907.lovable.app-1780903893799.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cc5bb21b-e9f7-47c5-8886-07eed52e91f6/id-preview-8d313d68--6383a3c8-02fc-485a-ae50-11a763776907.lovable.app-1780903893799.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Montserrat:wght@400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CityQlo",
    url: "https://cityqlo.com",
    logo: "https://cityqlo.com/Logo.png",
    description:
      "CityQlo helps Filipino professionals, investors, and OFWs make smarter property decisions in Metro Manila.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Metro Manila",
      addressCountry: "PH",
    },
    sameAs: [
      "https://www.facebook.com/cityqlo",
      "https://www.instagram.com/cityqlo",
      "https://twitter.com/cityqlo",
    ],
  };

  return (
    <html lang={APP_LOCALE}>
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPortal = pathname.startsWith("/portal");

  return (
    <QueryClientProvider client={queryClient}>
      {!isPortal && <Nav />}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {!isPortal && <Footer />}
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.21 0.012 252 / 0.97)",
            color: "#fff",
            border: "1px solid oklch(1 0 0 / 0.1)",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.01em",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px -8px rgba(0,0,0,0.4)",
            padding: "12px 20px",
          },
          classNames: {
            success: "border-l-4 border-l-[#3B82F6]",
            error: "border-l-4 border-l-red-500/70",
          },
        }}
      />
    </QueryClientProvider>
  );
}
