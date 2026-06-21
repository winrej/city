import {
  createFileRoute,
  Outlet,
  Link,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  Image,
  Megaphone,
  Activity,
  FolderOpen,
  Building2,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Zap,
  Sparkles,
  BookOpen,
  HelpCircle,
  Briefcase,
} from "lucide-react";
import { getAuthSession, logoutAdmin } from "../lib/api/admin.functions";

export const Route = createFileRoute("/portal")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/portal/login") return;

    try {
      const session = await getAuthSession();
      if (!session) {
        throw redirect({ to: "/portal/login" });
      }
    } catch (err) {
      if (err && typeof err === "object" && "to" in err) {
        throw err;
      }
      throw redirect({ to: "/portal/login" });
    }
  },
  component: PortalLayout,
});

type NavItem = {
  label: string;
  path: string;
  icon: React.ElementType;
  active: boolean;
};

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/portal", icon: LayoutDashboard, active: true },
  { label: "Leads", path: "/portal/leads", icon: Users, active: true },
  { label: "Homepage Editor", path: "/portal/content", icon: Sparkles, active: true },
  { label: "Projects", path: "/portal/projects", icon: FolderOpen, active: true },
  { label: "Properties", path: "/portal/properties", icon: Building2, active: true },
  { label: "Guides & Blog", path: "/portal/blogs", icon: BookOpen, active: true },
  { label: "FAQs", path: "/portal/faqs", icon: HelpCircle, active: true },
  { label: "Applications", path: "/portal/applications", icon: Briefcase, active: true },
  { label: "Media", path: "/portal/media", icon: Image, active: false },
  { label: "Marketing", path: "/portal/marketing", icon: Megaphone, active: false },
  { label: "Users", path: "/portal/users", icon: Users, active: false },
  { label: "Activity", path: "/portal/activity", icon: Activity, active: false },
];


function PortalLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await logoutAdmin();
    navigate({ to: "/portal/login" });
  }

  const isActive = (path: string) => {
    if (path === "/portal") return pathname === "/portal";
    return pathname.startsWith(path);
  };

  // Do not render sidebar/header shell layout on the login screen
  if (pathname === "/portal/login") {
    return <Outlet />;
  }

  return (
    <div className="portal-shell">
      {/* Mobile overlay */}
      {mobileOpen && <div className="portal-overlay" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`portal-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
      >
        {/* Logo */}
        <div className="portal-logo">
          <div className="portal-logo-icon">
            <Zap size={20} />
          </div>
          {!collapsed && (
            <div className="portal-logo-text">
              <span className="portal-logo-brand">CityQlo</span>
              <span className="portal-logo-sub">Admin Portal</span>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          className="portal-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight
            size={16}
            className={`portal-collapse-icon ${collapsed ? "" : "rotated"}`}
          />
        </button>

        {/* Navigation */}
        <nav className="portal-nav">
          <div className="portal-nav-group">
            {!collapsed && <span className="portal-nav-label">Navigation</span>}
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              if (!item.active) {
                return (
                  <div
                    key={item.path}
                    className={`portal-nav-item disabled ${collapsed ? "collapsed" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="portal-nav-icon" />
                    {!collapsed && (
                      <>
                        <span className="portal-nav-text">{item.label}</span>
                        <span className="portal-nav-soon">Soon</span>
                      </>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`portal-nav-item ${active ? "active" : ""} ${collapsed ? "collapsed" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} className="portal-nav-icon" />
                  {!collapsed && <span className="portal-nav-text">{item.label}</span>}
                  {active && !collapsed && <span className="portal-nav-active-dot" />}
                </Link>
              );
            })}
          </div>

          {/* Bottom: Settings + Logout */}
          <div className="portal-nav-bottom">
            <Link
              to="/portal/settings"
              className={`portal-nav-item ${isActive("/portal/settings") ? "active" : ""} ${collapsed ? "collapsed" : ""}`}
              title={collapsed ? "Settings" : undefined}
            >
              <Settings size={18} className="portal-nav-icon" />
              {!collapsed && <span className="portal-nav-text">Settings</span>}
            </Link>

            <button
              onClick={handleLogout}
              className={`portal-nav-item logout ${collapsed ? "collapsed" : ""}`}
              title={collapsed ? "Logout" : undefined}
            >
              <LogOut size={18} className="portal-nav-icon" />
              {!collapsed && <span className="portal-nav-text">Logout</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content area */}
      <div className={`portal-main ${collapsed ? "sidebar-collapsed" : ""}`}>
        {/* Top bar */}
        <header className="portal-topbar">
          <button className="portal-mobile-menu-btn" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>

          <div className="portal-topbar-right">
            <div className="portal-topbar-badge">
              <span className="portal-badge-dot" />
              <span>Live</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="portal-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
