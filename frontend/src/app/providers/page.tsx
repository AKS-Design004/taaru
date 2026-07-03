"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProviderCard from "@/components/providers/ProviderCard";
import type { ProviderSummary } from "@/lib/providers";
import { searchProviders } from "@/lib/providers";

export default function ProvidersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProvidersContent />
    </Suspense>
  );
}

function ProvidersContent() {
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setLoading(true);
    searchProviders({
      query: searchParams.get("query") || undefined,
      city: searchParams.get("city") || undefined,
      category: searchParams.get("category") || undefined,
    })
      .then((res) => setProviders(res.content))
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Prestataires</h1>
        <p className="text-gray-400 mt-2">
          Découvrez les meilleurs professionnels près de chez vous
        </p>
      </div>

      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par nom, ville, catégorie..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
        />
        <button
          onClick={() => {
            const params = new URLSearchParams();
            if (query) params.set("query", query);
            window.history.pushState(null, "", `?${params.toString()}`);
            window.dispatchEvent(new Event("popstate"));
          }}
          className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#E8C547] transition-colors"
        >
          Rechercher
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">Aucun prestataire trouvé</p>
          <p className="text-sm mt-2">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {providers.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      )}
    </div>
  );
}
