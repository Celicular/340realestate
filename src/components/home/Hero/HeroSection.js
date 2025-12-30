import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import hero1 from "../../../assets/homehero/hero1.jpeg";
import hero2 from "../../../assets/homehero/hero2.jpg";
import hero3 from "../../../assets/homehero/hero3.jpg";
import hero4 from "../../../assets/homehero/hero4.jpg";

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isDarkBg, setIsDarkBg] = useState(true); // Track if current bg is dark

  const heroImages = [hero1, hero2, hero3, hero4];
  
  // Define which images have lighter backgrounds (adjust based on your actual images)
  const lightBackgroundImages = []; // Add indices of images with lighter backgrounds, e.g., [1, 3]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => {
        const nextImage = (prev + 1) % heroImages.length;
        // Update background darkness based on current image
        setIsDarkBg(!lightBackgroundImages.includes(nextImage));
        return nextImage;
      });
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Initial background check
  useEffect(() => {
    setIsDarkBg(!lightBackgroundImages.includes(currentImage));
  }, []);

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/", label: "Instagram" },
    { icon: FaXTwitter, href: "https://x.com", label: "Twitter" },
    { icon: FaWhatsapp, href: "https://wa.me/", label: "Whatsapp" },
    { icon: Youtube, href: "https://www.youtube.com", label: "YouTube" },
  ];

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Hero ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              currentImage === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
      </div>

      <div className="hidden md:absolute md:mt-20 md:z-30 md:flex md:flex-col md:right-6 md:top-24 md:gap-4 pointer-events-auto">
        {socialLinks.map((social, idx) => (
          <a
            key={idx}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className={`
              group relative z-10
              p-3
              w-12 h-12
              backdrop-blur-md rounded-full
              hover:scale-110
              transition-all duration-500
              flex items-center justify-center
              border
              pointer-events-auto
              shadow-lg
              ${
                isDarkBg
                  ? "bg-white/15 hover:bg-white/25 border-white/10"
                  : "bg-black/15 hover:bg-black/25 border-black/10"
              }
            `}
          >
            {React.createElement(social.icon, {
              size: 20,
              className: `
                group-hover:scale-110 transition-all duration-500
                w-6 h-6
                pointer-events-none
                ${
                  isDarkBg
                    ? "text-white group-hover:text-cyan-300"
                    : "text-gray-800 group-hover:text-blue-600"
                }
              `,
            })}
          </a>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-30 flex items-center justify-center h-full px-6 text-center text-white">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold mb-6 drop-shadow-2xl">
            Discover Your Paradise
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl mb-10 font-light tracking-wide">
            Luxury Real Estate in St. John, USVI
          </p>

          {/* CTA Button */}
          <Link
            to="/mls"
            className="
              inline-flex items-center px-8 py-4 
              bg-white/10 hover:bg-white/20 text-white font-semibold text-lg 
              rounded-lg shadow-2xl hover:shadow-3xl 
              transform hover:scale-105 transition-all duration-300 
              backdrop-blur-md border border-white/30 hover:border-white/50
            "
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search MLS Properties
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;