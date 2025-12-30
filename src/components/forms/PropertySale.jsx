import React, { useState } from 'react';
import { addSaleProperty } from '../../firebase/firestore';

const PropertySale = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    address: '',
    location: '',
    beds: '',
    baths: '',
    sqft: '',
    pool: false,
    type: 'Active',
    fullDescription: '',
    amenities: [],
    images: [],
    imageLinks: [],
    status: 'For Sale',
    showPackageDetails: false,
    additionalNotes: ''
  });

  const [imageLink, setImageLink] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // Generate slug from property title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove multiple hyphens
      .trim();
  };

  const propertyCategories = [
    'Villa',
    'Cottage',
    'House',
    'Condo',
    'Apartment',
    'Land',
    'Commercial',
    'Other'
  ];

  const commonAmenities = [
    'Air Conditioning', 'Backyard', 'BBQ', 'Beach Access', 'Beach Chairs',
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
    'Wireless Internet', 'Gated Entry', 'Solar Panels', 'Cistern', 'Grey Water System',
    'Ocean View', 'Mountain View', 'Garden View', 'Furnished', 'Unfurnished',
    'Pet Friendly', 'Smoking Allowed', 'Wheelchair Accessible', 'Storage',
    'Workshop', 'Garage', 'Carport', 'Boat Dock', 'Dock Access'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
      const saleData = {
        ...formData,
        // Add additional fields for better organization
        propertyInfo: {
          title: formData.title,
          slug: generateSlug(formData.title),
          category: formData.category,
          address: formData.address,
          location: formData.location,
          price: formData.price
        },
        features: {
          beds: parseInt(formData.beds) || 0,
          baths: parseInt(formData.baths) || 0,
          sqft: formData.sqft,
          pool: formData.pool,
          type: formData.type
        },
        media: {
          imageFiles: selectedFiles.map(file => ({ name: file.name, size: file.size })),
          imageLinks: formData.imageLinks
        },
        description: formData.fullDescription,
        additionalNotes: formData.additionalNotes
      };

      // Submit to Firebase
      console.log('Submitting sale property to Firebase:', saleData);
      const result = await addSaleProperty(saleData, {
        email: agentEmail,
        name: agentName,
        role: agentRole
      });
      console.log('Sale property submission result:', result);

      if (result.success) {
        setSubmitMessage({
          type: 'success',
          text: `Property sale submitted successfully! ID: ${result.id}`
        });
        
        // Reset form
        setFormData({
          title: '', category: '', price: '', address: '', location: '',
          beds: '', baths: '', sqft: '', pool: false, type: 'Active',
          fullDescription: '', amenities: [], images: [], imageLinks: [],
          status: 'For Sale', showPackageDetails: false, additionalNotes: ''
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
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Property Sale Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                required
              >
                <option value="">Select Category</option>
                {propertyCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., $1,695,000"
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
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Sold">Sold</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location (Full Address)</label>
            <textarea
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              rows="2"
              placeholder="e.g., 6B-22 St. Quaco & Zimmerman, St John, VI 00830"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
              required
            />
          </div>
        </div>

        {/* Property Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <input
                type="number"
                name="beds"
                value={formData.beds}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
              <input
                type="number"
                name="baths"
                value={formData.baths}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
              <input
                type="text"
                name="sqft"
                value={formData.sqft}
                onChange={handleInputChange}
                placeholder="e.g., 3,308"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="pool"
                  checked={formData.pool}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-brand-dark focus:ring-brand-dark"
                />
                <span className="text-sm text-gray-700">Pool</span>
              </label>
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

        {/* Property Description */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Description</h3>
          <textarea
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleInputChange}
            rows="8"
            placeholder="Describe the property in detail, including features, views, amenities, and any special characteristics..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
            required
          />
        </div>

        {/* Additional Notes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            rows="4"
            placeholder="Any additional information, special instructions, or notes for the admin..."
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
            {isSubmitting ? 'Submitting...' : 'Submit Property Sale'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertySale;
