import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Home, Building, MapPin, DollarSign } from 'lucide-react';
import salesData from '../../../data/SalesData';

const ResidentialPortfolio = ({ data, onDelete, onAdd, onUpdate, canEdit, searchTerm, filterStatus }) => {
  const [activeSubTab, setActiveSubTab] = useState('villas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    // Filter data based on search term and status
    const filtered = {};
    Object.keys(data).forEach(category => {
      filtered[category] = data[category].filter(property => {
        const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            property.location?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || property.status?.toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
      });
    });
    setFilteredData(filtered);
  }, [data, searchTerm, filterStatus]);

  // Initialize with sales data if portfolio is empty
  useEffect(() => {
    if (Object.values(data).every(arr => arr.length === 0)) {
      initializeWithSalesData();
    }
  }, []);

  const initializeWithSalesData = () => {
    const categorizedData = {
      villas: salesData.filter(item => item.type === 'Villa'),
      condos: salesData.filter(item => item.type === 'Condo'),
      cottages: salesData.filter(item => item.type === 'Cottage'),
      houses: salesData.filter(item => item.type === 'House')
    };

    Object.keys(categorizedData).forEach(category => {
      categorizedData[category].forEach(property => {
        onAdd('residential', property, category);
      });
    });
  };

  const subTabs = [
    { id: 'villas', label: 'Villas', icon: Home, count: filteredData.villas?.length || 0 },
    { id: 'condos', label: 'Condos', icon: Building, count: filteredData.condos?.length || 0 },
    { id: 'cottages', label: 'Cottages', icon: Home, count: filteredData.cottages?.length || 0 },
    { id: 'houses', label: 'Houses', icon: Home, count: filteredData.houses?.length || 0 }
  ];

  const PropertyCard = ({ property, category }) => (
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
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>{property.beds || 0} beds</span>
          <span>{property.baths || 0} baths</span>
          <span>{property.sqft || 0} sqft</span>
        </div>
        
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
              onClick={() => onDelete('residential', property.id, category)}
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

  const AddPropertyModal = ({ isOpen, onClose, category }) => {
    const [formData, setFormData] = useState({
      title: '',
      location: '',
      price: '',
      beds: '',
      baths: '',
      sqft: '',
      image: '',
      status: 'Active',
      type: category.slice(0, -1) // Remove 's' from category name
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onAdd('residential', formData, category);
      setFormData({
        title: '',
        location: '',
        price: '',
        beds: '',
        baths: '',
        sqft: '',
        image: '',
        status: 'Active',
        type: category.slice(0, -1)
      });
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Add New {category.slice(0, -1)}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
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
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beds</label>
                <input
                  type="number"
                  value={formData.beds}
                  onChange={(e) => setFormData({...formData, beds: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Baths</label>
                <input
                  type="number"
                  value={formData.baths}
                  onChange={(e) => setFormData({...formData, baths: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sqft</label>
                <input
                  type="number"
                  value={formData.sqft}
                  onChange={(e) => setFormData({...formData, sqft: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
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
      {/* Sub-tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {subTabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeSubTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent size={18} />
              <span className="font-medium">{tab.label}</span>
              <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add Property Button */}
      {canEdit && (
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Add New {activeSubTab.slice(0, -1)}
          </button>
        </div>
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData[activeSubTab]?.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            category={activeSubTab}
          />
        ))}
      </div>

      {filteredData[activeSubTab]?.length === 0 && (
        <div className="text-center py-12">
          <Home size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : `No ${activeSubTab} have been added yet.`}
          </p>
        </div>
      )}

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        category={activeSubTab}
      />
    </div>
  );
};

export default ResidentialPortfolio;