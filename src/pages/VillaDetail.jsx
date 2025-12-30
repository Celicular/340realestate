import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  selectVilla,
  fetchVillas
} from "../redux/slices/villaSlice";

import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

import { getRentalProperties } from "../firebase/firestore";

// Import hero images for slideshow
import hero1 from "../assets/homehero/hero1.jpeg";
import hero2 from "../assets/homehero/hero2.jpg";
import hero3 from "../assets/homehero/hero3.jpg";
import hero4 from "../assets/homehero/hero4.jpg";
import blueVilla1 from "../assets/villa/blue/blue1.jpg";
import blueVilla2 from "../assets/villa/blue/blue2.jpg";

// Hero images array for slideshow
const heroImages = [
  hero1,
  hero2,
  hero3,
  hero4,
  blueVilla1,
  blueVilla2
];

const VillaDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const villa = useSelector((state) => state.villa.selectedVilla);
  const { villas, loading: villasLoading, error: villasError } = useSelector((state) => state.villa);
  const [isLoading, setIsLoading] = useState(true);
  const [rentalProperties, setRentalProperties] = useState([]);
  const [rentalsLoading, setRentalsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Manual slide navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  useEffect(() => {
    // Fetch villas if not already loaded
    if (villas.length === 0 && !villasLoading && !villasError) {
      dispatch(fetchVillas());
    }
  }, [dispatch, villas.length, villasLoading, villasError]);

  useEffect(() => {
    // Format slug back to proper name
    const formattedName = slug
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

    // Only dispatch if we have villas loaded and don't already have the correct villa selected
    if (villas.length > 0 && (!villa || villa.propertyInfo?.name !== formattedName)) {
      setIsLoading(true);
      dispatch(selectVilla(formattedName));
    } else if (villa && villa.propertyInfo?.name === formattedName) {
      setIsLoading(false);
    }
  }, [slug, dispatch, villa, villas.length]);

  // Set loading to false when villa is loaded
  useEffect(() => {
    if (villa || villasError) {
      setIsLoading(false);
    }
  }, [villa, villasError]);

  // Fetch rental properties
  useEffect(() => {
    const fetchRentalProperties = async () => {
      try {
        setRentalsLoading(true);
        console.log("🔍 Fetching rental properties...");
        const result = await getRentalProperties({ status: "approved" });
        console.log("📋 Rental properties result:", result);
        if (result.success) {
          setRentalProperties(result.data);
          console.log(`✅ Loaded ${result.data.length} approved rental properties`);
        } else {
          console.error("❌ Failed to fetch rental properties:", result.error);
        }
      } catch (error) {
        console.error("❌ Error fetching rental properties:", error);
      } finally {
        setRentalsLoading(false);
      }
    };

    fetchRentalProperties();
  }, []);

  if (villasLoading || isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="text-lg">Loading villas...</div></div>;
  if (villasError) return <div className="min-h-screen flex items-center justify-center"><div className="text-lg text-red-500">Error loading villas: {villasError}</div></div>;
  if (!villa) return <div className="min-h-screen flex items-center justify-center"><div className="text-lg">Villa not found</div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Slideshow */}
      <div className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
        {/* Image Slideshow */}
        {heroImages.map((img, idx) => (
          <motion.img
            key={idx}
            src={img}
            alt={`Villa Rental ${idx + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSlide === idx ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ))}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-bold mb-6 tracking-wide">
            Available Rental Villas
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full mb-6"></div>
          <p className="text-white text-lg md:text-xl lg:text-2xl max-w-3xl font-light leading-relaxed">
            Discover luxury vacation rentals in the paradise of St. John, US Virgin Islands. 
            Your perfect getaway awaits.
          </p>
        </motion.div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === idx 
                  ? 'bg-white scale-110' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Rental Properties Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Featured Properties
          </h2>
          <p className="text-gray-600">
            Browse our handpicked selection of luxury vacation rentals
          </p>
        </div>

        {rentalsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-gray-200 rounded-xl shadow-sm animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-xl"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : rentalProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentalProperties.map((rental) => {
              // Get the first valid image from media.imageLinks
              const firstImage = rental.media?.imageLinks?.find(img => img && typeof img === 'string' && img.trim() !== '');
              
              return (
                <Link
                  key={rental.id}
                  to={`/rental/${rental.propertyInfo?.slug || rental.id}`}
                  className="block bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:shadow-lg"
                >
                  {/* Property Image */}

                  {firstImage ? (
                    <div className="relative h-48 overflow-hidden rounded-t-xl">
                      <img
                        src={firstImage}
                        alt={rental.propertyInfo?.name || "Rental Property"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative h-48 overflow-hidden rounded-t-xl bg-gradient-to-br from-gray-200 to-gray-300">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl opacity-40">🏠</div>
                      </div>
                    </div>
                  )}

                {/* Property Content */}

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {rental.propertyInfo?.name || "Unnamed Property"}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
                    <MapPin size={16} />

                    {rental.location?.address || "Address not available"}
                  </p>

                  <p className="text-blue-700 font-medium mb-3">
                    {rental.propertyInfo?.type || "Property Type"}
                  </p>

                  {/* Accommodation Details */}

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Guests</p>

                      <p className="font-semibold text-gray-800">
                        {rental.accommodation?.maxGuests || rental.details?.maxOccupancy || "N/A"}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">Bedrooms</p>

                      <p className="font-semibold text-gray-800">
                        {rental.accommodation?.bedrooms || rental.details?.bedrooms || "N/A"}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">Bathrooms</p>

                      <p className="font-semibold text-gray-800">
                        {rental.accommodation?.bathrooms || rental.details?.bathrooms || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Price */}

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">
                      Price per Week
                    </span>

                    <span className="text-lg font-bold text-blue-600">
                      ${rental.propertyInfo?.pricePerNight || rental.pricing?.nightly || rental.pricing?.weekly || "N/A"}
                    </span>
                  </div>

                  {/* Description */}

                  {rental.propertyInfo?.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {rental.propertyInfo.description}
                    </p>
                  )}

                  {/* Amenities */}

                  {rental.amenities && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Key Amenities
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          // Convert amenities object to array
                          const amenitiesList = [];
                          if (typeof rental.amenities === 'object') {
                            Object.entries(rental.amenities).forEach(([key, value]) => {
                              if (value === true) {
                                const readableKey = key
                                  .replace(/([A-Z])/g, ' $1')
                                  .replace(/^./, str => str.toUpperCase())
                                  .trim();
                                amenitiesList.push(readableKey);
                              }
                            });
                          }

                          return amenitiesList.slice(0, 4).map((amenity, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {amenity}
                            </span>
                          )).concat(
                            amenitiesList.length > 4 ? [
                              <span key="more" className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                +{amenitiesList.length - 4} more
                              </span>
                            ] : []
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Agent Info */}

                 
                </div>
              </Link>
            );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Rental Properties Available
            </h3>
            <p className="text-gray-500">
              Check back soon for new luxury vacation rental listings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VillaDetails;
