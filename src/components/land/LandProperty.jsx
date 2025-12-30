import React, { useState, useEffect, memo, useMemo } from "react";
import {
  FaMapMarkerAlt,
  FaRulerCombined,
  FaTree,
  FaWater,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { BsHouseDoorFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getPortfolioItems } from "../../firebase/firestore";

const LandPropertyCard = ({
  id,
  title,
  location,
  price,
  status,
  images,
  description,
  overview,
  details,
  mls,
}) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  const handleCardClick = () => {
    navigate(`/landproperty/${id}`);
  };

  // Format price
  const formatPrice = (price) => {
    if (typeof price === "number") {
      return `$${price.toLocaleString()}`;
    }
    return price;
  };

  // Get location display
  const getLocationDisplay = (location) => {
    if (typeof location === "string") {
      return location;
    }
    if (location && location.address) {
      return location.address;
    }
    return "Location not specified";
  };

  return (
    <div
      className="bg-white rounded-3xl mt-10 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
      onClick={handleCardClick}
    >
      {/* 🖼 Image Carousel */}
      <div className="relative w-full h-72 overflow-hidden">
        {images &&
          images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${title} Image ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        {images && images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 px-2 rounded-full text-lg z-10"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 px-2 rounded-full text-lg z-10"
            >
              ›
            </button>
          </>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
            {status}
          </span>
        </div>
      </div>

      {/* 📄 Land Property Info */}
      <div className="p-6 md:p-8 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <FaMapMarkerAlt className="w-4 h-4" />
            <p className="text-sm">{getLocationDisplay(location)}</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-2xl text-emerald-600 font-bold">
              {formatPrice(price)}
            </p>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Land Features */}
        <div className="flex flex-wrap gap-4 mt-2 text-gray-700 text-sm">
          {overview && overview.lotSizeAcres > 0 && (
            <span className="flex items-center gap-2">
              <FaRulerCombined /> {overview.lotSizeAcres} Acres
            </span>
          )}
          {overview && overview.grade && (
            <span className="flex items-center gap-2">
              <FaTree /> {overview.grade} Grade
            </span>
          )}
          {details && details.zoning && (
            <span className="flex items-center gap-2">
              <BsHouseDoorFill /> {details.zoning}
            </span>
          )}
          {details && details.waterfront === "Y" && (
            <span className="flex items-center gap-2">
              <FaWater /> Waterfront
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Filter Modal Component (without bedrooms)
const LandFilterModal = memo(
  ({
    isOpen,
    onClose,
    filters,
    onFilterChange,
    priceRange,
    onApplyFilters,
  }) => {
    if (!isOpen) return null;

    const { min: minGlobal, max: maxGlobal } = priceRange;

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-50 to-blue-50 px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaFilter className="text-emerald-600" /> Filters
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-4">
                  Price Range
                </label>

                {/* Min Price Slider */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Minimum</span>
                    <span className="text-sm font-semibold text-emerald-600">
                      ${filters.minPrice?.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={minGlobal}
                    max={maxGlobal}
                    step={50000}
                    value={filters.minPrice}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        minPrice: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                {/* Max Price Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Maximum</span>
                    <span className="text-sm font-semibold text-emerald-600">
                      ${filters.maxPrice?.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={minGlobal}
                    max={maxGlobal}
                    step={50000}
                    value={filters.maxPrice}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        maxPrice: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>
              </div>

              {/* Sort Option */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-4">
                  Sort By
                </label>
                <select
                  value={filters.sortBy || "newest"}
                  onChange={(e) =>
                    onFilterChange({ ...filters, sortBy: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 focus:outline-none focus:border-emerald-600 transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="titleAZ">Title: A to Z</option>
                  <option value="titleZA">Title: Z to A</option>
                </select>
              </div>

              {/* Buttons Container */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                {/* Apply Button */}
                <button
                  onClick={() => {
                    onApplyFilters(filters);
                    onClose();
                  }}
                  className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  Apply Filters
                </button>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    onFilterChange({
                      minPrice: minGlobal,
                      maxPrice: maxGlobal,
                      sortBy: "newest",
                    });
                  }}
                  className="w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

const LandProperty = ({ filteredProperties }) => {
  const [landProperties, setLandProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [globalPriceRange, setGlobalPriceRange] = useState({
    min: 0,
    max: 10000000,
  });
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000000,
    sortBy: "newest",
  });
  const [tempFilters, setTempFilters] = useState({
    minPrice: 0,
    maxPrice: 10000000,
    sortBy: "newest",
  });

  // Fetch land properties from Firestore
  useEffect(() => {
    const fetchLandProperties = async () => {
      try {
        setLoading(true);
        const result = await getPortfolioItems("land");
        if (result.success && result.data) {
          const processed = result.data.map((item) => {
            // Extract price - handle both numbers and strings
            let priceValue = null;
            if (typeof item.price === "number") {
              priceValue = item.price;
            } else if (
              typeof item.price === "string" &&
              item.price !== "Price on request"
            ) {
              const cleaned = item.price.replace(/[$,]/g, "").trim();
              const parsed = parseInt(cleaned);
              if (!isNaN(parsed)) {
                priceValue = parsed;
              }
            }

            return {
              ...item,
              priceValue,
            };
          });

          setLandProperties(processed);

          // Calculate GLOBAL price range
          const pricesWithValues = processed
            .filter((p) => p.priceValue !== null)
            .map((p) => p.priceValue);

          if (pricesWithValues.length > 0) {
            const minPrice = Math.min(...pricesWithValues);
            const maxPrice = Math.max(...pricesWithValues);

            setGlobalPriceRange({ min: minPrice, max: maxPrice });

            const initialFilters = {
              minPrice: minPrice,
              maxPrice: maxPrice,
              sortBy: "newest",
            };
            setFilters(initialFilters);
            setTempFilters(initialFilters);
          }
        } else {
          setError(result.error || "Failed to fetch land properties");
        }
      } catch (err) {
        setError("Error fetching land properties: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if no filtered properties are provided
    if (!filteredProperties) {
      fetchLandProperties();
    } else {
      setLoading(false);
    }
  }, [filteredProperties]);

  // Apply filters and sorting
  const filteredAndSorted = useMemo(() => {
    let result = landProperties.filter((p) => {
      const priceValue = p.priceValue;

      // If no price, exclude it
      if (priceValue === null) {
        return false;
      }

      // Check price is in range
      return priceValue >= filters.minPrice && priceValue <= filters.maxPrice;
    });

    // Apply sorting
    switch (filters.sortBy) {
      case "priceLow":
        result.sort((a, b) => {
          const aPrice = a.priceValue ?? Infinity;
          const bPrice = b.priceValue ?? Infinity;
          return aPrice - bPrice;
        });
        break;
      case "priceHigh":
        result.sort((a, b) => {
          const aPrice = a.priceValue ?? -Infinity;
          const bPrice = b.priceValue ?? -Infinity;
          return bPrice - aPrice;
        });
        break;
      case "titleAZ":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "titleZA":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
      default:
        break;
    }

    return result;
  }, [landProperties, filters, globalPriceRange]);

  // Use filtered properties if provided, otherwise use fetched land properties
  const propertiesToShow = filteredProperties || filteredAndSorted;

  // Loading state
  if (loading && !filteredProperties) {
    return (
      <div className="pb-20 px-4 lg:px-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading land properties...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !filteredProperties) {
    return (
      <div className="pb-20 px-4 lg:px-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center py-16">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error loading land properties: {error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="pb-20 px-4 lg:px-24 bg-gradient-to-br from-gray-50 to-white">
        {/* 🏠 Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Available Land
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Browse our selection of premium land properties across St. John's
            most desirable locations.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 bg-white px-4 sm:px-6 py-4 rounded-xl shadow-md">
            {/* Filter Button */}
            <button
              onClick={() => {
                setTempFilters(filters);
                setShowFilters(true);
              }}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
            >
              <FaFilter /> Filters
            </button>

            {/* Showing Results Text */}
            <div className="text-center flex-grow sm:flex-grow-0">
              <p className="text-gray-700 font-semibold">
                Showing{" "}
                <span className="text-emerald-600">
                  {propertiesToShow?.length || 0}
                </span>{" "}
                out of{" "}
                <span className="text-emerald-600">
                  {landProperties.length}
                </span>{" "}
                properties
              </p>
            </div>

            {/* Active Filters Indicator */}
            {(filters.minPrice > globalPriceRange.min ||
              filters.maxPrice < globalPriceRange.max) && (
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                  Filters Applied
                </div>
                <button
                  onClick={() => {
                    setFilters({
                      minPrice: globalPriceRange.min,
                      maxPrice: globalPriceRange.max,
                      sortBy: "newest",
                    });
                  }}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 🧱 Grid */}
        <div className="w-full py-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {propertiesToShow && propertiesToShow.length > 0 ? (
              propertiesToShow.map((property, index) => (
                <LandPropertyCard key={index} {...property} />
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500">
                  {loading
                    ? "Loading..."
                    : "No land properties match your filter criteria. Try adjusting your filters."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter Modal */}
      <LandFilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={tempFilters}
        onFilterChange={setTempFilters}
        priceRange={globalPriceRange}
        onApplyFilters={setFilters}
      />
    </div>
  );
};

export default LandProperty;
