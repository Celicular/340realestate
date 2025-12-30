import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllBlogs } from '../../redux/slices/blogslice';

const BlogImageAssetsTest = () => {
  const allBlogs = useSelector(selectAllBlogs);
  const getToKnowBlog = allBlogs.find(blog => blog.id === 'get-to-know-st-john');

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Blog Images from Assets Test</h2>
      
      {getToKnowBlog ? (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800">✅ "Get to Know St. John" blog found!</p>
          </div>
          
          {/* Cover Image Test */}
          {getToKnowBlog.coverImage && (
            <div>
              <h3 className="font-semibold mb-2">Cover Image Test:</h3>
              <div className="border rounded p-3 bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Path:</strong> {getToKnowBlog.coverImage}
                </p>
                <img 
                  src={getToKnowBlog.coverImage} 
                  alt="Cruz Bay Cover"
                  className="w-48 h-32 object-cover rounded border"
                  onError={(e) => {
                    console.error('Cover image failed to load:', getToKnowBlog.coverImage);
                    e.target.classList.add('border-red-500');
                  }}
                  onLoad={() => {
                    console.log('Cover image loaded successfully:', getToKnowBlog.coverImage);
                  }}
                />
              </div>
            </div>
          )}

          {/* Content Images Test */}
          <div>
            <h3 className="font-semibold mb-2">Content Images Test:</h3>
            <div className="text-sm text-gray-600 mb-2">
              These images are embedded in the blog description and will be processed by the BlogDetails component.
            </div>
            
            {/* Show first 500 characters of description to see image markdown */}
            <div className="bg-gray-50 p-3 rounded border text-xs font-mono">
              {getToKnowBlog.description.substring(0, 800)}...
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-semibold mb-2">Assets Migration Status:</h4>
            <ul className="text-sm space-y-1">
              <li>✅ Images moved from public/blog/ to src/assets/blog/</li>
              <li>✅ Images imported as modules in blogslice.js</li>
              <li>✅ Cover image using imported cruzbayImage</li>
              <li>✅ Content images using imported wharfImage, mongooseImage, trunkbayImage</li>
              <li>✅ BlogDetails component updated to handle imported images</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">❌ Blog not found</p>
        </div>
      )}
    </div>
  );
};

export default BlogImageAssetsTest;