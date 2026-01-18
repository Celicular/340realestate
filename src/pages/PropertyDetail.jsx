import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Waves,
  Home,
  Calendar,
  Phone,
  Mail,
  Star,
  Building,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import MortgageCalculator from "../components/mortage/MortgageCalculator";
import agentimage from "../assets/tammy.jpg";
import { getPortfolioItems } from "../firebase/firestore";
import { getPropertyImages } from "../data/PropertyImages";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingProperty, setBookingProperty] = useState(null);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch property data from Firestore
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        // First try residential portfolio
        let result = await getPortfolioItems('residential');
        let property = null;
        
        if (result.success) {
          property = result.data.find(p => p.id === id);
        }
        
        // If not found in residential, try commercial
        if (!property) {
          result = await getPortfolioItems('commercial');
          if (result.success) {
            property = result.data.find(p => p.id === id);
          }
        }
        
        // If not found in commercial, try land
        if (!property) {
          result = await getPortfolioItems('land');
          if (result.success) {
            property = result.data.find(p => p.id === id);
          }
        }
        
        if (property) {
          // Add fallback images if property has no images
          if (!property.images || property.images.length === 0) {
            const fallbackImages = getPropertyImages(property.id) || getPropertyImages(property.title);
            if (fallbackImages && fallbackImages.length > 0) {
              console.log(`📸 Using fallback images for property "${property.title}":`, fallbackImages.length, 'images');
              property = { ...property, images: fallbackImages };
            }
          }
          setCurrentProperty(property);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        setError('Error fetching property: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Determine if this is a combo property (has internal tabs) or single property
  const isComboProperty =
    id === "combo" || id === "stillwater" || id === "ripple";
  const isSingleProperty = id === "doubleVision";

  // Agent data
  const agent = {
    name: "Tammy Donnelly",
    phone: "+1 340-643-6068",
    email: "340realestateco@gmail.com",
  };


  // Reset image index when property changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [id]);

  // Navigation functions
  const nextImage = () => {
    if (currentProperty && currentProperty.images) {
      setCurrentImageIndex(
        (prev) => (prev + 1) % currentProperty.images.length
      );
    }
  };

  const prevImage = () => {
    if (currentProperty && currentProperty.images) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + currentProperty.images.length) %
          currentProperty.images.length
      );
    }
  };

  // Booking functions
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

  const handleBookingSubmit = async () => {
    const bookingData = {
      fullName,
      email,
      mobile,
      selectedDate,
      selectedTime,
      propertyId: id,
    };
  
    console.log("📌 Sending booking to Firestore:", bookingData);
  
    try {
      const result = await saveViewingRequest(bookingData);
  
      if (result?.success) {
        console.log("✅ Booking saved:", result.id);
  
        // Close modal AFTER confirming
        setShowBookingModal(false);
  
        // Reset form AFTER saving
        setFullName("");
        setEmail("");
        setMobile("");
        setSelectedDate("");
        setSelectedTime("");
  
        alert("Booking Confirmed!");
      } else {
        alert("Failed to save booking.");
      }
    } catch (error) {
      console.error(error);
      alert("Unexpected error.");
    }
  };

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading property details...</p>
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
            onClick={() => navigate('/properties')}
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

  // If property not found
  if (!currentProperty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested property could not be found.
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
      <section className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden bg-gray-300">
        {currentProperty.images && currentProperty.images.length > 0 ? (
          <img
            src={currentProperty.images[0]}
            alt={currentProperty.title}
            className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
            <p className="text-white text-lg">No image available</p>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4"
        >
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-wide mb-4">
            {currentProperty.title}
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-tropical-500 to-blue-400 rounded-full mb-4"></div>
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

            {/* Show tabs only for combo properties */}
            {isComboProperty && (
              <div className="flex flex-wrap gap-2 border-b border-gray-200">
                {[
                  { id: "combo", label: "Combo Package" },
                  { id: "stillwater", label: "Still Water Villa" },
                  { id: "ripple", label: "Ripple Home" },
                ].map(({ id: tabId, label }) => (
                  <button
                    key={tabId}
                    onClick={() => navigate(`/property/${tabId}`)}
                    className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
                      id === tabId
                        ? "bg-[#3c6a72] text-white"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
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
                    {currentProperty.images &&
                      currentProperty.images.length > 0 && (
                        <>
                          <img
                            src={currentProperty.images[currentImageIndex]}
                            alt={`${currentProperty.title} - Image ${
                              currentImageIndex + 1
                            }`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20" />

                          {/* Navigation arrows */}
                          {currentProperty.images.length > 1 && (
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
                            {currentImageIndex + 1} /{" "}
                            {currentProperty.images.length}
                          </div>
                        </>
                      )}
                  </div>

                  {/* Thumbnail gallery */}
                  {currentProperty.images &&
                    currentProperty.images.length > 1 && (
                      <div className="p-4 bg-gray-50">
                        <div className="flex gap-2 overflow-x-auto">
                          {currentProperty.images.map((image, index) => (
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
                      {currentProperty.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{typeof currentProperty.location === 'object' ? currentProperty.location?.address : currentProperty.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-green-600">
                      {currentProperty.price}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <Bed className="text-blue-600" size={20} />
                      <span className="font-medium">
                        {currentProperty.features.beds} Beds
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="text-blue-600" size={20} />
                      <span className="font-medium">
                        {currentProperty.features.baths} Baths
                      </span>
                    </div>
                    {currentProperty.features.pool && (
                      <div className="flex items-center gap-2">
                        <Waves className="text-blue-600" size={20} />
                        <span className="font-medium">Pool Included</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Home className="text-blue-600" size={20} />
                      <span className="font-medium">
                        {currentProperty.features.type}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {currentProperty.fullDescription}
                    </p>
                  </div>

                  {/* Package Details - Only for Combo tab */}
                  {currentProperty.showPackageDetails &&
                    currentProperty.propertyDetails && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          Package Includes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {currentProperty.propertyDetails.map(
                            (property, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-lg p-6"
                              >
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                  {property.name}
                                </h4>
                                <p className="text-gray-600 text-sm mb-3">
                                  {property.description}
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                  <span>{property.beds} beds</span>
                                  <span>{property.baths} baths</span>
                                  <span>{property.type}</span>
                                  {property.pool && <span>Pool</span>}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Amenities */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Amenities
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentProperty.amenities && currentProperty.amenities.length > 0 ? (
                        currentProperty.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Star className="text-blue-600" size={16} />
                            <span className="text-gray-700">{amenity}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No amenities available</p>
                      )}
                    </div>
                  </div>
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
                                   value={emailAdd}
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
                                   onFocus={(e) => e.target.showPicker && e.target.showPicker()}
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
                   !fullName || !emailAdd || !mobile || !selectedDate || !selectedTime 
                   }
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                 Schedule Viewing
                 </button>
                 </div>
                {/* <div className="space-y-4">
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
                </div> */}
              </motion.div>

              {/* Contact Agent */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                {/* Agent Picture */}
                <div className="flex justify-center mb-4">
                  <img
                    src={agentimage}
                    alt={agent.name || "Agent"}
                    className="w-[150px] h-[150px] rounded-full object-cover shadow-md border-2 border-gray-200"
                  />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
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
                  <span className="font-semibold">
                    {bookingProperty?.title}
                  </span>
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
      <MortgageCalculator />
    </div>
  );
};

export default PropertyDetail;
