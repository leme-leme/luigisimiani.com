/**
 * Content loading utilities - static imports for Cloudflare Workers compatibility
 * JSON is resolved at build time by Next.js bundler (no runtime fs needed)
 */

import { cache } from "react";
import type { Gallery, DisplaySize } from "@/app/types/content";

// --- Static imports: bundled at build time ---
import bioData from "@/content/bio.json";
import contactData from "@/content/contact.json";
import featuredData from "@/content/featured.json";
import filmStripData from "@/content/film-strip.json";
import quotesData from "@/content/quotes.json";
import settingsData from "@/content/settings.json";

// Gallery imports
import alphaXJunyaWatanabe from "@/content/gallery/alpha-x-junya-watanabe.json";
import diesel2024 from "@/content/gallery/diesel-2024.json";
import dreamUnit from "@/content/gallery/dream-unit.json";
import freeYourself from "@/content/gallery/free-yourself.json";
import galleryMisc from "@/content/gallery/gallery.json";
import laCassetteRunway from "@/content/gallery/la-cassette-runway.json";
import nachbarPromotion from "@/content/gallery/nachbar-promotion.json";
import orderTattooJam from "@/content/gallery/order-tattoo-jam.json";
import pattaXKeepHush from "@/content/gallery/patta-x-keep-hush-noiz-boiz.json";
import procidaWedding from "@/content/gallery/procida-wedding.json";
import productPhotography from "@/content/gallery/product-photography.json";
import sexyland from "@/content/gallery/sexyland.json";
import tgib from "@/content/gallery/tgib.json";
import vogue2024 from "@/content/gallery/vogue-2024.json";
import wingstopXSmib from "@/content/gallery/wingstop-x-smib.json";

type ContentDoc = Record<string, unknown>;

// --- Gallery registry (keyed by filename without .json) ---
const GALLERY_MAP: Record<string, Gallery> = {
  "alpha-x-junya-watanabe": alphaXJunyaWatanabe as unknown as Gallery,
  "diesel-2024": diesel2024 as unknown as Gallery,
  "dream-unit": dreamUnit as unknown as Gallery,
  "free-yourself": freeYourself as unknown as Gallery,
  "gallery": galleryMisc as unknown as Gallery,
  "la-cassette-runway": laCassetteRunway as unknown as Gallery,
  "nachbar-promotion": nachbarPromotion as unknown as Gallery,
  "order-tattoo-jam": orderTattooJam as unknown as Gallery,
  "patta-x-keep-hush-noiz-boiz": pattaXKeepHush as unknown as Gallery,
  "procida-wedding": procidaWedding as unknown as Gallery,
  "product-photography": productPhotography as unknown as Gallery,
  "sexyland": sexyland as unknown as Gallery,
  "tgib": tgib as unknown as Gallery,
  "vogue-2024": vogue2024 as unknown as Gallery,
  "wingstop-x-smib": wingstopXSmib as unknown as Gallery,
};

// --- Single-file content registry ---
const CONTENT_MAP: Record<string, ContentDoc> = {
  bio: bioData as unknown as ContentDoc,
  contact: contactData as unknown as ContentDoc,
  featured: featuredData as unknown as ContentDoc,
  "film-strip": filmStripData as unknown as ContentDoc,
  quotes: quotesData as unknown as ContentDoc,
  settings: settingsData as unknown as ContentDoc,
};

/**
 * Fetch documents from a collection path
 * Compatible with Firebase fetchDocs() interface
 */
export const fetchDocs = cache(async (ref: string): Promise<ContentDoc[]> => {
  try {
    if (!ref || typeof ref !== "string") {
      console.error("Invalid ref provided to fetchDocs:", ref);
      return [];
    }

    // Check single-file content first
    const singleFile = CONTENT_MAP[ref] as ContentDoc | ContentDoc[] | undefined;
    if (singleFile) {
      if (Array.isArray(singleFile)) return singleFile;
      if ((singleFile as any).items) return (singleFile as any).items as ContentDoc[];
      if ((singleFile as any).images) return (singleFile as any).images as ContentDoc[];
      if ((singleFile as any).paragraphs) return (singleFile as any).paragraphs as ContentDoc[];
      return [singleFile];
    }

    // Check if it's a gallery directory request
    if (ref === "gallery") {
      return Object.entries(GALLERY_MAP).map(([id, g]) => ({ ...g, id } as unknown as ContentDoc))
        .sort((a, b) => {
          const dateA = (a as any).date ? new Date((a as any).date).getTime() : 0;
          const dateB = (b as any).date ? new Date((b as any).date).getTime() : 0;
          return dateB - dateA;
        });
    }

    // Check gallery sub-path (e.g. "gallery/vogue-2024")
    if (ref.startsWith("gallery/")) {
      const id = ref.replace("gallery/", "");
      const g = GALLERY_MAP[id];
      if (g) return [{ ...g, id } as unknown as ContentDoc];
    }

    return [];
  } catch (error) {
    console.error("Error fetching docs from", ref, ":", error);
    return [];
  }
});

/**
 * Fetch a single document
 * Compatible with Firebase fetchDoc() interface
 */
export const fetchDoc = cache(async (ref: string): Promise<ContentDoc> => {
  try {
    if (!ref || typeof ref !== "string") {
      console.error("Invalid ref provided to fetchDoc:", ref);
      return {};
    }

    // Check content map
    if (CONTENT_MAP[ref]) return CONTENT_MAP[ref];

    // Check gallery
    if (ref.startsWith("gallery/")) {
      const id = ref.replace("gallery/", "");
      if (GALLERY_MAP[id]) return GALLERY_MAP[id] as unknown as ContentDoc;
    }

    return {};
  } catch (error) {
    console.error("Error fetching doc from", ref, ":", error);
    return {};
  }
});

/**
 * Fetch URLs from a collection
 */
export const fetchUrls = cache(async (ref: string): Promise<string[]> => {
  try {
    const docs = await fetchDocs(ref);
    return docs.map((doc) => doc.url).filter((url): url is string => Boolean(url));
  } catch (error) {
    console.error("Error fetching URLs from", ref, ":", error);
    return [];
  }
});

/**
 * Normalize tags
 */
function normalizeTags(tags?: string[]): string[] {
  if (!tags) return [];
  const normalized: string[] = [];
  for (const tag of tags) {
    const parts = tag.split(",").map((t) => t.trim().toLowerCase());
    normalized.push(...parts.filter(Boolean));
  }
  return normalized;
}

export function hasTag(gallery: Gallery, tag: string): boolean {
  return normalizeTags(gallery.tags).includes(tag.toLowerCase());
}

export function isHidden(gallery: Gallery): boolean {
  return hasTag(gallery, "hidden");
}

export function isDownloadable(gallery: Gallery): boolean {
  return hasTag(gallery, "downloadable");
}

export function isPasswordProtected(gallery: Gallery): boolean {
  return Boolean(gallery.password && gallery.password.trim() !== "");
}

/**
 * Fetch galleries, optionally filtered by category
 */
export const fetchGalleries = cache(
  async (category?: string, includeHidden = false): Promise<Gallery[]> => {
    try {
      let galleries = Object.entries(GALLERY_MAP).map(([id, g]) => ({ ...g, id }));

      // Filter hidden
      if (!includeHidden) {
        galleries = galleries.filter((g) => !isHidden(g));
      }

      // Filter by category/tag
      if (category) {
        galleries = galleries.filter((g) => {
          if (g.tags?.includes(category)) return true;
          if (Array.isArray(g.category)) return g.category.includes(category);
          return g.category === category;
        });
      }

      // Sort by date (newest first)
      return galleries.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error("Error fetching galleries:", error);
      return [];
    }
  }
);

/**
 * Fetch a single gallery by ID
 */
export const fetchGalleryById = cache(
  async (id: string): Promise<Gallery | null> => {
    return GALLERY_MAP[id] ? { ...GALLERY_MAP[id], id } : null;
  }
);

/**
 * Fetch featured galleries
 */
export const fetchFeaturedGalleries = cache(async (): Promise<Gallery[]> => {
  try {
    const allGalleries = await fetchGalleries();
    return allGalleries.filter(
      (g) => g.featured === true || g.tags?.includes("featured")
    );
  } catch (error) {
    console.error("Error fetching featured galleries:", error);
    return [];
  }
});

/**
 * Tag-to-layout mapping
 */
const TAG_TO_SIZE: Record<string, DisplaySize> = {
  hero: "full",
  featured: "full",
  highlight: "full",
  editorial: "half",
  pair: "half",
  duo: "half",
  portrait: "third",
  small: "third",
  grid: "third",
};

/**
 * Compute display size for a gallery
 */
export function computeDisplaySize(gallery: Gallery): DisplaySize {
  const tags: string[] = [];
  if (gallery.tags) tags.push(...gallery.tags);
  if (gallery.category) {
    if (Array.isArray(gallery.category)) tags.push(...gallery.category);
    else tags.push(gallery.category);
  }

  for (const tag of tags) {
    const normalizedTag = tag.toLowerCase();
    if (TAG_TO_SIZE[normalizedTag]) return TAG_TO_SIZE[normalizedTag];
  }

  const aspectRatio = gallery.imageAspectRatios?.[0] ?? 1.5;
  if (aspectRatio >= 2.0) return "full";
  if (aspectRatio < 0.8) return "third";
  return "half";
}

/**
 * Fetch featured galleries with computed display sizes
 */
export const fetchFeaturedGalleriesWithLayout = cache(
  async (): Promise<Gallery[]> => {
    try {
      const allGalleries = await fetchGalleries();
      const featured = allGalleries.filter(
        (g) => g.featured === true || g.tags?.includes("featured")
      );

      const sorted = featured.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });

      return sorted.map((gallery) => ({
        ...gallery,
        displaySize: computeDisplaySize(gallery),
      }));
    } catch (error) {
      console.error("Error fetching featured galleries with layout:", error);
      return [];
    }
  }
);

/**
 * Verify gallery password
 */
export async function verifyGalleryPassword(
  slug: string,
  password: string
): Promise<boolean> {
  const gallery = await fetchGalleryById(slug);
  if (!gallery) return false;
  if (!isPasswordProtected(gallery)) return true;
  return gallery.password === password;
}

/**
 * Generate blur placeholder
 */
export function generateBlurPlaceholder(width = 10, height = 10): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <filter id="b" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="1" />
      </filter>
      <rect width="100%" height="100%" fill="#1a1a1a" filter="url(#b)" />
    </svg>
  `;
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}
