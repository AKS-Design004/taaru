"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/layout/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { getMyProviderProfile } from "@/lib/providers";
import type { ProviderDetail } from "@/lib/providers";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<ProviderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "PROFESSIONAL") {
      getMyProviderProfile()
        .then(setProfile)
        .catch(() => setProfile(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Bonjour, {user?.firstName}
          </h1>
          <p className="text-gray-400 mt-1">
            {user?.role === "PROFESSIONAL" ? "Espace professionnel" : "Espace client"}
          </p>
        </div>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Déconnexion
        </button>
      </div>

      {user?.role === "PROFESSIONAL" && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : profile ? (
            <div>
              <div className="flex items-start gap-4">
                {profile.logoUrl && (
                  <img
                    src={profile.logoUrl}
                    alt={profile.businessName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    {profile.businessName}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {profile.category} — {profile.city}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="text-[#D4AF37]">
                      {"★".repeat(Math.round(profile.rating))}
                      {"☆".repeat(5 - Math.round(profile.rating))}
                    </span>
                    <span className="text-gray-500">
                      {profile.reviewCount} avis
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href="/dashboard/edit"
                className="inline-block mt-4 text-sm text-[#D4AF37] hover:underline"
              >
                Modifier mon profil →
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">
                Vous n&apos;avez pas encore de profil professionnel
              </p>
              <Link
                href="/dashboard/edit"
                className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#E8C547] transition-colors"
              >
                Créer mon profil
              </Link>
            </div>
          )}
        </div>
      )}

      {user?.role === "CLIENT" && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400">
            Votre espace client sera bientôt disponible.
          </p>
        </div>
      )}
    </div>
  );
}
