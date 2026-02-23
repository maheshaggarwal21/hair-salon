/**
 * @file AppLayout.tsx
 * @description Shared layout shell for public and visit-entry pages.
 *
 * Auth-aware navbar with mobile hamburger menu:
 *   Guest:     logo · Home · About Us · Contact · Sign In
 *   Logged in: logo · Home · About Us · Contact · Dashboard · avatar · Sign Out
 */

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Scissors, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
  subtitle?: string;
}

/** Return the dashboard path for the given role. */
function dashboardPath(role: string) {
  if (role === "owner") return "/dashboard/owner";
  if (role === "manager") return "/dashboard/manager";
  return "/visit-entry"; // receptionist has no separate dashboard
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    setMobileOpen(false);
    await logout();
    navigate("/signin");
  };

  /* Build nav links dynamically — add Dashboard when logged in as manager/owner */
  const navLinks: { to: string; label: string }[] = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];
  if (user && (user.role === "manager" || user.role === "owner")) {
    navLinks.push({ to: dashboardPath(user.role), label: "Dashboard" });
  }

  /** Is a path currently active (exact or starts-with for dashboard sub-routes)? */
  const isActive = (to: string) =>
    pathname === to || (to.startsWith("/dashboard") && pathname.startsWith("/dashboard"));

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#faf8f4" }}>
      {/* ── Sticky navbar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.90)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-8 h-16 flex items-center justify-between">

          {/* ── Left: logo ── */}
          <Link to="/" className="shrink-0 flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-amber-50 shadow-sm ring-1 ring-black/8 group-hover:ring-amber-300/60 transition-all duration-200 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-lg font-bold text-stone-800 tracking-tight hidden sm:block">
              The Experts
            </span>
          </Link>

          {/* ── Center: nav links (desktop only) ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium tracking-wide
                  transition-colors duration-150
                  ${isActive(to)
                    ? "text-stone-900 bg-stone-100"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                  }
                `}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Right: auth-aware actions (desktop) ── */}
          <div className="hidden md:flex shrink-0 items-center gap-3">
            {user ? (
              <>
                {/* User avatar + name */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center uppercase">
                    {user.name?.charAt(0) ?? "?"}
                  </div>
                  <span className="text-sm font-medium text-stone-700 hidden lg:block max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-stone-400 hover:text-red-500 hover:bg-red-50/60 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                className="px-5 py-2 rounded-lg bg-stone-900 text-white text-sm font-semibold tracking-wide hover:bg-stone-800 transition-colors duration-150"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* ── Hamburger button (mobile only) ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile slide-down menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-stone-100"
              style={{ background: "rgba(255,255,255,0.96)" }}
            >
              <nav className="flex flex-col px-6 py-4 gap-1">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                      isActive(to)
                        ? "text-stone-900 bg-stone-100"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {label}
                  </Link>
                ))}

                {user ? (
                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-4">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center uppercase">
                        {user.name?.charAt(0) ?? "?"}
                      </div>
                      <span className="text-sm font-medium text-stone-700">{user.name}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-stone-500 hover:text-red-500"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/signin"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2.5 rounded-lg text-base font-semibold text-stone-700"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer so content doesn't hide behind fixed navbar */}
      <div className="h-16" />

      <main className="w-full">{children}</main>
    </div>
  );
}

