"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const categories = [
  { name: "Mode", icon: "👗", slug: "mode" },
  { name: "Couture", icon: "🧵", slug: "couture" },
  { name: "Beauté", icon: "💄", slug: "beaute" },
  { name: "Événementiel", icon: "🎉", slug: "evenementiel" },
];

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>("checking...");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus("disconnected"));
  }, []);

  return (
    <div className="min-h-screen">
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
          <span className="text-[#D4AF37]">TAARU</span>
        </h1>
        <p className="mt-4 text-xl text-gray-400 max-w-lg">
          Toute la mode et la beauté à portée de clic
        </p>

        <div className="mt-8 w-full max-w-2xl">
          <div className="flex gap-2 bg-gray-900 rounded-lg p-2">
            <input
              type="text"
              placeholder="Que recherchez-vous ? (prestataire, ville, catégorie...)"
              className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none"
            />
            <button className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#E8C547] transition-colors">
              Rechercher
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/providers?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-[#D4AF37]/50 transition-colors group"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm text-gray-400 group-hover:text-[#D4AF37] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-xs text-gray-600">
          API :{" "}
          <span
            className={
              apiStatus === "UP" ? "text-green-500" : "text-red-500"
            }
          >
            {apiStatus}
          </span>
        </p>
      </section>

      <footer className="text-center pb-8 text-xs text-gray-600">
        &copy; {new Date().getFullYear()} TAARU. Tous droits réservés.
      </footer>
    </div>
  );
}
