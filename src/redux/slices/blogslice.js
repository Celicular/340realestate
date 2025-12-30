import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBlogs, getBlog } from "../../firebase/firestore";
import { getBlogImage } from "../../utils/blogImageMapping";
import realestateintro from "../../assets/articles/340realestate-intro.jpg";

// Import blog images from assets
import cruzbayImage from "../../assets/blog/cruse-bay.jpeg";
import wharfImage from "../../assets/blog/wharf.jpeg";
import mongooseImage from "../../assets/blog/Mongoose.jpeg";
import trunkbayImage from "../../assets/blog/Trunk-Bay.jpeg";

// Import blog3 images for the new parcel blog
import blog3Image1 from "../../assets/blog/blog3/1.jpg";
import blog3Image2 from "../../assets/blog/blog3/2.jpg";
import blog3Image3 from "../../assets/blog/blog3/3.jpg";
import blog3Image4 from "../../assets/blog/blog3/4.jpg";
import blog3Image5 from "../../assets/blog/blog3/5.jpg";

// Create the hardcoded blogs
const featuredBlogs = [
  {
    id: "get-to-know-st-john",
    title: "Get to Know St. John",
    description: `St. John is the smallest of the three US Virgin Islands. The island is just under 20 square miles, and more than two-thirds is National Park. Less than 5,000 residents live on the island full time, and tourism is the number one source of the economy.

## How to Get to St. John

St. John does not have an airport, so all travelers must arrive via ferry. (If you want to arrive in style, you can charter a private helicopter.) In season, which typically runs from early fall through mid-summer, flights arrive daily from nearly a dozen major airports including Boston, New York, Newark, Philadelphia, Washington DC, Charlotte, Atlanta, Ft. Lauderdale, and Miami among other places.

The majority of visitors arrive via ferry in Cruz Bay, which is the island's main town. Cruz Bay is very safe and walkable. St. John, as a whole, is extremely safe. Crime is nearly nonexistent.

There are a variety of shops, restaurants and bars located in and around Cruz Bay. The town has two main dining and shopping areas - Wharfside Village, which is located on the beach in Cruz Bay, and Mongoose Junction, which is located on the other side of town. It takes less than 10 minutes to walk from Wharfside Village to Mongoose Junction.

![Wharfside Hotel](` + wharfImage + `)
*Image credit: Wharfside Hotel*

![Mongoose Junction](` + mongooseImage + `)
*Image credit: Mongoose Junction*

The island is separated into three main areas - Cruz Bay, Coral Bay and the East End. Within these sections, there are a variety of neighbourhoods including Great Cruz Bay, Chocolate Hole, Rendezvous, Ditleff Point, Fish Bay, Peter Bay, Catherineberg, Carolina, Freeman's Ground, Privateer Bay, among others.

## What to Do in St. John

People who visit St. John typically engage in a variety of outdoor activities, including beach hopping, snorkeling, hiking, boating, paddle-boarding, kayaking, scuba diving, and more. St. John proudly boasts having one of the top-ranked beaches in the world - Trunk Bay.

![Trunk Bay](` + trunkbayImage + `)

## St. John Real Estate

The majority of the properties in St. John are investment properties. It is common that an owner spend only a fraction of a time at their villa or condo, while renting is as a vacation property the majority of the year. St. John vacation properties rent well, making many of them solid investments.

As of October 2025, there are 72 residential properties, 14 condos, 173 land parcels and seven commercial opportunities listed on St. John's MLS. [Click here to view 340 Real Estate's searchable MLS database](https://www.340realestate.com/mls).

340 Real Estate has an experienced team of brokers and sales agents who are dedicated to helping you find the perfect property - whether it's a cozy condo, sprawling land, a luxurious home or a commercial space. Whether you are planning a week-long getaway, a permanent relocation, or if you are looking to purchase an investment property, we're here to help. With more than 70 years of combined experience in St. John real estate, the 340 Real Estate team is ready to turn your dream into reality.`,
    coverImage: cruzbayImage,
    author: "Jenn Manes, 340 Real Estate Agent",
    publishedAt: "Oct 13, 25",
    category: "Lifestyle",
    isHardcoded: true,
    views: 0,
    likes: 0
  },
  {
    id: "340-real-estate-first-blog",
    title: "Welcome to 340 Real Estate's New Website!",
    description: `Welcome to our new website! We are always working to give a better experience to our customers, so we decided to modernize our website while making it much more user-friendly in the process. We've also decided to launch a new blog, so we can keep you informed about the happenings here at 340 Real Estate and around St. John too. We hope you enjoy the new look and services we've created for you.

Now that you're here – thank you so much for visiting – we'd like to introduce ourselves.

## Meet Our Broker and Owner

Tammy Donnelly launched 340 Real Estate in 2013. She has more than 25 years of experience selling real estate here on St. John. Tammy is 340 Real Estate's broker and owner.

Tammy has seven sales associates and one broker associate who work alongside her. Together the team has more than 70 years of combined real estate experience.

## The 340 Real Estate Team

Tammy Donnelly - Broker/Owner
Jennifer Doran - Sales Associate
Tina Petitto - Sales Associate
Rosanne Ramos Lloyd - Sales Associate
Jenn Manes - Sales Associate
Adonis Morton - Sales Associate
Mary Maroney - Sales Associate
John McCann - Broker Associate
Mark Shekleton - Sales Associate

We are an experienced team who is dedicated to helping you find the perfect property. Whether it's a cozy condo overlooking Cruz Bay, a luxurious home on St. John's famed North Shore, a sprawling piece of land with views of Coral Bay, the British Virgin Islands and beyond, or a commercial space located here in St. John, we will work tirelessly to help you find the ideal property to suit your wants and needs.

## A Great Feature for You!

Our new website has a user-friendly, fully searchable database of all St. John properties for sale, including homes, condos, land, and commercial businesses. It also includes a sales archive with more than 5,000 real estate sales dating back to 2009. You can explore historical trends by area, property type and timeframe. We work to provide you with all of the insights necessary to make a smart investment.

We are so proud of 340 Real Estate's new website, and we are excited to share all of this valuable information with you. Please check back here often to see what's new here at 340 Real Estate and what's happening around the island. You can find this page easily, simply by bookmarking it at [www.340realestate.com/blogs](https://340realestate.com/blogs).

For more information about our services or to search properties, visit our website at [340realestate.com](https://340realestate.com) or contact us directly.

**Contact Information:**
- Website: https://340realestate.com/
- Phone: +1 340-643-6068
- Email: 340realestateco@gmail.com
- Follow us on [Facebook](https://www.facebook.com/340realestateco/) and [Instagram](https://www.instagram.com/340realestateco/)

We look forward to helping you find your perfect piece of paradise in St. John!`,
    coverImage: realestateintro,
    author: "340 Real Estate Team",
    publishedAt: "Oct 8, 25",
    category: "Company News",
    isHardcoded: true,
    views: 2,
    likes: 0
  },
  {
    id: "two-affordable-parcels-coral-bay",
    title: "Two Affordable Parcels Listed For Sale & Owner Financing May Be Available",
    subtitle: "Are you looking to build a home here on St. John?",
    description: `
Are you looking to build a home here on St. John? Are you looking for gentle breezes and views of the harbor, the British Virgin Islands, or lush valleys—all while being close to Skinny Legs, Lime Out, and other great restaurants and shops in Coral Bay?

If so, you may be interested in one of the two properties that recently listed for sale.

## 8-36 Emmaus, Coral Bay

![Property Location – 8-36 Emmaus](` + blog3Image1 + `)

This quarter-acre lot is located in the **Seagrape Hill subdivision**, which you enter from Route 10 (Centerline Road) just before Skinny Legs in Coral Bay.

This property is priced to sell at **$99,000**. Owner financing may be available to qualified buyers, making this an even more attractive buy.

The property is accessed from **fully paved roads**, with **utilities nearby**. It features **westerly views of Coral Bay Harbor**, along with **lush valley views**.

The location is peaceful and private, yet still close to the action of Coral Bay. You could walk to Skinny Legs—though you probably wouldn't want to walk home uphill 🙂—but it really is that close.

![View Toward Coral Bay Harbor](` + blog3Image2 + `)

**Seagrape Hill highlights:**
- Located near Skinny Legs
- Across from the Coral Bay fire station
- Excellent breezes
- Views toward Coral Bay Harbor and Bordeaux Mountain
- Restaurants and shops just minutes away

**Full listing:**  
https://www.flexmls.com/share/CzzmB/8-36-Emmaus-Coral-Bay-St-John-US-VI-00830

This property is listed with **Jenn Manes** for **$99,000**.  
📧 jenn@explorestj.com  
📞 203-376-3786


## 10-25F Carolina, Coral Bay

![Road Access – 10-25F Carolina](` + blog3Image3 + `)

This **0.35-acre parcel** offers beautiful views of **Coral Bay Harbor**, the **Sir Francis Drake Channel**, the **British Virgin Islands**, and beyond.

The lot is located on **Bordeaux Mountain** and faces east. Access is relatively easy—drive up Route 108 from Coral Bay, take the second left, and the property will be on your left.

The land is currently a bit overgrown due to recent rains, but a small amount of clearing would reveal **spectacular water views**.

![Water Views After Clearing](` + blog3Image4 + `)

The current owners have **expired house plans** that they will provide to the new owners—an important advantage that can save both time and money during the building process.

![Expired Plans – Two-Story Home](` + blog3Image5 + `)

This property is also priced to sell, with **owner financing potentially available** to qualified buyers.

**Listing price:** **$115,000**  
**Agent:** Jenn Manes  
📧 jenn@explorestj.com  
📞 203-376-3786

## Looking for More Properties?

Want to see what else is listed for sale in St. John?

Search current MLS listings—including homes, condos, land, commercial, and fractional properties—at:

👉 https://340realestate.com/mls

Listings can be searched 24/7.`,
    coverImage: blog3Image1,
    author: "Jenn Manes, 340 Real Estate Agent",
    publishedAt: "Dec 31, 25",
    category: "Property News",
    isHardcoded: true,
    views: 0,
    likes: 0
  }
];

// Process hardcoded blogs with proper image mapping
const processHardcodedBlogs = () => {
  return featuredBlogs.map(blog => ({
    ...blog,
    // Use the mapped image instead of the variable reference
    coverImage: getBlogImage(blog),
    isHardcoded: true,
    // Keep the original publishedAt date as is
    publishedAt: blog.publishedAt || "Oct 8, 25",
    // Convert createdAt to timestamp (milliseconds) for Redux serialization
    createdAt: blog.createdAt || (blog.id === "get-to-know-st-john" ? new Date("2025-10-13").getTime() : new Date("2025-10-08").getTime()),
    // Add default values
    views: blog.views || 0,
    likes: blog.likes || 0,
    status: blog.status || 'published',
    author: blog.author || '340 Real Estate Team',
    category: blog.category || 'Real Estate'
  }));
};

// Get all hardcoded blogs
const hardcodedBlogs = processHardcodedBlogs();

// Async thunk for fetching blogs from Firestore (enhanced with hardcoded images)
export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (limitCount = 20) => {
    const result = await getBlogs(limitCount);
    if (result.success) {
      // Blogs are already filtered for published status in the service
      const blogsWithImages = result.data.map(blog => ({
        ...blog,
        coverImage: blog.coverImage || getBlogImage(blog),
        isHardcoded: false // Mark as Firebase blog
      }));
      return blogsWithImages;
    }
    throw new Error(result.error);
  }
);

