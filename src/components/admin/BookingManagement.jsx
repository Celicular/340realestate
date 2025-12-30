import React, { useState, useEffect } from 'react';
import { getAllBookingRequestsForAdmin, updateBookingRequestStatus } from '../../firebase/firestore';
import { Calendar, Users, Mail, Phone, DollarSign, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const BookingManagement = () => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadBookingRequests();
  }, []);

  const loadBookingRequests = async () => {
    setLoading(true);
    try {
      const result = await getAllBookingRequestsForAdmin();
      
      if (result.success) {
        setBookingRequests(result.data);
      } else {
        console.error('Failed to load booking requests:', result.error);
      }
    } catch (error) {
      console.error('Error loading booking requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (propertyId, bookingId, newStatus, adminNotes = '') => {
    try {
      const result = await updateBookingRequestStatus(propertyId, bookingId, newStatus, adminNotes);
      
      if (result.success) {
        // Update local state
        setBookingRequests(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: newStatus, adminNotes, updatedAt: new Date() }
              : booking
          )
        );
        
        // Reload to get updated data
        loadBookingRequests();
        alert(`Booking request ${newStatus} successfully!`);
      } else {
        alert('Failed to update status: ' + result.error);
      }
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        text: 'Pending Review',
        icon: <AlertCircle size={12} />
      },
      approved: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        text: 'Approved',
        icon: <CheckCircle size={12} />
      },
      rejected: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        text: 'Rejected',
        icon: <XCircle size={12} />
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDaysBetween = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = checkIn.toDate ? checkIn.toDate() : new Date(checkIn);
    const checkOutDate = checkOut.toDate ? checkOut.toDate() : new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredBookings = bookingRequests.filter(booking => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  const getStatusStats = () => {
    const stats = {
      total: bookingRequests.length,
      pending: bookingRequests.filter(b => b.status === 'pending').length,
      approved: bookingRequests.filter(b => b.status === 'approved').length,
      rejected: bookingRequests.filter(b => b.status === 'rejected').length
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Booking Request Management</h3>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button 
            onClick={loadBookingRequests}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Requests</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Requests List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No booking requests found</h4>
          <p className="text-gray-600">
            {filterStatus === 'all' 
              ? 'No booking requests have been submitted yet.' 
              : `No ${filterStatus} booking requests found.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin size={18} className="text-gray-500" />
                      {booking.propertyName || 'Unnamed Property'}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Property ID: {booking.propertyId} • Agent: {booking.agentName} ({booking.agentEmail})
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(booking.status)}
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetails(true);
                      }}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Guest Information */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900 flex items-center gap-2">
                      <Users size={16} />
                      Guest Information
                    </h5>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Name:</span>
                        <span className="text-gray-600">{booking.guestInfo?.name}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <span className="text-gray-600">{booking.guestInfo?.email}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-gray-600">{booking.guestInfo?.phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900 flex items-center gap-2">
                      <Calendar size={16} />
                      Booking Details
                    </h5>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium text-gray-700">Check-in:</span>
                        <span className="ml-2 text-gray-600">{formatDate(booking.bookingDetails?.checkIn)}</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Check-out:</span>
                        <span className="ml-2 text-gray-600">{formatDate(booking.bookingDetails?.checkOut)}</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <span className="ml-2 text-gray-600">{calculateDaysBetween(booking.bookingDetails?.checkIn, booking.bookingDetails?.checkOut)} nights</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Guests:</span>
                        <span className="ml-2 text-gray-600">{booking.bookingDetails?.guests} guest{booking.bookingDetails?.guests > 1 ? 's' : ''}</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Season:</span>
                        <span className="ml-2 text-gray-600 capitalize">{booking.bookingDetails?.season}</span>
                      </p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900 flex items-center gap-2">
                      <DollarSign size={16} />
                      Pricing Breakdown
                    </h5>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="text-gray-700">Base Rate:</span>
                        <span className="text-gray-900 font-medium">${booking.pricing?.baseRate}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-700">Cleaning Fee:</span>
                        <span className="text-gray-900">${booking.pricing?.cleaningFee}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-700">Service Fee:</span>
                        <span className="text-gray-900">${booking.pricing?.serviceFee}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-700">VI Hotel Tax:</span>
                        <span className="text-gray-900">${booking.pricing?.taxes}</span>
                      </p>
                      <div className="border-t pt-2">
                        <p className="flex justify-between font-semibold">
                          <span className="text-gray-900">Total Amount:</span>
                          <span className="text-blue-600 text-lg">${booking.pricing?.totalAmount}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Message */}
                {booking.guestInfo?.message && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h6 className="font-medium text-gray-900 mb-2">Guest Message:</h6>
                    <p className="text-sm text-gray-700">{booking.guestInfo.message}</p>
                  </div>
                )}

                {/* Admin Actions */}
                {booking.status === 'pending' && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleStatusUpdate(booking.propertyId, booking.id, 'approved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Approve Booking
                    </button>
                    <button
                      onClick={() => {
                        const notes = prompt('Enter rejection reason (optional):');
                        if (notes !== null) {
                          handleStatusUpdate(booking.propertyId, booking.id, 'rejected', notes);
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <XCircle size={16} />
                      Reject Booking
                    </button>
                  </div>
                )}

                {/* Admin Notes */}
                {booking.status !== 'pending' && booking.adminNotes && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h6 className="font-medium text-blue-900 mb-1">Admin Notes:</h6>
                    <p className="text-sm text-blue-800">{booking.adminNotes}</p>
                    <p className="text-xs text-blue-600 mt-2">
                      Updated: {formatDateTime(booking.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Booking Request Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* All booking details would go here - similar to above but in modal format */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{selectedBooking.propertyName}</h4>
                  <p className="text-gray-600">Booking ID: {selectedBooking.id}</p>
                  <p className="text-gray-600">Property ID: {selectedBooking.propertyId}</p>
                </div>
                
                {/* You can expand this with more detailed view */}
                <div className="text-center">
                  <p className="text-gray-600">Full booking details view would be implemented here.</p>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;