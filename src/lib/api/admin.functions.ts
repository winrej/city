import { createServerFn } from "@tanstack/react-start";
import {
  getCookie,
  setCookie,
  deleteCookie,
  getRequestHeader,
  getRequestUrl,
} from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import ws from "ws";
import { MARKETING_PAGE_SETTING_KEYS } from "@/lib/marketing-pages";

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LeadUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "qualified", "closed", "spam"]).optional(),
  source: z
    .enum(["website", "facebook", "instagram", "google", "tiktok", "referral", "organic"])
    .optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  follow_up_at: z.string().datetime().nullable().optional(),
});

export const SoftDeleteLeadSchema = z.object({
  id: z.string().uuid(),
});

export const NoteCreateSchema = z.object({
  lead_id: z.string().uuid(),
  note: z.string().min(1, "Note cannot be empty").max(2000),
});

export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional(),
  role: z.string().max(50).optional(),
  message: z.string().max(2000).optional(),
  source: z
    .enum(["website", "facebook", "instagram", "google", "tiktok", "referral", "organic"])
    .optional(),
  company: z.string().max(0).optional(),
  form_started_at: z.coerce.number().optional(),
});

export const FeaturedDistrictSchema = z
  .object({
    enabled: z.boolean().optional(),
    district_name: z.string().optional(),
    tagline: z.string().optional(),
    headline: z.string().optional(),
    description: z.string().optional(),
    projects_count: z.number().int().min(0).optional(),
    entry_price: z.string().optional(),
    image_url: z.string().nullable().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.enabled === false) return;

    for (const field of ["district_name", "tagline", "headline", "description", "entry_price"]) {
      const current = value[field as keyof typeof value];
      if (typeof current !== "string" || !current.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field.replaceAll("_", " ")} is required when Featured District is enabled`,
        });
      }
    }
  });

export const CollectionItemSchema = z.object({
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().nullable().optional(),
});

export const CollectionsSettingsSchema = z.object({
  "Metro Core": CollectionItemSchema,
  "Suburban Enclaves": CollectionItemSchema,
  "Resort & Leisure": CollectionItemSchema,
});

const JsonRecordSchema = z.record(z.unknown());

export const MarketingPageSettingsSchema = z
  .object({
    enabled: z.boolean().optional(),
  })
  .catchall(z.unknown());

export const MarketingSeoSettingsSchema = z
  .object({
    meta_title: z.string().max(120).optional(),
    meta_description: z.string().max(220).optional(),
    canonical_path: z.string().max(120).optional(),
    og_image_url: z.string().max(500).optional(),
  })
  .catchall(z.unknown());

export const SettingsUpdateSchema = z.object({
  key: z.string().min(1),
  // Accept any JSON object — different sections (general, contact, homepage, seo, social)
  // store flat key-value maps directly. Using z.record allows the homepage editor to save
  // fields like hero_media_type, enable_team_member, etc. without rigid shape enforcement.
  value: JsonRecordSchema,
});

export const TestimonialCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.string().max(100).optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  rating: z.number().int().min(1).max(5).default(5),
  image_url: z.string().optional().nullable(),
  status: z.enum(["published", "draft"]).default("draft"),
  display_order: z.number().int().default(0),
});

export const TestimonialUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  role: z.string().max(100).optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  image_url: z.string().optional().nullable(),
  status: z.enum(["published", "draft"]).optional(),
  display_order: z.number().int().optional(),
});

// ─── Supabase client helpers ──────────────────────────────────────────────────
// All env reads happen inside handler functions (per-request) to be safe on
// Cloudflare Workers / Nitro where module-scope reads resolve to undefined.

async function getServerClient() {
  const url =
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    console.error("Missing Supabase service configuration", {
      hasUrl: Boolean(url),
      hasServiceRoleKey: Boolean(serviceRoleKey),
    });
    throw new Error("Server configuration error.");
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: { transport: ws as any },
  });
}

async function getUserClient() {
  const url =
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL;
  const anonKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    import.meta.env?.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      `Missing Supabase public environment variables. url_exists=${!!url}, anonKey_exists=${!!anonKey}. ` +
        `process.env keys: ${Object.keys(process.env)
          .filter((k) => !k.includes("KEY") && !k.includes("SECRET") && !k.includes("PASSWORD"))
          .join(", ")}`,
    );
  }

  const client = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: { transport: ws as any },
  });

  const accessToken = getCookie("sb-access-token");
  const refreshToken = getCookie("sb-refresh-token");

  if (accessToken && refreshToken) {
    await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  }
  return client;
}

const ADMIN_ROLES = ["super_admin", "admin"] as const;
const DEFAULT_ALLOWED_ORIGINS = [
  "https://cityqlo.com",
  "https://www.cityqlo.com",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8888",
];

function getAllowedOrigins() {
  const configured = [
    process.env.ALLOWED_ORIGINS,
    process.env.SITE_URL,
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
  ]
    .filter(Boolean)
    .flatMap((value) => value!.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...configured].map(normalizeOrigin).filter(Boolean));
}

function normalizeOrigin(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function originFromHeader(value: string | undefined) {
  if (!value) return null;
  return normalizeOrigin(value);
}

function assertAllowedOrigin() {
  const requestUrl = getRequestUrl();
  const requestOrigin = requestUrl.origin;
  const origin = originFromHeader(getRequestHeader("origin"));
  const referer = originFromHeader(getRequestHeader("referer"));
  const sourceOrigin = origin ?? referer;
  const allowedOrigins = getAllowedOrigins();

  if (!sourceOrigin || (sourceOrigin !== requestOrigin && !allowedOrigins.has(sourceOrigin))) {
    console.warn("Blocked cross-origin server function request", {
      requestOrigin,
      sourceOrigin,
    });
    throw new Error("Invalid request origin.");
  }
}

function isAdminRole(role: unknown): role is (typeof ADMIN_ROLES)[number] {
  return typeof role === "string" && ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]);
}

async function requireAdminSession() {
  assertAllowedOrigin();

  const userClient = await getUserClient();
  const {
    data: { session },
  } = await userClient.auth.getSession();
  if (!session) throw new Error("Unauthorized");

  const { data: profile, error } = await userClient
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", session.user.id)
    .single();

  if (error || !profile || !isAdminRole(profile.role)) {
    throw new Error("Unauthorized: admin access required.");
  }

  return { session, profile, userClient };
}

// ─── Authentication ───────────────────────────────────────────────────────────

export const loginAdmin = createServerFn({ method: "POST" })
  .validator(LoginSchema)
  .handler(async ({ data }) => {
    assertAllowedOrigin();

    try {
      const sb = await getServerClient();
      const { data: authData, error } = await sb.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error || !authData.user || !authData.session)
        throw new Error(error?.message ?? "Login failed.");

      const { data: profile, error: profileError } = await sb
        .from("profiles")
        .select("id, email, full_name, role")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) throw new Error("User profile not found.");
      if (!isAdminRole(profile.role)) {
        throw new Error("Unauthorized: admin access required.");
      }

      // Set cookie persistence so that getAuthSession can retrieve the session later
      setCookie("sb-access-token", authData.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: authData.session.expires_in,
        path: "/",
      });
      setCookie("sb-refresh-token", authData.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      return { user: authData.user, session: authData.session, profile };
    } catch (err: any) {
      console.error("loginAdmin error:", err);
      throw err;
    }
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  assertAllowedOrigin();

  const sb = await getUserClient();
  const { error } = await sb.auth.signOut();
  if (error) throw new Error(error.message);

  deleteCookie("sb-access-token", { path: "/" });
  deleteCookie("sb-refresh-token", { path: "/" });

  return { success: true };
});

export const getAuthSession = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await getUserClient();
  const {
    data: { session },
  } = await sb.auth.getSession();
  if (!session) return null;

  const { data: profile } = await sb
    .from("profiles")
    .select("id, email, full_name, role, last_login")
    .eq("id", session.user.id)
    .single();

  if (!profile || !isAdminRole(profile.role)) return null;

  return { session, profile };
});

// ─── Leads ────────────────────────────────────────────────────────────────────

export const getLeads = createServerFn({ method: "GET" }).handler(async () => {
  const { userClient: sb } = await requireAdminSession();

  const { data: leads, error } = await sb
    .from("active_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const total = leads?.length ?? 0;
  const byStatus = { new: 0, contacted: 0, qualified: 0, closed: 0, spam: 0 };
  const bySource: Record<string, number> = {};

  for (const lead of leads ?? []) {
    if (lead.status in byStatus) byStatus[lead.status as keyof typeof byStatus]++;
    if (lead.source) bySource[lead.source] = (bySource[lead.source] ?? 0) + 1;
  }

  const conversionRate = total > 0 ? Math.round((byStatus.closed / total) * 100) : 0;
  return { leads, total, byStatus, bySource, conversionRate };
});

export const updateLead = createServerFn({ method: "POST" })
  .validator(LeadUpdateSchema)
  .handler(async ({ data }) => {
    const { userClient: sb } = await requireAdminSession();
    const { id, ...updates } = data;

    const { data: updated, error } = await sb
      .from("inquiries")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  });

export const softDeleteLead = createServerFn({ method: "POST" })
  .validator(SoftDeleteLeadSchema)
  .handler(async ({ data }) => {
    const { userClient: sb } = await requireAdminSession();
    const { error } = await sb
      .from("inquiries")
      .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

// ─── Lead Notes ───────────────────────────────────────────────────────────────

export const getLeadNotes = createServerFn({ method: "POST" })
  .validator(z.object({ lead_id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { userClient: sb } = await requireAdminSession();
    const { data: notes, error } = await sb
      .from("lead_notes")
      .select("*, author:profiles(full_name)")
      .eq("lead_id", data.lead_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return notes;
  });

export const addLeadNote = createServerFn({ method: "POST" })
  .validator(NoteCreateSchema)
  .handler(async ({ data }) => {
    const { session, userClient: sb } = await requireAdminSession();

    const { data: note, error } = await sb
      .from("lead_notes")
      .insert({ lead_id: data.lead_id, note: data.note, author_id: session?.user.id ?? null })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return note;
  });

// ─── Public Lead Submission (Contact Form) ────────────────────────────────────
// Uses service role client to bypass the "Block direct public SQL inserts" RLS
// policy — Zod validation enforces data quality server-side instead.

export const createLead = createServerFn({ method: "POST" })
  .validator(ContactFormSchema)
  .handler(async ({ data }) => {
    assertAllowedOrigin();

    if (data.company) {
      throw new Error("Invalid submission.");
    }

    if (data.form_started_at && Date.now() - data.form_started_at < 2500) {
      throw new Error("Invalid submission.");
    }

    const sb = await getServerClient();
    const { data: lead, error } = await sb
      .from("inquiries")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        role: data.role ?? null,
        message: data.message ?? null,
        source: data.source ?? "website",
        status: "new",
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return lead;
  });

// ─── Site Settings ────────────────────────────────────────────────────────────

// Public read — no auth required. Fetches only the `seo` row for use in head().
export const getPublicSeoSettings = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sb = await getServerClient();
    const { data, error } = await sb
      .from("site_settings")
      .select("value")
      .eq("key", "seo")
      .single();
    if (error) return null;
    return (data?.value ?? null) as {
      meta_title?: string;
      meta_description?: string;
      og_image_url?: string;
      og_title?: string;
      og_description?: string;
      twitter_title?: string;
      twitter_description?: string;
    } | null;
  } catch {
    return null;
  }
});

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await getUserClient();
  const { data, error } = await sb.from("site_settings").select("*");
  if (error) throw new Error(error.message);
  return data;
});

export const getMarketingPageSettings = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await getUserClient();
  const { data, error } = await sb
    .from("site_settings")
    .select("key, value")
    .in("key", [...MARKETING_PAGE_SETTING_KEYS]);
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const updateSiteSettings = createServerFn({ method: "POST" })
  .validator(SettingsUpdateSchema)
  .handler(async ({ data }) => {
    await requireAdminSession();

    // Validate specific setting keys before saving
    if (data.key === "featured_district") {
      FeaturedDistrictSchema.parse(data.value);
    } else if (data.key === "collections_settings") {
      CollectionsSettingsSchema.parse(data.value);
    } else if (data.key.startsWith("page_")) {
      MarketingPageSettingsSchema.parse(data.value);
    } else if (data.key.startsWith("seo_")) {
      MarketingSeoSettingsSchema.parse(data.value);
    }

    // Perform the write using Server Client to bypass RLS restrictions safely
    const sb = await getServerClient();
    const { error } = await sb
      .from("site_settings")
      .upsert(
        { key: data.key, value: data.value, updated_at: new Date().toISOString() },
        { onConflict: "key" },
      );
    if (error) throw new Error(error.message);
    return { success: true };
  });

// ─── Activity Logs ────────────────────────────────────────────────────────────

export const getActivities = createServerFn({ method: "GET" }).handler(async () => {
  const { userClient: sb } = await requireAdminSession();
  const { data, error } = await sb
    .from("activity_logs")
    .select("*, admin:profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return data;
});

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const getPublicTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sb = await getServerClient();
    const { data, error } = await sb
      .from("testimonials")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (err: any) {
    console.error("getPublicTestimonials error:", err);
    throw err;
  }
});

export const getAdminTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const { userClient } = await requireAdminSession();

  const { data, error } = await userClient
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
});

export const createTestimonial = createServerFn({ method: "POST" })
  .validator((d: unknown) => TestimonialCreateSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdminSession();

    const sb = await getServerClient();
    const { data: inserted, error } = await sb
      .from("testimonials")
      .insert({
        name: data.name,
        role: data.role,
        message: data.message,
        rating: data.rating,
        image_url: data.image_url,
        status: data.status,
        display_order: data.display_order,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return inserted;
  });

export const updateTestimonial = createServerFn({ method: "POST" })
  .validator((d: unknown) => TestimonialUpdateSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdminSession();

    const { id, ...updateFields } = data;
    const sb = await getServerClient();
    const { data: updated, error } = await sb
      .from("testimonials")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdminSession();

    const sb = await getServerClient();
    const { error } = await sb.from("testimonials").delete().eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

// ─── Dynamic Property CMS Server Functions ────────────────────────────────────

async function compileProjectPayload(sb: any, projectId: string) {
  const { data: project, error: pError } = await sb
    .from("projects")
    .select(
      `
      *,
      units:project_units(*),
      sections:project_sections(
        *,
        type:section_types(key, schema_version)
      )
    `,
    )
    .eq("id", projectId)
    .single();

  if (pError || !project) return null;

  return {
    api_version: "1.2",
    schema_version: "2026-06",
    generated_at: new Date().toISOString(),
    project_meta: {
      id: project.id,
      title: project.title,
      slug: project.slug,
      developer: project.developer,
      location_district: project.location_district,
      city: project.city,
      full_address: project.full_address,
      status: project.status,
      category: project.category,
      min_price: Number(project.min_price),
      max_price: Number(project.max_price),
      meta_title: project.meta_title,
      meta_description: project.meta_description,
    },
    layout_flow: (project.sections || []).map((sec: any) => ({
      id: sec.id,
      type: sec.type?.key || "unknown",
      version: sec.type?.schema_version || "1.0",
      payload: sec.payload,
      depends_on_section_id: sec.depends_on_section_id,
    })),
    units: (project.units || []).map((u: any) => ({
      name: u.name,
      area_sqm: Number(u.area_sqm),
      starting_price: Number(u.starting_price),
      description: u.description,
      profile_target: u.profile_target,
      image_url: u.image_url,
    })),
    landmarks: [],
  };
}

export const getProjectBySlug = createServerFn({ method: "GET" })
  .validator(
    z.object({
      slug: z.string(),
      preview: z.boolean().optional(),
      version: z.string().uuid().optional(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sb = await getServerClient();

      if (data.preview) {
        if (data.version) {
          const { data: rev, error } = await sb
            .from("project_revisions")
            .select("snapshot")
            .eq("id", data.version)
            .single();
          if (error) throw new Error(error.message);
          return rev?.snapshot || null;
        } else {
          // Get project ID first
          const { data: proj } = await sb
            .from("projects")
            .select("id")
            .eq("slug", data.slug)
            .single();

          if (proj) {
            const { data: draft, error } = await sb
              .from("project_draft_workspaces")
              .select("draft_snapshot")
              .eq("project_id", proj.id)
              .single();
            if (error && error.code !== "PGRST116") throw new Error(error.message);
            if (draft?.draft_snapshot) {
              return draft.draft_snapshot;
            }
            return compileProjectPayload(sb, proj.id);
          }
        }
      }

      // 1. Try fetching from project_read_models pre-compiled cache projection table
      const { data: readModel, error: rmError } = await sb
        .from("project_read_models")
        .select("content_payload")
        .eq("slug", data.slug)
        .single();

      if (readModel) {
        return readModel.content_payload;
      }

      // 2. Fallback Compiler: Join tables on the fly
      const { data: proj } = await sb
        .from("projects")
        .select("id")
        .eq("slug", data.slug)
        .eq("status", "published")
        .single();

      if (proj) {
        return compileProjectPayload(sb, proj.id);
      }
      return null;
    } catch (err: any) {
      console.error("getProjectBySlug error:", err);
      throw err;
    }
  });

export const getPublishedProjectSlugs = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sb = await getServerClient();
    const { data, error } = await sb
      .from("projects")
      .select("slug")
      .eq("status", "published")
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map((p) => p.slug);
  } catch (err: any) {
    console.error("getPublishedProjectSlugs error:", err);
    throw err;
  }
});

export const saveProjectDraft = createServerFn({ method: "POST" })
  .validator(
    z.object({
      projectId: z.string().uuid(),
      draftSnapshot: z.record(z.any()),
    }),
  )
  .handler(async ({ data }) => {
    const { session } = await requireAdminSession();

    const sb = await getServerClient();
    const { error } = await sb.from("project_draft_workspaces").upsert(
      {
        project_id: data.projectId,
        draft_snapshot: data.draftSnapshot,
        updated_by: session.user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "project_id" },
    );

    if (error) throw new Error(error.message);
    return { success: true };
  });

export const publishProject = createServerFn({ method: "POST" })
  .validator(
    z.object({
      projectId: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
    const { session } = await requireAdminSession();

    const sb = await getServerClient();

    // Fetch active draft
    const { data: draft, error: draftError } = await sb
      .from("project_draft_workspaces")
      .select("draft_snapshot")
      .eq("project_id", data.projectId)
      .single();

    if (draftError || !draft) throw new Error("No draft found to publish.");

    const snapshot = draft.draft_snapshot as any;
    const meta = snapshot.project_meta || {};

    // Create revision log record
    const { data: revision, error: revError } = await sb
      .from("project_revisions")
      .insert({
        project_id: data.projectId,
        snapshot: snapshot,
        created_by: session.user.id,
      })
      .select("id")
      .single();

    if (revError || !revision) throw new Error(revError?.message || "Failed to log revision.");

    // Update master project attributes status and version_id and metadata
    const { error: projError } = await sb
      .from("projects")
      .update({
        status: "published",
        current_version_id: revision.id,
        title: meta.title || "",
        slug: meta.slug || "",
        developer: meta.developer || "DMCI Homes",
        location_district: meta.location_district || "",
        city: meta.city || "",
        full_address: meta.full_address || "",
        category: meta.category || "Suburban Enclaves",
        architectural_theme: meta.architectural_theme || "",
        land_area: meta.land_area || "",
        floors: meta.floors || "",
        total_units: meta.total_units || "",
        turnover: meta.turnover || "",
        min_price: meta.min_price ? Number(meta.min_price) : 0,
        max_price: meta.max_price ? Number(meta.max_price) : 0,
        meta_title: meta.meta_title || "",
        meta_description: meta.meta_description || "",
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.projectId);

    if (projError) throw new Error(projError.message);

    // Upsert precompiled read model
    const { error: rmError } = await sb.from("project_read_models").upsert(
      {
        project_id: data.projectId,
        slug: meta.slug,
        version_id: revision.id,
        content_payload: {
          ...snapshot,
          generated_at: new Date().toISOString(),
          project_meta: {
            ...meta,
            status: "published",
          },
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "project_id" },
    );

    if (rmError) throw new Error(rmError.message);

    // Sync back to project_sections
    // 1. Delete old sections
    await sb.from("project_sections").delete().eq("project_id", data.projectId);

    // 2. Fetch section types to map keys to IDs
    const { data: secTypes } = await sb.from("section_types").select("id, key");
    const secTypeMap = (secTypes || []).reduce((acc: any, row: any) => {
      acc[row.key] = row.id;
      return acc;
    }, {});

    // 3. Insert new sections
    if (snapshot.layout_flow && snapshot.layout_flow.length > 0) {
      const sectionsToInsert = snapshot.layout_flow
        .map((sec: any, idx: number) => {
          const typeId = secTypeMap[sec.type];
          if (!typeId) return null;
          return {
            project_id: data.projectId,
            section_type_id: typeId,
            display_order: idx * 10,
            payload: sec.payload || {},
            is_active: true,
          };
        })
        .filter(Boolean);

      if (sectionsToInsert.length > 0) {
        const { error: secInsertError } = await sb
          .from("project_sections")
          .insert(sectionsToInsert);
        if (secInsertError)
          console.error("Error syncing sections to database:", secInsertError.message);
      }
    }

    // Sync back to project_units
    // 1. Delete old units
    await sb.from("project_units").delete().eq("project_id", data.projectId);

    // 2. Insert new units
    if (snapshot.units && snapshot.units.length > 0) {
      const unitsToInsert = snapshot.units.map((u: any, idx: number) => ({
        project_id: data.projectId,
        name: u.name,
        area_sqm: Number(u.area_sqm),
        starting_price: Number(u.starting_price),
        description: u.description || "",
        profile_target: u.profile_target || "",
        display_order: idx + 1,
      }));

      const { error: unitInsertError } = await sb.from("project_units").insert(unitsToInsert);
      if (unitInsertError)
        console.error("Error syncing units to database:", unitInsertError.message);
    }

    return { success: true };
  });

export const getAdminProjects = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  const sb = await getServerClient();
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
});

export const createProject = createServerFn({ method: "POST" })
  .validator(
    z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      category: z.enum(["Metro Core", "Suburban Enclaves", "Resort & Leisure"]),
      developer: z.string().default("DMCI Homes"),
      city: z.string().min(1),
      full_address: z.string().min(1),
      min_price: z.number(),
      max_price: z.number(),
      location_district: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { session } = await requireAdminSession();
    const sb = await getServerClient();

    // 1. Insert into projects
    const { data: proj, error } = await sb
      .from("projects")
      .insert({
        ...data,
        location_district: data.location_district || data.city,
        status: "draft",
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    // 2. Initialize draft workspace with empty snapshot structure
    const initialSnapshot = {
      api_version: "1.2",
      schema_version: "2026-06",
      generated_at: new Date().toISOString(),
      project_meta: {
        id: proj.id,
        title: data.title,
        slug: data.slug,
        developer: data.developer,
        location_district: data.city,
        city: data.city,
        full_address: data.full_address,
        status: "draft",
        category: data.category,
        min_price: data.min_price,
        max_price: data.max_price,
      },
      layout_flow: [],
      units: [],
      landmarks: [],
    };

    const { error: draftError } = await sb.from("project_draft_workspaces").insert({
      project_id: proj.id,
      draft_snapshot: initialSnapshot,
      updated_by: session.user.id,
    });

    if (draftError) throw new Error(draftError.message);
    return { id: proj.id };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const sb = await getServerClient();

    const { error } = await sb.from("projects").delete().eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

// ─── Properties ───────────────────────────────────────────────────────────────

// Helper: generate a URL-safe slug from any string
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics (e.g. ñ → n)
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

// Helper: ensure unique slug by appending -2, -3 etc. if needed
async function uniquePropertySlug(sb: any, base: string): Promise<string> {
  let candidate = base;
  let attempt = 1;
  while (true) {
    const { data } = await sb.from("properties").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    attempt++;
    candidate = `${base}-${attempt}`;
  }
}

// ─── Zod Schemas

export const PropertyCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  developer: z.string().min(1).default("DMCI Homes"),
  city: z.string().min(1, "City is required"),
  location: z.string().min(1, "Location/district is required"),
  price_display: z.string().min(1, "Price display string is required"),
  price_min: z.number().min(0, "Price must be a positive number"),
  status: z.enum(["Pre-selling", "RFO"]).default("Pre-selling"),
  beds: z.number().int().min(0).default(1),
  baths: z.number().min(0).default(1),
  area: z.string().min(1, "Area is required"),
  description: z.string().default(""),
  highlights: z.array(z.string()).default([]),
  category: z.enum(["Metro Core", "Suburban Enclaves", "Resort & Leisure"]).default("Metro Core"),
  image_url: z.string().url().nullable().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  display_order: z.number().int().default(0),
  promo_badge: z.string().nullable().optional(),
  is_spotlight: z.boolean().default(false),
  featured_rank: z.number().int().default(0),
  autoCreateProject: z.boolean().optional(),
});

export const PropertyUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).optional(),
  developer: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  price_display: z.string().min(1).optional(),
  price_min: z.number().min(0).optional(),
  status: z.enum(["Pre-selling", "RFO"]).optional(),
  beds: z.number().int().min(0).optional(),
  baths: z.number().min(0).optional(),
  area: z.string().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  category: z.enum(["Metro Core", "Suburban Enclaves", "Resort & Leisure"]).optional(),
  image_url: z.string().nullable().optional(),
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
  promo_badge: z.string().nullable().optional(),
  is_spotlight: z.boolean().optional(),
  featured_rank: z.number().int().optional(),
});

// ─── Public read (active + not deleted, ordered by display_order)

export const getPublicProperties = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sb = await getServerClient();
    const { data, error } = await sb
      .from("properties")
      .select("*")
      .eq("is_active", true)
      .eq("is_deleted", false)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  } catch (err: any) {
    console.error("getPublicProperties error:", err);
    throw err;
  }
});

// ─── Admin read (all rows including soft-deleted)

export const getAdminProperties = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();

  const sb = await getServerClient();
  const { data, error } = await sb
    .from("properties")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

// ─── Create (slug auto-generated server-side)

export const createProperty = createServerFn({ method: "POST" })
  .validator((d: unknown) => PropertyCreateSchema.parse(d))
  .handler(async ({ data }) => {
    const { session } = await requireAdminSession();

    const sb = await getServerClient();
    const baseSlug = slugify(data.name);
    const slug = await uniquePropertySlug(sb, baseSlug);

    const { autoCreateProject, ...propertyFields } = data;

    const { data: inserted, error } = await sb
      .from("properties")
      .insert({
        ...propertyFields,
        slug,
        highlights: JSON.stringify(propertyFields.highlights ?? []),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Auto-create matching Project stub & draft workspace
    if (autoCreateProject) {
      const { data: proj, error: projError } = await sb
        .from("projects")
        .insert({
          title: data.name,
          slug: slug,
          category: data.category,
          developer: data.developer,
          location_district: data.location,
          city: data.city.includes(",") ? data.city.split(",").pop()?.trim() || data.city : data.city,
          full_address: data.city,
          min_price: Math.round(data.price_min * 1000000),
          max_price: Math.round(data.price_min * 1000000 * 1.5),
          status: "draft",
        })
        .select("id")
        .single();

      if (projError) {
        console.error("Failed to auto-create matching project stub:", projError.message);
      } else if (proj) {
        const initialSnapshot = {
          api_version: "1.2",
          schema_version: "2026-06",
          generated_at: new Date().toISOString(),
          project_meta: {
            id: proj.id,
            title: data.name,
            slug: slug,
            developer: data.developer,
            location_district: data.location,
            city: data.city.includes(",") ? data.city.split(",").pop()?.trim() || data.city : data.city,
            full_address: data.city,
            status: "draft",
            category: data.category,
            min_price: Math.round(data.price_min * 1000000),
            max_price: Math.round(data.price_min * 1000000 * 1.5),
          },
          layout_flow: [],
          units: [],
          landmarks: [],
        };

        const { error: draftError } = await sb.from("project_draft_workspaces").insert({
          project_id: proj.id,
          draft_snapshot: initialSnapshot,
          updated_by: session.user.id,
        });

        if (draftError) {
          console.error("Failed to auto-create matching project workspace:", draftError.message);
        }
      }
    }

    return inserted;
  });

// ─── Update

export const updateProperty = createServerFn({ method: "POST" })
  .validator((d: unknown) => PropertyUpdateSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdminSession();

    const { id, highlights, ...rest } = data;
    const sb = await getServerClient();

    const updatePayload: Record<string, any> = {
      ...rest,
      updated_at: new Date().toISOString(),
    };
    if (highlights !== undefined) {
      updatePayload.highlights = JSON.stringify(highlights);
    }

    const { data: updated, error } = await sb
      .from("properties")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  });

// ─── Soft Delete

export const deleteProperty = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdminSession();

    const sb = await getServerClient();
    const { error } = await sb
      .from("properties")
      .update({ is_deleted: true, updated_at: new Date().toISOString() })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

// ─── Toggle active

export const togglePropertyActive = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string().uuid(), is_active: z.boolean() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdminSession();

    const sb = await getServerClient();
    const { error } = await sb
      .from("properties")
      .update({ is_active: data.is_active, updated_at: new Date().toISOString() })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

// ─── Toggle featured

export const togglePropertyFeatured = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string().uuid(), is_featured: z.boolean() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdminSession();

    const sb = await getServerClient();
    const { error } = await sb
      .from("properties")
      .update({ is_featured: data.is_featured, updated_at: new Date().toISOString() })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

// ─── Public Properties Page Content Aggregation
export const getPublicPropertiesPageContent = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const sb = await getServerClient();

      // Fetch public properties with projection discipline (excluding draft/admin-only metadata)
      const { data: properties, error: propertiesError } = await sb
        .from("properties")
        .select(
          "id, name, slug, developer, city, location, price_display, price_min, status, beds, baths, area, description, highlights, category, image_url, is_featured, is_spotlight, promo_badge, display_order, featured_rank",
        )
        .eq("is_active", true)
        .eq("is_deleted", false)
        .order("is_spotlight", { ascending: false })
        .order("featured_rank", { ascending: false })
        .order("created_at", { ascending: false });

      if (propertiesError) throw new Error(propertiesError.message);

      // Fetch site settings in the same call
      const { data: settings, error: settingsError } = await sb
        .from("site_settings")
        .select("*")
        .in("key", ["collections_settings", "featured_district"]);

      if (settingsError) throw new Error(settingsError.message);

      const collectionsSettings =
        settings?.find((r) => r.key === "collections_settings")?.value ?? null;
      const featuredDistrict = settings?.find((r) => r.key === "featured_district")?.value ?? null;

      return {
        properties: properties ?? [],
        collectionsSettings,
        featuredDistrict,
      };
    } catch (err: any) {
      console.error("getPublicPropertiesPageContent error:", err);
      throw err;
    }
  },
);

// ─── Blog / Guides ────────────────────────────────────────────────────────────

export const BlogCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z
    .string()
    .min(3)
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(500),
  content: z.string().min(1, "Content is required"),
  cover_image_url: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
  tags: z.array(z.string().max(50)).max(10).default([]),
  read_time: z.number().int().min(1).max(120).default(5),
});

export const BlogUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(200).optional(),
  slug: z
    .string()
    .min(3)
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  excerpt: z.string().min(10).max(500).optional(),
  content: z.string().min(1).optional(),
  cover_image_url: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published"]).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  read_time: z.number().int().min(1).max(120).optional(),
});

// Public: list all published posts (newest first)
export const getPublicBlogs = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sb = await getServerClient();
    const { data, error } = await sb
      .from("blogs")
      .select("id, title, slug, excerpt, cover_image_url, published_at, tags, read_time, author_id")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  } catch (err: any) {
    console.error("getPublicBlogs error:", err);
    throw err;
  }
});

// Public: single post by slug
export const getPublicBlogBySlug = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    try {
      const sb = await getServerClient();
      const { data: post, error } = await sb
        .from("blogs")
        .select("*")
        .eq("slug", data.slug)
        .eq("status", "published")
        .single();

      if (error && error.code !== "PGRST116") throw new Error(error.message);
      return post ?? null;
    } catch (err: any) {
      console.error("getPublicBlogBySlug error:", err);
      throw err;
    }
  });

// Admin: list all posts including drafts
export const getAdminBlogs = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  const sb = await getServerClient();
  const { data, error } = await sb
    .from("blogs")
    .select("id, title, slug, status, published_at, tags, read_time, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
});

// Admin: get single blog by id for editing
export const getAdminBlogById = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const sb = await getServerClient();
    const { data: post, error } = await sb
      .from("blogs")
      .select("*")
      .eq("id", data.id)
      .single();

    if (error) throw new Error(error.message);
    return post;
  });

// Admin: create blog post
export const createBlog = createServerFn({ method: "POST" })
  .validator((d: unknown) => BlogCreateSchema.parse(d))
  .handler(async ({ data }) => {
    const { session } = await requireAdminSession();
    const sb = await getServerClient();

    const { data: inserted, error } = await sb
      .from("blogs")
      .insert({
        ...data,
        author_id: session.user.id,
        published_at: data.status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return inserted;
  });

// Admin: update blog post
export const updateBlog = createServerFn({ method: "POST" })
  .validator((d: unknown) => BlogUpdateSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { id, ...updateFields } = data;

    const sb = await getServerClient();

    // If publishing for first time, set published_at
    const extraFields: Record<string, any> = {};
    if (updateFields.status === "published") {
      const { data: existing } = await sb
        .from("blogs")
        .select("published_at")
        .eq("id", id)
        .single();
      if (!existing?.published_at) {
        extraFields.published_at = new Date().toISOString();
      }
    }

    const { data: updated, error } = await sb
      .from("blogs")
      .update({ ...updateFields, ...extraFields, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  });

// Admin: delete blog post
export const deleteBlog = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const sb = await getServerClient();
    const { error } = await sb.from("blogs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

