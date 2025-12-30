import React, { useState } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import blogsData from '../../data/Blogs';

const BlogMigrationTool = () => {
  const [migrationStatus, setMigrationStatus] = useState('idle'); // idle, running, completed, error
  const [migrationResults, setMigrationResults] = useState(null);
  const [migrationLog, setMigrationLog] = useState([]);

  const addToLog = (message) => {
    setMigrationLog(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), message }]);
  };

  const migrateBlogsToFirestore = async () => {
    const BLOGS_COLLECTION = 'blogs';
    const results = {
      success: 0,
      skipped: 0,
      errors: 0,
      details: []
    };

    setMigrationStatus('running');
    setMigrationLog([]);
    addToLog(`Starting migration of ${blogsData.length} blogs to Firestore...`);

    for (const blog of blogsData) {
      try {
        // Check if blog already exists by checking the original ID
        const existingBlogQuery = query(
          collection(db, BLOGS_COLLECTION),
          where('originalId', '==', blog.id)
        );
        const existingBlogs = await getDocs(existingBlogQuery);

        if (!existingBlogs.empty) {
          addToLog(`Blog "${blog.title}" already exists, skipping...`);
          results.skipped++;
          results.details.push({
            id: blog.id,
            title: blog.title,
            status: 'skipped',
            reason: 'Already exists'
          });
          continue;
        }

        // Prepare blog data for Firestore
        const blogData = {
          // Keep original ID for reference
          originalId: blog.id,
          
          // Basic info
          title: blog.title || 'Untitled Blog',
          subtitle: blog.subtitle || '',
          description: blog.description || '',
          
          // Author info
          author: {
            name: blog.author || '340 Real Estate Team',
            role: 'Real Estate Expert',
            email: '340realestateco@gmail.com'
          },
          
          // Category and tags
          category: blog.category || 'Real Estate',
          tags: blog.tags || ['St. John', 'Real Estate', 'USVI'],
          
          // Status and visibility
          status: 'published',
          featured: false,
          
          // Image
          coverImage: blog.coverImage || '',
          
          // Dates
          publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          
          // Engagement metrics
          views: blog.views || 0,
          likes: blog.likes || 0,
          
          // SEO
          slug: blog.id, // Use original ID as slug
          metaDescription: blog.description?.substring(0, 160) || '',
          metaKeywords: blog.tags || ['St. John', 'Real Estate', 'USVI']
        };

        // Add to Firestore
        const docRef = await addDoc(collection(db, BLOGS_COLLECTION), blogData);
        
        addToLog(`✅ Successfully migrated: ${blog.title}`);
        results.success++;
        results.details.push({
          id: blog.id,
          firestoreId: docRef.id,
          title: blog.title,
          status: 'success'
        });

      } catch (error) {
        addToLog(`❌ Error migrating ${blog.title}: ${error.message}`);
        results.errors++;
        results.details.push({
          id: blog.id,
          title: blog.title || 'Unknown',
          status: 'error',
          error: error.message
        });
      }
    }

    addToLog('\n=== Migration Summary ===');
    addToLog(`✅ Successfully migrated: ${results.success} blogs`);
    addToLog(`⏭️  Skipped (already exist): ${results.skipped} blogs`);
    addToLog(`❌ Errors: ${results.errors} blogs`);

    setMigrationResults(results);
    setMigrationStatus('completed');

    return results;
  };

  const handleRunMigration = async () => {
    try {
      await migrateBlogsToFirestore();
    } catch (error) {
      addToLog(`💥 Migration failed: ${error.message}`);
      setMigrationStatus('error');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog Migration Tool</h2>
        <p className="text-gray-600">
          Migrate existing blog posts from static data to Firestore database.
        </p>
      </div>

      {/* Migration Status */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            migrationStatus === 'idle' ? 'bg-gray-100 text-gray-700' :
            migrationStatus === 'running' ? 'bg-blue-100 text-blue-700' :
            migrationStatus === 'completed' ? 'bg-green-100 text-green-700' :
            'bg-red-100 text-red-700'
          }`}>
            {migrationStatus === 'idle' ? 'Ready to migrate' :
             migrationStatus === 'running' ? 'Migration in progress...' :
             migrationStatus === 'completed' ? 'Migration completed' :
             'Migration failed'}
          </span>
        </div>
      </div>

      {/* Migration Controls */}
      <div className="mb-6">
        <button
          onClick={handleRunMigration}
          disabled={migrationStatus === 'running'}
          className={`px-6 py-3 rounded-lg font-medium ${
            migrationStatus === 'running'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {migrationStatus === 'running' ? 'Migrating...' : 'Start Migration'}
        </button>
      </div>

      {/* Migration Results */}
      {migrationResults && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Migration Results</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-100 p-3 rounded">
              <div className="text-2xl font-bold text-green-600">{migrationResults.success}</div>
              <div className="text-sm text-green-700">Successful</div>
            </div>
            <div className="bg-yellow-100 p-3 rounded">
              <div className="text-2xl font-bold text-yellow-600">{migrationResults.skipped}</div>
              <div className="text-sm text-yellow-700">Skipped</div>
            </div>
            <div className="bg-red-100 p-3 rounded">
              <div className="text-2xl font-bold text-red-600">{migrationResults.errors}</div>
              <div className="text-sm text-red-700">Errors</div>
            </div>
          </div>
        </div>
      )}

      {/* Migration Log */}
      {migrationLog.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Migration Log</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
            {migrationLog.map((entry, index) => (
              <div key={index} className="mb-1">
                <span className="text-gray-500">[{entry.timestamp}]</span> {entry.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">What this migration does:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Transfers {blogsData.length} existing blog posts to Firestore</li>
          <li>• Preserves all blog content, images, and metadata</li>
          <li>• Adds proper structure for database management</li>
          <li>• Skips blogs that already exist to prevent duplicates</li>
          <li>• Enables dynamic blog creation and editing</li>
        </ul>
      </div>
    </div>
  );
};

export default BlogMigrationTool;