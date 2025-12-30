import React, { useState } from 'react';
import { Mail, Send, CheckCircle, XCircle, AlertCircle, Server } from 'lucide-react';
import { 
  sendTestEmail, 
  validateEmailConfiguration,
  sendRentalApprovalEmail,
  sendRentalRejectionEmail,
  sendBookingRequestEmail
} from '../../services/emailService';

const EmailTestPanel = () => {
  const [emailConfig, setEmailConfig] = useState({ isValid: false });
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  React.useEffect(() => {
    const checkEmailServer = async () => {
      const config = await validateEmailConfiguration();
      setEmailConfig(config);
    };
    checkEmailServer();
  }, []);

  const addResult = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setResults(prev => [...prev, { message, type, timestamp }]);
  };

  const handleTestEmail = async () => {
    setLoading(true);
    addResult('🚀 Sending test email...', 'info');
    
    try {
      const result = await sendTestEmail(testEmail);
      if (result.success) {
        addResult('✅ Test email sent successfully!', 'success');
      } else {
        addResult(`❌ Test email failed: ${result.error}`, 'error');
      }
    } catch (error) {
      addResult(`💥 Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestApprovalEmail = async () => {
    setLoading(true);
    addResult('📧 Testing approval email...', 'info');
    
    const mockRental = {
      propertyInfo: {
        name: 'Test Villa Paradise',
        address: 'Test Bay, St. John, USVI',
        pricePerNight: 350,
        slug: 'test-villa-paradise'
      },
      agentEmail: testEmail,
      agentName: 'Test Agent',
      id: 'test-approval-123'
    };

    try {
      const result = await sendRentalApprovalEmail(mockRental, 'This is a test approval email from the system.');
      if (result.success) {
        addResult('✅ Approval email test sent successfully!', 'success');
      } else {
        addResult(`❌ Approval email test failed: ${result.error}`, 'error');
      }
    } catch (error) {
      addResult(`💥 Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestRejectionEmail = async () => {
    setLoading(true);
    addResult('📧 Testing rejection email...', 'info');
    
    const mockRental = {
      propertyInfo: {
        name: 'Test Villa Paradise',
        address: 'Test Bay, St. John, USVI',
        pricePerNight: 350
      },
      agentEmail: testEmail,
      agentName: 'Test Agent',
      id: 'test-rejection-123'
    };

    try {
      const result = await sendRentalRejectionEmail(mockRental, 'This is a test rejection email. Please update the property description and resubmit.');
      if (result.success) {
        addResult('✅ Rejection email test sent successfully!', 'success');
      } else {
        addResult(`❌ Rejection email test failed: ${result.error}`, 'error');
      }
    } catch (error) {
      addResult(`💥 Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestBookingEmail = async () => {
    setLoading(true);
    addResult('📧 Testing booking request email...', 'info');
    
    const mockBooking = {
      agentEmail: testEmail,
      propertyName: 'Test Villa Paradise',
      checkIn: '2024-12-15',
      checkOut: '2024-12-22',
      nights: 7,
      guests: 4,
      totalPrice: 2450,
      guestName: 'John Smith',
      guestEmail: 'guest@example.com',
      guestPhone: '+1 (555) 123-4567',
      specialRequests: 'This is a test booking request email with special requests for early check-in.'
    };

    try {
      const result = await sendBookingRequestEmail(mockBooking);
      if (result.success) {
        addResult('✅ Booking request email test sent successfully!', 'success');
      } else {
        addResult(`❌ Booking request email test failed: ${result.error}`, 'error');
      }
    } catch (error) {
      addResult(`💥 Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const refreshServerStatus = async () => {
    const config = await validateEmailConfiguration();
    setEmailConfig(config);
    addResult('🔄 Server status refreshed', 'info');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Email Test Panel</h2>
        <button
          onClick={refreshServerStatus}
          className="ml-auto px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
        >
          Refresh Status
        </button>
      </div>

      {/* Email Server Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Server className="h-4 w-4" />
          Email Server Status
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-2">
            {emailConfig.config?.serverAvailable ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm">
              Email Server ({emailConfig.config?.serverUrl || 'http://localhost:3001'})
            </span>
          </div>
          {emailConfig.config?.error && (
            <div className="text-xs text-red-600 ml-6 bg-red-50 p-2 rounded">
              Error: {emailConfig.config.error}
            </div>
          )}
        </div>
        
        <div className="mt-3 p-3 rounded-lg flex items-center gap-2">
          {emailConfig.isValid ? (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Email server ready!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-700 bg-red-50 p-2 rounded">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Email server not available</span>
            </div>
          )}
        </div>
      </div>

      {/* Server Setup Instructions */}
      {!emailConfig.isValid && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2">Email Server Setup Required</h4>
              <p className="text-sm text-blue-700 mb-3">
                To enable email notifications, start the email server:
              </p>
              <div className="bg-blue-100 p-3 rounded text-xs font-mono text-blue-800 space-y-1">
                <div>cd server</div>
                <div>npm install</div>
                <div>cp .env.example .env</div>
                <div># Edit .env with your dummy email credentials</div>
                <div>npm start</div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                The server will run on port 3001 by default.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Test Email Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Email Address
        </label>
        <input
          type="email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter email to receive test emails"
        />
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={handleTestEmail}
          disabled={loading || !emailConfig.isValid}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Send className="h-4 w-4" />
          )}
          Basic Test
        </button>

        <button
          onClick={handleTestApprovalEmail}
          disabled={loading || !emailConfig.isValid}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Test Approval
        </button>

        <button
          onClick={handleTestRejectionEmail}
          disabled={loading || !emailConfig.isValid}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          Test Rejection
        </button>

        <button
          onClick={handleTestBookingEmail}
          disabled={loading || !emailConfig.isValid}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Mail className="h-4 w-4" />
          )}
          Test Booking
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
            <h4 className="font-medium text-gray-900">Test Results</h4>
            <button
              onClick={clearResults}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="p-3 border-b last:border-b-0">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-500 min-w-16">{result.timestamp}</span>
                  <span className={`text-sm ${
                    result.type === 'success' ? 'text-green-700' :
                    result.type === 'error' ? 'text-red-700' :
                    'text-gray-700'
                  }`}>
                    {result.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTestPanel;