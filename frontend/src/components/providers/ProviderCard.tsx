"use client";

import Link from "next/link";
import type { ProviderSummary } from "@/lib/providers";

interface Props {
  provider: ProviderSummary;
}

export default function ProviderCard({ provider }: Props) {
  return (
    <Link
      href={`/providers/${provider.id}`}
      className="group block liquid-glass rounded-[1.25rem] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.12)]"
    >
      <div className="aspect-[4/3] bg-black/40 relative overflow-hidden">
        {provider.firstPhotoUrl ? (
          <>
            <img
              src={provider.firstPhotoUrl}
              alt={provider.businessName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/30 gap-3">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">Aucune photo</span>
          </div>
        )}
        {provider.featured && (
          <span className="absolute top-3 left-3 bg-gold-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
            À la une
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs text-white/50 uppercase tracking-wider font-medium font-body">
          {provider.category}
        </p>
        <h3 className="text-lg font-heading italic text-white mt-1.5 group-hover:text-white/80 transition-colors duration-300">
          {provider.businessName}
        </h3>
        <p className="text-sm text-white/50 mt-1.5 flex items-center gap-1.5 font-body">
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
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
        {provider.rating > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <span className="flex text-white/80">
              {Array.from({ length: 5 }, (_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(provider.rating) ? "text-white" : "text-white/20"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </span>
            <span className="text-xs text-white/40 font-body">
              {provider.reviewCount} avis
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
