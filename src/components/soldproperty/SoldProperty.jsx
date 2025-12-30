import React, { useState, useCallback, memo, useEffect } from "react";
import { FaMapMarkerAlt, FaRulerCombined, FaTree, FaWater } from "react-icons/fa";
import { BsHouseDoorFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getAllPortfolioItems } from "../../firebase/firestore";

const SoldPropertyCard = memo(({
  id,
  title,
  location,
  price,
  status,
  images,
  description,
  highlights,
  features,
  additionalInfo,
}) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // Helper function to get location display
  const getLocationDisplay = (loc) => {
    if (typeof loc === 'string') return loc;
    if (loc && loc.address) return loc.address;
    return 'St. John, USVI';
  };

  const nextSlide = useCallback(() => setCurrent((prev) => (prev + 1) % (images?.length || 1)), [images?.length]);
  const prevSlide = useCallback(() =>
    setCurrent((prev) => (prev - 1 + (images?.length || 1)) % (images?.length || 1)), [images?.length]);

  const handleCardClick = useCallback(() => {
    navigate(`/soldproperty/${id}`);
  }, [navigate, id]);

  const handleCarouselClick = useCallback((e) => {
    e.stopPropagation(); // Prevent card click when clicking carousel buttons
  }, []);

  return (
         <div
       className="bg-white rounded-3xl mt-10 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer group"
       onClick={handleCardClick}
     >
      {/* 🖼 Image Carousel */}
      <div className="relative w-full h-72 overflow-hidden">
        {images && images.length > 0 ? (
          images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${title} Image ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No images available</span>
          </div>
        )}
                 {images && images.length > 1 && (
           <>
             <button
               onClick={(e) => {
                 handleCarouselClick(e);
                 prevSlide();
               }}
               className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 px-2 rounded-full text-lg z-10"
             >
               ‹
             </button>
             <button
               onClick={(e) => {
                 handleCarouselClick(e);
                 nextSlide();
               }}
               className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 px-2 rounded-full text-lg z-10"
             >
               ›
             </button>
           </>
         )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
            {status}
          </span>
        </div>
      </div>

      {/* 📄 Sold Property Info */}
      <div className="p-6 md:p-8 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <FaMapMarkerAlt className="w-4 h-4" />
            <p className="text-sm">{getLocationDisplay(location)}</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-2xl text-emerald-600 font-bold">{price}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{description}</p>

        {/* Property Features */}
        <div className="flex flex-wrap gap-4 mt-2 text-gray-700 text-sm">
          {features?.beds > 0 && (
            <span className="flex items-center gap-2">
              <BsHouseDoorFill /> {features.beds} Beds
            </span>
          )}
          {features?.baths > 0 && (
            <span className="flex items-center gap-2">
              <FaWater /> {features.baths} Baths
            </span>
          )}
          {features?.sqft > 0 && (
            <span className="flex items-center gap-2">
              <FaRulerCombined /> {features.sqft} Sqft
            </span>
          )}
          {highlights?.acreage > 0 && (
            <span className="flex items-center gap-2">
              <FaRulerCombined /> {highlights.acreage} Acres
            </span>
          )}
          {highlights?.oceanView && (
            <span className="flex items-center gap-2">
              <FaWater /> Ocean View
            </span>
          )}
          {highlights?.waterfront && (
            <span className="flex items-center gap-2">
              <FaWater /> Waterfront
            </span>
          )}
        </div>
       </div>
    </div>
  );
});

const SoldProperty = () => {
  const [soldProperties, setSoldProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSoldProperties = async () => {
      try {
        setLoading(true);
        const result = await getAllPortfolioItems({ status: 'recent-sale' });
        
        if (result.success) {
          setSoldProperties(result.data);
        } else {
          setError(result.error || 'Failed to fetch sold properties');
        }
      } catch (err) {
        setError('Error fetching sold properties: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSoldProperties();
  }, []);

  if (loading) {
    return (
      <div className="pb-20 px-4 lg:px-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sold properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-20 px-4 lg:px-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center py-20">
          <p className="text-red-600 mb-4">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="py-20 px-4 lg:px-24 bg-gradient-to-br from-gray-50 to-white">
        {/* 🏠 Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Recently Sold Properties
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Explore our recently sold properties in St. John. View transaction history, 
            property details, and market insights from completed sales.
          </p>
        </div>

        {/* 🧱 Grid */}
        <div className="w-full py-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {soldProperties.map((property, index) => (
              <SoldPropertyCard key={property.id || index} {...property} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SoldProperty;
