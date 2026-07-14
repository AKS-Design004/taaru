"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import ProviderCard from "@/components/providers/ProviderCard";
import BlurText from "@/components/ui/BlurText";
import { getFeaturedProviders, searchProviders } from "@/lib/providers";
import type { ProviderSummary } from "@/lib/providers";

const categories = [
  {
    name: "Mode",
    slug: "mode",
    desc: "Créateurs, boutiques et styling",
    tags: ["Haute Couture", "Streetwear", "Accessoires", "Sur-Mesure"],
    icon: "M7 21c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1H7v1ZM5 5v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2Zm3 0h8v10H8V5Z",
  },
  {
    name: "Couture",
    slug: "couture",
    desc: "Tailleurs, couturiers et retouches",
    tags: ["Sur Mesure", "Retouches", "Mariage", "Traditionnel"],
    icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm-7 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6Zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4Z",
  },
  {
    name: "Beauté",
    slug: "beaute",
    desc: "Coiffure, maquillage, soins et bien-être",
    tags: ["Coiffure", "Maquillage", "Soins", "Bien-être"],
    icon: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z",
  },
  {
    name: "Événementiel",
    slug: "evenementiel",
    desc: "Wedding planners, traiteurs, DJ et photographes",
    tags: ["Mariage", "Soirée", "Corporate", "Festival"],
    icon: "M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1Zm-2 14-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8Z",
  },
];

