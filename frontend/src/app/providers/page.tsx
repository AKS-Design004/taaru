"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProviderCard from "@/components/providers/ProviderCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import type { ProviderSummary } from "@/lib/providers";
import { searchProviders } from "@/lib/providers";

export default function ProvidersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black pt-32 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ProvidersContent />
    </Suspense>
  );
}

function ProvidersContent() {
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const load = () => {
    setLoading(true);
    setError(false);
    searchProviders({
      query: searchParams.get("query") || undefined,
      city: searchParams.get("city") || undefined,
      category: searchParams.get("category") || undefined,
    })
      .then((res) => setProviders(res.content))
      .catch(() => {
        setProviders([]);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [searchParams]);

  const categoryLabel = searchParams.get("category");

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
            <p className="text-sm font-body text-white/60 mb-3 tracking-wide">
              {'// Annuaire'}
            </p>
          <h1
            className="font-heading italic text-white text-5xl md:text-6xl lg:text-[5rem] leading-[0.9] tracking-[-3px]"
            style={{ fontStyle: "italic" }}
          >
            {categoryLabel
              ? `${categoryLabel}`
              : "Prestataires"}
          </h1>
          <p className="mt-4 text-sm text-white/60 font-body font-light max-w-xl">
            Découvrez les meilleurs professionnels près de chez vous
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="liquid-glass rounded-[1.25rem] p-2 flex items-center gap-2 mb-10 max-w-2xl"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const params = new URLSearchParams();
                if (query) params.set("query", query);
                const cat = searchParams.get("category");
                if (cat) params.set("category", cat);
                window.history.pushState(null, "", `?${params.toString()}`);
                window.dispatchEvent(new Event("popstate"));
              }
            }}
            placeholder="Rechercher par nom, ville, catégorie..."
            className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 font-body outline-none"
          />
          <button
            onClick={() => {
              const params = new URLSearchParams();
              if (query) params.set("query", query);
              const cat = searchParams.get("category");
              if (cat) params.set("category", cat);
              window.history.pushState(null, "", `?${params.toString()}`);
              window.dispatchEvent(new Event("popstate"));
            }}
            className="rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium whitespace-nowrap hover:bg-white/90 transition-colors font-body"
          >
            Rechercher
          </button>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : providers.length === 0 ? (
          <EmptyState
            title="Aucun prestataire trouvé"
            message="Essayez de modifier vos critères de recherche"
          />
        ) : (
          <>
            <p className="text-sm text-white/40 font-body mb-6">
              {providers.length} prestataire
              {providers.length > 1 ? "s" : ""} trouvé
              {providers.length > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {providers.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <ProviderCard provider={p} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