// Async thunk for fetching a single blog (enhanced with hardcoded images)
export const fetchBlogById = createAsyncThunk(
  'blogs/fetchBlogById',
  async (blogId) => {
    // First check if it's a hardcoded blog
    const hardcodedBlog = hardcodedBlogs.find(blog => blog.id === blogId);
    if (hardcodedBlog) {
      return {
        ...hardcodedBlog,
        coverImage: hardcodedBlog.coverImage || getBlogImage(hardcodedBlog)
      };
    }
    
    // Try Firestore
    const result = await getBlog(blogId);
    if (result.success) {
      return { 
        ...result.data, 
        coverImage: result.data.coverImage || getBlogImage(result.data),
        isHardcoded: false 
      };
    }
    throw new Error(result.error);
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    // Firebase blogs and hardcoded blogs
    firebaseBlogs: [],
    allBlogs: [...hardcodedBlogs], // Start with the hardcoded blogs
    currentBlog: null,
    loading: false,
    error: null,
    lastFetch: null
  },
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add blog to local state (useful for real-time updates)
    addBlog: (state, action) => {
      state.firebaseBlogs.unshift(action.payload);
      // Combine blogs, prioritizing Firebase blogs first, then hardcoded blogs at the bottom
      const uniqueBlogs = [];
      const seenIds = new Set();
      
      // Add Firebase blogs first
      for (const blog of state.firebaseBlogs) {
        if (blog.id && !seenIds.has(blog.id)) {
          uniqueBlogs.push(blog);
          seenIds.add(blog.id);
        }
      }
      
      // Add hardcoded blogs at the bottom only if their ID hasn't been seen
      for (const blog of hardcodedBlogs) {
        if (blog.id && !seenIds.has(blog.id)) {
          uniqueBlogs.push(blog);
          seenIds.add(blog.id);
        }
      }
      
      state.allBlogs = uniqueBlogs;
    },
    // Update blog in local state
    updateBlogInState: (state, action) => {
      const { id, updates } = action.payload;
      const blogIndex = state.firebaseBlogs.findIndex(blog => blog.id === id);
      if (blogIndex !== -1) {
        state.firebaseBlogs[blogIndex] = { ...state.firebaseBlogs[blogIndex], ...updates };
        // Rebuild allBlogs with proper deduplication - Firebase first, hardcoded at bottom
        const uniqueBlogs = [];
        const seenIds = new Set();
        
        // Add Firebase blogs first
        for (const blog of state.firebaseBlogs) {
          if (blog.id && !seenIds.has(blog.id)) {
            uniqueBlogs.push(blog);
            seenIds.add(blog.id);
          }
        }
        
        // Add hardcoded blogs at the bottom only if their ID hasn't been seen
        for (const blog of hardcodedBlogs) {
          if (blog.id && !seenIds.has(blog.id)) {
            uniqueBlogs.push(blog);
            seenIds.add(blog.id);
          }
        }
        
        state.allBlogs = uniqueBlogs;
      }
      if (state.currentBlog && state.currentBlog.id === id) {
        state.currentBlog = { ...state.currentBlog, ...updates };
      }
    },
    // Remove blog from local state
    removeBlogFromState: (state, action) => {
      const blogId = action.payload;
      state.firebaseBlogs = state.firebaseBlogs.filter(blog => blog.id !== blogId);
      
      // Rebuild with proper deduplication - Firebase first, hardcoded at bottom
      const uniqueBlogs = [];
      const seenIds = new Set();
      
      // Add Firebase blogs first, but skip if it's the one being removed
      for (const blog of state.firebaseBlogs) {
        if (blog.id && !seenIds.has(blog.id)) {
          uniqueBlogs.push(blog);
          seenIds.add(blog.id);
        }
      }
      
      // Add hardcoded blogs at the bottom only if their ID hasn't been seen and it's not being removed
      for (const blog of hardcodedBlogs) {
        if (blog.id && blog.id !== blogId && !seenIds.has(blog.id)) {
          uniqueBlogs.push(blog);
          seenIds.add(blog.id);
        }
      }
      
      state.allBlogs = uniqueBlogs;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.firebaseBlogs = action.payload;
        // Combine blogs, prioritizing Firebase blogs first, then hardcoded blogs at the bottom
        const uniqueBlogs = [];
        const seenIds = new Set();
        
        // Add Firebase blogs first
        for (const blog of action.payload) {
          if (blog.id && !seenIds.has(blog.id)) {
            uniqueBlogs.push(blog);
            seenIds.add(blog.id);
          }
        }
        
        // Add hardcoded blogs at the bottom only if their ID hasn't been seen
        for (const blog of hardcodedBlogs) {
          if (blog.id && !seenIds.has(blog.id)) {
            uniqueBlogs.push(blog);
            seenIds.add(blog.id);
          }
        }
        
        state.allBlogs = uniqueBlogs;
        state.lastFetch = new Date().toISOString();
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // If Firebase fails, show only the hardcoded blogs
        state.allBlogs = [...hardcodedBlogs];
      })
      // Fetch single blog
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.currentBlog = null;
      });
  },
});

export const { 
  clearCurrentBlog, 
  clearError, 
  addBlog, 
  updateBlogInState, 
  removeBlogFromState 
} = blogSlice.actions;

// Selectors
export const selectAllBlogs = (state) => state.blogs.allBlogs;
export const selectFirebaseBlogs = (state) => state.blogs.firebaseBlogs;
export const selectCurrentBlog = (state) => state.blogs.currentBlog;
export const selectBlogsLoading = (state) => state.blogs.loading;
export const selectBlogsError = (state) => state.blogs.error;
export const selectBlogsLastFetch = (state) => state.blogs.lastFetch;

export default blogSlice.reducer;
