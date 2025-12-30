import React from "react";
import SEOHead from "../components/SEO/SEOHead";
import { generateOrganizationJsonLd, generateWebsiteJsonLd } from "../utils/seoUtils";

// Sections & Layouts
import HeroSection from "../components/home/Hero/HeroSection";
import AboutSection from "../components/home/Sections/AboutSection";
import TeamSection from "../components/home/Sections/TeamSection";
import ContactSection from "../components/home/Sections/ContactSection";
import AgentsSection from "../components/home/Sections/AgentsSection";
import RentalsSection from "../components/home/Sections/RentalsSection";
import GallerySection from "../components/home/Sections/GallerySection";
import HeroLogos from "../components/home/Sections/HeroLogos";
import AnniversarySection from "../components/home/Sections/AnniverserySection";

function Home() {
  return (
    <>
      <SEOHead
        title="Luxury Real Estate & Vacation Rentals in St. John, USVI"
        description="Discover premium real estate and luxury vacation rentals in St. John, U.S. Virgin Islands. Expert real estate services, beautiful villas, and tropical paradise properties. Your gateway to Caribbean island living."
        keywords="St John real estate, USVI property, Virgin Islands vacation rentals, luxury villas St John, Caribbean real estate, tropical properties, island homes, vacation homes USVI, St John property sales, real estate agent Virgin Islands"
        image={typeof window !== 'undefined' ? `${window.location.origin}/images/hero1.jpeg` : ''}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
        jsonLd={[generateOrganizationJsonLd(), generateWebsiteJsonLd()]}
      />
      
      <div className="App relative scroll-smooth">
      <HeroSection />
      
      <AboutSection />
      <TeamSection />
      <ContactSection />
      <AgentsSection />
      <HeroLogos />
      <RentalsSection />
      <AnniversarySection />
      <GallerySection />
    </div>
    </>
  );
}

export default Home;
