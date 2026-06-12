import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { loginAdmin, LoginSchema } from "../../lib/api/admin.functions";
import { getAuthSession } from "../../lib/api/admin.functions";
import { z } from "zod";

export const Route = createFileRoute("/portal/login")({
  beforeLoad: async () => {
    try {
      // Redirect authenticated users away from login
      const session = await getAuthSession();
      if (session) throw redirect({ to: "/portal" });
    } catch (err) {
      if (err && typeof err === "object" && "to" in err) {
        throw err;
      }
      // Otherwise allow rendering the login form
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Client-side Zod validation
    const result = LoginSchema.safeParse({ email, password });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        if (e.path[0]) errs[e.path[0] as string] = e.message;
      });
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await loginAdmin({ data: { email, password } });
      navigate({ to: "/portal" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="portal-login-page">
      {/* Background decoration */}
      <div className="portal-login-bg">
        <div className="portal-login-blob blob-1" />
        <div className="portal-login-blob blob-2" />
        <div className="portal-login-blob blob-3" />
      </div>

      <div className="portal-login-container">
        {/* Brand */}
        <div className="portal-login-brand">
          <div className="portal-login-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L26 8V20L14 26L2 20V8L14 2Z" fill="currentColor" opacity="0.2" />
              <path d="M14 6L22 10V18L14 22L6 18V10L14 6Z" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="portal-login-title">CityQlo</h1>
            <p className="portal-login-subtitle">Admin Portal</p>
          </div>
        </div>

        {/* Card */}
        <div className="portal-login-card">
          <div className="portal-login-card-header">
            <h2>Sign in</h2>
            <p>Access your admin workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="portal-login-form" noValidate>
            {/* Error banner */}
            {error && (
              <div className="portal-login-error" role="alert">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="portal-field">
              <label htmlFor="login-email" className="portal-field-label">
                Email address
              </label>
              <div className={`portal-input-wrap ${fieldErrors.email ? "error" : ""}`}>
                <Mail size={16} className="portal-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="portal-input"
                  required
                />
              </div>
              {fieldErrors.email && <span className="portal-field-error">{fieldErrors.email}</span>}
            </div>

            {/* Password */}
            <div className="portal-field">
              <label htmlFor="login-password" className="portal-field-label">
                Password
              </label>
              <div className={`portal-input-wrap ${fieldErrors.password ? "error" : ""}`}>
                <Lock size={16} className="portal-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="portal-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="portal-input-suffix"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="portal-field-error">{fieldErrors.password}</span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="portal-login-btn"
              id="portal-login-submit"
            >
              {loading ? (
                <>
                  <span className="portal-spinner" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="portal-login-footer">
            Issues logging in? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
