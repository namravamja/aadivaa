import HeroSection from "@/components/Homepage/components/HeroSection";
import BestSellingProducts from "@/components/Homepage/components/BestSellingProducts";
import ArtistSpotlight from "@/components/Homepage/components/ArtistSpotlight";
import CustomerReviews from "@/components/Homepage/components/CustomerReviews";
import CallToAction from "@/components/Homepage/components/CallToAction";

export default function HomePage() {
  return (
    <main className="xl:pt-20 lg:pt-16 md:pt-16 pt-14">
      <HeroSection />
      <BestSellingProducts />
      <ArtistSpotlight />
      <CustomerReviews />
      <CallToAction />
    </main>
  );
}
