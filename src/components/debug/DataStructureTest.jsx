import React, { useEffect, useState } from 'react';
import { getRentalProperties } from '../../firebase/firestore';

const DataStructureTest = () => {
  const [rentalProperties, setRentalProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔍 Fetching rental properties for debugging...");
        const result = await getRentalProperties({ status: "approved" });
        
        if (result.success) {
          setRentalProperties(result.data);
          console.log("📋 Rental properties fetched:", result.data);
          
          // Log the structure of the first property for debugging
          if (result.data.length > 0) {
            console.log("🏠 First property structure:", result.data[0]);
          }
        } else {
          setError(result.error);
          console.error("❌ Failed to fetch rental properties:", result.error);
        }
      } catch (err) {
        setError(err.message);
        console.error("❌ Error fetching rental properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Loading Data Structure Test...</h3>
        <p className="text-blue-600">Fetching rental properties from Firestore...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Data Structure Test - {rentalProperties.length} Properties Found
      </h3>
      
      {rentalProperties.length === 0 ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800">No approved rental properties found in the database.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rentalProperties.map((property, index) => (
            <div key={property.id || index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-semibold text-gray-800 mb-2">
                Property {index + 1}: {property.propertyInfo?.name || 'Unnamed Property'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Location:</strong>
                  <p className="text-gray-600">{property.location?.address || 'No address'}</p>
                </div>
                
                <div>
                  <strong>Type:</strong>
                  <p className="text-gray-600">{property.propertyInfo?.type || 'No type'}</p>
                </div>
                
                <div>
                  <strong>Accommodation:</strong>
                  <p className="text-gray-600">
                    {property.details?.maxOccupancy || 'N/A'} guests, 
                    {property.details?.bedrooms || 'N/A'} beds, 
                    {property.details?.bathrooms || 'N/A'} baths
                  </p>
                </div>
                
                <div>
                  <strong>Pricing:</strong>
                  <p className="text-gray-600">
                    Weekly: ${property.pricing?.weekly || 'N/A'}, 
                    Nightly: ${property.pricing?.nightly || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <strong>Images:</strong>
                  <p className="text-gray-600">
                    Main: {property.images?.main ? '✅' : '❌'}, 
                    Gallery: {property.images?.gallery?.length || 0} images
                  </p>
                </div>
                
                <div>
                  <strong>Agent:</strong>
                  <p className="text-gray-600">
                    {property.agentInfo?.name || 'No agent'} ({property.agentInfo?.email || 'No email'})
                  </p>
                </div>
                
                <div>
                  <strong>Status:</strong>
                  <span className={`px-2 py-1 rounded text-xs ${
                    property.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status || 'unknown'}
                  </span>
                </div>
                
                <div>
                  <strong>Amenities:</strong>
                  <p className="text-gray-600">
                    {property.amenities ? 
                      Object.entries(property.amenities).filter(([_, value]) => value === true).length + ' amenities'
                      : 'No amenities data'
                    }
                  </p>
                </div>
              </div>
              
              {/* Show raw data structure for debugging */}
              <details className="mt-3">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                  View Raw Data Structure
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 text-xs overflow-auto max-h-40">
                  {JSON.stringify(property, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataStructureTest;