import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import blogsData from '../data/Blogs.js';

// Function to migrate blogs from static data to Firestore
export const migrateBlogsToFirestore = async () => {
  const BLOGS_COLLECTION = 'blogs';
  const results = {
    success: 0,
    skipped: 0,
    errors: 0,
    details: []
  };

  console.log(`Starting migration of ${blogsData.length} blogs to Firestore...`);

  for (const blog of blogsData) {
    try {
      // Check if blog already exists by checking the original ID
      const existingBlogQuery = query(
        collection(db, BLOGS_COLLECTION),
        where('originalId', '==', blog.id)
      );
      const existingBlogs = await getDocs(existingBlogQuery);

      if (!existingBlogs.empty) {
        console.log(`Blog with ID ${blog.id} already exists in Firestore, skipping...`);
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
      
      console.log(`✅ Successfully migrated blog: ${blog.title} (ID: ${docRef.id})`);
      results.success++;
      results.details.push({
        id: blog.id,
        firestoreId: docRef.id,
        title: blog.title,
        status: 'success'
      });

    } catch (error) {
      console.error(`❌ Error migrating blog ${blog.id}:`, error);
      results.errors++;
      results.details.push({
        id: blog.id,
        title: blog.title || 'Unknown',
        status: 'error',
        error: error.message
      });
    }
  }

  console.log('\n=== Migration Summary ===');
  console.log(`✅ Successfully migrated: ${results.success} blogs`);
  console.log(`⏭️  Skipped (already exist): ${results.skipped} blogs`);
  console.log(`❌ Errors: ${results.errors} blogs`);
  console.log('=========================\n');

  if (results.errors > 0) {
    console.log('Error details:');
    results.details
      .filter(detail => detail.status === 'error')
      .forEach(detail => {
        console.log(`- ${detail.title}: ${detail.error}`);
      });
  }

  return results;
};

// Function to run migration if this file is executed directly
export const runMigration = async () => {
  try {
    console.log('🚀 Starting blog migration to Firestore...\n');
    const results = await migrateBlogsToFirestore();
    
    if (results.success > 0) {
      console.log('🎉 Migration completed successfully!');
      console.log('You can now:');
      console.log('1. Update your UI to fetch blogs from Firestore');
      console.log('2. Remove the hardcoded blog imports');
      console.log('3. Test the blog functionality');
    } else {
      console.log('⚠️  No new blogs were migrated. Check if blogs already exist in Firestore.');
    }
    
    return results;
  } catch (error) {
    console.error('💥 Migration failed:', error);
    throw error;
  }
};

// Export individual functions for testing
export { blogsData };