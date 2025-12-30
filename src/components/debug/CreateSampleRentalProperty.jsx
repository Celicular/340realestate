import React, { useState } from 'react';
import { addRentalProperty } from '../../firebase/firestore';
import { getCurrentUser } from '../../utils/auth';

const CreateSampleRentalProperty = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const currentUser = getCurrentUser();

  const sampleProperty = {
    // Property Basic Info
    propertyInfo: {
      name: 'Sunset Villa Paradise',
      slug: 'sunset-villa-paradise',
      description: 'Stunning oceanfront villa with breathtaking sunset views. This luxurious 3-bedroom, 2-bathroom villa features an infinity pool, gourmet kitchen, and private beach access. Perfect for families or groups seeking an unforgettable Caribbean experience.',
      type: 'villa'
    },
    
    // Location
    location: {
      address: '123 Sunset Bay Drive, St. John, USVI 00830',
      neighborhood: 'Sunset Bay',
      city: 'St. John',
      state: 'USVI',
      zipCode: '00830'
    },
    
    // Property Details
    details: {
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: '2500',
      furnished: true,
      petFriendly: false,
      smokingAllowed: false,
      maxOccupancy: 6,
      minimumStay: 3,
      checkInTime: '15:00',
      checkOutTime: '11:00'
    },
    
    // Pricing
    pricing: {
      nightly: '450',
      weekly: '2800',
      monthly: '10500',
      cleaningFee: '200',
      securityDeposit: '500'
    },
    
    // Amenities
    amenities: {
      wifi: true,
      airConditioning: true,
      heating: false,
      kitchen: true,
      parking: true,
      pool: true,
      hotTub: true,
      beachAccess: true,
      oceanView: true,
      balcony: true,
      washer: true,
      dryer: true,
      tv: true,
      fireplace: false,
      gym: false,
      elevator: false,
      wheelchairAccessible: false,
      securitySystem: true
    },
    
    // Images
    images: {
      main: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80'
      ]
    },
    
    // Policies
    policies: {
      cancellationPolicy: 'Moderate - Full refund 5 days prior to arrival',
      houseRules: 'No smoking inside. No parties or events. Quiet hours from 10 PM to 8 AM.',
      damagePolicy: 'Guests are responsible for any damage beyond normal wear and tear.',
      childrenAllowed: true,
      partyAllowed: false
    }
  };

  const sampleProperty2 = {
    propertyInfo: {
      name: 'Coral Bay Retreat',
      slug: 'coral-bay-retreat',
      description: 'Charming 2-bedroom cottage nestled in the heart of Coral Bay. Features a private garden, outdoor dining area, and stunning mountain views. Walking distance to restaurants and shops.',
      type: 'cottage'
    },
    
    location: {
      address: '456 Coral Bay Road, St. John, USVI 00830',
      neighborhood: 'Coral Bay',
      city: 'St. John',
      state: 'USVI',
      zipCode: '00830'
    },
    
    details: {
      bedrooms: 2,
      bathrooms: 1.5,
      squareFeet: '1200',
      furnished: true,
      petFriendly: true,
      smokingAllowed: false,
      maxOccupancy: 4,
      minimumStay: 2,
      checkInTime: '16:00',
      checkOutTime: '10:00'
    },
    
    pricing: {
      nightly: '250',
      weekly: '1600',
      monthly: '6000',
      cleaningFee: '150',
      securityDeposit: '300'
    },
    
    amenities: {
      wifi: true,
      airConditioning: false,
      heating: false,
      kitchen: true,
      parking: true,
      pool: false,
      hotTub: false,
      beachAccess: false,
      oceanView: false,
      balcony: true,
      washer: true,
      dryer: true,
      tv: true,
      fireplace: false,
      gym: false,
      elevator: false,
      wheelchairAccessible: false,
      securitySystem: false
    },
    
    images: {
      main: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80',
        'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80',
        '',
        ''
      ]
    },
    
    policies: {
      cancellationPolicy: 'Flexible - Full refund 24 hours prior to arrival',
      houseRules: 'No smoking inside. Pets welcome with additional fee. Please respect quiet hours.',
      damagePolicy: 'Standard damage policy applies.',
      childrenAllowed: true,
      partyAllowed: false
    }
  };

  const handleCreateSample = async (propertyData, propertyName) => {
    setLoading(true);
    setResult(null);
    
    try {
      const agentInfo = {
        email: currentUser?.email || 'demo@340realestate.com',
        name: currentUser?.displayName || 'Demo Agent',
        role: 'agent'
      };

      const result = await addRentalProperty(propertyData, agentInfo);
      
      if (result.success) {
        setResult({
          success: true,
          message: `✅ ${propertyName} created successfully! Property ID: ${result.id}`,
          property: propertyData
        });
      } else {
        setResult({
          success: false,
          message: `❌ Failed to create ${propertyName}: ${result.error}`
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: `❌ Error creating ${propertyName}: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        🏗️ Create Sample Rental Properties
      </h3>
      
      <p className="text-gray-600 mb-6">
        Create sample rental properties with the correct data structure to test the RentalDetail and VillaDetail pages.
      </p>

      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={() => handleCreateSample(sampleProperty, 'Sunset Villa Paradise')}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Villa Sample'}
          </button>
          
          <button
            onClick={() => handleCreateSample(sampleProperty2, 'Coral Bay Retreat')}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Cottage Sample'}
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p>{result.message}</p>
            {result.success && result.property && (
              <div className="mt-2 text-sm">
                <p>📋 Slug: <code>{result.property.propertyInfo.slug}</code></p>
                <p>🔗 Test URLs:</p>
                <ul className="ml-4 list-disc">
                  <li><code>/rental/{result.property.propertyInfo.slug}</code></li>
                  <li><code>/villa/{result.property.propertyInfo.slug}</code></li>
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">📝 Note:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Properties are created with status 'pending' by default</li>
            <li>• You'll need to approve them in the admin dashboard</li>
            <li>• Only approved properties will be visible on detail pages</li>
            <li>• Navigate to <code>/admin</code> to approve the properties</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateSampleRentalProperty;