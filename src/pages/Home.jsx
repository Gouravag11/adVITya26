import HeroSection from "../components/Home/HeroSection";
import AboutSection from "../components/Home/AboutSection";
import GallerySection from "../components/Home/GallerySection";
import SponsoredBy from "../components/Home/SponsoredBy";
import TeaserSection from "../components/Home/TeaserSection";
import EventsSection from "../components/Home/EventsSection";
import LeadershipSection from "../components/Home/LeadershipSection";

function Home() {
  return (
    <div className="min-h-screen w-full bg-white">
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <SponsoredBy />
      <TeaserSection />
      <EventsSection />
      <LeadershipSection />
    </div>
  );
}

export default Home;