/* ───── Sparkle dot decorator ───── */
function GoldDot({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-block w-1.5 h-1.5 rounded-full bg-gold-500/50 ${className}`} />
  );
}

export default function Home() {
  const [featured, setFeatured] = useState<ProviderSummary[]>([]);
  const [realTotalProviders, setRealTotalProviders] = useState<number | null>(null);

  useEffect(() => {
    getFeaturedProviders()
      .then(setFeatured)
      .catch(() => setFeatured([]));
  }, []);

  useEffect(() => {
    searchProviders({ size: 1 })
      .then((res) => setRealTotalProviders(res.totalElements))
      .catch(() => {});
  }, []);

  const providerCount = realTotalProviders ?? featured.length;
  const displayCount = providerCount > 0 ? providerCount : null;
  const totalReviews = featured.reduce((sum, p) => sum + p.reviewCount, 0);
  const displayReviews = totalReviews > 0 ? totalReviews : null;

  return (
    <div>
      {/* ───── HERO ───── */}
      <section className="relative min-h-screen flex flex-col bg-black overflow-hidden">
        {/* Ambient gold glow layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(212,175,55,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_30%_at_50%_80%,rgba(212,175,55,0.06)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/3 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_50%)] pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24">
          {/* Badge */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="liquid-glass rounded-full inline-flex items-center mb-8 shadow-[0_0_20px_-5px_rgba(212,175,55,0.15)]"
          >
            <span className="bg-white text-black px-3 py-1 text-xs font-semibold rounded-full">
              Nouveau
            </span>
            <span className="text-sm text-white/90 px-3 font-body">
              Mode & Beauté au Sénégal
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          >
            <BlurText
              text="La mode et la beauté à portée de clic"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-heading italic text-white leading-[0.85] max-w-3xl mx-auto tracking-[-3px] drop-shadow-[0_0_30px_rgba(212,175,55,0.08)]"
            />
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
            className="mt-6 text-sm md:text-base text-white/70 max-w-xl mx-auto text-center font-body font-light leading-tight"
          >
            Découvrez les meilleurs professionnels de la mode, couture, beauté
            et événementiel au Sénégal — sélectionnés pour leur excellence.
          </motion.p>

          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="w-32 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mt-8"
          />

          {/* CTAs */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1, ease: "easeOut" }}
            className="flex items-center gap-6 mt-8"
          >
            <Link
              href="/providers"
              className="liquid-glass-strong rounded-full px-7 py-3.5 text-sm font-medium text-white flex items-center gap-2 font-body shadow-[0_0_25px_-5px_rgba(212,175,55,0.2)]"
            >
              Explorer les prestataires
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" /><path d="M7 7h10v10" />
              </svg>
            </Link>
            <Link
              href="/auth/register"
              className="text-sm text-white/70 font-body hover:text-gold-500 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,4 20,12 6,20" />
              </svg>
              Rejoindre
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3, ease: "easeOut" }}
            className="flex items-stretch gap-4 mt-12"
          >
            <div className="liquid-glass rounded-[1.25rem] p-5 w-[210px] shadow-[0_0_15px_-5px_rgba(212,175,55,0.1)]">
              <svg className="w-7 h-7 text-gold-500/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <p className="font-heading italic text-white text-4xl tracking-[-1px] leading-none mt-3" style={{ fontStyle: "italic" }}>
                {displayCount ?? "..."}
              </p>
              <p className="text-xs text-white/50 font-body font-light mt-2 flex items-center gap-1.5">
                <GoldDot /> Prestataires
              </p>
            </div>
            <div className="liquid-glass rounded-[1.25rem] p-5 w-[210px] shadow-[0_0_15px_-5px_rgba(212,175,55,0.1)]">
              <svg className="w-7 h-7 text-gold-500/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <p className="font-heading italic text-white text-4xl tracking-[-1px] leading-none mt-3" style={{ fontStyle: "italic" }}>
                {displayReviews !== null ? `${displayReviews}` : "..."}
              </p>
              <p className="text-xs text-white/50 font-body font-light mt-2 flex items-center gap-1.5">
                <GoldDot /> Avis clients
              </p>
            </div>
          </motion.div>
        </div>

        {/* Partners */}
        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-4 pb-10"
        >
          <div className="liquid-glass rounded-full px-4 py-1.5">
            <span className="text-xs font-medium text-white/70 font-body">
              Ils nous font confiance
            </span>
          </div>
          <div className="flex items-center gap-10 md:gap-16 text-2xl md:text-3xl font-heading italic text-white/90 tracking-tight">
            <span>Dakar</span>
            <span className="text-white/10 font-body text-base">/</span>
            <span>Thiès</span>
            <span className="text-white/10 font-body text-base">/</span>
            <span>Saint-Louis</span>
          </div>
        </motion.div>
      </section>

      {/* ───── CATÉGORIES ───── */}
      <section className="relative bg-black overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_30%,rgba(212,175,55,0.06)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid bg-dot-grid pointer-events-none opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-sm font-body text-gold-500/60 mb-4 tracking-wide">
              {'// Domaines'}
            </p>
            <div className="flex items-end gap-6">
              <h2
                className="font-heading italic text-white text-5xl md:text-6xl lg:text-[5.5rem] leading-[0.9] tracking-[-3px]"
                style={{ fontStyle: "italic" }}
              >
                Quatre
                <br />
                univers
              </h2>
              <div className="hidden md:block w-32 h-px bg-gradient-to-r from-gold-500/40 to-transparent mb-6" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.slug} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───── FEATURED ───── */}
      {featured.length > 0 && (
        <section className="relative bg-black overflow-hidden py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_70%,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <p className="text-sm font-body text-gold-500/60 mb-4 tracking-wide">
                {'// Sélection'}
              </p>
              <div className="flex items-end gap-6">
                <h2
                  className="font-heading italic text-white text-5xl md:text-6xl lg:text-[5.5rem] leading-[0.9] tracking-[-3px]"
                  style={{ fontStyle: "italic" }}
                >
                  Prestataires
                  <br />
                  à la une
                </h2>
                <div className="hidden md:block w-32 h-px bg-gradient-to-r from-gold-500/40 to-transparent mb-6" />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <ProviderCard provider={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───── CTA ───── */}
      <section className="relative bg-black overflow-hidden py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(212,175,55,0.1)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid bg-dot-grid pointer-events-none opacity-20" />
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-body text-gold-500/60 mb-4 tracking-wide">
              {'// Rejoignez-nous'}
            </p>
            <h2
              className="font-heading italic text-white text-5xl md:text-6xl lg:text-[5rem] leading-[0.9] tracking-[-3px] mb-6"
              style={{ fontStyle: "italic" }}
            >
              Vous êtes
              <br />
              professionnel ?
            </h2>
            <div className="flex items-center justify-center gap-4 text-white/40 text-xl md:text-2xl font-heading italic mb-8" style={{ fontStyle: "italic" }}>
              <span>Mode</span>
              <GoldDot />
              <span>Couture</span>
              <GoldDot />
              <span>Beauté</span>
              <GoldDot />
              <span>Événements</span>
            </div>
            <p className="text-sm md:text-base text-white/50 font-body font-light max-w-md mx-auto mb-10">
              Créez votre profil gratuitement et commencez à recevoir des
              demandes de clients dès aujourd&apos;hui.
            </p>
            <Link
              href="/auth/register"
              className="liquid-glass-strong rounded-full px-8 py-4 text-sm font-medium text-white inline-flex items-center gap-2 font-body shadow-[0_0_30px_-5px_rgba(212,175,55,0.25)]"
            >
              Rejoindre TAARU
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" /><path d="M7 7h10v10" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ───── Category Card ───── */
function CategoryCard({
  category,
  index,
}: {
  category: (typeof categories)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <Link
        href={`/providers?category=${category.slug}`}
        className="group block liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col relative overflow-hidden hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.15)] transition-shadow duration-500"
      >
        {/* Gold accent top line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gold-500/20 group-hover:w-24 transition-all duration-500" />

        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <div className="w-11 h-11 liquid-glass rounded-[0.75rem] flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_15px_-3px_rgba(212,175,55,0.15)] transition-shadow duration-500">
            <svg className="w-6 h-6 text-gold-500/80" viewBox="0 0 24 24" fill="currentColor">
              <path d={category.icon} />
            </svg>
          </div>
          <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
            {category.tags.map((tag) => (
              <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/80 font-body whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        <div className="mt-6">
          <h3
            className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none group-hover:text-gold-500 transition-colors duration-500"
            style={{ fontStyle: "italic" }}
          >
            {category.name}
          </h3>
          <p className="mt-3 text-sm text-white/70 font-body font-light leading-snug max-w-[32ch]">
            {category.desc}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
