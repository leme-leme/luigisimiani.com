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
  const featured = await fetchDoc("featured");
  const quotesData = await fetchDoc("quotes");
  const featuredGalleries = await fetchFeaturedGalleriesWithLayout();

  // Get hero images from gallery references
  const galleryIds = featured.galleries || [];
  const heroImages = [];

  for (const id of galleryIds) {
    const gallery = await fetchGalleryById(id);
    if (gallery) {
      heroImages.push({
        url: gallery.coverPhotoVertical || gallery.coverPhoto || gallery.imageUrls?.[0],
        galleryId: gallery.id,
      });
    }
  }

  // Get quotes
  const quotes = quotesData.quotes || [];

  return (
    <>
      <Menu />
      <HeroSlideshow images={heroImages} />
      <HomeFlowers />
      <FeaturedWork galleries={featuredGalleries} quotes={quotes} />
    </>
  );
}
