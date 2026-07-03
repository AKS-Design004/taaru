"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProviderDetail } from "@/lib/providers";
import type { ProviderDetail } from "@/lib/providers";

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    getProviderDetail(id)
      .then(setProvider)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Prestataire introuvable
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Galerie */}
      {provider.photoUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
          {provider.photoUrls.slice(0, 5).map((url, i) => (
            <button
              key={i}
              onClick={() => setSelectedPhoto(url)}
              className={`aspect-square rounded-lg overflow-hidden bg-gray-800 ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={url}
                alt={`${provider.businessName} - ${i + 1}`}
                className="w-full h-full object-cover hover:opacity-80 transition-opacity"
              />
            </button>
          ))}
        </div>
      )}

      {/* En-tête */}
      <div className="flex items-start gap-4 mb-8">
        {provider.logoUrl && (
          <img
            src={provider.logoUrl}
            alt={provider.businessName}
            className="w-20 h-20 rounded-xl object-cover"
          />
        )}
        <div className="flex-1">
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            {provider.category}
            {provider.subcategory ? ` / ${provider.subcategory}` : ""}
          </p>
          <h1 className="text-3xl font-bold mt-1">{provider.businessName}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[#D4AF37]">
              {"★".repeat(Math.round(provider.rating))}
              {"☆".repeat(5 - Math.round(provider.rating))}
            </span>
            <span className="text-sm text-gray-500">
              ({provider.reviewCount} avis)
            </span>
          </div>
          <p className="text-gray-400 mt-1">
            {provider.city}
            {provider.district ? `, ${provider.district}` : ""}
          </p>
        </div>
      </div>

      {/* Description */}
      {provider.description && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">À propos</h2>
          <p className="text-gray-300 whitespace-pre-line">
            {provider.description}
          </p>
        </div>
      )}

      {/* Contact */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Contact</h2>
        <div className="space-y-3">
          {provider.phone && (
            <a
              href={`tel:${provider.phone}`}
              className="flex items-center gap-3 text-gray-300 hover:text-[#D4AF37] transition-colors"
            >
              <span>📞</span>
              <span>{provider.phone}</span>
            </a>
          )}
          {provider.whatsapp && (
            <a
              href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-300 hover:text-green-500 transition-colors"
            >
              <span>💬</span>
              <span>{provider.whatsapp}</span>
            </a>
          )}
          {provider.address && (
            <p className="flex items-center gap-3 text-gray-300">
              <span>📍</span>
              <span>{provider.address}</span>
            </p>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={selectedPhoto}
            alt="Photo agrandie"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
