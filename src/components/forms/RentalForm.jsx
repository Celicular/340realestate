import React, { useState } from 'react';
import { addRentalProperty } from '../../firebase/firestore';
import { sendNewRentalNotificationEmail } from '../../services/emailService';

const RentalForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    pricePerNight: '',
    address: '',
    type: '',
    guests: '',
    bedrooms: '',
    bathrooms: '',
    details: '',
    amenities: [],
    inSeasonRates: {
      oneToFour: '',
      fiveToSix: ''
    },
    offSeasonRates: {
      oneToFour: '',
      fiveToSix: ''
    },
    smoking: false,
    pets: false,
    party: false,
    children: true,
    cancellationPolicy: '',
    damagePolicy: '',
    notes: '',
    images: [],
    imageLinks: []
  });

  const [imageLink, setImageLink] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // Generate slug from property name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove multiple hyphens
      .trim();
  };

  const accommodationTypes = [
    'Entire Place / Villa',
    'Private Room',
    'Shared Room',
    'Cottage',
    'Apartment',
    'House'
  ];

  const commonAmenities = [
    'Air Conditioning', 'Backyard', 'Basic Soaps', 'BBQ', 'Beach Chairs',
    'Beach Towels', 'Blender', 'Breakfast Bar', 'Car Recommended', 'Ceiling Fans',
    'Chairs', 'Clothes Dryer', 'Coffee Grinder', 'Deck/ Patio', 'Designer Furnishings',
    'Dining Table', 'Dishes & Utensils', 'Dishwasher', 'DVD Player', 'Exterior Lighting',
    'Fire Extinguisher', 'First Aid Kit', 'Free WIFI', 'Grill', 'Hair Dryer',
    'Hot Tub', 'Ice Maker', 'Iron & Board', 'Kettle', 'Kid Friendly', 'Kitchen',
    'Lawn/ Garden', 'Linens Provided', 'Living Room', 'Maid Service Available',
    'Microwave', 'Music Library', 'Outdoor Furniture', 'Oven', 'Pantry Items',
    'Paper Towels', 'Parking', 'Pool', 'Porch/ Veranda', 'Private Hot Tub',
    'Private Pool', 'Professionally Decorated', 'Refrigerator', 'Safe',
    'Satellite/ Cable', 'Seating For 6 People', 'Shampoo', 'Shower', 'Smart TV',
    'Smoke Detector', 'Spacious', 'Terrace', 'Toaster', 'Toilet Paper',
    'Towels Provided', 'Vaulted Ceiling', 'Washing Machine', 'Water Filter',
    'Wireless Internet'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const addImageLink = () => {
    if (imageLink.trim()) {
      setFormData(prev => ({
        ...prev,
        imageLinks: [...prev.imageLinks, imageLink.trim()]
      }));
      setImageLink('');
    }
  };

  const removeImageLink = (index) => {
    setFormData(prev => ({
      ...prev,
      imageLinks: prev.imageLinks.filter((_, i) => i !== index)
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      // Get agent info from localStorage
      const agentEmail = localStorage.getItem('userEmail');
      const agentRole = localStorage.getItem('userRole');
      
      // Get agent name or use email prefix as fallback
      let agentName = localStorage.getItem('userName');
      if (!agentName) {
        // Use email prefix (everything before @) as the name
        agentName = agentEmail ? agentEmail.split('@')[0] : 'Agent';
      }

      if (!agentEmail || !agentRole) {
        throw new Error('Agent information not found. Please login again.');
      }

      // Prepare data for Firebase
      const rentalData = {
        ...formData,
        // Add additional fields for better organization
        propertyInfo: {
          name: formData.name,
          slug: generateSlug(formData.name),
          type: formData.type,
          address: formData.address,
          pricePerNight: parseFloat(formData.pricePerNight) || 0
        },
        accommodation: {
          maxGuests: parseInt(formData.guests) || 0,
          bedrooms: parseInt(formData.bedrooms) || 0,
          bathrooms: parseInt(formData.bathrooms) || 0
        },
        rates: {
          inSeason: formData.inSeasonRates,
          offSeason: formData.offSeasonRates
        },
        policies: {
          smoking: formData.smoking,
          pets: formData.pets,
          party: formData.party,
          children: formData.children,
          cancellationPolicy: formData.cancellationPolicy,
          damagePolicy: formData.damagePolicy
        },
        media: {
          imageFiles: selectedFiles.map(file => ({ name: file.name, size: file.size })),
          imageLinks: formData.imageLinks
        },
        description: formData.details,
        additionalNotes: formData.notes
      };

      // Submit to Firebase
      const result = await addRentalProperty(rentalData, {
        email: agentEmail,
        name: agentName,
        role: agentRole
      });

      if (result.success) {
        setSubmitMessage({
          type: 'success',
          text: `Rental property submitted successfully! ID: ${result.id}`
        });
        
        // Send admin notification email
        try {
          const emailResult = await sendNewRentalNotificationEmail(rentalData);
          if (emailResult.success) {
            console.log('✅ Admin notification email sent successfully');
          } else {
            console.warn('⚠️ Admin notification email failed:', emailResult.error);
          }
        } catch (emailError) {
          console.error('❌ Error sending admin notification:', emailError);
        }
        
        // Reset form
        setFormData({
          name: '', pricePerNight: '', address: '', type: '',
          guests: '', bedrooms: '', bathrooms: '', details: '', amenities: [],
          inSeasonRates: { oneToFour: '', fiveToSix: '' },
          offSeasonRates: { oneToFour: '', fiveToSix: '' },
          smoking: false, pets: false, party: false, children: true,
          cancellationPolicy: '', damagePolicy: '', notes: '', images: [], imageLinks: []
        });
        setSelectedFiles([]);
        setImageLink('');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: `Submission failed: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Rental Property Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Week ($)</label>
              <input
                type="number"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                required
              >
                <option value="">Select Type</option>
                {accommodationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
              required
            />
          </div>
        </div>

        {/* Accommodation Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accommodation Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Guests</label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                required
              />
            </div>
          </div>
        </div>

        {/* Rates */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">In Season Rates</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">1-4 Persons ($)</label>
                  <input
                    type="number"
                    name="inSeasonRates.oneToFour"
                    value={formData.inSeasonRates.oneToFour}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">5-6 Persons ($)</label>
                  <input
                    type="number"
                    name="inSeasonRates.fiveToSix"
                    value={formData.inSeasonRates.fiveToSix}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Off Season Rates</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">1-4 Persons ($)</label>
                  <input
                    type="number"
                    name="offSeasonRates.oneToFour"
                    value={formData.offSeasonRates.oneToFour}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">5-6 Persons ($)</label>
                  <input
                    type="number"
                    name="offSeasonRates.fiveToSix"
                    value={formData.offSeasonRates.fiveToSix}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
          
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
            />
            {selectedFiles.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Selected Files:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-lg">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Image Links</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageLink}
                onChange={(e) => setImageLink(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
              />
              <button
                type="button"
                onClick={addImageLink}
                className="px-4 py-3 bg-brand-dark text-white rounded-lg hover:bg-brand-dark/90 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.imageLinks.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Image Links:</p>
                <div className="space-y-2">
                  {formData.imageLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-700 truncate">{link}</span>
                      <button
                        type="button"
                        onClick={() => removeImageLink(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
          
          {/* Custom Amenity Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Amenity</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter custom amenity..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const customAmenity = e.target.value.trim();
                    if (customAmenity && !formData.amenities.includes(customAmenity)) {
                      setFormData(prev => ({
                        ...prev,
                        amenities: [...prev.amenities, customAmenity]
                      }));
                      e.target.value = '';
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  const customAmenity = input.value.trim();
                  if (customAmenity && !formData.amenities.includes(customAmenity)) {
                    setFormData(prev => ({
                      ...prev,
                      amenities: [...prev.amenities, customAmenity]
                    }));
                    input.value = '';
                  }
                }}
                className="px-4 py-3 bg-brand-dark text-white rounded-lg hover:bg-brand-dark/90 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Selected Amenities Display */}
          {formData.amenities.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Amenities:</h4>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center bg-brand-dark/10 text-brand-dark px-3 py-1 rounded-lg">
                    <span className="text-sm">{amenity}</span>
                    <button
                      type="button"
                      onClick={() => handleAmenityChange(amenity)}
                      className="ml-2 text-brand-dark hover:text-brand-dark/70"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}


        </div>

        {/* Policies */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Policies & Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Property Rules</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="smoking"
                    checked={formData.smoking}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-brand-dark focus:ring-brand-dark"
                  />
                  <span className="text-sm text-gray-700">Smoking Allowed</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="pets"
                    checked={formData.pets}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-brand-dark focus:ring-brand-dark"
                  />
                  <span className="text-sm text-gray-700">Pets Allowed</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="party"
                    checked={formData.party}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-brand-dark focus:ring-brand-dark"
                  />
                  <span className="text-sm text-gray-700">Parties/Events Allowed</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="children"
                    checked={formData.children}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-brand-dark focus:ring-brand-dark"
                  />
                  <span className="text-sm text-gray-700">Children Welcome</span>
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Policies</h4>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Cancellation Policy</label>
                <textarea
                  name="cancellationPolicy"
                  value={formData.cancellationPolicy}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Damage Policy</label>
                <textarea
                  name="damagePolicy"
                  value={formData.damagePolicy}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Description</h3>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            rows="6"
            placeholder="Describe your property in detail..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
            required
          />
        </div>

        {/* Additional Notes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="4"
            placeholder="Any additional information, special instructions, or notes..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
          />
        </div>

        {/* Submit Message */}
        {submitMessage.text && (
          <div className={`p-4 rounded-lg ${
            submitMessage.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {submitMessage.text}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-brand-dark text-white hover:bg-brand-dark/90'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rental Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RentalForm;
