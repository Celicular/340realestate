import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import BookingRequestForm from '../components/booking/BookingRequestForm';
import { 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Utensils,
  Calendar,
  DollarSign
} from 'lucide-react';

const RentalDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        const propertyDoc = await getDoc(doc(db, 'rentalProperties', id));
        
        if (propertyDoc.exists()) {
          setProperty({ id: propertyDoc.id, ...propertyDoc.data() });
        } else {
          setError('Property not found');
        }
      } catch (err) {
        setError('Failed to load property details');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const handleBookingSuccess = (bookingId) => {
    alert(`Booking request submitted successfully! Reference ID: ${bookingId}`);
    setShowBookingForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading property details...</span>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Property not found'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = property.imageLinks || property.media?.imageLinks || [];
  const amenities = property.amenities || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative h-96 bg-gray-300">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={property.name || property.propertyInfo?.name}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => 
                    prev === 0 ? images.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => 
                    prev === images.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  →
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <span className="text-white text-2xl font-semibold">
              {(property.name || property.propertyInfo?.name)?.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.name || property.propertyInfo?.name}
              </h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin size={20} className="mr-2" />
                <span>{property.address || property.propertyInfo?.address}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center">
                  <Users size={20} className="mr-2 text-gray-500" />
                  <span className="text-sm">
                    {property.guests || property.accommodation?.maxGuests} Guests
                  </span>
                </div>
                <div className="flex items-center">
                  <Bed size={20} className="mr-2 text-gray-500" />
                  <span className="text-sm">
                    {property.bedrooms || property.accommodation?.bedrooms} Bedrooms
                  </span>
                </div>
                <div className="flex items-center">
                  <Bath size={20} className="mr-2 text-gray-500" />
                  <span className="text-sm">
                    {property.bathrooms || property.accommodation?.bathrooms} Bathrooms
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-blue-600">
                    {property.type || property.propertyInfo?.type}
                  </span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {property.description || property.details}
                </p>
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.slice(0, 12).map((amenity, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      {amenity.includes('Wi-Fi') || amenity.includes('Wireless') ? (
                        <Wifi size={16} className="mr-2 text-green-600" />
                      ) : amenity.includes('Parking') || amenity.includes('Car') ? (
                        <Car size={16} className="mr-2 text-blue-600" />
                      ) : amenity.includes('Kitchen') ? (
                        <Utensils size={16} className="mr-2 text-orange-600" />
                      ) : (
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      )}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
                {amenities.length > 12 && (
                  <p className="text-sm text-gray-500 mt-3">
                    +{amenities.length - 12} more amenities
                  </p>
                )}
              </div>
            )}

            {/* Policies */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">House Rules & Policies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Property Rules</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Smoking: {property.smoking || property.policies?.smoking ? 'Allowed' : 'Not allowed'}</li>
                    <li>• Pets: {property.pets || property.policies?.pets ? 'Allowed' : 'Not allowed'}</li>
                    <li>• Parties: {property.party || property.policies?.party ? 'Allowed' : 'Not allowed'}</li>
                    <li>• Children: {property.children !== false && property.policies?.children !== false ? 'Welcome' : 'Not suitable'}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cancellation Policy</h4>
                  <p className="text-sm text-gray-700">
                    {property.cancellationPolicy || property.policies?.cancellationPolicy || 
                     'Please contact the property owner for cancellation terms.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">
                    ${property.pricePerNight || property.propertyInfo?.pricePerNight}
                  </span>
                  <span className="text-gray-600">per week</span>
                </div>
                
                {/* Rate Breakdown */}
                {(property.inSeasonRates || property.rates?.inSeason) && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>In Season (Dec-Apr):</span>
                      <span>${property.inSeasonRates?.oneToFour || property.rates?.inSeason?.oneToFour}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Off Season (May-Nov):</span>
                      <span>${property.offSeasonRates?.oneToFour || property.rates?.offSeason?.oneToFour}</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center"
              >
                <Calendar className="mr-2" size={20} />
                Request to Book
              </button>

              <div className="mt-4 text-center text-sm text-gray-600">
                <p>• No booking fees</p>
                <p>• 12.5% VI Hotel Tax applies</p>
                <p>• 50% deposit required</p>
              </div>

              {/* Contact Info */}
              {property.agentInfo && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium mb-2">Property Manager</h4>
                  <p className="text-sm text-gray-700">{property.agentInfo.name}</p>
                  <p className="text-sm text-gray-600">{property.agentInfo.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-screen overflow-y-auto">
            <BookingRequestForm
              rentalProperty={property}
              onSuccess={handleBookingSuccess}
              onCancel={() => setShowBookingForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalDetailPage;