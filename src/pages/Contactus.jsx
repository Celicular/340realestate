import React from "react";
import ContactHero from "./../components/contact/ContactHero";
import ContactDetail from "./../components/contact/ContactDetail";
import SEOHead from "../components/SEO/SEOHead";

const Contactus = () => {
  return (
    <div className="App relative scroll-smooth">
      <SEOHead
        title="Contact Us | 340 Real Estate St. John"
        description="Contact 340 Real Estate for all your St. John, USVI property needs. Expert real estate agents ready to help you buy, sell, or rent in paradise."
        keywords="contact real estate agent St John, USVI property agent, Virgin Islands realtor, St John real estate contact, property inquiry USVI"
        canonicalUrl="https://340realestate.com/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact 340 Real Estate St. John",
          "description": "Get in touch with our expert real estate team in St. John, USVI",
          "url": "https://340realestate.com/contact",
          "mainEntity": {
            "@type": "RealEstateAgent",
            "name": "340 Real Estate St. John",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "St. John",
              "addressRegion": "VI",
              "addressCountry": "US"
            },
            "telephone": "+1-340-XXX-XXXX",
            "email": "info@340realestate.com"
          }
        }}
      />
      
      <ContactHero />
      <ContactDetail />
    </div>
  );
};

export default Contactus;
