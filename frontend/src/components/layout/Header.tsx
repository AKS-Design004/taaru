"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/providers", label: "Prestataires" },
  ];

  return (
    <nav
      className={`fixed top-4 left-4 right-4 lg:left-8 lg:right-8 z-50 transition-all duration-500 ${
        scrolled ? "top-2 lg:top-3" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="liquid-glass rounded-full px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full liquid-glass flex items-center justify-center flex-shrink-0"
          >
            <span
              className="font-heading italic text-white text-lg lg:text-xl"
              style={{ fontStyle: "italic" }}
            >
              t
            </span>
          </Link>

          {/* Desktop nav — center */}
          <div className="hidden md:flex items-center gap-1 liquid-glass rounded-full px-1.5 py-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <button
                onClick={logout}
                className="px-3 py-2 text-sm font-medium text-white/90 font-body hover:text-status-error transition-colors"
              >
                Déconnexion
              </button>
            ) : (
              <Link
                href="/auth/register"
                className="rounded-full bg-gold-500 text-black px-4 py-2 text-sm font-medium whitespace-nowrap hover:bg-gold-400 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  Inscription
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </span>
              </Link>
            )}
          </div>

          {/* Invisible spacer (mobile) */}
          <div className="w-10 h-10 md:hidden" />

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-white"
            aria-label="Menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-2 liquid-glass rounded-2xl p-4 md:hidden"
            >
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-white/90 font-body hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                {user && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-white/90 font-body hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-sm text-status-error font-body rounded-xl hover:bg-white/5 transition-colors"
                  >
                    Déconnexion
                  </button>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-white/90 font-body hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-center rounded-full bg-white text-black px-4 py-3 text-sm font-medium"
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
