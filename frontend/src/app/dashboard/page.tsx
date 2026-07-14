"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/layout/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { getMyProviderProfile } from "@/lib/providers";
import type { ProviderDetail } from "@/lib/providers";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { user } = useAuth();
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
    <div className="page-container animate-fade-in">
      <div className="max-w-3xl">
        <h1 className="section-title text-left">
          Bonjour, {user?.firstName}
        </h1>
        <p className="text-surface-400 mt-1">
          {user?.role === "PROFESSIONAL"
            ? "Espace professionnel"
            : "Espace client"}
        </p>
      </div>

      {user?.role === "PROFESSIONAL" && (
        <div className="mt-8 max-w-3xl">
          {loading ? (
            <div className="card animate-pulse p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-surface-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-48 rounded bg-surface-800" />
                  <div className="h-4 w-32 rounded bg-surface-800" />
                </div>
              </div>
            </div>
          ) : profile ? (
            <div className="card p-6">
              <div className="flex items-start gap-4">
                {profile.logoUrl && (
                  <img
                    src={profile.logoUrl}
                    alt={profile.businessName}
                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-surface-800"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold">
                    {profile.businessName}
                  </h2>
                  <p className="text-sm text-gold-500/70">
                    {profile.category}
                    {profile.city && (
                      <>
                        <span className="text-surface-600 mx-1">—</span>
                        {profile.city}
                      </>
                    )}
                  </p>
                  {profile.rating > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="flex text-gold-500">
                        {Array.from({ length: 5 }, (_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(profile.rating) ? "text-gold-500" : "text-surface-700"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </span>
                      <span className="text-sm text-surface-500">
                        {profile.reviewCount} avis
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-surface-800 flex flex-wrap gap-3">
                <Link href="/dashboard/edit" className="btn-primary">
                  Modifier mon profil
                </Link>
                <Link
                  href={`/providers/${profile.id}`}
                  className="btn-ghost"
                >
                  Voir ma page
                </Link>
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center">
              <svg
                className="w-12 h-12 text-surface-700 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <p className="text-surface-400 mb-6">
                Vous n&apos;avez pas encore de profil professionnel
              </p>
              <Link href="/dashboard/edit" className="btn-primary">
                Créer mon profil
              </Link>
            </div>
          )}
        </div>
      )}

      {user?.role === "CLIENT" && (
        <div className="mt-8 max-w-3xl">
          <div className="card p-8 text-center">
            <svg
              className="w-12 h-12 text-surface-700 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-surface-400">
              Votre espace client sera bientôt disponible.
            </p>
            <Link href="/providers" className="btn-ghost mt-4 inline-flex">
              Parcourir les prestataires
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
