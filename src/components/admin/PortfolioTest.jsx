import React from 'react';
import { addPortfolioItem } from '../../firebase/firestore';

const PortfolioTest = () => {
  const testAddPortfolioItem = async () => {
    const testItem = {
      title: "Test Villa",
      category: 'residential',
      subcategory: 'villa',
      status: 'for-sale',
      price: "$1,500,000",
      location: {
        address: "Test Address, St. John, VI 00830",
        quarter: "Test Quarter"
      },
      images: [],
      description: "Test property description",
      features: {
        beds: 3,
        baths: 2,
        sqft: "2,000",
        pool: true
      },
      amenities: ["Ocean Views", "Pool"],
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'manual'
    };

    try {
      const result = await addPortfolioItem(testItem, 'residential');
      console.log('Test result:', result);
      alert(result.success ? 'Success!' : 'Error: ' + result.error);
    } catch (error) {
      console.error('Test error:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Portfolio System Test</h3>
      <button
        onClick={testAddPortfolioItem}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Test Add Portfolio Item
      </button>
    </div>
  );
};

export default PortfolioTest;