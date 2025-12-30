import React, { useState, useEffect } from 'react';
import { 
  getAllBookingRequestsForAgent, 
  getAllBookingRequestsForAdmin, 
  updateBookingRequestStatus 
} from '../../firebase/firestore';
import { getCurrentUser } from '../../utils/auth';
import { 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  MessageSquare
} from 'lucide-react';

const BookingRequestsManagement = ({ userRole = 'agent' }) => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const loadBookingRequests = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        
        let result;
        if (userRole === 'admin') {
          result = await getAllBookingRequestsForAdmin();
        } else {
          result = await getAllBookingRequestsForAgent(currentUser?.email);
        }
        
        if (result.success) {
          setBookingRequests(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch booking requests');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBookingRequests();
  }, [userRole]);

  const fetchBookingRequests = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      
      let result;
      if (userRole === 'admin') {
        result = await getAllBookingRequestsForAdmin();
      } else {
        result = await getAllBookingRequestsForAgent(currentUser?.email);
      }
      
      if (result.success) {
        setBookingRequests(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch booking requests');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingRequestId, propertyId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const result = await updateBookingRequestStatus(
        propertyId, 
        bookingRequestId, 
        newStatus, 
        adminNotes
      );
      
      if (result.success) {
        // Update the local state
        setBookingRequests(prev => 
          prev.map(request => 
            request.id === bookingRequestId 
              ? { ...request, status: newStatus, adminNotes } 
              : request
          )
        );
        setSelectedRequest(null);
        setAdminNotes('');
        alert(`Booking request ${newStatus} successfully!`);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      alert('Failed to update booking request: ' + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateField) => {
    if (!dateField) return 'N/A';
    
    let date;
    if (dateField.seconds) {
      date = new Date(dateField.seconds * 1000);
    } else if (dateField instanceof Date) {
      date = dateField;
    } else if (typeof dateField === 'string') {
      date = new Date(dateField);
    } else {
      return 'N/A';
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <Clock className="text-yellow-600" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredRequests = bookingRequests.filter(request => 
    statusFilter === 'all' || request.status === statusFilter
  );

  const stats = {
    total: bookingRequests.length,
    pending: bookingRequests.filter(r => r.status === 'pending').length,
    approved: bookingRequests.filter(r => r.status === 'approved').length,
    rejected: bookingRequests.filter(r => r.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading booking requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Booking Requests</h2>
        <button
          onClick={fetchBookingRequests}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === 'pending' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === 'approved' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Approved ({stats.approved})
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === 'rejected' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Rejected ({stats.rejected})
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Booking Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600">No booking requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {request.propertyName}
                  </h3>
                  {userRole === 'admin' && (
                    <p className="text-sm text-gray-600">
                      Agent: {request.agentName} ({request.agentEmail})
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(request.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm font-medium">{request.guestName || request.guestInfo?.name}</p>
                    <p className="text-xs text-gray-600">{request.numberOfGuests || request.guestInfo?.numberOfGuests} guests</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm">{request.email || request.guestInfo?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm">{request.phone || request.guestInfo?.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm font-medium">${request.totalAmount?.toFixed(2) || 'N/A'}</p>
                    <p className="text-xs text-gray-600">{request.nights || 0} nights</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Check-in</p>
                  <p className="text-sm text-gray-600">{request.checkInDate || request.bookingDetails?.checkInDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Check-out</p>
                  <p className="text-sm text-gray-600">{request.checkOutDate || request.bookingDetails?.checkOutDate}</p>
                </div>
              </div>

              {request.specialRequests && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 flex items-center">
                    <MessageSquare className="mr-1" size={16} />
                    Special Requests
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{request.specialRequests}</p>
                </div>
              )}

              {request.adminNotes && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-700">Admin Notes</p>
                  <p className="text-sm text-gray-600 mt-1">{request.adminNotes}</p>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Submitted: {formatDate(request.createdAt)}</span>
                {request.updatedAt && (
                  <span>Updated: {formatDate(request.updatedAt)}</span>
                )}
              </div>

              {/* Action Buttons */}
              {request.status === 'pending' && (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Status Update Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Update Booking Request Status
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Guest: {selectedRequest.guestName || selectedRequest.guestInfo?.name}<br />
              Property: {selectedRequest.propertyName}
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add notes about this decision..."
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleStatusUpdate(selectedRequest.id, selectedRequest.propertyId, 'approved')}
                disabled={updatingStatus}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {updatingStatus ? 'Updating...' : 'Approve'}
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedRequest.id, selectedRequest.propertyId, 'rejected')}
                disabled={updatingStatus}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {updatingStatus ? 'Updating...' : 'Reject'}
              </button>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setAdminNotes('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingRequestsManagement;