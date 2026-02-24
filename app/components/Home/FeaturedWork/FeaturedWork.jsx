"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useMenuStore } from "@/app/context/UIContext";

function hasTag(gallery, tag) {
  if (!gallery.tags) return false;
  const normalized = [];
  for (const t of gallery.tags) {
    const parts = t.split(",").map((p) => p.trim().toLowerCase());
    normalized.push(...parts.filter(Boolean));
  }
  return normalized.includes(tag.toLowerCase());
}

/**
 * Compute grid span for a gallery based on aspect ratio and tags
 * Returns "full" (3 cols), "wide" (2 cols), or "single" (1 col)
 */
function getGridSpan(gallery, index, total) {
  if (hasTag(gallery, "hero") || hasTag(gallery, "highlight")) return "full";
  if (hasTag(gallery, "editorial") || hasTag(gallery, "pair")) return "wide";

  const aspectRatio = gallery.imageAspectRatios?.[0] ?? 1.5;

  // Wide/landscape images span 2 columns
  if (aspectRatio >= 1.8) return "wide";

  return "single";
}

/**
 * Get aspect ratio class for the image container
 */
function getAspectClass(gallery) {
  const ar = gallery.imageAspectRatios?.[0] ?? 1.5;
  if (ar < 0.8) return "aspect-[3/4]"; // Portrait
  if (ar < 1.2) return "aspect-square"; // Square-ish
  if (ar < 1.6) return "aspect-[4/3]"; // Landscape
  return "aspect-[16/10]"; // Wide
}

export default function FeaturedWork({ galleries, quotes = [] }) {
  const { isMenuVisible } = useMenuStore();

  // Build the layout: galleries with interspersed quotes
  const layoutItems = useMemo(() => {
    if (!galleries?.length) return [];

    const items = [];
    let quoteIndex = 0;

    galleries.forEach((gallery, i) => {
      items.push({ type: "gallery", data: gallery, index: i });

      // Insert a quote every 3-4 galleries
      if ((i + 1) % 3 === 0 && quoteIndex < quotes.length) {
        items.push({ type: "quote", data: quotes[quoteIndex] });
        quoteIndex++;
      }
    });

    return items;
  }, [galleries, quotes]);

  if (layoutItems.length === 0) return null;

  return (
    <AnimatePresence>
      {!isMenuVisible && (
        <motion.section
          className="bg-[#0a0a0a] py-24 md:py-32 px-4 md:px-8 lg:px-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Section header */}
          <motion.header
            className="max-w-7xl mx-auto mb-16 md:mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="retro text-lg uppercase tracking-widest">
              Featured Work
            </h2>
          </motion.header>

          {/* 3-column grid on desktop, 2 on tablet, 1 on mobile */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {layoutItems.map((item, idx) => {
              if (item.type === "quote") {
                return (
                  <motion.blockquote
                    key={`quote-${idx}`}
                    className="col-span-1 md:col-span-2 lg:col-span-3 py-16 md:py-24"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <p className="text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed text-white/90 max-w-4xl">
                      &ldquo;{item.data.text}&rdquo;
                    </p>
                    {item.data.author && (
                      <cite className="block mt-6 retro text-xs uppercase tracking-widest text-white/50 not-italic">
                        — {item.data.author}
                      </cite>
                    )}
                  </motion.blockquote>
                );
              }

              const gallery = item.data;
              const span = getGridSpan(gallery, item.index, galleries.length);
              const aspectClass = getAspectClass(gallery);

              const spanClass =
                span === "full"
                  ? "col-span-1 md:col-span-2 lg:col-span-3"
                  : span === "wide"
                    ? "col-span-1 md:col-span-2"
                    : "col-span-1";

              const imageSizes =
                span === "full"
                  ? "100vw"
                  : span === "wide"
                    ? "(max-width: 768px) 100vw, 66vw"
                    : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw";

              return (
                <motion.article
                  key={gallery.id}
                  className={spanClass}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                >
                  <Link href={`/gallery/${gallery.id}`} className="block group">
                    {/* Fixed aspect ratio container with object-cover */}
                    <div
                      className={`relative overflow-hidden ${aspectClass}`}
                    >
                      <Image
                        src={gallery.coverPhoto || gallery.imageUrls[0]}
                        alt={gallery.title}
                        fill
                        sizes={imageSizes}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500" />

                      {/* Title - visible on hover (desktop) / always visible (mobile) */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                        <div className="md:translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          <h3 className="text-sm md:text-base uppercase tracking-wider text-white font-medium">
                            {gallery.title}
                          </h3>
                          {gallery.subTitle && (
                            <p className="text-xs text-white/60 mt-1">
                              {gallery.subTitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>

          {/* View all link */}
          <motion.div
            className="max-w-7xl mx-auto mt-20 md:mt-32 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/gallery"
              className="inline-block retro text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors border-b border-white/30 hover:border-white pb-1"
            >
              View All Work
            </Link>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
