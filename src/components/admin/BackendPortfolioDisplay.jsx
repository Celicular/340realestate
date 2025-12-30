import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Home, 
  MapPin, 
  DollarSign,
  Calendar,
  Tag,
  RefreshCw
} from 'lucide-react';
import { getAllPortfolioItems } from '../../firebase/firestore';

const BackendPortfolioDisplay = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    residential: 0,
    commercial: 0,
    land: 0,
    forSale: 0,
    recentSales: 0
  });

  const loadPortfolioFromBackend = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading portfolio from backend...');
      const result = await getAllPortfolioItems();
      
      if (result.success) {
        console.log(`✅ Loaded ${result.data.length} items from backend`);
        setPortfolioItems(result.data);
        
        // Calculate stats
        const stats = {
          total: result.data.length,
          residential: result.data.filter(item => item.category === 'residential').length,
          commercial: result.data.filter(item => item.category === 'commercial').length,
          land: result.data.filter(item => item.category === 'land').length,
          forSale: result.data.filter(item => item.status === 'for-sale').length,
          recentSales: result.data.filter(item => item.status === 'recent-sale').length
        };
        setStats(stats);
      } else {
        console.error('❌ Failed to load portfolio:', result.error);
        setPortfolioItems([]);
        setStats({ total: 0, residential: 0, commercial: 0, land: 0, forSale: 0, recentSales: 0 });
      }
    } catch (error) {
      console.error('💥 Error loading portfolio:', error);
      setPortfolioItems([]);
      setStats({ total: 0, residential: 0, commercial: 0, land: 0, forSale: 0, recentSales: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioFromBackend();
  }, []);

  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
    if (typeof price === 'number') return `$${price.toLocaleString()}`;
    return 'Price on request';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'residential': return <Home className="h-4 w-4" />;
      case 'commercial': return <Building2 className="h-4 w-4" />;
      case 'land': return <MapPin className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'residential': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-purple-100 text-purple-800';
      case 'land': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'for-sale' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Backend Portfolio Display</h3>
          <p className="text-gray-600">Data loaded from Firestore backend</p>
        </div>
        <button
          onClick={loadPortfolioFromBackend}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.residential}</div>
          <div className="text-sm text-gray-600">Residential</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.commercial}</div>
          <div className="text-sm text-gray-600">Commercial</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.land}</div>
          <div className="text-sm text-gray-600">Land</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-teal-600">{stats.forSale}</div>
          <div className="text-sm text-gray-600">For Sale</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.recentSales}</div>
          <div className="text-sm text-gray-600">Recent Sales</div>
        </div>
      </div>

      {/* Portfolio Items */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Portfolio Items from Backend ({portfolioItems.length})
          </h4>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading from backend...</p>
            </div>
          ) : portfolioItems.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No portfolio items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Use the "Backend Migration" tab to migrate data from files to backend.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {portfolioItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {/* Image placeholder */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Building2 className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </span>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status === 'for-sale' ? 'For Sale' : 'Recent Sale'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-gray-900 truncate">{item.title}</h5>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                    
                    {item.location?.address && (
                      <p className="text-sm text-gray-600 mb-2 truncate">{item.location.address}</p>
                    )}

                    {/* Sold Info for Recent Sales */}
                    {item.status === 'recent-sale' && item.soldPrice && (
                      <div className="mb-2 p-2 bg-orange-50 rounded text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sold for:</span>
                          <span className="font-medium text-orange-700">{formatPrice(item.soldPrice)}</span>
                        </div>
                        {item.soldDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sold on:</span>
                            <span className="text-orange-700">
                              {new Date(item.soldDate.toDate?.() || item.soldDate).toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span>{item.subcategory}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(item.createdAt?.toDate?.() || item.createdAt).toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' })}</span>
                      </span>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.description.substring(0, 100)}...
                      </p>
                    )}

                    {/* Features (for residential/commercial) */}
                    {item.features && (
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
                        {item.features.beds && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {item.features.beds} beds
                          </span>
                        )}
                        {item.features.baths && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {item.features.baths} baths
                          </span>
                        )}
                        {item.features.sqft && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {item.features.sqft} sqft
                          </span>
                        )}
                        {item.features.pool && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Pool
                          </span>
                        )}
                      </div>
                    )}

                    {/* Amenities */}
                    {item.amenities && item.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.amenities.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                        {item.amenities.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{item.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Source indicator */}
                    <div className="text-xs text-gray-400 mt-2">
                      Source: {item.source || 'backend'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackendPortfolioDisplay;