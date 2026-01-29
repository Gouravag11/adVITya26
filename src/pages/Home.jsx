import { useState, useEffect } from "react";
import PreLoader from "../components/PreLoader";
import HeroSection from "../components/Home/HeroSection";
import AboutSection from "../components/Home/AboutSection";
import GallerySection from "../components/Home/GallerySection";
import SponsoredBy from "../components/Home/SponsoredBy";
import TeaserSection from "../components/Home/TeaserSection";
import EventsSection from "../components/Home/EventsSection";
import LeadershipSection from "../components/Home/LeadershipSection";

function Home() {
  const [showPreLoader, setShowPreLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreLoader(false);
    }, 4000); // 4 seconds duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <PreLoader show={showPreLoader} />
      <section id="hero">
        <HeroSection />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <section id="gallery">
        <GallerySection />
      </section>
      <section id="sponsors">
        <SponsoredBy />
      </section>
      <section id="teaser">
        <TeaserSection />
      </section>
      <section id="events">
        <EventsSection />
      </section>
      <section id="leadership">
        <LeadershipSection />
      </section>

    </div>
  );
}

export default Home;
