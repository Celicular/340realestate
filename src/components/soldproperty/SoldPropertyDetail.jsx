import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Home,
  Phone,
  Mail,
  Building,
  Tree,
  Droplets,
  Ruler,
  Calendar,
  Star,
  Waves,
} from "lucide-react";
import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaTree,
} from "react-icons/fa";
import { getAllPortfolioItems } from "../../firebase/firestore";

const SoldPropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [soldProperty, setSoldProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sold property from Firestore
  useEffect(() => {
    const fetchSoldProperty = async () => {
      try {
        setLoading(true);

        // Fetch all recent-sale properties
        const result = await getAllPortfolioItems({ status: "recent-sale" });
        if (result.success) {
          const property = result.data.find((p) => p.id === id);
          if (property) {
            setSoldProperty(property);
          } else {
            setError("Sold property not found");
          }
        } else {
          setError(result.error || "Failed to fetch sold properties");
        }
      } catch (err) {
        setError("Error fetching sold property: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSoldProperty();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Loading sold property details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error: {error}</p>
          </div>
          <button
            onClick={() => navigate("/properties")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          >
            Back to Properties
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get the sold property
  const property = soldProperty;

  // Helper function to get location display
  const getLocationDisplay = (loc) => {
    if (typeof loc === "string") return loc;
    if (loc && loc.address) return loc.address;
    return "St. John, USVI";
  };

  // Check if property details section has meaningful data
  const hasPropertyDetails = () => {
    const mls = property?.highlights?.mls || property?.mls;
    const quarter =
      property?.highlights?.quarter || property?.location?.quarter;
    const estate = property?.highlights?.estate || property?.estate;
    const yearBuilt =
      (property?.highlights?.yearBuilt || property?.yearBuilt) > 0;
    const totalSqFt =
      (property?.highlights?.totalSqFt || property?.features?.sqft) > 0;
    const approxIntSqft = property?.highlights?.approxIntSqft > 0;

    return mls || quarter || estate || yearBuilt || totalSqFt || approxIntSqft;
  };

  // Check if additional info section has meaningful data
  const hasAdditionalInfo = () => {
    const zoning =
      property?.additionalInfo?.zoning || property?.details?.zoning;
    const grade = property?.additionalInfo?.grade || property?.overview?.grade;
    const waterfront =
      property?.additionalInfo?.waterfront || property?.details?.waterfront;
    const intendedUse =
      property?.additionalInfo?.intendedUse || property?.details?.intendedUse;
    const sewer = property?.additionalInfo?.sewer || property?.details?.sewer;
    const condition =
      property?.additionalInfo?.condition || property?.details?.condition;
    const builder =
      property?.additionalInfo?.builderName || property?.details?.builderName;
    const construction =
      property?.additionalInfo?.construction || property?.details?.construction;
    const foundation =
      property?.additionalInfo?.foundation || property?.details?.foundation;
    const deckSqFt =
      (property?.additionalInfo?.deckSqFt || 0) > 0 ||
      (property?.details?.deckSqFt || 0) > 0;
    const insurance =
      property?.additionalInfo?.insurance || property?.details?.insurance;
    const roadAssessment =
      property?.additionalInfo?.roadAssessmentYear ||
      property?.details?.roadAssessmentYear;

    // Check if any value is not "N/A" and not empty
    return (
      (zoning && zoning !== "N/A") ||
      (grade && grade !== "N/A") ||
      (waterfront && waterfront !== "N/A") ||
      (intendedUse && intendedUse !== "N/A") ||
      (sewer && sewer !== "N/A") ||
      (condition && condition !== "N/A") ||
      (builder && builder !== "N/A") ||
      (construction && construction !== "N/A") ||
      (foundation && foundation !== "N/A") ||
      deckSqFt ||
      (insurance && insurance !== "N/A") ||
      (roadAssessment && roadAssessment !== "N/A")
    );
  };

  // Agent data
  const agent = {
    name: "Tammy Donnelly",
    phone: "+1 340-643-6068",
    email: "340realestateco@gmail.com",
  };

  // Time slots for booking
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  // Navigation functions
  const nextImage = () => {
    if (property && property.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + property.images.length) % property.images.length
      );
    }
  };

  // Booking functions
  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      alert(
        `Booking confirmed for ${selectedDate} at ${selectedTime}! We'll contact you soon.`
      );
      setShowBookingModal(false);
      setSelectedDate("");
      setSelectedTime("");
    } else {
      alert("Please select both date and time.");
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sold Property Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested sold property could not be found.
          </p>
          <button
            onClick={() => navigate("/properties")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/40" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4"
        >
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-wide mb-4">
            {property.title}
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-tropical-500 to-blue-400 rounded-full mb-4"></div>
          <div className="text-white text-xl">
            <span className="bg-red-500 px-4 py-2 rounded-full font-semibold">
              {property.status}
            </span>
          </div>
        </motion.div>
      </section>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <button
              onClick={() => navigate("/properties")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium mb-6"
            >
              <ArrowLeft size={20} />
              Back to Properties
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative h-96">
                    {property.images && property.images.length > 0 && (
                      <>
                        <img
                          src={property.images[currentImageIndex]}
                          alt={`${property.title} - Image ${
                            currentImageIndex + 1
                          }`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />

                        {/* Navigation arrows */}
                        {property.images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                            >
                              ‹
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                            >
                              ›
                            </button>
                          </>
                        )}

                        {/* Image counter */}
                        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {property.images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail gallery */}
                  {property.images && property.images.length > 1 && (
                    <div className="p-4 bg-gray-50">
                      <div className="flex gap-2 overflow-x-auto">
                        {property.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                              index === currentImageIndex
                                ? "border-blue-500"
                                : "border-transparent hover:border-gray-300"
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Property Card Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{getLocationDisplay(property.location)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-green-600">
                      {property.price}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-6">
                    {(property.features?.beds || property.highlights?.beds) >
                      0 && (
                      <div className="flex items-center gap-2">
                        <Bed className="text-blue-600" size={20} />
                        <span className="font-medium">
                          {property.features?.beds || property.highlights?.beds}{" "}
                          Beds
                        </span>
                      </div>
                    )}
                    {(property.features?.baths || property.highlights?.baths) >
                      0 && (
                      <div className="flex items-center gap-2">
                        <Bath className="text-blue-600" size={20} />
                        <span className="font-medium">
                          {property.features?.baths ||
                            property.highlights?.baths}{" "}
                          Baths
                        </span>
                      </div>
                    )}
                    {(property.features?.sqft || property.highlights?.sqft) && (
                      <div className="flex items-center gap-2">
                        <Home className="text-blue-600" size={20} />
                        <span className="font-medium">
                          {property.features?.sqft || property.highlights?.sqft}{" "}
                          Sqft
                        </span>
                      </div>
                    )}
                    {(property.highlights?.acreage ||
                      property.highlights?.acres) > 0 && (
                      <div className="flex items-center gap-2">
                        <FaRulerCombined className="text-blue-600" size={20} />
                        <span className="font-medium">
                          {property.highlights?.acreage ||
                            property.highlights?.acres}{" "}
                          Acres
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {property.description}
                    </p>
                  </div>

                  {/* Property Features */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Property Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property?.highlights?.landscaping && (
                        <div className="flex items-center gap-2">
                          <FaTree className="text-green-600" size={16} />
                          <span className="text-gray-700">
                            {property.highlights.landscaping} Landscaping
                          </span>
                        </div>
                      )}
                      {property?.features?.acFans &&
                        property.features.acFans !== "N/A" && (
                          <div className="flex items-center gap-2">
                            <Building className="text-blue-600" size={16} />
                            <span className="text-gray-700">
                              AC/Fans: {property.features.acFans}
                            </span>
                          </div>
                        )}
                      {property?.features?.cistern &&
                        property.features.cistern !== "N/A" && (
                          <div className="flex items-center gap-2">
                            <Droplets className="text-blue-600" size={16} />
                            <span className="text-gray-700">
                              Cistern: {property.features.cistern}
                            </span>
                          </div>
                        )}
                      {property?.features?.roof &&
                        property.features.roof !== "N/A" && (
                          <div className="flex items-center gap-2">
                            <Home className="text-gray-600" size={16} />
                            <span className="text-gray-700">
                              Roof: {property.features.roof}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Property Details */}
                  {hasPropertyDetails() && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Property Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {(property?.highlights?.mls || property?.mls) && (
                          <div>
                            <strong>MLS #:</strong>{" "}
                            {property?.highlights?.mls || property?.mls}
                          </div>
                        )}
                        {(property?.highlights?.quarter ||
                          property?.location?.quarter) && (
                          <div>
                            <strong>Quarter:</strong>{" "}
                            {property?.highlights?.quarter ||
                              property?.location?.quarter}
                          </div>
                        )}
                        {(property?.highlights?.estate || property?.estate) && (
                          <div>
                            <strong>Estate:</strong>{" "}
                            {property?.highlights?.estate || property?.estate}
                          </div>
                        )}
                        {(property?.highlights?.yearBuilt ||
                          property?.yearBuilt) > 0 && (
                          <div>
                            <strong>Year Built:</strong>{" "}
                            {property?.highlights?.yearBuilt ||
                              property?.yearBuilt}
                          </div>
                        )}
                        {(property?.highlights?.totalSqFt ||
                          property?.features?.sqft) > 0 && (
                          <div>
                            <strong>Total SqFt:</strong>{" "}
                            {property?.highlights?.totalSqFt ||
                              property?.features?.sqft}
                          </div>
                        )}
                        {property?.highlights?.approxIntSqft > 0 && (
                          <div>
                            <strong>Interior SqFt:</strong>{" "}
                            {property?.highlights?.approxIntSqft}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Information */}
                  {hasAdditionalInfo() && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Additional Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {(property?.additionalInfo?.zoning ||
                          property?.details?.zoning) &&
                          (property?.additionalInfo?.zoning !== "N/A" ||
                            property?.details?.zoning !== "N/A") && (
                            <div>
                              <strong>Zoning:</strong>{" "}
                              {property?.additionalInfo?.zoning ||
                                property?.details?.zoning}
                            </div>
                          )}
                        {(property?.additionalInfo?.grade ||
                          property?.overview?.grade) &&
                          (property?.additionalInfo?.grade !== "N/A" ||
                            property?.overview?.grade !== "N/A") && (
                            <div>
                              <strong>Grade:</strong>{" "}
                              {property?.additionalInfo?.grade ||
                                property?.overview?.grade}
                            </div>
                          )}
                        {(property?.additionalInfo?.waterfront ||
                          property?.details?.waterfront) &&
                          (property?.additionalInfo?.waterfront !== "N/A" ||
                            property?.details?.waterfront !== "N/A") && (
                            <div>
                              <strong>Waterfront:</strong>{" "}
                              {property?.additionalInfo?.waterfront ||
                                property?.details?.waterfront}
                            </div>
                          )}
                        {(property?.additionalInfo?.intendedUse ||
                          property?.details?.intendedUse) &&
                          (property?.additionalInfo?.intendedUse !== "N/A" ||
                            property?.details?.intendedUse !== "N/A") && (
                            <div>
                              <strong>Intended Use:</strong>{" "}
                              {property?.additionalInfo?.intendedUse ||
                                property?.details?.intendedUse}
                            </div>
                          )}
                        {(property?.additionalInfo?.sewer ||
                          property?.details?.sewer) &&
                          (property?.additionalInfo?.sewer !== "N/A" ||
                            property?.details?.sewer !== "N/A") && (
                            <div>
                              <strong>Sewer:</strong>{" "}
                              {property?.additionalInfo?.sewer ||
                                property?.details?.sewer}
                            </div>
                          )}
                        {(property?.additionalInfo?.condition ||
                          property?.details?.condition) &&
                          (property?.additionalInfo?.condition !== "N/A" ||
                            property?.details?.condition !== "N/A") && (
                            <div>
                              <strong>Condition:</strong>{" "}
                              {property?.additionalInfo?.condition ||
                                property?.details?.condition}
                            </div>
                          )}
                        {(property?.additionalInfo?.builderName ||
                          property?.details?.builderName) &&
                          (property?.additionalInfo?.builderName !== "N/A" ||
                            property?.details?.builderName !== "N/A") && (
                            <div>
                              <strong>Builder:</strong>{" "}
                              {property?.additionalInfo?.builderName ||
                                property?.details?.builderName}
                            </div>
                          )}
                        {(property?.additionalInfo?.construction ||
                          property?.details?.construction) &&
                          (property?.additionalInfo?.construction !== "N/A" ||
                            property?.details?.construction !== "N/A") && (
                            <div>
                              <strong>Construction:</strong>{" "}
                              {property?.additionalInfo?.construction ||
                                property?.details?.construction}
                            </div>
                          )}
                        {(property?.additionalInfo?.foundation ||
                          property?.details?.foundation) &&
                          (property?.additionalInfo?.foundation !== "N/A" ||
                            property?.details?.foundation !== "N/A") && (
                            <div>
                              <strong>Foundation:</strong>{" "}
                              {property?.additionalInfo?.foundation ||
                                property?.details?.foundation}
                            </div>
                          )}
                        {((property?.additionalInfo?.deckSqFt || 0) > 0 ||
                          (property?.details?.deckSqFt || 0) > 0) && (
                          <div>
                            <strong>Deck SqFt:</strong>{" "}
                            {property?.additionalInfo?.deckSqFt ||
                              property?.details?.deckSqFt}
                          </div>
                        )}
                        {(property?.additionalInfo?.insurance ||
                          property?.details?.insurance) &&
                          (property?.additionalInfo?.insurance !== "N/A" ||
                            property?.details?.insurance !== "N/A") && (
                            <div>
                              <strong>Insurance:</strong>{" "}
                              {property?.additionalInfo?.insurance ||
                                property?.details?.insurance}
                            </div>
                          )}
                        {(property?.additionalInfo?.roadAssessmentYear ||
                          property?.details?.roadAssessmentYear) &&
                          (property?.additionalInfo?.roadAssessmentYear !==
                            "N/A" ||
                            property?.details?.roadAssessmentYear !==
                              "N/A") && (
                            <div>
                              <strong>Road Assessment:</strong>{" "}
                              {property?.additionalInfo?.roadAssessmentYear ||
                                property?.details?.roadAssessmentYear}
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Schedule a Viewing */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Schedule a Viewing
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      onFocus={(e) =>
                        e.target.showPicker && e.target.showPicker()
                      }
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose a time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => setShowBookingModal(true)}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Schedule Viewing
                  </button>
                </div>
              </motion.div>

              {/* Contact Agent */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Contact Agent
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Phone className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{agent.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{agent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FaWhatsapp className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">WhatsApp</p>
                      <p className="font-medium text-gray-900">{agent.phone}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Confirm Booking
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property:</span>
                  <span className="font-semibold">{property.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold">{selectedTime}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoldPropertyDetail;
