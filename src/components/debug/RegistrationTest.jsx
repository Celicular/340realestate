import React, { useState } from 'react';
import { debugRegistration, clearAllUsers, addTestUser } from '../../utils/debugAuth';

const RegistrationTest = () => {
  const [debugInfo, setDebugInfo] = useState(null);

  const runDebug = () => {
    const info = debugRegistration();
    setDebugInfo(info);
  };

  const clearUsers = () => {
    clearAllUsers();
    setDebugInfo(null);
  };

  const addTest = () => {
    addTestUser();
    runDebug();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Registration System Debug</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={runDebug}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          🔍 Debug Current State
        </button>
        
        <button
          onClick={addTest}
          className="bg-green-500 text-white px-4 py-2 rounded ml-2"
        >
          ➕ Add Test User
        </button>
        
        <button
          onClick={clearUsers}
          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
        >
          🧹 Clear All Users
        </button>
      </div>

      {debugInfo && (
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-2">Current Session:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(debugInfo.currentUser, null, 2)}
            </pre>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-2">Registered Users ({debugInfo.users.length}):</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(debugInfo.users, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-8 bg-yellow-100 p-4 rounded">
        <h2 className="font-bold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Debug Current State" to see current data</li>
          <li>Go to /register and create a new user</li>
          <li>Come back and click "Debug Current State" again</li>
          <li>Check the browser console for detailed logs</li>
          <li>Try logging in with the created user</li>
        </ol>
      </div>
    </div>
  );
};

export default RegistrationTest;
