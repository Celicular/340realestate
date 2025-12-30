import React, { useState, useEffect } from 'react';
import { getBlogs, deleteBlog, updateBlog } from '../../firebase/firestore';
import BlogForm from './BlogForm';
import { Edit, Trash2, Eye, EyeOff, Plus } from 'lucide-react';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const result = await getBlogs(50);
      if (result.success) {
        setBlogs(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const result = await deleteBlog(blogId);
        if (result.success) {
          setBlogs(blogs.filter(blog => blog.id !== blogId));
        } else {
          alert('Failed to delete blog: ' + result.error);
        }
      } catch (err) {
        alert('Failed to delete blog');
      }
    }
  };

  const handleStatusToggle = async (blogId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const result = await updateBlog(blogId, { status: newStatus });
      if (result.success) {
        setBlogs(blogs.map(blog => 
          blog.id === blogId ? { ...blog, status: newStatus } : blog
        ));
      } else {
        alert('Failed to update blog status: ' + result.error);
      }
    } catch (err) {
      alert('Failed to update blog status');
    }
  };

  const formatDate = (dateField) => {
    if (!dateField) return 'Unknown';
    
    let date;
    if (dateField.seconds) {
      date = new Date(dateField.seconds * 1000);
    } else if (dateField instanceof Date) {
      date = dateField;
    } else if (typeof dateField === 'string') {
      date = new Date(dateField);
    } else {
      return 'Unknown';
    }
    
    // Format date with 2-digit year
    const options = { 
      year: '2-digit', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading blogs...</span>
      </div>
    );
  }

  if (showForm) {
    return (
      <BlogForm
        onSuccess={() => {
          setShowForm(false);
          fetchBlogs();
        }}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>New Blog</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600">No blogs found. Create your first blog!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                      {blog.title}
                    </div>
                    {blog.subtitle && (
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {blog.subtitle}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {blog.author?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      blog.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {blog.category || 'Real Estate'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {blog.views || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(blog.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusToggle(blog.id, blog.status)}
                        className={`p-1 rounded ${
                          blog.status === 'published'
                            ? 'text-yellow-600 hover:text-yellow-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                        title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {blog.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => setEditingBlog(blog)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;