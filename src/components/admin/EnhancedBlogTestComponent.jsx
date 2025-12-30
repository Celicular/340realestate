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
import { migrateBlogsToFirestore, previewMigration, validateBlogData } from '../../utils/blogMigration';
import { getBlogImage, getAllCategoryImages } from '../../utils/blogImageMapping';

const EnhancedBlogTestComponent = () => {
  const dispatch = useDispatch();
  const allBlogs = useSelector(selectAllBlogs);
  const firebaseBlogs = useSelector(selectFirebaseBlogs);
  const hardcodedBlogs = useSelector(selectHardcodedBlogs);
  const loading = useSelector(selectBlogsLoading);
  const error = useSelector(selectBlogsError);

  const [migrationStatus, setMigrationStatus] = useState('idle'); // idle, migrating, success, error
  const [migrationResults, setMigrationResults] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [imageTestResults, setImageTestResults] = useState(null);

  useEffect(() => {
    // Fetch blogs from Firebase on component mount
    dispatch(fetchBlogs(20));
  }, [dispatch]);

  const handleMigration = async () => {
    setMigrationStatus('migrating');
    setMigrationResults(null);
    
    try {
      const result = await migrateBlogsToFirestore(true);
      setMigrationResults(result);
      setMigrationStatus(result.success ? 'success' : 'error');
      
      if (result.success) {
        // Refresh the blog list after successful migration
        dispatch(fetchBlogs(20));
      }
    } catch (error) {
      setMigrationResults({ success: false, error: error.message });
      setMigrationStatus('error');
    }
  };

  const handleValidation = () => {
    const results = validateBlogData();
    setValidationResults(results);
  };

  const handleImageTest = () => {
    const categoryImages = getAllCategoryImages();
    const testResults = {
      totalCategories: Object.keys(categoryImages).length,
      categories: Object.keys(categoryImages),
      sampleBlogTests: allBlogs.slice(0, 5).map(blog => ({
        title: blog.title,
        originalImage: blog.coverImage,
        assignedImage: getBlogImage(blog),
        category: blog.category
      }))
    };
    setImageTestResults(testResults);
  };

  const handlePreview = () => {
    previewMigration();
  };

  const refreshBlogs = () => {
    dispatch(fetchBlogs(20));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Enhanced Blog System Test</h2>
        
        {/* System Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{allBlogs.length || 0}</div>
            <div className="text-sm text-blue-700">Total Blogs</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{firebaseBlogs.length || 0}</div>
            <div className="text-sm text-green-700">Firebase Blogs</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{hardcodedBlogs.length || 0}</div>
            <div className="text-sm text-purple-700">Hardcoded Blogs</div>
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

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <button
            onClick={refreshBlogs}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium ${
              loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          
          <button
            onClick={handleValidation}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Validate Data
          </button>
          
          <button
            onClick={handleImageTest}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            Test Images
          </button>
          
          <button
            onClick={handlePreview}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
          >
            Preview Migration
          </button>
          
          <button
            onClick={handleMigration}
            disabled={migrationStatus === 'migrating'}
            className={`px-4 py-2 rounded-lg font-medium ${
              migrationStatus === 'migrating'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {migrationStatus === 'migrating' ? 'Migrating...' : 'Migrate Blogs'}
          </button>
        </div>

        {/* Validation Results */}
        {validationResults && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Validation Results</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Total Blogs:</strong> {validationResults.totalBlogs}
              </div>
              <div className={validationResults.issues.length > 0 ? 'text-red-600' : 'text-green-600'}>
                <strong>Issues:</strong> {validationResults.issues.length}
              </div>
              <div className={validationResults.warnings.length > 0 ? 'text-yellow-600' : 'text-green-600'}>
                <strong>Warnings:</strong> {validationResults.warnings.length}
              </div>
            </div>
            {validationResults.issues.length > 0 && (
              <div className="mt-2">
                <h4 className="font-medium text-red-800">Issues:</h4>
                <ul className="list-disc list-inside text-sm text-red-700">
                  {validationResults.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Image Test Results */}
        {imageTestResults && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Image System Test</h3>
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <strong>Available Categories:</strong> {imageTestResults.totalCategories}
              </div>
              <div>
                <strong>Sample Tests:</strong> {imageTestResults.sampleBlogTests.length}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">Sample Blog Image Assignments:</h4>
              {imageTestResults.sampleBlogTests.map((test, index) => (
                <div key={index} className="text-sm bg-white p-2 rounded">
                  <strong>{test.title}</strong> ({test.category})
                  <br />
                  <span className="text-gray-600">
                    Image: {test.assignedImage?.split('/').pop() || 'No image'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Migration Results */}
        {migrationResults && (
          <div className={`border rounded-lg p-4 mb-4 ${
            migrationResults.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className={`font-semibold mb-2 ${
              migrationResults.success ? 'text-green-800' : 'text-red-800'
            }`}>
              Migration Results
            </h3>
            {migrationResults.success ? (
              <div className="text-sm text-green-700">
                <p>✅ Migration completed successfully!</p>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div><strong>Total:</strong> {migrationResults.totalBlogs}</div>
                  <div><strong>Successful:</strong> {migrationResults.successful}</div>
                  <div><strong>Failed:</strong> {migrationResults.failed}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-red-700">
                <p>❌ Migration failed: {migrationResults.error}</p>
              </div>
            )}
          </div>
        )}

        {/* Blog List Preview */}
        {allBlogs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Blogs</h3>
            <div className="grid gap-4">
              {allBlogs.slice(0, 5).map((blog, index) => (
                <div key={blog.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{blog.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{blog.description?.substring(0, 150)}...</p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span>Category: {blog.category || 'N/A'}</span>
                        <span>•</span>
                        <span>Views: {blog.views || 0}</span>
                        <span>•</span>
                        <span>Status: {blog.status || 'published'}</span>
                        {blog.isHardcoded !== undefined && (
                          <>
                            <span>•</span>
                            <span>Source: {blog.isHardcoded ? 'Hardcoded' : 'Firebase'}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {blog.coverImage && (
                      <div className="ml-4">
                        <img 
                          src={blog.coverImage} 
                          alt={blog.title}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">System Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Last Update:</strong> {new Date().toLocaleString()}
            </div>
            <div>
              <strong>Redux Store:</strong> Connected
            </div>
            <div>
              <strong>Firebase:</strong> {firebaseBlogs.length > 0 ? 'Connected' : 'No data'}
            </div>
            <div>
              <strong>Image System:</strong> Hardcoded mapping active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBlogTestComponent;