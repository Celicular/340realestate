import React, { useState, useEffect } from "react";
import {
  getAllPortfolioItems,
  updatePortfolioItem,
  deletePortfolioItem,
} from "../../firebase/firestore";

const SoldApproval = () => {
  const [soldProperties, setSoldProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadSoldProperties();
  }, [filterStatus]);

  const loadSoldProperties = async () => {
    try {
      setLoading(true);
      console.log("Loading sold properties with recent-sale status...");
      const result = await getAllPortfolioItems({ status: "recent-sale" });
      console.log("Sold properties result:", result);

      if (result.success) {
        console.log("Sold properties loaded:", result.data);
        setSoldProperties(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to load sold properties");
      console.error("Error loading sold properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (propertyId, status) => {
    try {
      setProcessing(true);
      const result = await updatePortfolioItem(propertyId, {
        status: "recent-sale",
      });

      if (result.success) {
        // Remove the property from the list
        setSoldProperties((prev) =>
          prev.filter((prop) => prop.id !== propertyId)
        );
        setSelectedProperty(null);
        setAdminNotes("");
        alert(`Property marked as recent sale successfully!`);
      } else {
        alert(`Failed to update property: ${result.error}`);
      }
    } catch (error) {
      alert(`Error updating property status: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (propertyId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this sold property? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setProcessing(true);
      const result = await deletePortfolioItem(propertyId);

      if (result.success) {
        // Remove from local state
        setSoldProperties((prev) =>
          prev.filter((prop) => prop.id !== propertyId)
        );
        setSelectedProperty(null);
        alert("Property deleted successfully!");
      } else {
        alert("Failed to delete property: " + result.error);
      }
    } catch (error) {
      alert("Error deleting property: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading sold properties...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Sold Property Approval
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {soldProperties.length} properties
          </div>
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
      </div>

      {soldProperties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No sold properties pending approval
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {soldProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {property.propertyInfo?.title || property.title}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {property.propertyInfo?.location || property.location}
                  </p>
                  <p className="text-green-600 font-semibold mt-1">
                    {property.propertyInfo?.price || property.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(property.status)}
                  <button
                    onClick={() =>
                      setSelectedProperty(
                        selectedProperty?.id === property.id ? null : property
                      )
                    }
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {selectedProperty?.id === property.id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>
              </div>

              {/* Property Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {property.highlights?.beds && (
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {property.highlights.beds}
                    </div>
                    <div className="text-sm text-gray-600">Beds</div>
                  </div>
                )}
                {property.highlights?.baths && (
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {property.highlights.baths}
                    </div>
                    <div className="text-sm text-gray-600">Baths</div>
                  </div>
                )}
                {property.highlights?.sqft && (
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {property.highlights.sqft}
                    </div>
                    <div className="text-sm text-gray-600">Sq Ft</div>
                  </div>
                )}
                {property.highlights?.acres && (
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {property.highlights.acres}
                    </div>
                    <div className="text-sm text-gray-600">Acres</div>
                  </div>
                )}
              </div>

              {/* Agent Info */}
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="text-sm text-gray-600">
                  <strong>Submitted by:</strong> {property.agentInfo?.name} (
                  {property.agentInfo?.email})
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Submitted:</strong> {formatDate(property.submittedAt)}
                </div>
              </div>

              {/* Detailed View */}
              {selectedProperty?.id === property.id && (
                <div className="border-t pt-4 space-y-4">
                  {/* Description */}
                  {property.description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-700">{property.description}</p>
                    </div>
                  )}

                  {/* Highlights */}
                  {property.highlights && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Property Highlights
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {Object.entries(property.highlights).map(
                          ([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </span>
                              <span className="font-medium">{value}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {property.features &&
                    Object.keys(property.features).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Features
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          {Object.entries(property.features).map(
                            ([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600 capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}:
                                </span>
                                <span className="font-medium">{value}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Additional Info */}
                  {property.additionalInfo &&
                    Object.keys(property.additionalInfo).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Additional Information
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          {Object.entries(property.additionalInfo).map(
                            ([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600 capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}:
                                </span>
                                <span className="font-medium">{value}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Images */}
                  {property.media?.imageLinks &&
                    property.media.imageLinks.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Images ({property.media.imageLinks.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {property.media.imageLinks
                            .slice(0, 8)
                            .map((link, index) => (
                              <img
                                key={index}
                                src={link}
                                alt={`Property image ${index + 1}`}
                                className="w-full h-20 object-cover rounded"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Admin Notes */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Admin Notes (Optional)
                    </h4>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes for approval/rejection..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() =>
                        handleStatusUpdate(property.id, "approved")
                      }
                      disabled={processing}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {processing ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(property.id, "rejected")
                      }
                      disabled={processing}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {processing ? "Processing..." : "Reject"}
                    </button>
                  </div>

                  {/* Delete Button for Approved Properties */}
                  {property.status === "approved" && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <button
                        onClick={() => handleDelete(property.id)}
                        disabled={processing}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        {processing ? "Processing..." : "Delete Property"}
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

export default SoldApproval;
