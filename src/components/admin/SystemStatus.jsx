import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const SystemStatus = () => {
  const [status, setStatus] = useState({
    firebase: 'checking',
    portfolioFunctions: 'checking',
    salesData: 'checking',
    landData: 'checking'
  });

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    // Check Firebase
    try {
      const { db } = await import('../../firebase/config');
      setStatus(prev => ({ ...prev, firebase: db ? 'ok' : 'error' }));
    } catch (error) {
      console.error('Firebase check failed:', error);
      setStatus(prev => ({ ...prev, firebase: 'error' }));
    }

    // Check Portfolio Functions
    try {
      const { getAllPortfolioItems } = await import('../../firebase/firestore');
      setStatus(prev => ({ ...prev, portfolioFunctions: getAllPortfolioItems ? 'ok' : 'error' }));
    } catch (error) {
      console.error('Portfolio functions check failed:', error);
      setStatus(prev => ({ ...prev, portfolioFunctions: 'error' }));
    }

    // Check Sales Data
    try {
      const { propertyData } = await import('../../data/SalesData');
      setStatus(prev => ({ ...prev, salesData: propertyData ? 'ok' : 'error' }));
    } catch (error) {
      console.error('Sales data check failed:', error);
      setStatus(prev => ({ ...prev, salesData: 'error' }));
    }

    // Check Land Data
    try {
      const { landProperties } = await import('../../data/LandSaleData');
      setStatus(prev => ({ ...prev, landData: landProperties ? 'ok' : 'error' }));
    } catch (error) {
      console.error('Land data check failed:', error);
      setStatus(prev => ({ ...prev, landData: 'error' }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'checking':
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ok':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'checking':
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const statusItems = [
    { key: 'firebase', label: 'Firebase Connection' },
    { key: 'portfolioFunctions', label: 'Portfolio Functions' },
    { key: 'salesData', label: 'Sales Data Import' },
    { key: 'landData', label: 'Land Data Import' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status Check</h3>
        <p className="text-gray-600 mb-6">
          This component checks if all portfolio system components are working correctly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statusItems.map(item => (
          <div
            key={item.key}
            className={`border rounded-lg p-4 ${getStatusColor(status[item.key])}`}
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(status[item.key])}
              <div>
                <h4 className="font-medium text-gray-900">{item.label}</h4>
                <p className="text-sm text-gray-600">
                  Status: {status[item.key] === 'checking' ? 'Checking...' : status[item.key]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• If all components show "ok", the portfolio system is ready</li>
          <li>• Try the "Portfolio Test" tab to test adding a portfolio item</li>
          <li>• Use "Portfolio Management" to seed data and manage portfolios</li>
          <li>• Check browser console for any additional error details</li>
        </ul>
      </div>
    </div>
  );
};

export default SystemStatus;