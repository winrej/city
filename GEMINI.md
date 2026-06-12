# CityQlo — Project Documentation & Design System

## 1. Architecture Overview

CityQlo is a high-performance real estate advisory platform built with a modern, "cinematic" design philosophy.

- **Framework:** [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (React 19)
- **Routing:** File-based routing in `src/routes/`.
- **State & Data:** [TanStack Query](https://tanstack.com/query/v1) for client-side state, [Supabase](https://supabase.com/) for persistence.
- **Styling:** Tailwind CSS v4 + OKLCH-based custom CSS variables.
- **Animations:** CSS-first animations (keyframes) + lightweight JS-based parallax.

## 2. Design System: "The Cinematic Gallery"

The website uses an editorial, Apple-style product discovery experience.

### 2.1 Color System (OKLCH)

We use the `oklch()` color space for perceptually uniform lightness and future-proof dark mode support.

- **Primary:** `oklch(0.43 0.20 258)` (Brand Blue)
- **Ink:** `oklch(0.21 0.012 252)` (Deep Text/UI)
- **Surface:** `oklch(0.985 0.002 247)` (Soft Off-White)
- **Gold:** `oklch(0.74 0.137 79)` (Accent Rule)

### 2.2 Typography

- **Display:** Montserrat (ExtraBold, 800) for headlines.
- **Body:** Montserrat (Regular/Medium) for legibility.
- **UI/Mono:** JetBrains Mono for metadata, labels, and stats.

### 2.3 Animations

- **Rise:** Element-level entrance animations (`@utility rise`).
- **Luxe Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` used for all transitions.
- **Motion Policy:** JS-based animations must check `(prefers-reduced-motion: reduce)` before executing.

## 3. Key Conventions

- **Component Anatomy:** Prefer surgical, single-file sections for marketing pages unless logic is reused.
- **Asset Handling:** Standard aspect ratios are `16:9` (Hero), `4:3` (Property Cards), and `3:4` (Location Portraits).
- **Security:** Never import `createServerSupabaseClient` on the client. Always gate admin actions with server-side profile checks in `admin.functions.ts`.

## 4. Development Workflow

- `npm run dev`: Start development server.
- `src/routes/__root.tsx`: Main app shell and Global Nav/Footer.
- `src/lib/api/admin.functions.ts`: All server-side data mutations.

## 5. Deployment

Hosted on Netlify with Supabase as the backend. Nitro is used as the underlying server engine.
