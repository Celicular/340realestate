import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Building, MapPin, DollarSign } from 'lucide-react';

const CommercialPortfolio = ({ data, onDelete, onAdd, onUpdate, canEdit, searchTerm, filterStatus }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    // Filter data based on search term and status
    const filtered = data.filter(property => {
      const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || property.status?.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
    setFilteredData(filtered);
  }, [data, searchTerm, filterStatus]);

  const PropertyCard = ({ property }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img
          src={property.image || property.images?.[0] || '/api/placeholder/400/250'}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.status === 'Active' ? 'bg-green-100 text-green-800' :
            property.status === 'Sold' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {property.status || 'Active'}
          </span>
        </div>
        <div className="absolute top-4 left-4">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {property.commercialType || 'Commercial'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center text-green-600 mb-3">
          <DollarSign size={16} className="mr-1" />
          <span className="text-lg font-bold">
            {property.price ? `$${property.price.toLocaleString()}` : 'Price on request'}
          </span>
          {property.pricePerSqft && (
            <span className="text-sm text-gray-500 ml-2">
              (${property.pricePerSqft}/sqft)
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>{property.sqft || 0} sqft</span>
          <span>{property.yearBuilt || 'N/A'}</span>
          <span>{property.zoning || 'Commercial'}</span>
        </div>
        
        {property.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {property.description}
          </p>
        )}
        
        {canEdit && (
          <div className="flex space-x-2">
            <button
              onClick={() => setEditingProperty(property)}
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Edit size={16} className="mr-1" />
              Edit
            </button>
            <button
              onClick={() => onDelete('commercial', property.id)}
              className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  const AddPropertyModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
      title: '',
      location: '',
      price: '',
      sqft: '',
      yearBuilt: '',
      commercialType: '',
      zoning: '',
      description: '',
      image: '',
      status: 'Active'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onAdd('commercial', {
        ...formData,
        price: parseInt(formData.price),
        sqft: parseInt(formData.sqft),
        yearBuilt: parseInt(formData.yearBuilt),
        id: Date.now().toString()
      });
      setFormData({
        title: '',
        location: '',
        price: '',
        sqft: '',
        yearBuilt: '',
        commercialType: '',
        zoning: '',
        description: '',
        image: '',
        status: 'Active'
      });
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Add New Commercial Property</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
                <input
                  type="number"
                  value={formData.sqft}
                  onChange={(e) => setFormData({...formData, sqft: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                <input
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData({...formData, yearBuilt: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commercial Type</label>
                <select
                  value={formData.commercialType}
                  onChange={(e) => setFormData({...formData, commercialType: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="Office">Office</option>
                  <option value="Retail">Retail</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Mixed Use">Mixed Use</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Hotel">Hotel</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zoning</label>
                <input
                  type="text"
                  value={formData.zoning}
                  onChange={(e) => setFormData({...formData, zoning: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Sold">Sold</option>
                  <option value="Pending">Pending</option>
                  <option value="Off Market">Off Market</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Add Property
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Add Property Button */}
      {canEdit && (
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Add New Commercial Property
          </button>
        </div>
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <Building size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No commercial properties found</h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'No commercial properties have been added yet.'}
          </p>
        </div>
      )}

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default CommercialPortfolio;