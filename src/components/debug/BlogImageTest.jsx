import React from 'react';
import { getBlogImage } from '../utils/blogImageMapping';

const BlogImageTest = () => {
  // Test the two problematic blogs
  const testBlogs = [
    {
      id: "top-realtors-usvi",
      title: "Top 5 Real Estate Companies in US Virgin Islands",
      category: "Real Estate",
      description: "Real Estate in St. John's house rentals in st thomas virgin islands..."
    },
    {
      id: "home-buying-tips-stjohn", 
      title: "Expert Home Buying Tips for St. John, USVI",
      category: "Real Estate",
      description: "Expert Home Buying Tips for St. John, USVI Owning a home in St. John..."
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Blog Image Mapping Test</h2>
      
      <div className="space-y-6">
        {testBlogs.map(blog => {
          const assignedImage = getBlogImage(blog);
          
          return (
            <div key={blog.id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
              <p className="text-sm text-gray-600 mb-2">ID: {blog.id}</p>
              
              {assignedImage ? (
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Assigned Image:</strong> {assignedImage.split('/').pop()}
                  </p>
                  <img 
                    src={assignedImage} 
                    alt={blog.title}
                    className="w-32 h-20 object-cover rounded border"
                    onError={(e) => {
                      console.error('Image failed to load:', assignedImage);
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', assignedImage);
                    }}
                  />
                  <p className="text-xs text-green-600">✅ Image mapping successful</p>
                </div>
              ) : (
                <p className="text-red-600">❌ No image assigned</p>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h4 className="font-semibold mb-2">Test Results:</h4>
        <p className="text-sm text-gray-700">
          This component tests the image mapping for the two blogs that were having visibility issues.
          Each blog should now have a properly assigned image based on their ID and content.
        </p>
      </div>
    </div>
  );
};

export default BlogImageTest;