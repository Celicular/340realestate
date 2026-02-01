import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Home, Bed, Bath, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ComparisonDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentImageIndex1, setCurrentImageIndex1] = useState(0);
  const [currentImageIndex2, setCurrentImageIndex2] = useState(0);

  const property1 = location.state?.property1;
  const property2 = location.state?.property2;

  // Debug: Log property structure
  useEffect(() => {
    console.log('Property 1 data:', property1);
    console.log('Property 2 data:', property2);
  }, [property1, property2]);

  if (!property1 || !property2) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Properties Selected</h2>
          <p className="text-gray-600 mb-6">Please select two properties to compare.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Helper functions
  const getPropertyName = (property) => {
    return property?.name || property?.title || 'Unnamed Property';
  };

  const getPropertyPrice = (property) => {
    const price = property?.price || property?.propertyPrice;
    if (typeof price === 'number') {
      return `$${price.toLocaleString()}`;
    }
    return price || 'Price not available';
  };

  const getPropertyImages = (property) => {
    return property?.images || property?.propertyImages || [];
  };

  const getPropertyLocation = (property) => {
    if (typeof property?.location === 'string') {
      return property.location;
    }
    if (property?.location?.address) {
      return property.location.address;
    }
    return 'Location not specified';
  };

  // Image navigation
  const nextImage1 = () => {
    const images = getPropertyImages(property1);
    setCurrentImageIndex1((prev) => (prev + 1) % images.length);
  };

  const prevImage1 = () => {
    const images = getPropertyImages(property1);
    setCurrentImageIndex1((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage2 = () => {
    const images = getPropertyImages(property2);
    setCurrentImageIndex2((prev) => (prev + 1) % images.length);
  };

  const prevImage2 = () => {
    const images = getPropertyImages(property2);
    setCurrentImageIndex2((prev) => (prev - 1 + images.length) % images.length);
  };

  const images1 = getPropertyImages(property1);
  const images2 = getPropertyImages(property2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="sticky top-20 bg-white shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Property Comparison</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Image Gallery */}
            <div className="relative group">
              <div className="w-full h-96 bg-gray-200 rounded-2xl overflow-hidden">
                {images1.length > 0 ? (
                  <img
                    src={images1[currentImageIndex1]}
                    alt={getPropertyName(property1)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              {images1.length > 1 && (
                <>
                  <button
                    onClick={prevImage1}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images1.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex1 + 1} / {images1.length}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {getPropertyName(property1)}
                </h2>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>{getPropertyLocation(property1)}</span>
                </div>
                <div className="text-4xl font-bold text-emerald-600 mb-6">
                  {getPropertyPrice(property1)}
                </div>
              </div>

              {/* Key Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                {(property1.features?.totalBeds || property1.features?.beds) && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bed className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600 font-medium">Bedrooms</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{property1.features?.totalBeds || property1.features?.beds || 0}</p>
                  </div>
                )}

                {(property1.features?.totalBaths || property1.features?.baths) && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bath className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600 font-medium">Bathrooms</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{property1.features?.totalBaths || property1.features?.baths || 0}</p>
                  </div>
                )}

                {property1.features?.sqft && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600 font-medium">Sq Ft</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {typeof property1.features.sqft === 'number' 
                        ? property1.features.sqft.toLocaleString() 
                        : property1.features.sqft}
                    </p>
                  </div>
                )}
              </div>

              {/* Status */}
              {property1.status && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-lg font-semibold text-emerald-600">{property1.status}</p>
                </div>
              )}

              {/* Description */}
              {(property1.description || property1.fullDescription) && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{property1.fullDescription || property1.description}</p>
                </div>
              )}

              {/* Amenities */}
              {property1.amenities && property1.amenities.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                  <ul className="space-y-2">
                    {property1.amenities.map((amenity, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                        <span>{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>

          {/* Property 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Image Gallery */}
            <div className="relative group">
              <div className="w-full h-96 bg-gray-200 rounded-2xl overflow-hidden">
                {images2.length > 0 ? (
                  <img
                    src={images2[currentImageIndex2]}
                    alt={getPropertyName(property2)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              {images2.length > 1 && (
                <>
                  <button
                    onClick={prevImage2}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage2}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images2.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex2 + 1} / {images2.length}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {getPropertyName(property2)}
                </h2>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>{getPropertyLocation(property2)}</span>
                </div>
                <div className="text-4xl font-bold text-emerald-600 mb-6">
                  {getPropertyPrice(property2)}
                </div>
              </div>

              {/* Key Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                {(property2.features?.totalBeds || property2.features?.beds) && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bed className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600 font-medium">Bedrooms</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{property2.features?.totalBeds || property2.features?.beds || 0}</p>
                  </div>
                )}

                {(property2.features?.totalBaths || property2.features?.baths) && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bath className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600 font-medium">Bathrooms</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{property2.features?.totalBaths || property2.features?.baths || 0}</p>
                  </div>
                )}

                {property2.features?.sqft && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600 font-medium">Sq Ft</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {typeof property2.features.sqft === 'number' 
                        ? property2.features.sqft.toLocaleString() 
                        : property2.features.sqft}
                    </p>
                  </div>
                )}
              </div>

              {/* Status */}
              {property2.status && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-lg font-semibold text-emerald-600">{property2.status}</p>
                </div>
              )}

              {/* Description */}
              {(property2.description || property2.fullDescription) && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{property2.fullDescription || property2.description}</p>
                </div>
              )}

              {/* Amenities */}
              {property2.amenities && property2.amenities.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                  <ul className="space-y-2">
                    {property2.amenities.map((amenity, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                        <span>{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonDetail;
