import React, { useState, useEffect, memo, useMemo } from "react";
import {
  FaBed,
  FaBath,
  FaSwimmingPool,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAllPortfolioItems } from "../../firebase/firestore";
import { getPropertyImages } from "../../data/PropertyImages";

const PropertyCard = memo(
  ({ id, title, price, images, description, features }) => {
    const navigate = useNavigate();

    return (
      <div
        onClick={() => navigate(`/property/${id}`)}
        className="bg-white rounded-3xl mt-10 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
      >
        <div className="relative w-full h-72 bg-gray-100">
          {images?.[0] ? (
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <p className="text-2xl text-emerald-600 font-bold">{price}</p>
          <p className="text-gray-600 text-sm line-clamp-3">{description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            {features.totalBeds > 0 && (
              <span className="flex items-center gap-2">
                <FaBed /> {features.totalBeds} Beds
              </span>
            )}
            {features.totalBaths > 0 && (
              <span className="flex items-center gap-2">
                <FaBath /> {features.totalBaths} Baths
              </span>
            )}
            {features.pool && (
              <span className="flex items-center gap-2">
                <FaSwimmingPool /> Pool
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

// Filter Modal Component
const FilterModal = memo(
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

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-4">
                  Minimum Bedrooms
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[0, 1, 2, 3, 4, 5, 6].map((bed) => (
                    <button
                      key={bed}
                      onClick={() =>
                        onFilterChange({
                          ...filters,
                          minBedrooms: filters.minBedrooms === bed ? 0 : bed,
                        })
                      }
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        filters.minBedrooms === bed
                          ? "bg-emerald-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {bed === 0 ? "Any" : `${bed}+`}
                    </button>
                  ))}
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
                      minBedrooms: 0,
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

const PropertiesForSale = memo(({ selectedCategory }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [globalPriceRange, setGlobalPriceRange] = useState({
    min: 0,
    max: 10000000,
  });
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000000,
    minBedrooms: 0,
    sortBy: "newest",
  });
  const [tempFilters, setTempFilters] = useState({
    minPrice: 0,
    maxPrice: 10000000,
    minBedrooms: 0,
    sortBy: "newest",
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const result = await getAllPortfolioItems({ status: "for-sale" });

        if (!result.success || !result.data || result.data.length === 0) {
          setProperties([]);
          return;
        }

        // Deduplicate by title (case-insensitive)
        const seenTitles = new Set();
        const unique = [];

        result.data.forEach((item) => {
          const title = item.title?.trim();
          if (!title) return;

          const key = title.toLowerCase();
          if (seenTitles.has(key)) return;

          seenTitles.add(key);

          let images = item.images || [];
          if (!images.length) {
            const fallback =
              getPropertyImages(item.id) || getPropertyImages(item.title);
            if (fallback?.length) images = fallback;
          }

          // Extract price - handle both numbers and strings
          let priceValue = null;
          if (typeof item.price === "number") {
            priceValue = item.price;
          } else if (
            typeof item.price === "string" &&
            item.price !== "Price on request"
          ) {
            // Try to parse string like "$1,500,000" or "1500000"
            const cleaned = item.price.replace(/[$,]/g, "").trim();
            const parsed = parseInt(cleaned);
            if (!isNaN(parsed)) {
              priceValue = parsed;
            }
          }

          unique.push({
            id: item.id,
            title: item.title || "Untitled Property",
            price:
              typeof item.price === "number"
                ? `$${item.price.toLocaleString()}`
                : item.price || "Price on request",
            priceValue,
            images,
            description: item.description || "Luxury villa in St. John",
            features: {
              totalBeds: item.features?.beds || item.beds || 0,
              totalBaths: item.features?.baths || item.baths || 0,
              pool: !!item.features?.pool,
            },
            category: item.category,
            subcategory: item.subcategory,
          });
        });

        // Filter by selectedCategory
        let filtered = unique;
        if (selectedCategory) {
          filtered = unique.filter((p) => {
            const cat = (p.category || "").toLowerCase();
            const sub = (p.subcategory || "").toLowerCase();
            const match = selectedCategory.toLowerCase();
            return cat === match || sub === match;
          });
        }

        setProperties(filtered);

        // Calculate GLOBAL price range from properties with prices
        const pricesWithValues = filtered
          .filter((p) => p.priceValue !== null)
          .map((p) => p.priceValue);

        if (pricesWithValues.length > 0) {
          const minPrice = Math.min(...pricesWithValues);
          const maxPrice = Math.max(...pricesWithValues);

          // Set the GLOBAL range (slider bounds)
          setGlobalPriceRange({ min: minPrice, max: maxPrice });

          // Initialize both actual and temp filters to full range
          const initialFilters = {
            minPrice: minPrice,
            maxPrice: maxPrice,
            minBedrooms: 0,
            sortBy: "newest",
          };
          setFilters(initialFilters);
          setTempFilters(initialFilters);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [selectedCategory]);

  // Apply filters and sorting
  const filteredAndSorted = useMemo(() => {
    let result = properties.filter((p) => {
      const priceValue = p.priceValue;
      const beds = p.features.totalBeds || 0;

      // Check bedroom filter
      if (filters.minBedrooms > 0 && beds < filters.minBedrooms) {
        return false;
      }

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
  }, [properties, filters, globalPriceRange]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600"></div>
        <p className="mt-4 text-gray-600">Loading properties...</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-xl text-gray-500">
          {selectedCategory
            ? `No ${selectedCategory} properties found.`
            : "No properties for sale at this time."}
        </p>
      </div>
    );
  }

  return (
    <section className="pb-20 pt-5 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Featured Properties For Sale
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mt-4 rounded-full" />
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Discover elegant villas with modern upgrades, breathtaking views, and
          exceptional amenities in St. John.
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
                {filteredAndSorted.length}
              </span>{" "}
              out of{" "}
              <span className="text-emerald-600">{properties.length}</span>{" "}
              properties
            </p>
          </div>

          {/* Active Filters Indicator */}
          {(filters.minPrice > globalPriceRange.min ||
            filters.maxPrice < globalPriceRange.max ||
            filters.minBedrooms > 0) && (
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                Filters Applied
              </div>
              <button
                onClick={() => {
                  setFilters({
                    minPrice: globalPriceRange.min,
                    maxPrice: globalPriceRange.max,
                    minBedrooms: 0,
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

      {/* Results */}
      {filteredAndSorted.length === 0 ? (
        <div className="max-w-7xl mx-auto py-12 text-center">
          <p className="text-lg text-gray-500">
            No properties match your filter criteria. Try adjusting your
            filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {filteredAndSorted.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={tempFilters}
        onFilterChange={setTempFilters}
        priceRange={globalPriceRange}
        onApplyFilters={setFilters}
      />
    </section>
  );
});

export default PropertiesForSale;
