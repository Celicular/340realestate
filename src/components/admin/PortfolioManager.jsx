import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { 
  getResidentialPortfolio, 
  getCommercialPortfolio, 
  getLandPortfolio,
  deletePropertyFromPortfolio,
  addPropertyToPortfolio,
  updatePropertyInPortfolio 
} from '../../firebase/firestore';
import { useAuth } from '../../firebase/auth';
import ResidentialPortfolio from './portfolios/ResidentialPortfolio';
import CommercialPortfolio from './portfolios/CommercialPortfolio';
import LandPortfolio from './portfolios/LandPortfolio';

const PortfolioManager = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('residential');
  const [portfolioData, setPortfolioData] = useState({
    residential: { villas: [], condos: [], cottages: [], houses: [] },
    commercial: [],
    land: { forSale: [], recentSales: [] }
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const [residential, commercial, land] = await Promise.all([
        getResidentialPortfolio(),
        getCommercialPortfolio(),
        getLandPortfolio()
      ]);

      setPortfolioData({
        residential: residential.success ? residential.data : { villas: [], condos: [], cottages: [], houses: [] },
        commercial: commercial.success ? commercial.data : [],
        land: land.success ? land.data : { forSale: [], recentSales: [] }
      });
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (portfolioType, propertyId, subCategory = null) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      const result = await deletePropertyFromPortfolio(portfolioType, propertyId, subCategory);
      if (result.success) {
        await loadPortfolioData();
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleAdd = async (portfolioType, propertyData, subCategory = null) => {
    try {
      const result = await addPropertyToPortfolio(portfolioType, propertyData, subCategory);
      if (result.success) {
        await loadPortfolioData();
      }
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  const handleUpdate = async (portfolioType, propertyId, propertyData, subCategory = null) => {
    try {
      const result = await updatePropertyInPortfolio(portfolioType, propertyId, propertyData, subCategory);
      if (result.success) {
        await loadPortfolioData();
      }
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'agent';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'residential', label: 'Residential Portfolio', count: Object.values(portfolioData.residential).flat().length },
    { id: 'commercial', label: 'Commercial Portfolio', count: portfolioData.commercial.length },
    { id: 'land', label: 'Land Portfolio', count: Object.values(portfolioData.land).flat().length }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Portfolio Manager</h1>
        <p className="text-gray-600">Manage residential, commercial, and land portfolios</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Portfolio Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'residential' && (
          <ResidentialPortfolio
            data={portfolioData.residential}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            canEdit={canEdit}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
          />
        )}
        
        {activeTab === 'commercial' && (
          <CommercialPortfolio
            data={portfolioData.commercial}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            canEdit={canEdit}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
          />
        )}
        
        {activeTab === 'land' && (
          <LandPortfolio
            data={portfolioData.land}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            canEdit={canEdit}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
          />
        )}
      </motion.div>
    </div>
  );
};

export default PortfolioManager;