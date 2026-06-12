import { createClient } from "@supabase/supabase-js";

// Public browser-safe client. All operations are still gated by RLS policies.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.");
}

// Node 20 on Netlify does not have native WebSocket support for Realtime.
// The ws constructor matches Supabase at runtime even though its type is wider.
const transport =
  typeof window === "undefined"
    ? ((await import("ws")).default as WebSocketConstructor)
    : undefined;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { transport },
});
