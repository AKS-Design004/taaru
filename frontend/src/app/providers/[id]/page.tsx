"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProviderDetail } from "@/lib/providers";
import type { ProviderDetail } from "@/lib/providers";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(false);
    getProviderDetail(id)
      .then(setProvider)
      .catch(() => {
        setProvider(null);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
          <div className="aspect-square rounded-xl bg-surface-800 col-span-2 row-span-2" />
          <div className="aspect-square rounded-xl bg-surface-800" />
          <div className="aspect-square rounded-xl bg-surface-800" />
        </div>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-20 h-20 rounded-xl bg-surface-800" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-32 rounded bg-surface-800" />
            <div className="h-8 w-64 rounded bg-surface-800" />
            <div className="h-4 w-48 rounded bg-surface-800" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorState onRetry={load} />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="page-container">
        <EmptyState
          title="Prestataire introuvable"
          message="Ce prestataire n'existe pas ou a été supprimé."
        />
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      {provider.photoUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
          {provider.photoUrls.slice(0, 5).map((url, i) => (
            <button
              key={i}
              onClick={() => setSelectedPhoto(url)}
              className={`aspect-square rounded-xl overflow-hidden bg-surface-900 group ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={url}
                alt={`${provider.businessName} - ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
              />
            </button>
          ))}
        </div>
      )}

      <div className="flex items-start gap-4 mb-8 max-w-3xl">
        {provider.logoUrl && (
          <img
            src={provider.logoUrl}
            alt={provider.businessName}
            className="w-20 h-20 rounded-xl object-cover ring-2 ring-surface-800"
          />
        )}
        <div className="flex-1">
          <p className="text-sm text-gold-500/70 uppercase tracking-wider font-medium">
            {provider.category}
            {provider.subcategory ? ` / ${provider.subcategory}` : ""}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-1">
            {provider.businessName}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex text-gold-500">
              {Array.from({ length: 5 }, (_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(provider.rating) ? "text-gold-500" : "text-surface-700"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </span>
            <span className="text-sm text-surface-500">
              {provider.reviewCount} avis
            </span>
          </div>
          <p className="text-surface-400 mt-1 flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {provider.city}
            {provider.district ? `, ${provider.district}` : ""}
          </p>
        </div>
      </div>

      {provider.description && (
        <div className="mb-10 max-w-3xl">
          <h2 className="text-xl font-semibold mb-3 text-white">À propos</h2>
          <p className="text-surface-400 leading-relaxed whitespace-pre-line">
            {provider.description}
          </p>
        </div>
      )}

      <div className="card max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 text-white">Contact</h2>
        <div className="space-y-4">
          {provider.phone && (
            <a
              href={`tel:${provider.phone}`}
              className="flex items-center gap-3 text-surface-300 hover:text-gold-500 transition-colors"
            >
              <svg
                className="w-5 h-5 text-surface-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{provider.phone}</span>
            </a>
          )}
          {provider.whatsapp && (
            <a
              href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-surface-300 hover:text-status-success transition-colors"
            >
              <svg
                className="w-5 h-5 text-surface-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>{provider.whatsapp}</span>
            </a>
          )}
          {provider.address && (
            <p className="flex items-center gap-3 text-surface-300">
              <svg
                className="w-5 h-5 text-surface-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{provider.address}</span>
            </p>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer backdrop-blur-sm"
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 text-surface-400 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={selectedPhoto}
            alt="Photo agrandie"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
