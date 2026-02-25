import React, { useState } from "react";
import { Bed, Bath, Waves, MapPin, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FeaturedPropertySection = () => {
  const navigate = useNavigate();
  const [videoStarted, setVideoStarted] = useState(false);

  const property = {
    id: "AuYFWdMOUXUkjrpqohVo",
    address: "3A-5 Zootenvaal",
    fullAddress: "3A-5 Zootenvaal, St John, VI",
    price: 990000,
    beds: 3,
    baths: 2.5,
    hasPool: true,
    status: "Active",
    description:
      "Living Life Smilin' is a charming cottage overlooking Hurricane Hole with protected water views, steady ocean breezes, privacy, pool, and easy access. This 3BR/2.5BA home sits at the end of a private estate road just 3 minutes from Coral Bay. Set on half an acre with room to expand, it works beautifully as a full-time home or STR investment -- Turnkey and fully furnished for immediate enjoyment. Updates include new flooring, a 2022 kitchen renovation with modern appliances and granite counters, AC in bedrooms, updated wastewater system, storage shed, and ample parking. Multiple outdoor spaces offer covered dining, a shaded hammock deck, sunny sitting area, and poolside perch.",
    videoUrl: "https://www.youtube.com/embed/KHE24styqyk",
  };

  const handleViewProperty = () => {
    navigate(`/property/${property.id}`);
  };

  return (
    <section id="featured-property" className="py-16 lg:py-24 bg-gradient-to-b from-white via-brand-light/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#3c6a72] mb-4">
            Featured Property
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-tropical-500 to-tropical-400 mx-auto"></div>
        </div>

        {/* Featured Property Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Video Section */}
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative w-full bg-black">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={property.videoUrl}
                    title="Featured Property Video Tour"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="order-1 lg:order-2">
            {/* Address & Status */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-tropical-600 uppercase tracking-wide mb-1">
                    {property.status}
                  </h3>
                  <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[#3c6a72] leading-tight">
                    {property.address}
                  </h2>
                  <p className="text-gray-600 mt-2 flex items-center gap-2">
                    <MapPin size={18} className="text-tropical-500" />
                    {property.fullAddress}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="my-6 p-4 bg-gradient-to-r from-tropical-50 to-tropical-100 rounded-lg border border-tropical-200">
                <p className="text-sm font-semibold text-gray-600 mb-1">PRICE</p>
                <p className="text-3xl lg:text-4xl font-bold text-tropical-700 flex items-center gap-2">
                  <DollarSign size={32} />
                  {property.price.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Property Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* Beds */}
              <div className="bg-white p-4 rounded-xl shadow-md text-center border-t-4 border-tropical-500">
                <div className="flex justify-center mb-2">
                  <Bed size={24} className="text-tropical-600" />
                </div>
                <p className="text-2xl font-bold text-[#3c6a72]">
                  {property.beds}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  {property.beds === 1 ? "Bed" : "Beds"}
                </p>
              </div>

              {/* Baths */}
              <div className="bg-white p-4 rounded-xl shadow-md text-center border-t-4 border-tropical-500">
                <div className="flex justify-center mb-2">
                  <Bath size={24} className="text-tropical-600" />
                </div>
                <p className="text-2xl font-bold text-[#3c6a72]">
                  {property.baths}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  {property.baths === 1 ? "Bath" : "Baths"}
                </p>
              </div>

              {/* Pool */}
              <div className="bg-white p-4 rounded-xl shadow-md text-center border-t-4 border-tropical-500">
                <div className="flex justify-center mb-2">
                  <Waves size={24} className="text-tropical-600" />
                </div>
                <p className="text-lg font-bold text-[#3c6a72]">
                  {property.hasPool ? "Yes" : "No"}
                </p>
                <p className="text-sm text-gray-600 font-medium">Pool</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-[#3c6a72] mb-3">
                Description
              </h4>
              <p className="text-gray-700 leading-relaxed line-clamp-4">
                {property.description}
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleViewProperty}
              className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-[#3c6a72] to-tropical-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              View Full Property Details
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            ✨ Discover more extraordinary properties in St. John paradise ✨
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPropertySection;
