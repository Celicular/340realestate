import React from "react";
import AboutHero from "../components/about/AboutHero";
import OwnershipSection from "./../components/about/OwnershipSection";
import CondosInfoGrid from "../components/about/CondosInfoGrid";
import StJohnMap from "./../components/about/StJohnMap";
import LandSubdivisions from "./../components/about/LandSubdivisions";
import SEOHead from "../components/SEO/SEOHead";

const About = () => {
  return (
    <div className="App relative scroll-smooth">
      <SEOHead
        title="About St. John Real Estate | 340 Real Estate Guide"
        description="Learn about real estate ownership, condos, and land subdivisions in St. John, USVI. Comprehensive guide to buying property in the U.S. Virgin Islands."
        keywords="St John real estate guide, USVI property ownership, Virgin Islands condos, land subdivisions St John, buying property USVI, real estate laws Virgin Islands"
        canonicalUrl="https://340realestate.com/about"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About St. John Real Estate",
          "description": "Comprehensive guide to real estate in St. John, U.S. Virgin Islands",
          "url": "https://340realestate.com/about",
          "mainEntity": {
            "@type": "RealEstateAgent",
            "name": "340 Real Estate St. John",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "St. John",
              "addressRegion": "VI",
              "addressCountry": "US"
            }
          }
        }}
      />
      
      <AboutHero />
      <OwnershipSection />
      <CondosInfoGrid />
      <StJohnMap />
      <LandSubdivisions />
    </div>
  );
};

export default About;
