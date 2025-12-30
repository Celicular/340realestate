import React, { useState, useEffect } from 'react';
import { getRentalProperties, updateRentalPropertyStatus } from '../../firebase/firestore';

const QuickApprovalTool = () => {
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    setLoading(true);
    try {
      const result = await getRentalProperties({ status: 'pending' });
      if (result.success) {
        setPendingProperties(result.data);
      }
    } catch (error) {
      console.error('Error fetching pending properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveProperty = async (propertyId, propertyName) => {
    setUpdating(prev => ({ ...prev, [propertyId]: true }));
    
    try {
      const result = await updateRentalPropertyStatus(propertyId, 'approved', 'Auto-approved via debug tool');
      
      if (result.success) {
        alert(`✅ ${propertyName} approved successfully!`);
        // Refresh the list
        fetchPendingProperties();
      } else {
        alert(`❌ Failed to approve ${propertyName}: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ Error approving ${propertyName}: ${error.message}`);
    } finally {
      setUpdating(prev => ({ ...prev, [propertyId]: false }));
    }
  };

  const approveAll = async () => {
    for (const property of pendingProperties) {
      await approveProperty(property.id, property.propertyInfo?.name || 'Unnamed Property');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <p className="text-gray-600">🔄 Loading pending properties...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        ⚡ Quick Approval Tool
      </h3>
      
      <p className="text-gray-600 mb-4">
        Quickly approve pending rental properties to test the detail pages.
      </p>

      {pendingProperties.length === 0 ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">✅ No pending properties found. All properties are already processed!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Found {pendingProperties.length} pending propert{pendingProperties.length === 1 ? 'y' : 'ies'}
            </p>
            <button
              onClick={approveAll}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              Approve All
            </button>
          </div>

          <div className="space-y-2">
            {pendingProperties.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">
                    {property.propertyInfo?.name || 'Unnamed Property'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {property.propertyInfo?.type} • {property.location?.address}
                  </p>
                  {property.propertyInfo?.slug && (
                    <p className="text-xs text-blue-600">
                      Slug: {property.propertyInfo.slug}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => approveProperty(property.id, property.propertyInfo?.name || 'Property')}
                  disabled={updating[property.id]}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  {updating[property.id] ? 'Approving...' : 'Approve'}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              💡 After approval, properties will be visible at:
            </p>
            <ul className="text-xs text-blue-700 mt-1 ml-4 list-disc">
              <li><code>/rental/[slug]</code> - For RentalDetail page</li>
              <li><code>/villa/[slug]</code> - For VillaDetail page</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickApprovalTool;