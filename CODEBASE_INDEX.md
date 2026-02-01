# 340 Real Estate - Codebase Index & Architecture

## 📋 Project Overview
**340 Real Estate** is a modern React-based real estate platform for St. John, USVI. It features luxury vacation rental management, property sales listings, an agent directory, blog functionality, and admin/agent dashboards.

**Tech Stack:**
- **Frontend:** React 19 with React Router v7
- **State Management:** Redux Toolkit
- **Backend Services:** Firebase (Auth, Firestore, Storage)
- **Additional Services:** Supabase, MapTiler, EmailJS
- **Styling:** Tailwind CSS
- **Build Tool:** React Scripts

---

## 🏗️ Core Architecture

### Entry Point
- **[src/index.js](src/index.js)** - React root with Redux Provider & HashRouter
- **[src/App.js](src/App.js)** - Main app component with 40+ lazy-loaded routes
- **[src/index.css](src/index.css)** - Global styles

### Key Features:
- ✅ Lazy loading all pages for performance
- ✅ Error boundary for error handling
- ✅ Analytics tracking (Google Analytics 4)
- ✅ Responsive header/footer layout

---

## 🔐 Authentication & Authorization

### Auth System
**File:** [src/auth/AuthProvider.js](src/auth/AuthProvider.js)
- Context-based auth using Firebase
- Stores user & role in `sessionStorage`
- Tracks auth state with `onAuthStateChanged`
- Fetches user role from Firestore `users` collection

**Auth Operations:** [src/firebase/auth.js](src/firebase/auth.js)
- `registerUser()` - Create account with email/password
- `loginUser()` - Sign in
- `logoutUser()` - Sign out
- `resetPassword()` - Password reset via email
- `updateProfile()` - Update display name

**Protected Routes:** [src/components/auth/ProtectedRoute.jsx](src/components/auth/ProtectedRoute.jsx)
- Restricts pages to authenticated users
- Checks user role (admin, agent, customer)

---

## 🔥 Firebase Integration

### Configuration
**File:** [src/firebase/config.js](src/firebase/config.js)
- Initializes Firebase with environment variables
- Exports: `auth`, `db` (Firestore), `storage`

### Firestore Collections & Operations
**File:** [src/firebase/firestore.js](src/firebase/firestore.js) (1415 lines)

**Key Collections:**
| Collection | Purpose |
|-----------|---------|
| `users` | User profiles & roles |
| `rentalProperties` | Vacation rentals (from agent forms) |
| `saleProperties` | Properties for sale |
| `residentialPortfolio` | Residential property listings |
| `landPortfolio` | Land listings |
| `properties` | General properties |
| `viewingRequests` | Property viewing requests |
| `blogs` | Blog posts |
| `contacts` | Contact form submissions |
| `reviews` | Testimonials/reviews |
| `agents` | Agent information |

**Core Functions:**
- `addRentalProperty()` / `addSaleProperty()` - Submit from agent forms
- `getRentalProperties()` - Fetch approved rentals
- `updateRentalProperty()` - Admin updates
- `deleteRentalProperty()` - Remove properties
- `addViewingRequest()` - Book property viewing
- `addBlog()` / `getBlog()` / `updateBlog()` - Blog CRUD
- `addReview()` / `getReviews()` - Manage testimonials
- Real-time listeners: `onSnapshot()` for live updates

---

## 📦 State Management (Redux)

### Store Configuration
**File:** [src/redux/store.js](src/redux/store.js)
```javascript
{
  villa: villaSlice,    // Rental properties & booking
  blogs: blogSlice      // Blog data
}
```

### Villa Slice
**File:** [src/redux/slices/villaSlice.js](src/redux/slices/villaSlice.js)

**State Structure:**
```javascript
{
  villas: [],                    // All approved rental properties
  selectedVilla: null,           // Currently selected rental
  loading: false,                // Fetch status
  error: null,                   // Error messages
  bookingDetails: {
    checkIn: null,
    checkOut: null,
    guests: 1,
    message: ""
  }
}
```

**Async Thunk:**
- `fetchVillas` - Gets approved rentals from Firestore

**Reducers:**
- `selectVilla()` - Choose rental by name
- `setBookingDates()` - Set check-in/out dates
- `setGuests()` - Set guest count
- `setMessage()` - Add booking message
- `resetBooking()` - Clear booking form

### Blog Slice
**File:** [src/redux/slices/blogslice.js](src/redux/slices/blogslice.js)
- Manages blog data & selected blog
- Async thunks for fetching blogs

---

## 📄 Pages & Routes

### Main Pages
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Home.jsx | Landing page with sections |
| `/aboutus` | AboutUs.jsx | About the company |
| `/about` | About.jsx | About St. John island |
| `/rental/:slug` | RentalDetail.jsx | Single rental property detail |
| `/properties` | Properties.jsx | All properties for sale |
| `/mls` | Mls.jsx | MLS property search |
| `/agent/:id` | AgentDetail.jsx | Individual agent profile |
| `/blog` | BlogList.jsx | All blog posts |
| `/blog/:slug` | BlogDetails.jsx | Single blog post |
| `/contact` | Contactus.jsx | Contact form |
| `/login` | Login.jsx | User login |
| `/register` | Register.jsx | User registration |

### Admin/Agent Pages
| Route | Component | Purpose |
|-------|-----------|---------|
| `/admin` | AdminDashboard.jsx | Admin control panel |
| `/agent-dashboard` | AgentDashboard.jsx | Agent dashboard |
| `/rental-approval` | RentalApproval.jsx | Approve rental submissions |
| `/sale-approval` | SaleApproval.jsx | Approve sale submissions |
| `/booking-management` | BookingManagement.jsx | Manage bookings |

### Utility Pages
- `/attractions` - St. John attractions
- `/testimonial` - Customer testimonials
- `/privacy` - Privacy policy
- `/terms` - Terms of use
- `/debug` - Debug page (development)

---

## 🎨 Component Structure

### Layout Components
**Path:** [src/components/Layout/](src/components/Layout/)
- **Header.js** - Navigation with dropdown menus, fetches rentals
- **Footer.jsx** - Footer with links & info
- **Breadcrumb.jsx** - Navigation breadcrumbs

### Home Page Sections
**Path:** [src/components/home/](src/components/home/)
```
Hero/
├── HeroSection.jsx         # Main hero banner
Sections/
├── AboutSection.jsx        # About company
├── AgentsSection.jsx       # Featured agents
├── ContactSection.jsx      # Contact form
├── GallerySection.jsx      # Image gallery
├── RentalsSection.jsx      # Featured rentals
├── TeamSection.jsx         # Team members
├── HeroLogos.jsx          # Brand logos
└── AnniversarySection.jsx # Anniversary info
```

### Properties Components
**Path:** [src/components/properties/](src/components/properties/)
- **PropertyDetail.jsx** - Single property view
- **PropertiesForSale.jsx** - Listing of properties for sale
- **PropertiesHero.jsx** - Hero section for properties page

### Rental Components
**Path:** [src/components/rental/](src/components/rental/) + [src/components/landsold/](src/components/landsold/)
- **RentalDetail.jsx** - Single rental property (villa) details
- **RentalDetailPage.jsx** - Rental page wrapper
- **LandPropertyDetail.jsx** - Land property details
- **LandSoldDetail.jsx** - Sold land property details

### Blog Components
**Path:** [src/components/blog/](src/components/blog/)
- **BlogList.jsx** - All blog posts grid
- **BlogDetails.jsx** - Single blog post view
- **BlogForm.jsx** - Create/edit blog
- **BlogManagement.jsx** - Admin blog management

### Admin Components
**Path:** [src/components/admin/](src/components/admin/)
- **AgentApproval.jsx** - Approve agent submissions
- **RentalApproval.jsx** - Approve rental listings
- **RentalPropertyApproval.jsx** - Alternative rental approval
- **SaleApproval.jsx** - Approve sale listings
- **SoldApproval.jsx** - Manage sold properties
- **BookingManagement.jsx** - Manage reservations
- **UserManagement/** - User admin panel
- **PortfolioManagement/** - Manage property portfolios
- **Viewing/** - Manage property viewings
  - EditViewingProperty.jsx
  - DeleteViewingProperty.jsx

### Agent Components
**Path:** [src/components/agent/](src/components/agent/)
- **AgentDetail.jsx** - Individual agent profile
- **AgentRentalDashboard.jsx** - Agent's rental submissions
- **AgentMigrationTool.jsx** - Data migration tool

### Other Key Components
- **[src/components/Chatbot.js](src/components/Chatbot.js)** - AI chatbot widget
- **[src/components/AnalyticsTracker.jsx](src/components/AnalyticsTracker.jsx)** - Google Analytics
- **[src/components/ScrollToTop.jsx](src/components/ScrollToTop.jsx)** - Auto-scroll on route change
- **[src/components/SEO/SEOHead.jsx](src/components/SEO/SEOHead.jsx)** - SEO meta tags & JSON-LD
- **[src/components/common/ErrorBoundary.jsx](src/components/common/ErrorBoundary.jsx)** - Error catching

---

## 📊 Data Management

### Static/Local Data
**Path:** [src/data/](src/data/)

**agentsData.js** (175 lines)
- Local hardcoded agent information
- Contains: Tammy Donnelly, Tina Petitto, Jennifer Doran, etc.
- Properties: name, bio, email, phone, specialties, images
- `getAgentById()` - Lookup function

**agentsDataFirebase.js**
- Fetches agents from Firestore dynamically
- `fetchAgentsData()` - Async fetch from DB
- Fallback to hardcoded data on error

**Blogs.js** (2549 lines)
- Large blog post data (mostly commented out - legacy)
- Being migrated to Firestore
- Contains markdown content, images, metadata

**SalesData.js** (916 lines)
- Legacy hardcoded property data (commented out)
- Historical reference only
- Now uses Firestore for live data

**PropertyImages.js**
- Maps property IDs to local image assets
- `getPropertyImages()` - Returns image array for property
- Fallback for properties without cloud storage

**LandSaleData.js**
- Land property listings data

---

## 🛠️ Utilities & Services

### Services
**Path:** [src/services/](src/services/)
- **emailService.js** - EmailJS integration for forms

### Utility Functions
**Path:** [src/utils/](src/utils/)

| File | Purpose |
|------|---------|
| `auth.js` | Auth helpers |
| `slugify.js` | URL slug generation |
| `seoUtils.js` | SEO helpers (JSON-LD, meta) |
| `uploadImage.js` | Firebase Storage upload |
| `uploadImagesToSupabase.js` | Supabase image upload |
| `blogImageMapping.js` | Blog image association |
| `normalizeRental.js` | Data normalization |
| `deleteImageFromFirebase.js` | Remove cloud images |
| `fixImageUrl.js` | Image URL correction |
| `sitemapGenerator.js` | Generate XML sitemap |
| `debugAuth.js` | Auth debugging |
| `debugFirebase.js` | Firebase debugging |

---

## 🖼️ Assets

**Path:** [src/assets/](src/assets/)
```
assets/
├── agent/                    # Agent profile photos
│   ├── tammy/
│   ├── tina/
│   ├── Jenn/
│   └── adronis/
├── villa/                    # Villa/rental property images
│   ├── stilwater/
│   ├── ripple/
│   ├── casa-amor/
│   ├── moonglow/
│   └── wind/
├── articles/                 # Blog post images
├── gallery/                  # Gallery images
├── blog/                     # Blog section images
├── home/                     # Home page images
│   ├── homehero/
│   ├── herosale/
│   └── testimonials/
├── logo/                     # Logo variants
├── tab/                      # Tab icons
├── video/                    # Video assets
├── Land/                     # Land property images
└── Cottage/                  # Cottage images
```

---

## 🔄 Data Flow Examples

### 1. Rental Property Display Flow
```
Header.jsx
  ↓
fetchRentalProperties() [firestore.js]
  ↓
Firestore: rentalProperties collection
  ↓
Redux villa slice (fetchVillas thunk)
  ↓
Component displays data + booking form
  ↓
User books → addViewingRequest() to Firestore
```

### 2. Blog Display Flow
```
BlogList.jsx
  ↓
fetchBlogs() [firestore.js]
  ↓
Firestore: blogs collection
  ↓
Redux blogs slice
  ↓
BlogDetails.jsx renders individual post
```

### 3. Admin Workflow
```
Agent submits rental form
  ↓
addRentalProperty() → Firestore (status: pending)
  ↓
Admin dashboard shows pending items
  ↓
Admin approves → updateRentalProperty() (status: approved)
  ↓
Property appears on main site
```

### 4. Authentication Flow
```
User registers/logs in
  ↓
Firebase Auth: createUserWithEmailAndPassword/signInWithEmailAndPassword
  ↓
onAuthStateChanged triggers
  ↓
AuthProvider fetches user role from Firestore
  ↓
Role stored in sessionStorage
  ↓
ProtectedRoute checks role for access
```

---

## 📱 Key Features

### 1. **Rental Property Management**
- Browse approved vacation rentals
- Detailed property pages with images, amenities, pricing
- Booking request system
- Virtual tours (uses React Three Fiber)

### 2. **Property Sales Listings**
- Residential properties for sale
- Land properties
- Sold property history (archive)
- Advanced search/filtering
- MLS integration

### 3. **Agent Directory**
- Browse real estate agents
- Individual agent profiles with contact
- Agent specialties & experience
- Agent photo galleries

### 4. **Blog System**
- Blog post listing with categories
- Individual post views with markdown rendering
- SEO optimized
- Image associations
- Admin blog management

### 5. **Admin Dashboard**
- Property approval workflows
- Rental submissions review
- Sale property approval
- Booking management
- Contact inquiries
- User management
- Blog management
- Portfolio management

### 6. **User Authentication**
- Email/password registration
- Login/logout
- Password reset
- Role-based access (admin, agent, customer)

### 7. **Contact & Communication**
- Contact form (sends via EmailJS)
- Property viewing requests
- Chatbot widget
- Review/testimonial system

### 8. **SEO & Analytics**
- Meta tags & Open Graph
- JSON-LD structured data
- Google Analytics 4 tracking
- XML sitemap generation
- Breadcrumb navigation

---

## 🌐 External Integrations

### Firebase
- **Auth:** User registration & login
- **Firestore:** All data storage
- **Storage:** Image & media files

### Supabase
- Alternative/complementary database (config in [src/supabase/](src/supabase/))

### Third-Party Services
- **EmailJS** - Form email delivery
- **MapTiler** - Maps for property locations
- **Google Analytics** - User analytics
- **Leaflet** - Interactive maps
- **Chart.js** - Dashboard charts

### Libraries
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Three Fiber** - 3D views
- **React Router** - Navigation
- **Redux Toolkit** - State management

---

## 📝 Configuration Files

| File | Purpose |
|------|---------|
| [package.json](package.json) | Dependencies & scripts |
| [tailwind.config.js](tailwind.config.js) | Tailwind CSS config |
| [postcss.config.js](postcss.config.js) | PostCSS plugins |
| [firebase.json](firebase.json) | Firebase hosting config |
| [firestore.rules](firestore.rules) | Firestore security rules |
| [render.yaml](render.yaml) | Render deployment config |

---

## 🚀 Deployment

- **Build:** `npm run build` → [build/](build/) folder
- **Hosting:** Firebase Hosting (configured in firebase.json)
- **Alternative:** Render (render.yaml config available)
- **Environment:** HashRouter for hash-based routing (no server rewrites needed)

---

## 📊 Database Schema (Firestore)

### Users Collection
```javascript
{
  uid: string,
  email: string,
  role: "admin" | "agent" | "customer",
  createdAt: timestamp
}
```

### Rental Properties Collection
```javascript
{
  propertyInfo: {
    name: string,
    description: string,
    location: string,
    bedrooms: number,
    bathrooms: number,
    amenities: [string],
    pricePerNight: number,
    images: [url]
  },
  agentInfo: {
    name: string,
    email: string,
    role: string
  },
  status: "pending" | "approved" | "rejected",
  submittedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Blogs Collection
```javascript
{
  title: string,
  slug: string,
  description: string (markdown),
  coverImage: url,
  author: string,
  category: string,
  tags: [string],
  publishedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Viewing Requests Collection
```javascript
{
  propertyId: string,
  propertyName: string,
  visitorName: string,
  visitorEmail: string,
  visitorPhone: string,
  preferredDate: timestamp,
  message: string,
  status: "pending" | "confirmed" | "completed",
  createdAt: timestamp
}
```

---

## 🔍 Development Notes

### Performance Optimizations
- ✅ Lazy loading all pages
- ✅ Redux for state management (avoid prop drilling)
- ✅ Image compression with browser-image-compression
- ✅ Real-time listeners with Firestore (instead of polling)

### Code Quality
- Error boundaries for error handling
- Console error logging
- Try-catch blocks in async operations
- Validation in forms

### TODO/Known Issues
- Blog data migration (from hardcoded to Firestore complete)
- Property images on cloud storage
- Some legacy data references (mostly commented out)

---

## 📂 Quick File Reference

| Need | Location |
|------|----------|
| Add new page | [src/pages/](src/pages/) |
| Add admin feature | [src/components/admin/](src/components/admin/) |
| Add form | [src/components/forms/](src/components/forms/) |
| Firebase query | [src/firebase/firestore.js](src/firebase/firestore.js) |
| Style page | [src/App.css](src/App.css) + Tailwind classes |
| Redux state | [src/redux/slices/](src/redux/slices/) |
| API utility | [src/utils/](src/utils/) |
| Environment vars | `.env.local` (not in repo - Firebase keys) |

---

## 🎯 How Things Work - Summary

1. **User visits site** → React loads with lazy-loaded pages
2. **Header fetches rental properties** → Real-time from Firestore
3. **User browses** → Data from static files (agents) + Firestore (properties, blogs)
4. **User books/requests** → Data saved to Firestore collection
5. **Admin reviews** → AdminDashboard shows pending submissions
6. **Admin approves** → Status updated → Property/blog goes live
7. **Analytics tracked** → Google Analytics 4
8. **SEO optimized** → JSON-LD, meta tags, sitemap

---

**Last Updated:** February 2026  
**Codebase Size:** ~40+ components, 1415+ lines of Firestore queries, 2500+ lines of blog content
