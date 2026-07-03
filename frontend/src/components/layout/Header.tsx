"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-[#D4AF37]">
            TAARU
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/providers"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Prestataires
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {user.firstName}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#E8C547] transition-colors"
                >
                  Inscription
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
