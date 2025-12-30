import React, { useEffect, useState } from 'react';
import { getRentalProperties } from '../../firebase/firestore';

const RentalDataChecker = () => {
  const [rentalProperties, setRentalProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching rental properties for debugging...');
        
        // Fetch all rental properties (not just approved ones)
        const allPropertiesResult = await getRentalProperties();
        console.log('📊 All rental properties result:', allPropertiesResult);
        
        // Fetch only approved properties
        const approvedPropertiesResult = await getRentalProperties({ status: 'approved' });
        console.log('✅ Approved rental properties result:', approvedPropertiesResult);
        
        if (allPropertiesResult.success) {
          setRentalProperties(allPropertiesResult.data);
          console.log(`📋 Total properties found: ${allPropertiesResult.data.length}`);
          console.log(`✅ Approved properties found: ${approvedPropertiesResult.success ? approvedPropertiesResult.data.length : 0}`);
        } else {
          setError(allPropertiesResult.error);
        }
      } catch (err) {
        console.error('❌ Error fetching rental properties:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800">🔍 Checking rental properties database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">❌ Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        🏠 Rental Properties Database Status
      </h3>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-lg font-semibold text-gray-700">
          📊 Total Properties Found: {rentalProperties.length}
        </p>
        <p className="text-sm text-gray-600">
          ✅ Approved: {rentalProperties.filter(p => p.status === 'approved').length} | 
          ⏳ Pending: {rentalProperties.filter(p => p.status === 'pending').length} | 
          ❌ Rejected: {rentalProperties.filter(p => p.status === 'rejected').length}
        </p>
      </div>

      {rentalProperties.length === 0 ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800">
            ⚠️ No rental properties found in the database. 
            You need to add some properties through the agent dashboard.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rentalProperties.map((property, index) => (
            <div key={property.id || index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-800">
                  {property.propertyInfo?.name || 'Unnamed Property'} 
                  <span className="ml-2 text-sm text-gray-500">({property.status})</span>
                </h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  property.status === 'approved' ? 'bg-green-100 text-green-800' :
                  property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {property.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>🏠 Property Info:</strong>
                  <p className="text-gray-600">Name: {property.propertyInfo?.name || 'N/A'}</p>
                  <p className="text-gray-600">Type: {property.propertyInfo?.type || 'N/A'}</p>
                  <p className="text-gray-600">Slug: {property.propertyInfo?.slug || 'N/A'}</p>
                </div>
                
                <div>
                  <strong>📍 Location:</strong>
                  <p className="text-gray-600">{property.location?.address || 'N/A'}</p>
                  <p className="text-gray-600">{property.location?.city}, {property.location?.state}</p>
                </div>
                
                <div>
                  <strong>🛏️ Details:</strong>
                  <p className="text-gray-600">
                    {property.details?.maxOccupancy || 'N/A'} guests, 
                    {property.details?.bedrooms || 'N/A'} beds, 
                    {property.details?.bathrooms || 'N/A'} baths
                  </p>
                </div>
                
                <div>
                  <strong>💰 Pricing:</strong>
                  <p className="text-gray-600">
                    Nightly: ${property.pricing?.nightly || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    Weekly: ${property.pricing?.weekly || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <strong>🖼️ Images:</strong>
                  <p className="text-gray-600">
                    Main: {property.images?.main ? '✅' : '❌'}
                  </p>
                  <p className="text-gray-600">
                    Gallery: {property.images?.gallery?.filter(img => img && img !== '').length || 0} images
                  </p>
                </div>
                
                <div>
                  <strong>👤 Agent:</strong>
                  <p className="text-gray-600">{property.agentInfo?.name || 'N/A'}</p>
                  <p className="text-gray-600">{property.agentInfo?.email || 'N/A'}</p>
                </div>
              </div>

              {property.status === 'approved' && property.propertyInfo?.slug && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-blue-600">
                    🔗 Available at: <code>/rental/{property.propertyInfo.slug}</code> and <code>/villa/{property.propertyInfo.slug}</code>
                  </p>
                </div>
              )}

              {property.status === 'approved' && !property.propertyInfo?.slug && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-red-600">
                    ⚠️ Property approved but missing slug - details page won't work
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-semibold text-blue-800 mb-2">🔧 Debug Information:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• VillaDetail.jsx fetches from rentalProperties collection with status: 'approved'</li>
          <li>• RentalDetail.jsx fetches from rentalProperties collection with status: 'approved'</li>
          <li>• Both pages look for properties by slug matching the URL parameter</li>
          <li>• URLs should be: /rental/[slug] or /villa/[slug]</li>
          <li>• Make sure properties have proper slugs and are approved</li>
        </ul>
      </div>
    </div>
  );
};

export default RentalDataChecker;