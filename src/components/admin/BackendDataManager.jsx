import React, { useState } from 'react';
import { 
  Database, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Trash2,
  RefreshCw
} from 'lucide-react';
import { 
  addPortfolioItem, 
  getAllPortfolioItems,
  deletePortfolioItem 
} from '../../firebase/firestore';

const BackendDataManager = () => {
  const [migrating, setMigrating] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [backendStats, setBackendStats] = useState(null);

  // Helper function to create portfolio item
  const createPortfolioItem = (data, category, subcategory, status) => {
    const baseItem = {
      title: data.title,
      category: category,
      subcategory: subcategory,
      status: status,
      price: data.price,
      location: data.location || {},
      images: data.images || [],
      description: data.description || data.fullDescription || '',
      features: data.features || {},
      amenities: data.amenities || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'migrated-from-files'
    };

    if (category === 'residential') {
      baseItem.propertyType = subcategory;
      baseItem.showPackageDetails = data.showPackageDetails || false;
      baseItem.propertyDetails = data.propertyDetails || null;
    }

    if (category === 'land') {
      baseItem.overview = data.overview || {};
      baseItem.details = data.details || {};
      baseItem.mls = data.mls || '';
      baseItem.type = data.type || 'Land';
    }

    return baseItem;
  };

  const handleMigrateToBackend = async () => {
    setMigrating(true);
    setResult(null);
    
    try {
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      console.log('🚀 Starting backend migration...');

      // Import data dynamically to avoid initial load issues
      const { propertyData } = await import('../../data/SalesData');
      const { landProperties } = await import('../../data/LandSaleData');

      // Migrate residential properties
      console.log('🏠 Migrating residential properties to backend...');
      const residentialProperties = Object.values(propertyData);
      
      for (const property of residentialProperties) {
        try {
          let subcategory = property.category || 'house';
          if (subcategory === 'Villa') subcategory = 'villa';
          
          const portfolioItem = createPortfolioItem(
            property, 
            'residential', 
            subcategory, 
            'for-sale'
          );
          
          const result = await addPortfolioItem(portfolioItem, 'residential');
          if (result.success) {
            console.log(`✅ Migrated ${property.title}`);
            successCount++;
          } else {
            console.error(`❌ Failed to migrate ${property.title}:`, result.error);
            errors.push(`${property.title}: ${result.error}`);
            errorCount++;
          }
        } catch (error) {
          console.error(`❌ Error migrating ${property.title}:`, error);
          errors.push(`${property.title}: ${error.message}`);
          errorCount++;
        }
      }

      // Migrate land properties
      console.log('🏞️ Migrating land properties to backend...');
      for (const land of landProperties) {
        try {
          const portfolioItem = createPortfolioItem(
            land, 
            'land', 
            'land', 
            'for-sale'
          );
          
          const result = await addPortfolioItem(portfolioItem, 'land');
          if (result.success) {
            console.log(`✅ Migrated ${land.title}`);
            successCount++;
          } else {
            console.error(`❌ Failed to migrate ${land.title}:`, result.error);
            errors.push(`${land.title}: ${result.error}`);
            errorCount++;
          }
        } catch (error) {
          console.error(`❌ Error migrating ${land.title}:`, error);
          errors.push(`${land.title}: ${error.message}`);
          errorCount++;
        }
      }

      // Add sample recent sales
      console.log('💰 Adding sample recent sales...');
      const sampleSales = [
        {
          title: "Paradise Villa - SOLD",
          category: 'residential',
          subcategory: 'villa',
          status: 'recent-sale',
          price: "$1,850,000",
          soldPrice: "$1,825,000",
          soldDate: new Date('2024-09-15'),
          location: {
            address: "Cruz Bay, St. John, VI 00830",
            quarter: "Cruz Bay"
          },
          images: [],
          description: "Stunning 4-bedroom villa with ocean views - recently sold.",
          features: {
            beds: 4,
            baths: 3,
            pool: true,
            sqft: "3,200"
          },
          amenities: ["Ocean Views", "Private Pool", "Gourmet Kitchen"],
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'sample-recent-sale'
        },
        {
          title: "Coral Bay Premium Lot - SOLD",
          category: 'land',
          subcategory: 'land',
          status: 'recent-sale',
          price: "$395,000",
          soldPrice: "$385,000",
          soldDate: new Date('2024-08-20'),
          location: {
            address: "Coral Bay, St. John, VI 00830",
            quarter: "Coral Bay"
          },
          images: [],
          description: "Prime building lot with panoramic harbor views - recently sold.",
          overview: {
            lotSizeSqFt: 25000,
            lotSizeAcres: 0.57
          },
          details: {
            zoning: "R-1 Residential",
            access: "paved road"
          },
          mls: "SOLD-123",
          type: "Land",
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'sample-recent-sale'
        }
      ];

      for (const sale of sampleSales) {
        try {
          const result = await addPortfolioItem(sale, sale.category);
          if (result.success) {
            console.log(`✅ Added sample sale: ${sale.title}`);
            successCount++;
          } else {
            console.error(`❌ Failed to add sample sale ${sale.title}:`, result.error);
            errors.push(`${sale.title}: ${result.error}`);
            errorCount++;
          }
        } catch (error) {
          console.error(`❌ Error adding sample sale ${sale.title}:`, error);
          errors.push(`${sale.title}: ${error.message}`);
          errorCount++;
        }
      }

      if (errorCount === 0) {
        setResult({ 
          success: true, 
          message: `✅ Successfully migrated ${successCount} items to backend! System is now using Firestore data.` 
        });
      } else {
        setResult({ 
          success: false, 
          error: `⚠️ Migrated ${successCount} items, but ${errorCount} failed. Errors: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}` 
        });
      }

      // Refresh backend stats
      await checkBackendData();
    } catch (error) {
      console.error('💥 Migration failed:', error);
      setResult({ success: false, error: error.message });
    } finally {
      setMigrating(false);
    }
  };

  const handleClearBackendData = async () => {
    if (!window.confirm('⚠️ This will delete ALL portfolio data from the backend. Are you sure?')) {
      return;
    }

    setClearing(true);
    setResult(null);

    try {
      console.log('🗑️ Clearing backend data...');
      const result = await getAllPortfolioItems();
      
      if (result.success) {
        let deletedCount = 0;
        for (const item of result.data) {
          try {
            const deleteResult = await deletePortfolioItem(item.category, item.id);
            if (deleteResult.success) {
              deletedCount++;
              console.log(`🗑️ Deleted ${item.title}`);
            }
          } catch (error) {
            console.error(`Failed to delete ${item.title}:`, error);
          }
        }
        setResult({ 
          success: true, 
          message: `🗑️ Cleared ${deletedCount} items from backend` 
        });
      }

      await checkBackendData();
    } catch (error) {
      console.error('Error clearing backend data:', error);
      setResult({ success: false, error: error.message });
    } finally {
      setClearing(false);
    }
  };

  const checkBackendData = async () => {
    setChecking(true);
    try {
      console.log('📊 Checking backend data...');
      const result = await getAllPortfolioItems();
      
      if (result.success) {
        const stats = {
          total: result.data.length,
          residential: result.data.filter(item => item.category === 'residential').length,
          commercial: result.data.filter(item => item.category === 'commercial').length,
          land: result.data.filter(item => item.category === 'land').length,
          forSale: result.data.filter(item => item.status === 'for-sale').length,
          recentSales: result.data.filter(item => item.status === 'recent-sale').length
        };
        setBackendStats(stats);
        console.log('📊 Backend stats:', stats);
      } else {
        setBackendStats({ total: 0, residential: 0, commercial: 0, land: 0, forSale: 0, recentSales: 0 });
      }
    } catch (error) {
      console.error('Error checking backend data:', error);
      setBackendStats({ total: 0, residential: 0, commercial: 0, land: 0, forSale: 0, recentSales: 0 });
    } finally {
      setChecking(false);
    }
  };

  React.useEffect(() => {
    checkBackendData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Backend Data Management</h3>
        <p className="text-gray-600 mb-6">
          Migrate data from local files to Firestore backend. After migration, the system will only use backend data.
        </p>
      </div>

      {/* Backend Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Current Backend Data</h4>
          <button
            onClick={checkBackendData}
            disabled={checking}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
        
        {backendStats ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{backendStats.total}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{backendStats.residential}</div>
              <div className="text-sm text-gray-600">Residential</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{backendStats.commercial}</div>
              <div className="text-sm text-gray-600">Commercial</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{backendStats.land}</div>
              <div className="text-sm text-gray-600">Land</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">{backendStats.forSale}</div>
              <div className="text-sm text-gray-600">For Sale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{backendStats.recentSales}</div>
              <div className="text-sm text-gray-600">Recent Sales</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">Loading backend stats...</div>
        )}
      </div>

      {/* Migration Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Migrate Data */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Upload className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Migrate to Backend</h4>
              <p className="text-sm text-blue-700">Move data from files to Firestore</p>
            </div>
          </div>
          
          <button
            onClick={handleMigrateToBackend}
            disabled={migrating}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>{migrating ? 'Migrating...' : 'Migrate Data to Backend'}</span>
          </button>
        </div>

        {/* Clear Data */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-red-900">Clear Backend Data</h4>
              <p className="text-sm text-red-700">Remove all portfolio data</p>
            </div>
          </div>
          
          <button
            onClick={handleClearBackendData}
            disabled={clearing}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>{clearing ? 'Clearing...' : 'Clear All Backend Data'}</span>
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {result && (
        <div className={`border rounded-lg p-4 ${
          result.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start space-x-3">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            )}
            <div>
              <h4 className={`text-sm font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? 'Success' : 'Error'}
              </h4>
              <p className={`text-sm mt-1 ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.success ? result.message : result.error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Migration Instructions</h4>
        <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
          <li>Check current backend data status above</li>
          <li>Click "Migrate Data to Backend" to move file data to Firestore</li>
          <li>After migration, the Portfolio Management will use backend data only</li>
          <li>Use "Clear All Backend Data" only if you need to start fresh</li>
          <li>The system will automatically use backend data once migration is complete</li>
        </ol>
      </div>
    </div>
  );
};

export default BackendDataManager;