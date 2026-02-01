import React, { useState, useEffect } from 'react';
import { X, Check, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePropertyData } from '../../hooks/usePropertyData';

const CompareModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  // Single property type for both sides
  const [propertyType, setPropertyType] = useState('residential');

  // State for selected properties
  const [selectedProperty1, setSelectedProperty1] = useState(null);
  const [selectedProperty2, setSelectedProperty2] = useState(null);

  // State for search
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');

  // Fetch properties based on single type
  const { properties, loading } = usePropertyData(propertyType);

  // Reset selections when type changes
  useEffect(() => {
    setSelectedProperty1(null);
    setSelectedProperty2(null);
    setSearchQuery1('');
    setSearchQuery2('');
  }, [propertyType]);

  // Get property display name
  const getPropertyName = (property) => {
    return property?.name || property?.title || 'Unnamed Property';
  };

  // Get property price
  const getPropertyPrice = (property) => {
    const price = property?.price || property?.propertyPrice;
    if (typeof price === 'number') {
      return `$${price.toLocaleString()}`;
    }
    return price || 'Price not available';
  };

  // Get property image
  const getPropertyImage = (property) => {
    const images = property?.images || property?.propertyImages || [];
    return images[0] || '/placeholder-image.jpg';
  };

  // Filter properties based on search and exclusion
  const filteredProperties1 = properties.filter((prop) => {
    const name = getPropertyName(prop).toLowerCase();
    const matchesSearch = name.includes(searchQuery1.toLowerCase());
    const isNotSelected = !selectedProperty2 || prop.id !== selectedProperty2.id;
    const hasImage = getPropertyImage(prop) && getPropertyImage(prop) !== '/placeholder-image.jpg';
    return matchesSearch && isNotSelected && hasImage;
  });

  const filteredProperties2 = properties.filter((prop) => {
    const name = getPropertyName(prop).toLowerCase();
    const matchesSearch = name.includes(searchQuery2.toLowerCase());
    const isNotSelected = !selectedProperty1 || prop.id !== selectedProperty1.id;
    const hasImage = getPropertyImage(prop) && getPropertyImage(prop) !== '/placeholder-image.jpg';
    return matchesSearch && isNotSelected && hasImage;
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Compare Properties
            </h2>
            
            {/* Property Type Selector in Header */}
            <div className="flex items-center gap-3 ml-auto">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Type:
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm"
              >
                <option value="residential">Residential</option>
                <option value="land">Land</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {/* Two Column Layout with Separator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
              {/* Property 1 Side */}
              <div className="space-y-4 pb-8 md:pb-0 md:pr-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Property 1</h3>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery1}
                  onChange={(e) => setSearchQuery1(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                />

                {/* Property Cards Grid */}
                {loading ? (
                  <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
                    <Loader className="w-5 h-5 animate-spin" />
                    Loading properties...
                  </div>
                ) : filteredProperties1.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filteredProperties1.map((property) => (
                      <button
                        key={property.id}
                        onClick={() => setSelectedProperty1(property)}
                        className={`relative rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg ${
                          selectedProperty1?.id === property.id
                            ? 'ring-2 ring-blue-600 ring-offset-2'
                            : 'hover:scale-105'
                        }`}
                      >
                        {/* Image */}
                        <div className="aspect-square w-full bg-gray-200 overflow-hidden">
                          <img
                            src={getPropertyImage(property)}
                            alt={getPropertyName(property)}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Checkmark */}
                        {selectedProperty1?.id === property.id && (
                          <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1 text-white">
                            <Check className="w-5 h-5" />
                          </div>
                        )}

                        {/* Info */}
                        <div className="p-2 bg-white">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                            {getPropertyName(property)}
                          </h4>
                          <p className="text-sm font-bold text-emerald-600">
                            {getPropertyPrice(property)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    No properties found
                  </div>
                )}
              </div>

              {/* Separator - Vertical on Desktop, Horizontal on Mobile */}
              <div className="hidden md:block absolute left-1/2 top-32 bottom-0 w-px bg-gradient-to-b from-gray-300 via-gray-200 to-transparent transform -translate-x-1/2" />
              <div className="md:hidden h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6" />

              {/* Property 2 Side */}
              <div className="space-y-4 pt-6 md:pt-0 md:pl-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Property 2</h3>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery2}
                  onChange={(e) => setSearchQuery2(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                />

                {/* Property Cards Grid */}
                {loading ? (
                  <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
                    <Loader className="w-5 h-5 animate-spin" />
                    Loading properties...
                  </div>
                ) : filteredProperties2.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filteredProperties2.map((property) => (
                      <button
                        key={property.id}
                        onClick={() => setSelectedProperty2(property)}
                        className={`relative rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg ${
                          selectedProperty2?.id === property.id
                            ? 'ring-2 ring-blue-600 ring-offset-2'
                            : 'hover:scale-105'
                        }`}
                      >
                        {/* Image */}
                        <div className="aspect-square w-full bg-gray-200 overflow-hidden">
                          <img
                            src={getPropertyImage(property)}
                            alt={getPropertyName(property)}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Checkmark */}
                        {selectedProperty2?.id === property.id && (
                          <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1 text-white">
                            <Check className="w-5 h-5" />
                          </div>
                        )}

                        {/* Info */}
                        <div className="p-2 bg-white">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                            {getPropertyName(property)}
                          </h4>
                          <p className="text-sm font-bold text-emerald-600">
                            {getPropertyPrice(property)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    No properties found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 flex gap-3 justify-end p-6 flex-shrink-0 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button
              disabled={!selectedProperty1 || !selectedProperty2}
              onClick={() => {
                navigate('/comparison', {
                  state: {
                    property1: selectedProperty1,
                    property2: selectedProperty2,
                  },
                });
                onClose();
              }}
              className={`px-6 py-2 rounded-lg font-medium text-white transition-all ${
                selectedProperty1 && selectedProperty2
                  ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              View Detailed Comparison
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompareModal;
