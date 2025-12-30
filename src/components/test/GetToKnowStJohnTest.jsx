import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllBlogs } from '../../redux/slices/blogslice';

const GetToKnowStJohnTest = () => {
  const allBlogs = useSelector(selectAllBlogs);
  const getToKnowBlog = allBlogs.find(blog => blog.id === 'get-to-know-st-john');

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Get to Know St. John Blog Test</h2>
      
      {getToKnowBlog ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800">✅ Blog found successfully!</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <strong>Title:</strong> {getToKnowBlog.title}
            </div>
            <div>
              <strong>Author:</strong> {getToKnowBlog.author}
            </div>
            <div>
              <strong>Category:</strong> {getToKnowBlog.category}
            </div>
            <div>
              <strong>Published:</strong> {getToKnowBlog.publishedAt}
            </div>
            <div>
              <strong>Views:</strong> {getToKnowBlog.views}
            </div>
            <div>
              <strong>Hardcoded:</strong> {getToKnowBlog.isHardcoded ? 'Yes' : 'No'}
            </div>
          </div>

          {getToKnowBlog.coverImage && (
            <div>
              <strong>Cover Image:</strong>
              <div className="mt-2">
                <img 
                  src={getToKnowBlog.coverImage} 
                  alt={getToKnowBlog.title}
                  className="w-48 h-32 object-cover rounded border"
                  onError={(e) => {
                    console.error('Cover image failed to load:', getToKnowBlog.coverImage);
                  }}
                  onLoad={() => {
                    console.log('Cover image loaded successfully:', getToKnowBlog.coverImage);
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <strong>Description Preview:</strong>
            <div className="mt-2 p-3 bg-gray-50 rounded text-sm max-h-40 overflow-y-auto">
              {getToKnowBlog.description.substring(0, 500)}...
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">❌ Blog not found in the blog list</p>
          <div className="mt-2 text-sm">
            <strong>Available blogs:</strong>
            <ul className="mt-1 space-y-1">
              {allBlogs.map(blog => (
                <li key={blog.id} className="text-gray-600">
                  • {blog.id} - {blog.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-semibold mb-2">Usage Instructions:</h4>
        <p className="text-sm text-gray-700">
          The "Get to Know St. John" blog has been successfully added to the hardcoded blogs array. 
          It includes information about St. John's geography, transportation, attractions, and real estate market.
          The blog includes placeholder references for images that should be added to the public/images/articles/ directory.
        </p>
      </div>
    </div>
  );
};

export default GetToKnowStJohnTest;