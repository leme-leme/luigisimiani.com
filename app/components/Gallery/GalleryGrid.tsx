"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useMenuStore } from "@/app/context/UIContext";
import type { Gallery } from "@/app/types/content";

interface GalleryGridProps {
  galleries: Gallery[];
}

export default function GalleryGrid({ galleries }: GalleryGridProps) {
  const { isMenuVisible } = useMenuStore();

  return (
    <AnimatePresence>
      {!isMenuVisible && (
        <motion.div
          className="min-h-screen bg-[#0a0a0a]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Page title */}
          <header className="pt-28 pb-8 px-8">
          </header>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-8 pb-16 max-w-7xl mx-auto">
            {galleries.map((gallery, index) => (
              <motion.article
                key={gallery.id}
                className="relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
              >
                <Link href={`/gallery/${gallery.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={gallery.coverPhoto || gallery.imageUrls[0]}
                      alt={gallery.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <h2 className="text-sm uppercase tracking-wider text-white">{gallery.title}</h2>
                    {gallery.subTitle && (
                      <p className="text-xs text-white/70 mt-1">{gallery.subTitle}</p>
                    )}
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
