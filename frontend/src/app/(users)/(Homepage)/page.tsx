import HeroSection from "@/app/(users)/(Homepage)/components/HeroSection";
import BestSellingProducts from "@/app/(users)/(Homepage)/components/BestSellingProducts";
import ArtistSpotlight from "@/app/(users)/(Homepage)/components/ArtistSpotlight";
import CustomerReviews from "@/app/(users)/(Homepage)/components/CustomerReviews";
import CallToAction from "@/app/(users)/(Homepage)/components/CallToAction";

export default function HomePage() {
  return (
    <main className="pt-20">
      <HeroSection />
      <BestSellingProducts />
      <ArtistSpotlight />
      <CustomerReviews />
      <CallToAction />
    </main>
  );
}
