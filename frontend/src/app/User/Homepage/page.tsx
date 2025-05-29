import HeroSection from "@/app/User/Homepage/components/HeroSection";
import FeaturedCategories from "@/app/User/Homepage/components/FeaturedCategories";
import BestSellingProducts from "@/app/User/Homepage/components/BestSellingProducts";
import ArtistSpotlight from "@/app/User/Homepage/components/ArtistSpotlight";
import CustomerReviews from "@/app/User/Homepage/components/CustomerReviews";
import CallToAction from "@/app/User/Homepage/components/CallToAction";

export default function HomePage() {
  return (
    <main className="pt-20">
      <HeroSection />
      <FeaturedCategories />
      <BestSellingProducts />
      <ArtistSpotlight />
      <CustomerReviews />
      <CallToAction />
    </main>
  );
}
