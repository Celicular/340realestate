import React, { useState } from 'react';
import { addBookingRequest } from '../../firebase/firestore';
import { sendBookingNotificationToAgent, sendBookingConfirmationToGuest } from '../../services/emailService';
import { Calendar, Users, Mail, Phone, MessageSquare, Send } from 'lucide-react';

const BookingRequestForm = ({ rentalProperty, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const calculateStayDuration = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateDetailedPricing = () => {
    const nights = calculateStayDuration();
    const pricePerNight = rentalProperty?.pricePerNight || rentalProperty?.propertyInfo?.pricePerNight || 0;
    const baseRate = nights * pricePerNight;
    const cleaningFee = 200;
    const serviceFee = Math.round(baseRate * 0.05); // 5% service fee
    const taxes = Math.round((baseRate + cleaningFee + serviceFee) * 0.125); // 12.5% VI tax
    const totalAmount = baseRate + cleaningFee + serviceFee + taxes;

    return {
      baseRate,
      cleaningFee,
      serviceFee,
      taxes,
      totalAmount,
      nights
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const nights = calculateStayDuration();
      
      if (nights <= 0) {
        throw new Error('Please select valid check-in and check-out dates');
      }

      if (formData.numberOfGuests > (rentalProperty?.accommodation?.maxGuests || rentalProperty?.guests || 0)) {
        throw new Error(`Maximum guests allowed: ${rentalProperty?.accommodation?.maxGuests || rentalProperty?.guests}`);
      }

      // Calculate pricing
      const pricePerNight = rentalProperty?.pricePerNight || rentalProperty?.propertyInfo?.pricePerNight || 0;
      const baseRate = nights * pricePerNight;
      const cleaningFee = 200;
      const serviceFee = Math.round(baseRate * 0.05); // 5% service fee
      const taxes = Math.round((baseRate + cleaningFee + serviceFee) * 0.125); // 12.5% VI tax
      const totalAmount = baseRate + cleaningFee + serviceFee + taxes;

      // Determine season based on check-in date
      const checkInMonth = new Date(formData.checkInDate).getMonth() + 1;
      const season = (checkInMonth >= 12 || checkInMonth <= 4) ? 'inSeason' : 'offSeason';

      // Create booking data matching your Firestore structure
      const bookingData = {
        bookingDetails: {
          checkIn: new Date(formData.checkInDate),
          checkOut: new Date(formData.checkOutDate),
          guests: formData.numberOfGuests,
          season: season,
          totalNights: nights
        },
        guestInfo: {
          name: formData.guestName,
          email: formData.email,
          phone: formData.phone,
          message: formData.specialRequests || ''
        },
        pricing: {
          baseRate: baseRate.toString(),
          cleaningFee: cleaningFee,
          serviceFee: serviceFee,
          taxes: taxes,
          totalAmount: totalAmount.toString(),
          totalNights: nights
        },
        propertyDetails: {
          propertyId: rentalProperty.id,
          name: rentalProperty?.name || rentalProperty?.propertyInfo?.name,
          address: rentalProperty?.address || rentalProperty?.propertyInfo?.address,
          type: rentalProperty?.type || rentalProperty?.propertyInfo?.type,
          slug: rentalProperty?.slug || rentalProperty.id
        },
        metadata: {
          source: 'website',
          userAgent: navigator.userAgent
        },
        requestedAt: new Date(),
        status: 'pending',
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) // Expires in 48 hours
      };

      // Submit booking request to Firebase
      const result = await addBookingRequest(rentalProperty.id, bookingData);
      
      if (result.success) {
        // Send email notifications
        try {
          // Get agent email - check multiple possible locations
          const agentEmail = rentalProperty?.agentInfo?.email || 
                           rentalProperty?.agentEmail || 
                           'agent.demo@340realestate.com'; // Fallback to demo email

          console.log('Sending booking notification to agent:', agentEmail);
          
          // Send notification to agent
          const agentEmailResult = await sendBookingNotificationToAgent(
            bookingData, 
            rentalProperty, 
            agentEmail
          );

          if (agentEmailResult.success) {
            console.log('✅ Agent notification sent successfully:', agentEmailResult.message);
          } else {
            console.error('❌ Failed to send agent notification:', agentEmailResult.error);
          }

          // Send confirmation to guest
          const guestEmailResult = await sendBookingConfirmationToGuest(
            bookingData, 
            rentalProperty
          );

          if (guestEmailResult.success) {
            console.log('✅ Guest confirmation sent successfully:', guestEmailResult.message);
          } else {
            console.error('❌ Failed to send guest confirmation:', guestEmailResult.error);
          }

          // Show success message with email info
          const emailInfo = agentEmailResult.emailInfo;
          const successMessage = emailInfo 
            ? `Booking request submitted successfully! 

📧 The property agent (${emailInfo.agentName}) has been notified at ${emailInfo.sentTo}

🏡 Property: ${emailInfo.propertyName}

You will receive a response within 24 hours. A confirmation email has also been sent to ${formData.email}.`
            : 'Booking request submitted successfully! The property owner has been notified and will respond within 24 hours.';

          if (onSuccess) {
            onSuccess(result.id);
          } else {
            alert(successMessage);
          }

        } catch (emailError) {
          console.error('Email sending error:', emailError);
          
          // Even if email fails, booking was still submitted successfully
          const fallbackMessage = `Booking request submitted successfully! 

The property has been saved to our system (ID: ${result.id}). 

Note: There was an issue sending email notifications, but your booking request is still valid and will be processed manually.

You can contact us directly at +1 (340) 555-0123 for immediate assistance.`;

          if (onSuccess) {
            onSuccess(result.id);
          } else {
            alert(fallbackMessage);
          }
        }
        
        // Reset form
        setFormData({
          guestName: '',
          email: '',
          phone: '',
          checkInDate: '',
          checkOutDate: '',
          numberOfGuests: 1,
          specialRequests: ''
        });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nights = calculateStayDuration();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request to Book</h2>
        <h3 className="text-lg text-gray-700">{rentalProperty?.name || rentalProperty?.propertyInfo?.name}</h3>
        <p className="text-sm text-gray-600">{rentalProperty?.address || rentalProperty?.propertyInfo?.address}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Guest Information */}
        <div className="border-b pb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="mr-2" size={20} />
            Guest Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests *</label>
              <select
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[...Array(rentalProperty?.accommodation?.maxGuests || rentalProperty?.guests || 8)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Mail className="mr-1" size={16} />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Phone className="mr-1" size={16} />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Booking Dates */}
        <div className="border-b pb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="mr-2" size={20} />
            Booking Dates
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date *</label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date *</label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleChange}
                required
                min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {nights > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-medium">{nights} night{nights > 1 ? 's' : ''}</span>
                </div>
                <div className="border-t pt-2 space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Base Rate ({nights} nights):</span>
                    <span>${calculateDetailedPricing().baseRate}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Cleaning Fee:</span>
                    <span>${calculateDetailedPricing().cleaningFee}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Service Fee:</span>
                    <span>${calculateDetailedPricing().serviceFee}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">VI Hotel Tax (12.5%):</span>
                    <span>${calculateDetailedPricing().taxes}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold text-lg text-blue-600">${calculateDetailedPricing().totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Special Requests / Message */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="mr-2" size={20} />
            Message to Host
          </h4>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any special requests, questions, or additional information for the host..."
          />
        </div>

        {/* Terms Notice */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Payment Terms:</strong> 50% deposit required within 7-9 days to secure your reservation. 
            Balance due 60 days prior to arrival. Trip cancellation insurance is strongly recommended.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>{loading ? 'Submitting Request...' : 'Submit Booking Request'}</span>
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookingRequestForm;