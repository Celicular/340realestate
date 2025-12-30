import React, { useState, useEffect } from 'react';
import { Mail, Settings, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { checkEmailServiceConfiguration, sendTestEmail } from '../../services/emailService';

const EmailConfiguration = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const configResult = checkEmailServiceConfiguration();
      setConfig(configResult);
    } catch (error) {
      console.error('Error loading email configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setTestLoading(true);
    setTestResult(null);
    
    try {
      const result = await sendTestEmail(testEmail);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message
      });
    } finally {
      setTestLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuration Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-2 rounded-lg ${config?.isConfigured ? 'bg-green-100' : 'bg-orange-100'}`}>
            {config?.isConfigured ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-orange-600" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Email Service Configuration</h2>
            <p className="text-sm text-gray-600">{config?.message}</p>
          </div>
        </div>

        {/* Current Configuration */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Current Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Service ID:</span>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-gray-200 px-2 py-1 rounded">{config?.credentials?.serviceId}</code>
                <button
                  onClick={() => copyToClipboard(config?.credentials?.serviceId)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Template ID:</span>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-gray-200 px-2 py-1 rounded">{config?.credentials?.templateId}</code>
                <button
                  onClick={() => copyToClipboard(config?.credentials?.templateId)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Public Key:</span>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-gray-200 px-2 py-1 rounded">{config?.credentials?.publicKey}</code>
                <button
                  onClick={() => copyToClipboard(config?.credentials?.publicKey)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Demo Mode:</span>
              <span className={`text-xs px-2 py-1 rounded ${config?.credentials?.demoMode ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                {config?.credentials?.demoMode ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        {!config?.isConfigured && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Setup Instructions</h3>
            <div className="space-y-3">
              {Object.entries(config?.instructions || {}).map(([step, instruction]) => (
                <div key={step} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {step.replace('step', '')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-blue-800">{instruction}</p>
                    {step === 'step1' && (
                      <a
                        href="https://www.emailjs.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                      >
                        <span>Visit EmailJS</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Test Email Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Test Email Functionality</h3>
            <p className="text-sm text-gray-600">Send a test email to verify configuration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Test Email Address
            </label>
            <input
              type="email"
              id="testEmail"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address to test"
            />
          </div>

          <button
            onClick={handleTestEmail}
            disabled={testLoading || !testEmail}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="h-4 w-4" />
            <span>{testLoading ? 'Sending...' : 'Send Test Email'}</span>
          </button>

          {testResult && (
            <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center space-x-2">
                {testResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`text-sm font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {testResult.success ? 'Success!' : 'Failed'}
                </span>
              </div>
              <p className={`text-sm mt-1 ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                {testResult.message || testResult.error}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Email Templates Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Settings className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
            <p className="text-sm text-gray-600">Configure your EmailJS templates for different email types</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Booking Notification</h4>
              <p className="text-sm text-gray-600 mb-3">Sent to agents when new booking requests are submitted</p>
              <code className="text-xs bg-gray-200 px-2 py-1 rounded">template_booking</code>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Guest Confirmation</h4>
              <p className="text-sm text-gray-600 mb-3">Sent to guests confirming their booking request</p>
              <code className="text-xs bg-gray-200 px-2 py-1 rounded">template_guest_confirmation</code>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Status Update</h4>
              <p className="text-sm text-gray-600 mb-3">Sent when booking status changes (approved/rejected)</p>
              <code className="text-xs bg-gray-200 px-2 py-1 rounded">template_status_update</code>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Mode Notice */}
      {config?.credentials?.demoMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <h4 className="font-medium text-yellow-800">Demo Mode Active</h4>
          </div>
          <p className="text-sm text-yellow-700 mt-2">
            Email functionality is currently running in demo mode. Booking notifications will be logged to the console 
            but not actually sent. Configure EmailJS credentials to enable real email sending.
          </p>
          <div className="mt-3">
            <p className="text-xs text-yellow-600">
              <strong>Demo agent email:</strong> agent.demo@340realestate.com
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailConfiguration;