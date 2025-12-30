// Enhanced blog migration utility with hardcoded image support
import { blogs } from '../data/Blogs';
import { bulkAddBlogs } from '../firebase/firestore';
import { assignBlogImage } from '../utils/blogImageMapping';

/**
 * Migrate blogs from static data to Firestore with hardcoded images
 * @param {boolean} skipExisting - Whether to skip blogs that might already exist
 * @returns {Object} - Migration results
 */
export const migrateBlogsToFirestore = async (skipExisting = true) => {
  console.log('🚀 Starting blog migration to Firestore with hardcoded images...');
  
  try {
    // Prepare blogs data with proper formatting and images
    const preparedBlogs = blogs.map(blog => {
      // Clean and format the blog data
      const cleanBlog = {
        id: blog.id, // Keep original ID for reference
        title: blog.title,
        subtitle: blog.subtitle || '',
        description: blog.description,
        category: blog.category || 'Real Estate',
        author: typeof blog.author === 'string' ? {
          name: blog.author,
          email: '340realestateco@gmail.com',
          role: 'Team Member'
        } : {
          name: blog.author?.name || '340 Real Estate Team',
          email: blog.author?.email || '340realestateco@gmail.com',
          role: blog.author?.role || 'Team Member'
        },
        publishedAt: blog.publishedAt || blog.createdAt || new Date().toISOString().split('T')[0],
        status: 'published',
        tags: blog.tags || [],
        views: 0,
        likes: 0,
        featured: blog.featured || false,
        slug: blog.id, // Use ID as slug for URL consistency
        seo: {
          title: blog.title,
          description: blog.description?.substring(0, 160) + '...',
          keywords: [
            blog.category || 'Real Estate',
            'St. John',
            'USVI',
            '340 Real Estate',
            ...(blog.tags || [])
          ]
        },
        // This will be populated by assignBlogImage
        coverImage: null
      };
      
      // Assign hardcoded image based on content
      return assignBlogImage(cleanBlog);
    });

    console.log(`📝 Prepared ${preparedBlogs.length} blogs for migration`);
    
    // Show a preview of what will be migrated
    console.log('🔍 Preview of blogs to migrate:');
    preparedBlogs.slice(0, 3).forEach(blog => {
      console.log(`- ${blog.title} (${blog.category}) - Image: ${blog.coverImage?.split('/').pop()}`);
    });

    // Perform the migration
    const result = await bulkAddBlogs(preparedBlogs);
    
    if (result.success) {
      const successful = result.results.filter(r => r.success).length;
      const failed = result.results.filter(r => !r.success).length;
      
      console.log('✅ Migration completed!');
      console.log(`📊 Results: ${successful} successful, ${failed} failed`);
      
      if (failed > 0) {
        console.log('❌ Failed migrations:');
        result.results.forEach((r, index) => {
          if (!r.success) {
            console.log(`- ${preparedBlogs[index].title}: ${r.error}`);
          }
        });
      }
      
      return {
        success: true,
        totalBlogs: preparedBlogs.length,
        successful,
        failed,
        results: result.results
      };
    } else {
      throw new Error(result.error);
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Preview what the migration would do without actually migrating
 * @returns {Array} - Preview of prepared blog data
 */
export const previewMigration = () => {
  console.log('🔍 Previewing blog migration...');
  
  const preparedBlogs = blogs.map(blog => {
    const cleanBlog = {
      id: blog.id,
      title: blog.title,
      category: blog.category || 'Real Estate',
      publishedAt: blog.publishedAt || new Date().toISOString().split('T')[0],
      coverImage: null
    };
    
    return assignBlogImage(cleanBlog);
  });
  
  console.log(`📋 Found ${preparedBlogs.length} blogs to migrate:`);
  preparedBlogs.forEach((blog, index) => {
    console.log(`${index + 1}. ${blog.title}`);
    console.log(`   Category: ${blog.category}`);
    console.log(`   Image: ${blog.coverImage?.split('/').pop() || 'No image'}`);
    console.log('');
  });
  
  return preparedBlogs;
};

/**
 * Validate blog data before migration
 * @returns {Object} - Validation results
 */
export const validateBlogData = () => {
  console.log('🔍 Validating blog data...');
  
  const issues = [];
  const warnings = [];
  
  blogs.forEach((blog, index) => {
    // Required fields
    if (!blog.id) issues.push(`Blog ${index + 1}: Missing ID`);
    if (!blog.title) issues.push(`Blog ${index + 1}: Missing title`);
    if (!blog.description) issues.push(`Blog ${index + 1}: Missing description`);
    
    // Warnings for optional fields
    if (!blog.category) warnings.push(`Blog ${index + 1} (${blog.title}): Missing category`);
    if (!blog.publishedAt) warnings.push(`Blog ${index + 1} (${blog.title}): Missing publishedAt`);
    if (!blog.author) warnings.push(`Blog ${index + 1} (${blog.title}): Missing author`);
    
    // Check for potential image assignment
    const testBlog = assignBlogImage({ ...blog });
    if (!testBlog.coverImage) {
      warnings.push(`Blog ${index + 1} (${blog.title}): No image could be assigned`);
    }
  });
  
  console.log(`✅ Validation complete: ${issues.length} issues, ${warnings.length} warnings`);
  
  if (issues.length > 0) {
    console.log('❌ Issues found:');
    issues.forEach(issue => console.log(`- ${issue}`));
  }
  
  if (warnings.length > 0) {
    console.log('⚠️ Warnings:');
    warnings.forEach(warning => console.log(`- ${warning}`));
  }
  
  return {
    valid: issues.length === 0,
    issues,
    warnings,
    totalBlogs: blogs.length
  };
};

const blogMigrationUtils = {
  migrateBlogsToFirestore,
  previewMigration,
  validateBlogData
};

export default blogMigrationUtils;