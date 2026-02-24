"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useMenuStore } from "@/app/context/UIContext";

const SLIDE_DURATION = 5000;

export default function HeroSlideshow({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isMenuVisible } = useMenuStore();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [nextSlide, slides.length]);

  if (!slides || slides.length === 0) return null;

  const current = slides[currentIndex];

  return (
    <AnimatePresence>
      {!isMenuVisible && (
        <motion.section
          className="relative h-screen w-full overflow-hidden select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Slides */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              {/* Desktop image (vertical/portrait) - hidden on mobile */}
              <Image
                src={current.desktopImage}
                alt=""
                fill
                priority={currentIndex === 0}
                className="object-cover pointer-events-none hidden md:block"
                sizes="100vw"
                draggable={false}
              />
              {/* Mobile image (horizontal/landscape) - hidden on desktop */}
              <Image
                src={current.mobileImage}
                alt=""
                fill
                priority={currentIndex === 0}
                className="object-cover pointer-events-none block md:hidden"
                sizes="100vw"
                draggable={false}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
            </motion.div>
          </AnimatePresence>

          {/* Slide indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <span className="text-xs uppercase tracking-widest text-white/70">
              Scroll
            </span>
            <motion.div
              className="w-px h-8 bg-white/50"
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
