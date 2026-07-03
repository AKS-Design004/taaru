import Link from "next/link";
import type { ProviderSummary } from "@/lib/providers";

interface Props {
  provider: ProviderSummary;
}

export default function ProviderCard({ provider }: Props) {
  return (
    <Link
      href={`/providers/${provider.id}`}
      className="group block bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-[#D4AF37]/50 transition-all"
    >
      <div className="aspect-[4/3] bg-gray-800 relative overflow-hidden">
        {provider.firstPhotoUrl ? (
          <img
            src={provider.firstPhotoUrl}
            alt={provider.businessName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            Aucune photo
          </div>
        )}
        {provider.featured && (
          <span className="absolute top-2 left-2 bg-[#D4AF37] text-black text-xs font-bold px-2 py-1 rounded">
            À la une
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {provider.category}
        </p>
        <h3 className="text-lg font-semibold text-white mt-1 group-hover:text-[#D4AF37] transition-colors">
          {provider.businessName}
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          {provider.city}
          {provider.district ? `, ${provider.district}` : ""}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[#D4AF37] text-sm">
            {"★".repeat(Math.round(provider.rating))}
            {"☆".repeat(5 - Math.round(provider.rating))}
          </span>
          <span className="text-xs text-gray-500">
            ({provider.reviewCount})
          </span>
        </div>
      </div>
    </Link>
  );
}
