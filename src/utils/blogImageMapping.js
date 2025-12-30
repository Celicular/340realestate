// Blog Image Mapping - Hardcoded images for consistent display
import realestateintro from "../assets/articles/340realestate-intro.jpg";
import choosinghome from "../assets/articles/choosing-home-builder.jpeg";
import firsthome from "../assets/articles/first-home-buying-stjohn.jpeg";
import homebuying from "../assets/articles/home-buying-tips-stjohn.jpg";
import homeloan from "../assets/articles/home-loan-eligibility.png";
import homevalue from "../assets/articles/home-values-stjohn.jpeg";
import interiordesign from "../assets/articles/interior-design.jpeg";
import localevent from "../assets/articles/local-events-stjohn.jpg";
import mortagerates from "../assets/articles/mortgage-rates-stjohn.jpeg";
import mortagetypes from "../assets/articles/mortgage-types.jpg";
import tenant from "../assets/articles/tenant.jpg";
import openhouse from "../assets/articles/open-house-pros-cons.jpeg";
import propertymanagement from "../assets/articles/property-management-usvi.jpg";
import propertytax from "../assets/articles/property-tax-stjohn.jpeg";
import propertytour from "../assets/articles/property-tour-importance.jpeg";
import propertytypes from "../assets/articles/property-types-stjohn.jpg";
import realestate from "../assets/articles/real-estate-stjohn.jpeg";
import realestatetech from "../assets/articles/real-estate-tech.jpg";
import renting from "../assets/articles/renting-vs-buying.jpeg";
import stthomas from "../assets/articles/st-thomas-carnival.jpg";
import beach from "../assets/articles/stjohn-beaches.jpeg";
import paradisediscovered from "../assets/articles/paradise-discovered.png";
import relocating from "../assets/articles/relocating.jpg";
import honeymoonbeach from "../assets/articles/Honeymoon-Beach.jpg";
import memorial from "../assets/articles/memorial.jpg";
import viewproperty from "../assets/articles/viewproperty.jpg";
import exploreisland from "../assets/articles/exploreisland.jpg";
import toprealtor from "../assets/articles/toprealtor.jpeg";

// Default fallback images for different categories
const categoryImages = {
  'Company News': realestateintro,
  'Real Estate': realestate,
  'Market Analysis': homevalue,
  'Buying Guide': firsthome,
  'Property Management': propertymanagement,
  'Lifestyle': beach,
  'Events': localevent,
  'Finance': homeloan,
  'Investment': renting,
  'Technology': realestatetech,
  'Education': exploreisland,
  'Legal': tenant,
  'default': realestateintro
};

// Topic-based image mapping for auto-assignment
const topicImageMapping = {
  // Real Estate Topics
  'buying': firsthome,
  'selling': openhouse,
  'renting': renting,
  'rental': tenant,
  'property': propertytour,
  'home': homevalue,
  'house': choosinghome,
  'villa': honeymoonbeach,
  'condo': propertytypes,
  'land': viewproperty,
  'companies': toprealtor,
  'realtors': toprealtor,
  'real estate companies': toprealtor,
  'top 5': toprealtor,
  'expert home buying': homebuying,
  'home buying tips': homebuying,
  'buying tips': homebuying,
  
  // Financial Topics
  'mortgage': mortagerates,
  'loan': homeloan,
  'finance': mortagetypes,
  'tax': propertytax,
  'investment': renting,
  
  // Location Specific
  'stjohn': beach,
  'st john': beach,
  'saint john': beach,
  'get to know': beach,
  'know st john': beach,
  'trunk bay': beach,
  'wharfside': beach,
  'mongoose junction': beach,
  'usvi': stthomas,
  'virgin islands': paradisediscovered,
  'caribbean': honeymoonbeach,
  'paradise': paradisediscovered,
  'beach': beach,
  'coral bay': beach,
  'cruz bay': beach,
  
  // Lifestyle & Events
  'carnival': stthomas,
  'event': localevent,
  'memorial': memorial,
  'education': exploreisland,
  'transportation': honeymoonbeach,
  'guide': relocating,
  
  // Services
  'management': propertymanagement,
  'interior': interiordesign,
  'design': interiordesign,
  'technology': realestatetech,
  'tech': realestatetech,
  
  // Company Related
  '340 real estate': realestateintro,
  'welcome': realestateintro,
  'team': realestateintro,
  'company': realestateintro
};

/**
 * Get hardcoded image for a blog based on various factors
 * @param {Object} blog - Blog object with title, category, tags, etc.
 * @returns {string} - Image URL/path
 */
export const getBlogImage = (blog) => {
  if (!blog) return categoryImages.default;
  
  // First check if blog already has a coverImage
  if (blog.coverImage) return blog.coverImage;
  
  // Check by specific blog ID for exact matches
  const blogId = blog.id?.toLowerCase() || '';
  
  // Specific blog ID mappings
  const idMappings = {
    '340-real-estate-first-blog': realestateintro,
    'get-to-know-st-john': beach,
    'tenant-rights': tenant,
    'paradise-discovered': paradisediscovered,
    'guide-buying-stjohn': relocating,
    'transportation-guide-stjohn': honeymoonbeach,
    'memorial-day-usvi': memorial,
    'property-viewing-tips': viewproperty,
    'education-stjohn': exploreisland,
    'st-thomas-carnival': stthomas,
    'open-house-pros-cons': openhouse,
    'home-loan-eligibility': homeloan,
    'renting-vs-buying': renting,
    'property-tour-importance': propertytour,
    'property-types-stjohn': propertytypes,
    'choosing-home-builder': choosinghome,
    'real-estate-tech': realestatetech,
    'property-management-usvi': propertymanagement,
    'interior-design': interiordesign,
    'mortgage-types': mortagetypes,
    'home-values-stjohn': homevalue,
    'property-tax-stjohn': propertytax,
    'mortgage-rates-stjohn': mortagerates,
    'first-home-buying-stjohn': firsthome,
    'local-events-stjohn': localevent,
    'top-realtors-usvi': toprealtor,
    'home-buying-tips-stjohn': homebuying
  };
  
  if (idMappings[blogId]) {
    return idMappings[blogId];
  }
  
  // Check by category
  if (blog.category && categoryImages[blog.category]) {
    return categoryImages[blog.category];
  }
  
  // Check by title keywords
  const title = (blog.title || '').toLowerCase();
  for (const [keyword, image] of Object.entries(topicImageMapping)) {
    if (title.includes(keyword)) {
      return image;
    }
  }
  
  // Check by tags if available
  if (blog.tags && Array.isArray(blog.tags)) {
    for (const tag of blog.tags) {
      const tagLower = tag.toLowerCase();
      if (topicImageMapping[tagLower]) {
        return topicImageMapping[tagLower];
      }
    }
  }
  
  // Check by description keywords (first 200 characters)
  if (blog.description) {
    const description = blog.description.toLowerCase().substring(0, 200);
    for (const [keyword, image] of Object.entries(topicImageMapping)) {
      if (description.includes(keyword)) {
        return image;
      }
    }
  }
  
  // Fallback to category default or main default
  return categoryImages[blog.category] || categoryImages.default;
};

/**
 * Get a random image from a specific category
 * @param {string} category - Category name
 * @returns {string} - Image URL/path
 */
export const getRandomCategoryImage = (category = 'default') => {
  return categoryImages[category] || categoryImages.default;
};

/**
 * Get all available category images
 * @returns {Object} - Object with category keys and image values
 */
export const getAllCategoryImages = () => {
  return { ...categoryImages };
};

/**
 * Assign image to blog data before saving to Firestore
 * @param {Object} blogData - Blog data to be saved
 * @returns {Object} - Blog data with assigned coverImage
 */
export const assignBlogImage = (blogData) => {
  if (!blogData.coverImage) {
    blogData.coverImage = getBlogImage(blogData);
  }
  return blogData;
};

const blogImageUtils = {
  getBlogImage,
  getRandomCategoryImage,
  getAllCategoryImages,
  assignBlogImage,
  categoryImages,
  topicImageMapping
};

export default blogImageUtils;