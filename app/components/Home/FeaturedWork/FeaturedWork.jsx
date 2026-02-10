"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useMenuStore } from "@/app/context/UIContext";

// Normalize tags - handles both array elements and comma-separated strings
function hasTag(gallery, tag) {
  if (!gallery.tags) return false;
  const normalized = [];
  for (const t of gallery.tags) {
    const parts = t.split(",").map((p) => p.trim().toLowerCase());
    normalized.push(...parts.filter(Boolean));
  }
  return normalized.includes(tag.toLowerCase());
}

// Generate deterministic vertical offset for staggered look
function getVerticalOffset(id, index) {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = (hash + index) % 100;
  return [0, 80, 40, 120, 20, 100, 60, 140][seed % 8];
}

export default function FeaturedWork({ galleries, quotes = [] }) {
  const { isMenuVisible } = useMenuStore();

  // Combine galleries and quotes into a single feed
  const feedItems = useMemo(() => {
    const items = [];

    // Add galleries as gallery type
    galleries?.forEach((g, i) => {
      items.push({ type: "gallery", data: g, order: i });
    });

    // Add quotes interspersed
    quotes?.forEach((q, i) => {
      items.push({ type: "quote", data: q, order: i + 0.5 });
    });

    // Sort by order to intersperse
    return items.sort((a, b) => a.order - b.order);
  }, [galleries, quotes]);

  // Memoize vertical offsets
  const verticalOffsets = useMemo(() => {
    return feedItems.map((item, i) =>
      getVerticalOffset(item.data.id || `quote-${i}`, i)
    );
  }, [feedItems]);

  if (feedItems.length === 0) return null;

  return (
    <AnimatePresence>
      {!isMenuVisible && (
        <motion.section
          className="bg-[#0a0a0a] py-32 px-8 md:px-16 lg:px-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Section header */}
          <motion.header
            className="max-w-6xl mx-auto mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="retro text-lg uppercase tracking-widest">
              Featured Work
            </h2>
          </motion.header>

          {/* Two-column grid feed */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12">
            {feedItems.map((item, index) => {
              const verticalOffset = verticalOffsets[index];

              if (item.type === "quote") {
                return (
                  <motion.blockquote
                    key={`quote-${index}`}
                    className="col-span-1 md:col-span-2 py-[25vh]"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <p className="text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed text-white/90 max-w-4xl">
                      "{item.data.text}"
                    </p>
                    {item.data.author && (
                      <cite className="block mt-8 retro text-xs uppercase tracking-widest text-white/50 not-italic">
                        — {item.data.author}
                      </cite>
                    )}
                  </motion.blockquote>
                );
              }

              const gallery = item.data;
              const isHero = hasTag(gallery, "hero");

              return (
                <motion.article
                  key={gallery.id}
                  className={`relative mb-[40vh] ${isHero ? "col-span-1 md:col-span-2" : ""}`}
                  style={{ marginTop: isHero ? 0 : verticalOffset }}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                >
                  <Link href={`/gallery/${gallery.id}`} className="block group">
                    {/* Image with vertical aspect ratio for landing page */}
                    <div className="relative overflow-hidden aspect-[3/4] md:aspect-[2/3]">
                      <Image
                        src={gallery.coverPhotoVertical || gallery.coverPhoto || gallery.imageUrls[0]}
                        alt={gallery.title}
                        fill
                        sizes={isHero ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />

                      {/* Gradient overlay for text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Title on image */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <h3 className="text-base md:text-xl uppercase tracking-wider text-white mb-1">
                          {gallery.title}
                        </h3>
                        {gallery.subTitle && (
                          <p className="text-xs md:text-sm text-white/60">
                            {gallery.subTitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>

          {/* View all link */}
          <motion.div
            className="max-w-6xl mx-auto mt-32 text-center"
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
