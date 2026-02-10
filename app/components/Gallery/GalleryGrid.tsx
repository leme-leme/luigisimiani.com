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
                  {/* Horizontal cover for work page */}
                  <div className="relative aspect-[4/3] overflow-hidden flex items-center justify-center bg-[#1a1a1a]">
                    <Image
                      src={gallery.coverPhotoHorizontal || gallery.coverPhoto || gallery.imageUrls[0]}
                      alt={gallery.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Title - Always visible on mobile, visible on hover on desktop */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                      <h2 className="text-sm md:text-base uppercase tracking-wider text-white font-medium">{gallery.title}</h2>
                      {gallery.subTitle && (
                        <p className="text-xs text-white/70 mt-1">{gallery.subTitle}</p>
                      )}
                    </div>
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
