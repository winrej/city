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
import { BottomNav } from "../components/site/BottomNav";
import { Toaster } from "../components/ui/sonner";
import { getPublicSeoSettings } from "../lib/api/admin.functions";

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

const DEFAULT_SEO = {
  meta_title: "CityQlo — Smarter Property Decisions in Metro Manila",
  meta_description:
    "CityQlo helps Filipino professionals, investors, and OFWs make smarter property decisions in Metro Manila.",
  og_image_url: "https://cityqlo.com/Logo.png",
  og_title: "CityQlo — Smarter Property Decisions in Metro Manila",
  og_description:
    "CityQlo helps Filipino professionals, investors, and OFWs make smarter property decisions in Metro Manila.",
  twitter_title: "CityQlo — Smarter Property Decisions in Metro Manila",
  twitter_description:
    "CityQlo helps Filipino professionals, investors, and OFWs make smarter property decisions in Metro Manila.",
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Load SEO settings from DB at request time so head() can use live values
  loader: async () => {
    try {
      const seo = await getPublicSeoSettings();
      return { seo };
    } catch {
      return { seo: null };
    }
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;

    // Merge DB values over defaults — empty strings fall back to defaults
    const title = seo?.meta_title?.trim() || DEFAULT_SEO.meta_title;
    const description = seo?.meta_description?.trim() || DEFAULT_SEO.meta_description;
    const ogImage = seo?.og_image_url?.trim() || DEFAULT_SEO.og_image_url;
    const ogTitle = seo?.og_title?.trim() || seo?.meta_title?.trim() || DEFAULT_SEO.og_title;
    const ogDesc = seo?.og_description?.trim() || seo?.meta_description?.trim() || DEFAULT_SEO.og_description;
    const twitterTitle = seo?.twitter_title?.trim() || ogTitle;
    const twitterDesc = seo?.twitter_description?.trim() || ogDesc;

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content:
            "Metro Manila real estate, property advisory Philippines, DMCI Homes, condo investment Manila, OFW property investment, CityQlo",
        },
        { name: "author", content: "CityQlo" },
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: ogDesc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://cityqlo.com" },
        { property: "og:site_name", content: "CityQlo" },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "theme-color", content: "oklch(0.43 0.20 258)" },
        { name: "twitter:title", content: twitterTitle },
        { name: "twitter:description", content: twitterDesc },
        { name: "twitter:image", content: ogImage },
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
    };
  },
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
      {!isPortal && <BottomNav />}
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
