import Menu from "../components/Menu/Menu/Menu.jsx";
import HeroSlideshow from "../components/Home/HeroSlideshow/HeroSlideshow.jsx";
import HomeFlowers from "../components/Home/Flowers/HomeFlowers.jsx";
import FeaturedWork from "../components/Home/FeaturedWork/FeaturedWork.jsx";
import {
  fetchDoc,
  fetchGalleryById,
  fetchFeaturedGalleriesWithLayout,
} from "@/app/lib/content";

export const revalidate = 3600;

export default async function Home() {
  const homeData = await fetchDoc("home");
  const featuredGalleries = await fetchFeaturedGalleriesWithLayout();

  // Build hero slides with separate desktop/mobile images
  const heroSlides = homeData.slides || [];
  const slides = [];

  for (const slide of heroSlides) {
    const gallery = slide.galleryId
      ? await fetchGalleryById(slide.galleryId)
      : null;
    slides.push({
      desktopImage:
        slide.desktopImage ||
        gallery?.coverPhoto ||
        gallery?.imageUrls?.[0],
      mobileImage:
        slide.mobileImage ||
        gallery?.coverPhoto ||
        gallery?.imageUrls?.[0],
      galleryId: slide.galleryId,
    });
  }

  const quotes = homeData.quotes || [];

  return (
    <>
      <Menu />
      <HeroSlideshow slides={slides} />
      <HomeFlowers />
      <FeaturedWork galleries={featuredGalleries} quotes={quotes} />
    </>
  );
}
