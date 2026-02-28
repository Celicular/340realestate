import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import mlsHero from "../../assets/abouthero.jpg";
import {
  MapPin,
  DollarSign,
  Home,
  Bath,
  Bed,
  Loader2,
  ChevronRight,
  ImageOff,
  AlertCircle,
  Sliders,
  X,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icon function
const createMarkerIcon = (color = "blue") => {
  const colors = {
    blue: "#3b82f6",
    red: "#ef4444",
  };

  return L.divIcon({
    html: `
      <div style="
        background-color: ${colors[color]};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const SearchMlsMain = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;
  const cardsContainerRef = React.useRef(null);
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    beds: "",
    bathrooms: "",
    landOnly: false,
  });

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = "";
        const hasFilters =
          filters.priceMin ||
          filters.priceMax ||
          filters.beds ||
          filters.bathrooms ||
          filters.landOnly;

        if (hasFilters) {
          // Use filtered endpoint for filter requests (returns all matching results)
          const filterParams = new URLSearchParams();
          if (filters.priceMin)
            filterParams.append("pricemin", filters.priceMin);
          if (filters.priceMax)
            filterParams.append("pricemax", filters.priceMax);
          if (filters.beds) filterParams.append("beds", filters.beds);
          if (filters.bathrooms)
            filterParams.append("bathrooms", filters.bathrooms);
          if (filters.landOnly) filterParams.append("landpropertyonly", "true");

          url = `https://api.340realestate.com/filtered?${filterParams.toString()}`;
        } else {
          // Use paginated endpoint for regular pagination (no filters)
          url = `https://api.340realestate.com/paginated?page=${currentPage}&limit=${itemsPerPage}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(url, {
          signal: controller.signal,
          mode: "cors",
          headers: {
            Accept: "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();
        const propertyList = data.properties || [];

        setProperties(propertyList);

        if (hasFilters) {
          // Filtered endpoint returns all results without pagination
          const totalCount = data.count || propertyList.length;
          setTotalPages(1);
          setTotalCount(totalCount);
        } else {
          // Paginated endpoint has pagination info
          setTotalPages(data.total_pages || 1);
          setTotalCount(data.total_count || 0);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);

        if (err.name === "AbortError") {
          setError(
            "Request timed out. The API server might be sleeping. Please try again in a moment.",
          );
        } else if (err instanceof TypeError) {
          setError(
            "Unable to connect to MLS database. Please check your internet connection.",
          );
        } else {
          setError("Failed to load properties. Please try again.");
        }

        setProperties([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentPage, filters]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMarkerClick = (property) => {
    if (property.href) {
      window.open(property.href, "_blank");
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 when filters change
    setShowFilterModal(false);
  };

  const scrollToCard = (propertyId) => {
    setTimeout(() => {
      const cardElement = document.getElementById(`card-${propertyId}`);
      if (cardElement && cardsContainerRef.current) {
        cardElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }
    }, 0);
  };

  const handleMarkerHover = (property) => {
    setHoveredPropertyId(property.card_id);
    scrollToCard(property.card_id);
  };

  const handleMarkerHoverOut = () => {
    setHoveredPropertyId(null);
  };

  const centerLat = 18.32;
  const centerLng = -64.765;

  return (
    <section className="w-full min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative w-full h-[25vh] sm:h-[30vh] overflow-hidden">
        <img
          src={mlsHero}
          alt="Search MLS Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            St. John MLS Listings
          </h1>
          <p className="text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
            Explore residential, condos, land & commercial properties across St.
            John
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full flex flex-row gap-0">
        {/* Left Section - Cards - Scrollable */}
        <div
          className="w-2/5 overflow-y-auto p-4 sm:p-6 lg:p-8"
          style={{ height: "calc(100vh - 240px)" }}
        >
          {/* Header with Filter Button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Properties</h2>
            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium text-sm"
            >
              <Sliders size={18} />
              Filter
            </button>
          </div>

          {/* Active Filters Display */}
          {(filters.priceMin ||
            filters.priceMax ||
            filters.beds ||
            filters.bathrooms ||
            filters.landOnly) && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 font-medium mb-2">
                Active Filters:
              </p>
              <div className="flex flex-wrap gap-2">
                {filters.priceMin && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    Min: ${parseInt(filters.priceMin).toLocaleString()}
                  </span>
                )}
                {filters.priceMax && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    Max: ${parseInt(filters.priceMax).toLocaleString()}
                  </span>
                )}
                {filters.beds && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    {filters.beds}+ Beds
                  </span>
                )}
                {filters.bathrooms && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    {filters.bathrooms}+ Baths
                  </span>
                )}
                {filters.landOnly && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    Land Only
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Pagination Controls at Top */}
          {!loading &&
            !error &&
            properties.length > 0 &&
            !filters.priceMin &&
            !filters.priceMax &&
            !filters.beds &&
            !filters.bathrooms &&
            !filters.landOnly && (
              <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-600">
                    Page{" "}
                    <span className="font-bold text-slate-800">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-slate-800">
                      {totalPages}
                    </span>
                  </p>
                  <p className="text-sm text-slate-600">
                    Showing {properties.length} of{" "}
                    <span className="font-bold text-slate-800">
                      {totalCount}
                    </span>{" "}
                    properties
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map(
                      (_, idx) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = idx + 1;
                        } else if (currentPage <= 3) {
                          pageNum = idx + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + idx;
                        } else {
                          pageNum = currentPage - 2 + idx;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                              pageNum === currentPage
                                ? "bg-blue-600 text-white"
                                : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

          {/* Filtered Results Info at Top */}
          {(filters.priceMin ||
            filters.priceMax ||
            filters.beds ||
            filters.bathrooms ||
            filters.landOnly) &&
            !loading &&
            !error && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-center">
                <p className="text-sm text-blue-700">
                  Showing <span className="font-bold">{properties.length}</span>{" "}
                  matching propert{properties.length === 1 ? "y" : "ies"}
                </p>
              </div>
            )}

          {/* Properties List */}
          <div className="space-y-3" ref={cardsContainerRef}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2
                  className="animate-spin text-blue-600 mb-3"
                  size={32}
                />
                <p className="text-slate-600">Loading properties...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <div>
                  <p className="text-red-700 text-sm font-medium">
                    Unable to Load Properties
                  </p>
                  <p className="text-red-600 text-xs mt-1">{error}</p>
                </div>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-slate-100 rounded-lg p-8 text-center">
                <MapPin className="mx-auto text-slate-400 mb-3" size={32} />
                <p className="text-slate-600 font-medium">
                  No properties found
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              properties.map((property, index) => (
                <PropertyCard
                  key={property.card_id || index}
                  property={property}
                  formatPrice={formatPrice}
                  onSelect={handlePropertyClick}
                  isSelected={selectedProperty?.card_id === property.card_id}
                  isHovered={hoveredPropertyId === property.card_id}
                  onHover={() => setHoveredPropertyId(property.card_id)}
                  onHoverOut={() => setHoveredPropertyId(null)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Section - Map - Sticky */}
        <div
          className="w-3/5 p-4 sm:p-6 lg:p-8 bg-slate-50 sticky top-0"
          style={{ height: "calc(100vh - 211px)" }}
        >
          <div className="bg-white rounded-xl shadow-md overflow-hidden w-full h-full">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <Loader2 className="animate-spin text-blue-600" size={40} />
              </div>
            ) : properties.length > 0 ? (
              <MapContainer
                center={[centerLat, centerLng]}
                zoom={13}
                className="w-full h-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                  maxZoom={19}
                />
                {properties.map((property, index) => {
                  const lat =
                    property.Latitude || parseFloat(property.latitude);
                  const lng =
                    property.Longitude || parseFloat(property.longitude);

                  if (!lat || !lng) return null;

                  const isHovered = hoveredPropertyId === property.card_id;

                  return (
                    <Marker
                      key={property.card_id || index}
                      position={[lat, lng]}
                      icon={createMarkerIcon(isHovered ? "red" : "blue")}
                      eventHandlers={{
                        mouseover: () => handleMarkerHover(property),
                        mouseout: handleMarkerHoverOut,
                      }}
                    >
                      <Popup>
                        <div className="p-3 w-64">
                          <h3 className="font-semibold text-slate-800 mb-2">
                            {property.Name ||
                              property.address_line1 ||
                              "Property"}
                          </h3>
                          <p className="text-sm text-slate-600 mb-3">
                            {formatPrice(property.CurrentPrice)}
                          </p>
                          {property.href && (
                            <button
                              onClick={() => handleMarkerClick(property)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                            >
                              View Listing
                              <ChevronRight size={16} />
                            </button>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <AlertCircle className="text-slate-400 mr-2" size={24} />
                <p className="text-slate-600">Unable to load map</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Filter Properties
              </h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-slate-500 hover:text-slate-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <FilterModal
              filters={filters}
              onApply={handleFilterChange}
              onClose={() => setShowFilterModal(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
};

// Filter Modal Component
const FilterModal = ({ filters, onApply, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      priceMin: "",
      priceMax: "",
      beds: "",
      bathrooms: "",
      landOnly: false,
    };
    setLocalFilters(resetFilters);
    onApply(resetFilters);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <DollarSign size={16} />
          Price Range
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-600 mb-2">
              Minimum Price
            </label>
            <input
              type="number"
              placeholder="Min"
              value={localFilters.priceMin}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, priceMin: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-2">
              Maximum Price
            </label>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.priceMax}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, priceMax: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Bedrooms & Bathrooms */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Home size={16} />
          Property Details
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-600 mb-2">
              Minimum Bedrooms
            </label>
            <input
              type="number"
              placeholder="0"
              value={localFilters.beds}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, beds: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-2">
              Minimum Bathrooms
            </label>
            <input
              type="number"
              placeholder="0"
              step="0.5"
              value={localFilters.bathrooms}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, bathrooms: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Property Type */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <MapPin size={16} />
          Property Type
        </h3>
        <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
          <input
            type="checkbox"
            checked={localFilters.landOnly}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, landOnly: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-slate-700">
            Land Properties Only
          </span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={handleReset}
          className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium text-sm"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

// Property Card Component
const PropertyCard = ({
  property,
  formatPrice,
  onSelect,
  isSelected,
  isHovered,
  onHover,
  onHoverOut,
}) => {
  const mainImage = property.images?.[0];
  const beds =
    property.BedsTotal || property.card_fields?.total_bedrooms || "—";
  const baths =
    property.BathsTotal || property.card_fields?.total_bathrooms || "—";
  const estate = property.card_fields?.estate || "—";
  const parcelNumber = property.card_fields?.parcel_number || "—";

  return (
    <div
      id={`card-${property.card_id}`}
      onClick={() => onSelect(property)}
      onMouseEnter={onHover}
      onMouseLeave={onHoverOut}
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 flex h-40 ${
        isSelected ? "ring-2 ring-blue-600" : ""
      } ${isHovered ? "ring-2 ring-orange-500 shadow-lg scale-105" : "hover:shadow-lg"}`}
    >
      {/* Image - 30% width on left */}
      <div className="relative w-[30%] bg-slate-200 overflow-hidden group flex-shrink-0">
        {mainImage ? (
          <>
            <img
              src={mainImage}
              alt="Property"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "";
                e.target.parentElement.innerHTML =
                  '<div class="w-full h-full flex items-center justify-center bg-slate-200"><svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
              }}
            />
            <div className="absolute top-1 right-1 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              {property.status || "Active"}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200">
            <ImageOff className="text-slate-400" size={24} />
          </div>
        )}
      </div>

      {/* Content - 70% width on right */}
      <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden">
        {/* Top Section */}
        <div>
          {/* Address */}
          <h3 className="font-bold text-slate-800 text-xs mb-0.5 line-clamp-1">
            {property.address_line1 || "Property"}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-1">
            {property.address_line2 || "St John, VI"}
          </p>

          {/* MLS Number */}
          <p className="text-xs text-slate-500 mt-1">
            MLS #{property.mls_number || property.ListingId || "—"}
          </p>
        </div>

        {/* Middle Section - Details Grid */}
        <div className="grid grid-cols-3 gap-2 my-2 text-xs">
          {/* Price */}
          <div>
            <p className="text-slate-500 mb-0.5 flex items-center gap-0.5">
              <DollarSign size={12} />
              Price
            </p>
            <p className="font-bold text-blue-600 text-sm">
              {formatPrice(property.CurrentPrice).substring(0, 12)}
            </p>
          </div>

          {/* Beds */}
          <div>
            <p className="text-slate-500 mb-0.5 flex items-center gap-0.5">
              <Bed size={12} />
              Beds
            </p>
            <p className="font-medium text-slate-700">{beds}</p>
          </div>

          {/* Baths */}
          <div>
            <p className="text-slate-500 mb-0.5 flex items-center gap-0.5">
              <Bath size={12} />
              Baths
            </p>
            <p className="font-medium text-slate-700">{baths}</p>
          </div>
        </div>

        {/* Bottom Section - Action Button */}
        {property.href && (
          <a
            href={property.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-1 rounded text-xs font-semibold transition-all flex items-center justify-center gap-1 group"
          >
            View
            <ChevronRight
              size={12}
              className="group-hover:translate-x-0.5 transition"
            />
          </a>
        )}
      </div>
    </div>
  );
};

export default SearchMlsMain;
