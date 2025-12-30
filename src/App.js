import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import ErrorBoundary from "./components/common/ErrorBoundary";

import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
// import Breadcrumb from "./components/Layout/Breadcrumb";
import ChatbotButton from "./components/Chatbot";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AnalyticsTracker from "./components/AnalyticsTracker";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Insentive = lazy(() => import("./pages/Insentive"));
const Testimonial = lazy(() => import("./pages/Testimonial"));
const VillaDetail = lazy(() => import("./pages/VillaDetail"));
const RentalDetail = lazy(() => import("./pages/RentalDetail"));
const SalesHistory = lazy(() => import("./pages/SalesHistory"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const BlogList = lazy(() => import("./components/blog/BlogList"));
const Attraction = lazy(() => import("./pages/Attraction"));
const Contactus = lazy(() => import("./pages/Contactus"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const SearchMlsMain = lazy(() => import("./components/mls/SearchMlsMain"));
const AboutRealEstate = lazy(() => import("./pages/AboutRealEstate"));
const AgentDetail = lazy(() => import("./pages/AgentDetail"));
const Properties = lazy(() => import("./pages/Properties"));
const SoldPropertyDetail = lazy(() =>
  import("./components/soldproperty/SoldPropertyDetail")
);
const LandPropertyDetail = lazy(() =>
  import("./components/land/LandPropertyDetail")
);
const LandSoldDetail = lazy(() =>
  import("./components/landsold/LandSoldDetail")
);
const AboutUs = lazy(() => import("./pages/AboutUs"));
const PropertyDetail = lazy(() =>
  import("./components/properties/PropertyDetail")
);
const LandProperties = lazy(() => import("./pages/LandProperties"));
const Login = lazy(() => import("./components/login/Login"));
const Register = lazy(() => import("./components/login/Register"));
const AdminDashboard = lazy(() =>
  import("./components/dashboard/AdminDashboard")
);
const AgentDashboard = lazy(() =>
  import("./components/dashboard/AgentDashboard")
);
const AgentRentalDashboard = lazy(() =>
  import("./components/agent/AgentRentalDashboard")
);
const RegistrationTest = lazy(() =>
  import("./components/debug/RegistrationTest")
);

const UpdateRentalPropertyForm = lazy(() =>
  import("./components/forms/UpdateRentalPropertyForm")
);

const EditViewingProperty = lazy(() =>
  import("./components/admin/Viewing/EditViewingProperty")
);
const DeleteViewingProperty = lazy(() =>
  import("./components/admin/Viewing/DeleteViewingProperty")
);

const DebugPage = lazy(() => import("./pages/DebugPage"));
const MigrateReviews = lazy(() => import("./pages/MigrateReviews"));
const AgentImageMigration = lazy(() => import("./pages/AgentImageMigration"));
const AgentDataMigration = lazy(() => import("./pages/AgentDataMigration"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="App relative scroll-smooth">
          {/* 🌐 Header */}
          <Header />

          <ScrollToTop />
          {/* 📄 Main Page Content */}
          <main>
            <Suspense fallback={<LoadingSpinner />}>
              <AnalyticsTracker />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/incentives" element={<Insentive />} />
                <Route path="/testimonial" element={<Testimonial />} />
                <Route path="/villa-rentals/:slug" element={<VillaDetail />} />
                <Route path="/villa/:slug" element={<VillaDetail />} />
                <Route path="/rental/:slug" element={<RentalDetail />} />
                <Route
                  path="/edit/:id"
                  element={<UpdateRentalPropertyForm />}
                />
                <Route path="/saleshistory" element={<SalesHistory />} />
                <Route path="/contact" element={<Contactus />} />
                <Route path="/blogs" element={<BlogList />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/attraction/video" element={<Attraction />} />
                <Route path="/termuse" element={<TermsOfUse />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/mls" element={<SearchMlsMain />} />
                <Route
                  path="/about-340-realestate-team"
                  element={<AboutRealEstate />}
                />
                <Route path="/agent/:id" element={<AgentDetail />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route
                  path="/soldproperty/:id"
                  element={<SoldPropertyDetail />}
                />
                <Route
                  path="/landproperty/:id"
                  element={<LandPropertyDetail />}
                />
                <Route path="/landsold/:id" element={<LandSoldDetail />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/landproperties" element={<LandProperties />} />
                <Route
                  path="/edit-viewing/:viewId"
                  element={<EditViewingProperty />}
                />
                <Route
                  path="/delete-viewing/:viewId"
                  element={<DeleteViewingProperty />}
                />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/debug-registration"
                  element={<RegistrationTest />}
                />
                <Route path="/debug" element={<DebugPage />} />
                <Route path="/migrate-reviews" element={<MigrateReviews />} />
                <Route
                  path="/migrate-agent-images"
                  element={<AgentImageMigration />}
                />
                <Route
                  path="/migrate-agent-data"
                  element={<AgentDataMigration />}
                />

                {/* Protected Dashboard Routes */}
                <Route
                  path="/admin/admindashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agent/agentdashboard"
                  element={
                    <ProtectedRoute allowedRoles={["agent"]}>
                      <AgentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agent/rentals"
                  element={
                    <ProtectedRoute allowedRoles={["agent", "admin"]}>
                      <AgentRentalDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Add more routes as needed */}
              </Routes>
            </Suspense>
          </main>

          {/* 🔻 Footer */}
          <Footer />

          {/* Chatbot Floating Button & Modal */}
          <ChatbotButton />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
