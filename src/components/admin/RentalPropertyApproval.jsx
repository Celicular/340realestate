import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar
} from 'lucide-react';
import { 
  getRentalProperties, 
  updateRentalPropertyStatus, 
  deleteRentalProperty 
} from '../../firebase/firestore';

const RentalPropertyApproval = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState(false);

  const loadRentalProperties = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getRentalProperties({ status: statusFilter });
      if (result.success) {
        setProperties(result.data);
      }
    } catch (error) {
      console.error('Error loading rental properties:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadRentalProperties();
  }, [loadRentalProperties]);

  const handleStatusUpdate = async (propertyId, newStatus, adminNotes = '') => {
    setActionLoading(true);
    try {
      const result = await updateRentalPropertyStatus(propertyId, newStatus, adminNotes);
      if (result.success) {
        await loadRentalProperties();
        setShowModal(false);
        alert(`Property ${newStatus} successfully!`);
      } else {
        alert('Error updating property status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating property status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setActionLoading(true);
      try {
        const result = await deleteRentalProperty(propertyId);
        if (result.success) {
          await loadRentalProperties();
          setShowModal(false);
          alert('Property deleted successfully!');
        } else {
          alert('Error deleting property');
        }
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Error deleting property');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    const dateObj = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
    return dateObj.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Calendar className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const renderPropertyModal = () => {
    if (!selectedProperty) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedProperty.propertyInfo?.name || 'Rental Property'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted by {selectedProperty.agentInfo?.name} ({selectedProperty.agentInfo?.email})
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Property Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{selectedProperty.propertyInfo?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bedrooms:</span>
                    <span className="font-medium">{selectedProperty.propertyInfo?.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bathrooms:</span>
                    <span className="font-medium">{selectedProperty.propertyInfo?.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Square Feet:</span>
                    <span className="font-medium">{selectedProperty.propertyInfo?.squareFeet}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Guests:</span>
                    <span className="font-medium">{selectedProperty.propertyInfo?.maxGuests}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium">{selectedProperty.location?.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Neighborhood:</span>
                    <span className="font-medium">{selectedProperty.location?.neighborhood}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zipcode:</span>
                    <span className="font-medium">{selectedProperty.location?.zipCode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Pricing</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600 block">Nightly Rate</span>
                  <span className="font-medium text-lg">${selectedProperty.pricing?.nightly}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600 block">Weekly Rate</span>
                  <span className="font-medium text-lg">${selectedProperty.pricing?.weekly || 'N/A'}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600 block">Monthly Rate</span>
                  <span className="font-medium text-lg">${selectedProperty.pricing?.monthly || 'N/A'}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600 block">Security Deposit</span>
                  <span className="font-medium text-lg">${selectedProperty.pricing?.securityDeposit || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {selectedProperty.amenities && Object.keys(selectedProperty.amenities).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {Object.entries(selectedProperty.amenities).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {selectedProperty.propertyInfo?.description && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedProperty.propertyInfo.description}
                </p>
              </div>
            )}

            {/* Images */}
            {selectedProperty.images && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(selectedProperty.images).map(([key, url]) => (
                    url && (
                      <div key={key} className="relative">
                        <img
                          src={url}
                          alt={key}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                          {key}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                {selectedProperty.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(selectedProperty.id, 'approved')}
                      disabled={actionLoading}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedProperty.id, 'rejected')}
                      disabled={actionLoading}
                      className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(selectedProperty.id)}
                  disabled={actionLoading}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Submitted: {formatDate(selectedProperty.submittedAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rental Property Approvals</h2>
          <p className="text-gray-600">Review and approve rental property submissions</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading properties...</span>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
          <p className="text-gray-600">No rental properties with status "{statusFilter}" found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price/Night
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {property.images?.main ? (
                          <img
                            src={property.images.main}
                            alt={property.propertyInfo?.name}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                            <Home className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {property.propertyInfo?.name || 'Unnamed Property'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.location?.neighborhood || property.location?.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.agentInfo?.name}</div>
                      <div className="text-sm text-gray-500">{property.agentInfo?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.propertyInfo?.type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${property.pricing?.nightly || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                        {getStatusIcon(property.status)}
                        <span className="ml-1 capitalize">{property.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(property.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowModal(true);
                        }}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && renderPropertyModal()}
    </div>
  );
};

export default RentalPropertyApproval;