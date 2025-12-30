import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchBlogs, 
  selectAllBlogs, 
  selectFirebaseBlogs,
  selectHardcodedBlogs,
  selectBlogsLoading, 
  selectBlogsError 
} from '../../redux/slices/blogslice';

const BlogTestComponent = () => {
  const dispatch = useDispatch();
  const allBlogs = useSelector(selectAllBlogs);
  const firebaseBlogs = useSelector(selectFirebaseBlogs);
  const hardcodedBlogs = useSelector(selectHardcodedBlogs);
  const loading = useSelector(selectBlogsLoading);
  const error = useSelector(selectBlogsError);

  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    // Test fetching blogs from Firebase
    dispatch(fetchBlogs(10));
  }, [dispatch]);

  useEffect(() => {
    // Update test results when data changes
    setTestResults({
      totalBlogs: allBlogs.length,
      firebaseBlogs: firebaseBlogs.length,
      hardcodedBlogs: hardcodedBlogs.length,
      loading,
      error,
      lastUpdate: new Date().toLocaleString()
    });
  }, [allBlogs, firebaseBlogs, hardcodedBlogs, loading, error]);

  const refreshBlogs = () => {
    dispatch(fetchBlogs(20));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog System Test</h2>
        
        {/* Test Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{testResults.totalBlogs || 0}</div>
            <div className="text-sm text-blue-700">Total Blogs</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{testResults.firebaseBlogs || 0}</div>
            <div className="text-sm text-green-700">Firebase Blogs</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{testResults.hardcodedBlogs || 0}</div>
            <div className="text-sm text-yellow-700">Hardcoded Blogs</div>
          </div>
          <div className={`p-4 rounded-lg text-center ${
            loading ? 'bg-gray-50' : error ? 'bg-red-50' : 'bg-green-50'
          }`}>
            <div className={`text-2xl font-bold ${
              loading ? 'text-gray-600' : error ? 'text-red-600' : 'text-green-600'
            }`}>
              {loading ? '...' : error ? '✗' : '✓'}
            </div>
            <div className={`text-sm ${
              loading ? 'text-gray-700' : error ? 'text-red-700' : 'text-green-700'
            }`}>
              Status
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Control Panel */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={refreshBlogs}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium ${
              loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Loading...' : 'Refresh Blogs'}
          </button>
        </div>

        {/* Blog List Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Blogs</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading blogs...</p>
            </div>
          ) : allBlogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No blogs found. Try running the migration tool first.
            </div>
          ) : (
            <div className="grid gap-4">
              {allBlogs.slice(0, 5).map((blog, index) => (
                <div key={blog.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{blog.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {blog.description?.substring(0, 100)}...
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>By {blog.author?.name || blog.author || 'Unknown'}</span>
                        <span>Category: {blog.category || 'Real Estate'}</span>
                        <span>Views: {blog.views || 0}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        blog.createdAt ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {blog.createdAt ? 'Firebase' : 'Static'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {blog.createdAt ? 
                          new Date(blog.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' }) :
                          blog.publishedAt || 'Unknown date'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">System Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Last Update:</strong> {testResults.lastUpdate}
            </div>
            <div>
              <strong>Redux Store:</strong> Connected
            </div>
            <div>
              <strong>Firebase:</strong> {firebaseBlogs.length > 0 ? 'Connected' : 'No data'}
            </div>
            <div>
              <strong>Static Data:</strong> {hardcodedBlogs.length} blogs loaded
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogTestComponent;