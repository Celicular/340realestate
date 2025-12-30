import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaRulerCombined,
  FaTree,
  FaWater,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";
import { BsHouseDoorFill, BsArrowLeft } from "react-icons/bs";
import { getPortfolioItems } from "../../firebase/firestore";

const LandSoldDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const result = await getPortfolioItems("land", {
          status: "recent-sale",
        });

        if (result.success) {
          const foundProperty = result.data.find((p) => p.id === id);
          if (foundProperty) {
            setProperty(foundProperty);
          } else {
            setError("Property not found");
          }
        } else {
          setError(result.error || "Failed to fetch property");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Loading Property...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/landsold")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Sold Properties
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Property Not Found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + property.images.length) % property.images.length
    );
  };

  const formatPrice = (price) => {
    if (typeof price === "number") {
      return `$${price.toLocaleString()}`;
    }
    return price;
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/landproperties")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <BsArrowLeft className="w-5 h-5" />
            Back to Land Properties
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Title and Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {property.title}
            </h1>
            <span className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold">
              {property.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <FaMapMarkerAlt className="w-5 h-5" />
            <p className="text-lg">{getLocationDisplay(property.location)}</p>
          </div>
          <div className="flex items-center gap-4 text-2xl font-bold text-red-600">
            <span>{formatPrice(property.soldPrice)}</span>
            <span className="text-sm text-gray-500 font-normal">
              Sold {property.soldDate}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-96">
              {property.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${property.title} ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    index === currentImage ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  >
                    ›
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImage + 1} / {property.images.length}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {property.images.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {property.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      index === currentImage
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Property Overview
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FaRulerCombined className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Lot Size</p>
                    <p className="font-semibold">
                      {property.overview.lotSizeAcres} Acres
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaTree className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Grade</p>
                    <p className="font-semibold">{property.overview.grade}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BsHouseDoorFill className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Zoning</p>
                    <p className="font-semibold">{property.details.zoning}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaWater className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Waterfront</p>
                    <p className="font-semibold">
                      {property.details.waterfront === "Y" ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sale Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Sale Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sold Price:</span>
                  <span className="font-semibold text-red-600">
                    {formatPrice(property.soldPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sold Date:</span>
                  <span className="font-semibold">{property.soldDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Under Contract Date:</span>
                  <span className="font-semibold">
                    {property.underContractDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">MLS #:</span>
                  <span className="font-semibold">{property.mls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Financing:</span>
                  <span className="font-semibold">
                    {property.details.financing}
                  </span>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Location Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quarter:</span>
                  <span className="font-semibold">
                    {property.location.quarter}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subdivision:</span>
                  <span className="font-semibold">
                    {property.location.subdivision}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <span className="font-semibold">
                    {property.location.country}
                  </span>
                </div>
                {property.location.additionalLegalAddress && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Legal Address:</span>
                    <span className="font-semibold">
                      {property.location.additionalLegalAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Property Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Additional Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                Property Features
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <strong>Improved Property:</strong>{" "}
                  {property.details.improvedProperty ? "Yes" : "No"}
                </div>
                {property.details.improvements && (
                  <div>
                    <strong>Improvements:</strong>{" "}
                    {property.details.improvements}
                  </div>
                )}
                <div>
                  <strong>Easements:</strong> {property.details.easements}
                </div>
                <div>
                  <strong>Access:</strong> {property.details.access}
                </div>
                <div>
                  <strong>Restrictions:</strong> {property.details.restrictions}
                </div>
                <div>
                  <strong>Stamp Tax:</strong> {property.details.stampTax}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                Views & Features
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                {property.overview.view &&
                  property.overview.view.length > 0 && (
                    <div>
                      <strong>Views:</strong>{" "}
                      {property.overview.view.join(", ")}
                    </div>
                  )}
                <div>
                  <strong>Lot Size (Sq Ft):</strong>{" "}
                  {property.overview.lotSizeSqFt.toLocaleString()}
                </div>
                <div>
                  <strong>Hurricane Damaged:</strong>{" "}
                  {property.overview.hurricaneDamaged ? "Yes" : "No"}
                </div>
                {property.overview.hurricaneDamageSource && (
                  <div>
                    <strong>Damage Source:</strong>{" "}
                    {property.overview.hurricaneDamageSource}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandSoldDetail;
