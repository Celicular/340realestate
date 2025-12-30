import React, { useState, useEffect } from 'react';
import { getSaleProperties, updateSalePropertyStatus, deleteSaleProperty } from '../../firebase/firestore';

const SaleApproval = () => {
  const [saleProperties, setSaleProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadSaleProperties();
  }, [filterStatus]);

  const loadSaleProperties = async () => {
    try {
      setLoading(true);
      console.log('Loading sale properties...');
      const filters = filterStatus !== 'all' ? { status: filterStatus } : {};
      const result = await getSaleProperties(filters);
      console.log('Sale properties result:', result);
      if (result.success) {
        setSaleProperties(result.data);
        console.log('Sale properties loaded:', result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error loading sale properties:', error);
      setError('Failed to load sale properties');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (propertyId, status) => {
    try {
      setProcessing(true);
      const result = await updateSalePropertyStatus(propertyId, status, adminNotes);
      if (result.success) {
        // Reload the properties
        await loadSaleProperties();
        setSelectedProperty(null);
        setAdminNotes('');
        alert(`Property ${status} successfully`);
      } else {
        alert(`Failed to ${status} property: ${result.error}`);
      }
    } catch (error) {
      alert(`Error updating property: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this sale property? This action cannot be undone.')) {
      return;
    }

    try {
      setProcessing(true);
      const result = await deleteSaleProperty(propertyId);
      
      if (result.success) {
        // Remove from local state
        setSaleProperties(prev => prev.filter(prop => prop.id !== propertyId));
        setSelectedProperty(null);
        alert('Sale property deleted successfully!');
      } else {
        alert('Failed to delete sale property: ' + result.error);
      }
    } catch (error) {
      alert('Error deleting sale property: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-dark"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Sale Property Approvals</h2>
        
        {/* Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved (Can Delete)</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      {saleProperties.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No sale properties submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {saleProperties.map((property) => (
            <div key={property.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {property.propertyInfo?.title || property.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {property.propertyInfo?.location || property.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: {property.propertyInfo?.price || property.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    Agent: {property.agentInfo?.name} ({property.agentInfo?.email})
                  </p>
                  <p className="text-sm text-gray-600">
                    Submitted: {formatDate(property.submittedAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(property.status)}
                  <button
                    onClick={() => setSelectedProperty(selectedProperty?.id === property.id ? null : property)}
                    className="text-brand-dark hover:text-brand-dark/70 text-sm"
                  >
                    {selectedProperty?.id === property.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>

              {selectedProperty?.id === property.id && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Property Details</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Category: {property.propertyInfo?.category || property.category}</p>
                        <p>Bedrooms: {property.features?.beds || property.beds}</p>
                        <p>Bathrooms: {property.features?.baths || property.baths}</p>
                        <p>Square Feet: {property.features?.sqft || property.sqft}</p>
                        <p>Pool: {property.features?.pool || property.pool ? 'Yes' : 'No'}</p>
                        <p>Type: {property.features?.type || property.type}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-1">
                        {(property.amenities || []).slice(0, 10).map((amenity, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {amenity}
                          </span>
                        ))}
                        {(property.amenities || []).length > 10 && (
                          <span className="text-xs text-gray-500">
                            +{(property.amenities || []).length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {property.description || property.fullDescription}
                    </p>
                  </div>

                  {property.additionalNotes && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                      <p className="text-sm text-gray-600">
                        {property.additionalNotes}
                      </p>
                    </div>
                  )}

                  {property.media?.imageLinks && property.media.imageLinks.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Image Links ({property.media.imageLinks.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {property.media.imageLinks.slice(0, 8).map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-brand-dark hover:underline truncate block"
                          >
                            Image {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {property.status === 'pending' && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Notes (Optional)
                        </label>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          rows="3"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                          placeholder="Add notes for the agent..."
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleStatusUpdate(property.id, 'approved')}
                          disabled={processing}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {processing ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(property.id, 'rejected')}
                          disabled={processing}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {processing ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  )}

                  {property.adminNotes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-1">Admin Notes</h4>
                      <p className="text-sm text-gray-600">{property.adminNotes}</p>
                    </div>
                  )}

                  {property.status === 'approved' && (
                    <div className="border-t border-gray-200 pt-4">
                      <button
                        onClick={() => handleDelete(property.id)}
                        disabled={processing}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {processing ? 'Processing...' : 'Delete Property'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SaleApproval;
