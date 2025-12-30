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
import { getPortfolioItems } from "../../firebase/firestore";
import { saveViewingRequest } from "../../firebase/firestore";

const LandPropertyDetail = () => {
  const { id } = useParams();
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  // Fetch land property from Firestore
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const result = await getPortfolioItems("land");

        if (result.success) {
          const foundProperty = result.data.find((prop) => prop.id === id);
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

  // bookingData
  const handleBookingSubmit = async () => {
    const bookingData = {
      fullName,
      email,
      mobile,
      selectedDate,
      selectedTime,
      propertyId, // optional
    };

    await saveViewingRequest(bookingData);
    setShowBookingModal(true);
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

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/landproperties")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Land Properties
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Land Property Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested land property could not be found.
          </p>
          <button
            onClick={() => navigate("/landproperties")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Land Properties
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
            <span className="bg-green-500 px-4 py-2 rounded-full font-semibold">
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
              onClick={() => navigate("/landproperties")}
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
                      {formatPrice(property.price)}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-6">
                    {property.overview &&
                      property.overview.lotSizeAcres > 0 && (
                        <div className="flex items-center gap-2">
                          <FaRulerCombined
                            className="text-blue-600"
                            size={20}
                          />
                          <span className="font-medium">
                            {property.overview.lotSizeAcres} Acres
                          </span>
                        </div>
                      )}
                    {property.overview && property.overview.grade && (
                      <div className="flex items-center gap-2">
                        <FaTree className="text-green-600" size={20} />
                        <span className="font-medium">
                          {property.overview.grade} Grade
                        </span>
                      </div>
                    )}
                    {property.details && property.details.zoning && (
                      <div className="flex items-center gap-2">
                        <Building className="text-blue-600" size={20} />
                        <span className="font-medium">
                          {property.details.zoning}
                        </span>
                      </div>
                    )}
                    {property.details &&
                      property.details.waterfront === "Y" && (
                        <div className="flex items-center gap-2">
                          <Waves className="text-blue-600" size={20} />
                          <span className="font-medium">Waterfront</span>
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

                  {/* Land Features */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Land Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.overview && property.overview.grade && (
                        <div className="flex items-center gap-2">
                          <FaTree className="text-green-600" size={16} />
                          <span className="text-gray-700">
                            Grade: {property.overview.grade}
                          </span>
                        </div>
                      )}
                      {property.details &&
                        property.details.improvements &&
                        property.details.improvements !== "N/A" && (
                          <div className="flex items-center gap-2">
                            <Home className="text-blue-600" size={16} />
                            <span className="text-gray-700">
                              Improvements: {property.details.improvements}
                            </span>
                          </div>
                        )}
                      {property.overview && property.overview.grade && (
                        <div className="flex items-center gap-2">
                          <Ruler className="text-blue-600" size={16} />
                          <span className="text-gray-700">
                            Grade: {property.overview.grade}
                          </span>
                        </div>
                      )}
                      {property.details && property.details.zoning && (
                        <div className="flex items-center gap-2">
                          <Building className="text-gray-600" size={16} />
                          <span className="text-gray-700">
                            Zoning: {property.details.zoning}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Land Details */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Land Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {property.mls && (
                        <div>
                          <strong>MLS #:</strong> {property.mls}
                        </div>
                      )}
                      {property.status && (
                        <div>
                          <strong>Status:</strong> {property.status}
                        </div>
                      )}
                      {property.location && property.location.quarter && (
                        <div>
                          <strong>Quarter:</strong> {property.location.quarter}
                        </div>
                      )}
                      {property.location && property.location.subdivision && (
                        <div>
                          <strong>Subdivision:</strong>{" "}
                          {property.location.subdivision}
                        </div>
                      )}
                      {property.location && property.location.country && (
                        <div>
                          <strong>Country:</strong> {property.location.country}
                        </div>
                      )}
                      {property.overview &&
                        property.overview.lotSizeAcres > 0 && (
                          <div>
                            <strong>Acres:</strong>{" "}
                            {property.overview.lotSizeAcres}
                          </div>
                        )}
                      {property.overview &&
                        property.overview.lotSizeSqFt > 0 && (
                          <div>
                            <strong>Lot Size SqFt:</strong>{" "}
                            {property.overview.lotSizeSqFt}
                          </div>
                        )}
                      {property.overview &&
                        property.overview.hurricaneDamaged && (
                          <div>
                            <strong>Hurricane Damaged:</strong> Yes
                          </div>
                        )}
                      {property.overview &&
                        property.overview.hurricaneDamageSource && (
                          <div>
                            <strong>Damage Source:</strong>{" "}
                            {property.overview.hurricaneDamageSource}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {property.details && property.details.zoning && (
                        <div>
                          <strong>Zoning:</strong> {property.details.zoning}
                        </div>
                      )}
                      {property.overview && property.overview.grade && (
                        <div>
                          <strong>Grade:</strong> {property.overview.grade}
                        </div>
                      )}
                      {property.details && property.details.waterfront && (
                        <div>
                          <strong>Waterfront:</strong>{" "}
                          {property.details.waterfront}
                        </div>
                      )}
                      {property.details && property.details.intendedUse && (
                        <div>
                          <strong>Intended Use:</strong>{" "}
                          {property.details.intendedUse}
                        </div>
                      )}
                      {property.details && property.details.financing && (
                        <div>
                          <strong>Financing:</strong>{" "}
                          {property.details.financing}
                        </div>
                      )}
                      {property.details && property.details.stampTax && (
                        <div>
                          <strong>Stamp Tax:</strong>{" "}
                          {property.details.stampTax}
                        </div>
                      )}
                      {property.details && property.details.easements && (
                        <div>
                          <strong>Easements:</strong>{" "}
                          {property.details.easements}
                        </div>
                      )}
                      {property.details && property.details.access && (
                        <div>
                          <strong>Access:</strong> {property.details.access}
                        </div>
                      )}
                      {property.details && property.details.restrictions && (
                        <div>
                          <strong>Restrictions:</strong>{" "}
                          {property.details.restrictions}
                        </div>
                      )}
                      {property.details &&
                        property.details.hoaDues !== undefined && (
                          <div>
                            <strong>HOA Dues:</strong>{" "}
                            {property.details.hoaDues === 0
                              ? "None"
                              : `$${property.details.hoaDues}`}
                          </div>
                        )}
                      {property.details &&
                        property.details.assocFee !== undefined && (
                          <div>
                            <strong>Association Fee:</strong>{" "}
                            {property.details.assocFee === 0
                              ? "None"
                              : `$${property.details.assocFee}`}
                          </div>
                        )}
                      {property.details &&
                        property.details.roadAssessment !== undefined && (
                          <div>
                            <strong>Road Assessment:</strong>{" "}
                            {property.details.roadAssessment === 0
                              ? "None"
                              : `$${property.details.roadAssessment}`}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* View Information */}
                  {property.overview &&
                    property.overview.view &&
                    property.overview.view.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          Views
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {property.overview.view.map((view, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {view}
                            </span>
                          ))}
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
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter mobile number"
                    />
                  </div>

                  {/* Date Picker */}
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

                  {/* Time Selector */}
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
                    onClick={handleBookingSubmit}
                    disabled={
                      !fullName ||
                      !email ||
                      !mobile ||
                      !selectedDate ||
                      !selectedTime
                    }
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

export default LandPropertyDetail;
