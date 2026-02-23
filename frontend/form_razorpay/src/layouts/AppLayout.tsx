/**
 * @file AppLayout.tsx
 * @description Shared layout shell for public and visit-entry pages.
 *
 * Auth-aware navbar with mobile hamburger menu:
 *   Guest:     logo · Home · About Us · Contact · Sign In
 *   Logged in: logo · Home · About Us · Contact · Visit Entry · Dashboard · avatar · Sign Out
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

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#faf8f4" }}>
      {/* ── Sticky navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300"
        style={{ background: "rgba(255,255,255,0.90)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-8 h-16 sm:h-18 flex items-center justify-between">

          {/* ── Left: logo ── */}
          <Link to="/" className="shrink-0 flex items-center gap-3 group">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-amber-50 shadow-sm ring-1 ring-black/8 group-hover:ring-amber-300/60 transition-all duration-200 flex items-center justify-center">
              <Scissors className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-amber-600" />
            </div>
            <span className="text-lg font-bold text-stone-800 tracking-tight hidden sm:block">
              The Experts
            </span>
          </Link>

          {/* ── Center: nav links (desktop only) ── */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1.5">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`
                  px-4.5 py-2 rounded-md text-lg font-medium tracking-wide
                  transition-colors duration-150
                  ${pathname === to
                    ? "text-stone-900 bg-stone-100"
                    : "text-stone-600 hover:text-black hover:bg-stone-100/70"
                  }
                `}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Right: auth-aware actions (desktop) ── */}
          <div className="hidden md:flex shrink-0 items-center gap-5">
            {user ? (
              <>
                {/* Visit Entry link (gradient) */}
                <Link to="/visit-entry">
                  <span
                    className="text-lg font-semibold tracking-wide cursor-pointer select-none transition-all duration-200"
                    style={{
                      background: "linear-gradient(90deg, #a855f7 0%, #f59e0b 50%, #ec4899 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      backgroundSize: "200% auto",
                      animation: "gradientShift 3s linear infinite",
                    }}
                  >
                    Visit Entry
                  </span>
                </Link>

                {/* Dashboard link (only for manager/owner) */}
                {(user.role === "manager" || user.role === "owner") && (
                  <Link
                    to={dashboardPath(user.role)}
                    className="text-lg font-semibold tracking-wide text-stone-700 hover:text-stone-900 transition-colors duration-150"
                  >
                    Dashboard
                  </Link>
                )}

                {/* User avatar + name */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center uppercase">
                    {user.name?.charAt(0) ?? "?"}
                  </div>
                  <span className="text-sm font-medium text-stone-700 hidden sm:block">
                    {user.name}
                  </span>
                </div>

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-red-500 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <Link to="/signin" className="shrink-0">
                <span className={`text-lg font-semibold tracking-wide transition-colors duration-150 cursor-pointer select-none ${pathname === "/signin" ? "text-stone-900" : "text-stone-700 hover:text-stone-900"}`}>
                  Sign In
                </span>
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
                      pathname === to
                        ? "text-stone-900 bg-stone-100"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {label}
                  </Link>
                ))}

                {user ? (
                  <>
                    <Link
                      to="/visit-entry"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-2.5 rounded-lg text-base font-semibold text-amber-600"
                    >
                      Visit Entry
                    </Link>
                    {(user.role === "manager" || user.role === "owner") && (
                      <Link
                        to={dashboardPath(user.role)}
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-2.5 rounded-lg text-base font-medium text-stone-600 hover:bg-stone-50"
                      >
                        Dashboard
                      </Link>
                    )}
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
                  </>
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
      <div className="h-16 sm:h-18" />

      <main className="w-full">{children}</main>

      {/* Gradient keyframe — injected once via a style tag */}
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}

