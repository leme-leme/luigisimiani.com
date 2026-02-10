"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Gallery } from "@/app/types/content";

interface HorizontalGalleryScrollProps {
  galleries: Gallery[];
}

export default function HorizontalGalleryScroll({ galleries }: HorizontalGalleryScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full py-8">
      {/* Title */}
      <div className="px-8 mb-6">
        <h2 className="retro text-lg uppercase tracking-wider">Work</h2>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-8 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {galleries.map((gallery, index) => (
          <motion.div
            key={gallery.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link href={`/gallery/${gallery.id}`} className="block group">
              <div className="relative w-72 md:w-80 lg:w-96 aspect-[4/3] overflow-hidden bg-[#1a1a1a]">
                <Image
                  src={gallery.coverPhotoHorizontal || gallery.coverPhoto || gallery.imageUrls[0]}
                  alt={gallery.title}
                  fill
                  sizes="(max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="mt-3">
                <h3 className="text-sm uppercase tracking-wider group-hover:text-[#ffd700] transition-colors">
                  {gallery.title}
                </h3>
                {gallery.subTitle && (
                  <p className="text-xs text-white/60 mt-1">{gallery.subTitle}</p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}

        {/* View All link */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: galleries.length * 0.1, duration: 0.5 }}
          className="flex-shrink-0 flex items-center justify-center w-48"
        >
          <Link
            href="/gallery"
            className="retro text-xs uppercase tracking-wider text-white/60 hover:text-[#ffd700] transition-colors"
          >
            View All →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
