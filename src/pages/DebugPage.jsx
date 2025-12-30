import React from 'react';
import DataStructureTest from '../components/debug/DataStructureTest';
import RentalDataChecker from '../components/debug/RentalDataChecker';
import CreateSampleRentalProperty from '../components/debug/CreateSampleRentalProperty';
import QuickApprovalTool from '../components/debug/QuickApprovalTool';

const DebugPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Debug - Rental Properties</h1>
      
      <div className="space-y-8">
        <CreateSampleRentalProperty />
        <QuickApprovalTool />
        <RentalDataChecker />
        <DataStructureTest />
      </div>
    </div>
  );
};

export default DebugPage;