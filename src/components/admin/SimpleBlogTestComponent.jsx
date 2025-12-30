import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchBlogs, 
  selectAllBlogs, 
  selectBlogsLoading, 
  selectBlogsError,
  clearError 
} from '../../redux/slices/blogslice';
import { getBlogImage } from '../../utils/blogImageMapping';

const SimpleBlogTestComponent = () => {
  const dispatch = useDispatch();
  const allBlogs = useSelector(selectAllBlogs);
  const loading = useSelector(selectBlogsLoading);
  const error = useSelector(selectBlogsError);
  
  const [testStatus, setTestStatus] = useState('idle');
  const [imageTestResults, setImageTestResults] = useState(null);

  useEffect(() => {
    // Auto-fetch blogs on component mount
    const fetchBlogs = async () => {
      setTestStatus('testing');
      try {
        await dispatch(fetchBlogs(10)).unwrap();
        setTestStatus('success');
      } catch (err) {
        setTestStatus('error');
        console.error('Failed to fetch blogs:', err);
      }
    };
    
    fetchBlogs();
  }, [dispatch]);

  const handleFetchBlogs = async () => {
    setTestStatus('testing');
    try {
      await dispatch(fetchBlogs(10)).unwrap();
      setTestStatus('success');
    } catch (err) {
      setTestStatus('error');
      console.error('Failed to fetch blogs:', err);
    }
  };

  const handleImageTest = () => {
    const testResults = allBlogs.slice(0, 5).map(blog => {
      const assignedImage = getBlogImage(blog);
      return {
        id: blog.id,
        title: blog.title,
        category: blog.category || 'N/A',
        originalImage: blog.coverImage,
        assignedImage: assignedImage,
        imageWorking: assignedImage ? true : false
      };
    });
    
    setImageTestResults(testResults);
  };

  const handleClearError = () => {
    dispatch(clearError());
    setTestStatus('idle');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🧪 Simple Blog System Test
        </h2>
        
        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{allBlogs.length}</div>
            <div className="text-sm text-blue-700">Total Blogs</div>
          </div>
          <div className={`p-4 rounded-lg text-center ${
            loading ? 'bg-yellow-50' : error ? 'bg-red-50' : 'bg-green-50'
          }`}>
            <div className={`text-2xl font-bold ${
              loading ? 'text-yellow-600' : error ? 'text-red-600' : 'text-green-600'
            }`}>
              {loading ? '⏳' : error ? '❌' : '✅'}
            </div>
            <div className={`text-sm ${
              loading ? 'text-yellow-700' : error ? 'text-red-700' : 'text-green-700'
            }`}>
              {loading ? 'Loading' : error ? 'Error' : 'Ready'}
            </div>
          </div>
          <div className={`p-4 rounded-lg text-center ${
            testStatus === 'testing' ? 'bg-yellow-50' : 
            testStatus === 'error' ? 'bg-red-50' : 
            testStatus === 'success' ? 'bg-green-50' : 'bg-gray-50'
          }`}>
            <div className={`text-2xl font-bold ${
              testStatus === 'testing' ? 'text-yellow-600' : 
              testStatus === 'error' ? 'text-red-600' : 
              testStatus === 'success' ? 'text-green-600' : 'text-gray-600'
            }`}>
              {testStatus === 'testing' ? '🔄' : 
               testStatus === 'error' ? '🚫' : 
               testStatus === 'success' ? '🎉' : '⚪'}
            </div>
            <div className={`text-sm ${
              testStatus === 'testing' ? 'text-yellow-700' : 
              testStatus === 'error' ? 'text-red-700' : 
              testStatus === 'success' ? 'text-green-700' : 'text-gray-700'
            }`}>
              Test Status
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {imageTestResults?.length || 0}
            </div>
            <div className="text-sm text-purple-700">Images Tested</div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-red-800">❌ Error Detected</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <p className="text-sm text-red-600 mt-2">
                  This might be due to Firestore index requirements. The system will fall back to hardcoded blogs.
                </p>
              </div>
              <button
                onClick={handleClearError}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleFetchBlogs}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium ${
              loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? '⏳ Testing...' : '🔄 Test Blog Fetch'}
          </button>
          
          <button
            onClick={handleImageTest}
            disabled={allBlogs.length === 0}
            className={`px-6 py-2 rounded-lg font-medium ${
              allBlogs.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            🖼️ Test Images
          </button>
        </div>

        {/* Image Test Results */}
        {imageTestResults && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-800 mb-3">🖼️ Image Assignment Test Results</h3>
            <div className="space-y-3">
              {imageTestResults.map((result, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{result.title}</h4>
                      <p className="text-sm text-gray-600">Category: {result.category}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Image: {result.assignedImage?.split('/').pop() || 'No image assigned'}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      result.imageWorking ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.imageWorking ? '✅ Working' : '❌ No Image'}
                    </div>
                  </div>
                  {result.assignedImage && (
                    <div className="mt-2">
                      <img 
                        src={result.assignedImage} 
                        alt={result.title}
                        className="w-16 h-16 object-cover rounded border"
                        onError={(e) => {
                          e.target.style.border = '2px solid red';
                        }}
                        onLoad={(e) => {
                          e.target.style.border = '2px solid green';
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog List Preview */}
        {allBlogs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              📝 Available Blogs ({allBlogs.length})
            </h3>
            <div className="grid gap-4">
              {allBlogs.slice(0, 3).map((blog, index) => (
                <div key={blog.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {blog.coverImage && (
                      <img 
                        src={blog.coverImage} 
                        alt={blog.title}
                        className="w-20 h-20 object-cover rounded border"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{blog.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {blog.description?.substring(0, 120)}...
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {blog.category || 'General'}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {blog.isHardcoded ? 'Static' : 'Firebase'}
                        </span>
                        {blog.status && (
                          <span className={`px-2 py-1 rounded ${
                            blog.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {blog.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {allBlogs.length > 3 && (
              <p className="text-sm text-gray-500 text-center">
                ... and {allBlogs.length - 3} more blogs
              </p>
            )}
          </div>
        )}

        {/* No Blogs Message */}
        {!loading && allBlogs.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📚</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Blogs Found</h3>
            <p className="text-gray-600 mb-4">
              The system is working, but no blogs are available yet.
            </p>
            <button
              onClick={handleFetchBlogs}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* System Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">ℹ️ System Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <div>✅ Hardcoded Image System: Active</div>
            <div>✅ Redux Store: Connected</div>
            <div>🔥 Firebase: {error ? 'Error (using fallback)' : 'Connected'}</div>
            <div>⏰ Last Test: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleBlogTestComponent;