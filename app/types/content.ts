/**
 * Content types for the CMS
 */

export type DisplaySize = "full" | "half" | "third";

export interface Photo {
  id: string;
  url: string;
  orientation: "horizontal" | "vertical";
  aspectRatio: number;
  order?: number;
  base64?: string;
}

export interface DigitalProject {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage: string;
  coverAspectRatio: number;
  order?: number;
  images: Photo[];
  base64?: string;
  // Password protection
  isProtected?: boolean;
  password?: string;
}

export interface FeaturedImages {
  images: Photo[];
}

export interface Paragraph {
  id: string;
  text: string;
  order: number;
}

export interface AboutContent {
  paragraphs: Paragraph[];
}

export interface ContactInfo {
  email: string;
  location: string;
  instagram?: string;
}

export interface Gallery {
  id: string;
  title: string;
  subTitle?: string;
  date?: string;
  category?: string | string[];
  tags?: string[];
  coverPhoto?: string;
  coverPhotoHorizontal?: string;
  coverPhotoVertical?: string;
  imageUrls: string[];
  imageAspectRatios?: number[];
  featured?: boolean;
  featuredOrder?: number;
  displaySize?: DisplaySize;
  isProtected?: boolean;
  password?: string;
}
