import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  fetchBlogs, 
  selectAllBlogs, 
  selectBlogsLoading, 
  selectBlogsError,
  clearError 
} from "../../redux/slices/blogslice";
import { getBlogImage } from "../../utils/blogImageMapping";
import blog1 from "../../assets/articles/340realestate-intro.jpg";
import blog2 from "../../assets/articles/Honeymoon-Beach.jpg";
import blog3 from "../../assets/articles/property-types-stjohn.jpg";

// Sample HD hero images (royalty-free)
const heroImages = [
  blog1,
  blog2,
  blog3,
];

const BlogList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Redux state
  const allBlogs = useSelector(selectAllBlogs);
  const loading = useSelector(selectBlogsLoading);
  const error = useSelector(selectBlogsError);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000); // 4 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch blogs from Firebase on component mount
    dispatch(fetchBlogs(20));
  }, [dispatch]);

  // Debug logging to see what blogs are being displayed
  useEffect(() => {
    console.log('BlogList - Total blogs:', allBlogs.length);
    console.log('BlogList - All blog IDs:', allBlogs.map(blog => blog.id));
    
    // Check for duplicates
    const blogIds = allBlogs.map(blog => blog.id);
    const duplicateIds = blogIds.filter((id, index) => blogIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      console.log('BlogList - Duplicate blog IDs found:', duplicateIds);
      console.log('BlogList - Blogs with duplicate IDs:', allBlogs.filter(blog => duplicateIds.includes(blog.id)));
    }
  }, [allBlogs]);

  // Debug logging to understand duplication
  useEffect(() => {
    console.log('All blogs count:', allBlogs.length);
    console.log('All blogs:', allBlogs);
    
    // Check for duplicates by ID
    const blogIds = allBlogs.map(blog => blog.id);
    const duplicateIds = blogIds.filter((id, index) => blogIds.indexOf(id) !== index);
    
    if (duplicateIds.length > 0) {
      console.log('Duplicate blog IDs found:', [...new Set(duplicateIds)]);
      console.log('Duplicate blogs:', allBlogs.filter(blog => duplicateIds.includes(blog.id)));
    } else {
      console.log('No duplicate blog IDs found');
    }
  }, [allBlogs]);

  const formatDate = (dateField) => {
    if (!dateField) return 'Recent';
    
    let date;
    if (dateField.seconds) {
      // Firestore timestamp
      date = new Date(dateField.seconds * 1000);
    } else if (dateField instanceof Date) {
      // Regular Date object
      date = dateField;
    } else if (typeof dateField === 'string') {
      // String date
      date = new Date(dateField);
    } else {
      return 'Recent';
    }
    
    // Format date with 2-digit year
    const options = { 
      year: '2-digit', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleBlogClick = (blog) => {
    // Check if it's a Firebase blog or hardcoded blog
    if (blog.createdAt || blog.isHardcoded === false) {
      // Firebase blog - navigate to dynamic route
      navigate(`/blog/${blog.id || blog.firebaseId}`);
    } else {
      // Hardcoded blog - navigate to static route  
      navigate(`/blog/${blog.id}`);
    }
  };

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchBlogs(20));
  };

  return (
    <div>
      {/* Hero Slideshow */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        {heroImages.map((img, idx) => (
          <motion.img
            key={idx}
            src={img}
            alt={`Slide ${idx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSlide === idx ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-4xl md:text-6xl text-white font-bold mb-4">
            Welcome to Our Blog
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl">
            Explore insights, stories, and beautiful moments from paradise.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading blogs...</span>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-600 mb-4">
            {error.includes('Failed to fetch') ? 
              'Unable to load latest blogs. Showing available content.' : 
              error
            }
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : allBlogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">No blogs found. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 max-w-7xl mx-auto mt-10">
          {allBlogs.map((blog) => (
            <motion.div
              key={blog.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition duration-300"
              whileHover={{ scale: 1.02 }}
              onClick={() => handleBlogClick(blog)}
            >
              {blog.coverImage ? (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    // Fallback to assigned image if coverImage fails to load
                    e.target.src = getBlogImage(blog);
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    {blog.title?.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {blog.category || 'Real Estate'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(blog.createdAt || blog.publishedAt)}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 line-clamp-2">
                  {blog.title}
                </h2>
                {blog.subtitle && (
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {blog.subtitle}
                  </p>
                )}
                <p className="text-gray-600 text-sm line-clamp-3">
                  {blog.description}
                </p>
                <div className="pt-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlogClick(blog);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors duration-200"
                  >
                    Read more →
                  </button>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-500">
                    By {blog.author?.name || blog.author || 'Admin'}
                  </span>
                  <div className="flex space-x-3 text-xs text-gray-500">
                    <span>👁 {blog.views || 0}</span>
                    <span>❤ {blog.likes || 0}</span>
                    {blog.isHardcoded === false && (
                      <span className="bg-green-100 text-green-600 px-1 rounded text-xs">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Show status if there are both Firebase and hardcoded blogs */}
      {allBlogs.length > 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            Showing {allBlogs.length} article{allBlogs.length !== 1 ? 's' : ''}
            {error && ' (some content may be offline)'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogList;
