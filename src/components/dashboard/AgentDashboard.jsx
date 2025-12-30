import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  CheckCircle,
  MapPin,
  FileText,
  LogOut,
  User,
  Plus,
  TrendingUp,
  Activity,
  Calendar,
  Award,
} from "lucide-react";
import RentalPropertyForm from "../forms/RentalPropertyForm";
import PropertySale from "../forms/PropertySale";
import PropertySold from "../forms/PropertySold";
import LandSale from "../forms/LandSale";
import LandSold from "../forms/LandSold";
import PortfolioManagement from "../admin/PortfolioManagement/PortfolioManagement";
import BackendPortfolioDisplay from "../admin/BackendPortfolioDisplay";
import BlogManagement from "../blog/BlogManagement";
import BookingRequestsManagement from "../booking/BookingRequestsManagement";
import { logout, getCurrentUser } from "../../utils/auth";
import {
  getRentalProperties,
  getSaleProperties,
  getAllPortfolioItems,
} from "../../firebase/firestore";

const AgentDashboard = () => {
  console.log("🎯 AgentDashboard component loaded");
  const [activeTab, setActiveTab] = useState("portfolio-management");
  const [stats, setStats] = useState({
    myRentals: 0,
    mySales: 0,
    mySold: 0,
    totalSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  console.log("👤 Current user in AgentDashboard:", currentUser);

  useEffect(() => {
    loadAgentStats();
  }, []);

  const loadAgentStats = async () => {
    try {
      setLoading(true);

      if (!currentUser?.email) return;

      // Fetch agent's own properties
      const [rentalResult, saleResult, soldResult] = await Promise.all([
        getRentalProperties({ agentEmail: currentUser.email }),
        getSaleProperties({ agentEmail: currentUser.email }),
        getAllPortfolioItems({ status: "recent-sale" }),
      ]);

      const myRentals = rentalResult.success ? rentalResult.data.length : 0;
      const mySales = saleResult.success ? saleResult.data.length : 0;
      const mySold = soldResult.success ? soldResult.data.length : 0;

      setStats({
        myRentals,
        mySales,
        mySold,
        totalSubmissions: myRentals + mySales + mySold,
      });
    } catch (error) {
      console.error("Error loading agent stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const tabs = [
    {
      id: "portfolio-management",
      name: "Portfolio Management",
      component: PortfolioManagement,
      icon: Home,
      color: "indigo",
      description: "Manage property portfolios",
    },
    {
      id: "backend-portfolio",
      name: "Backend Portfolio",
      component: BackendPortfolioDisplay,
      icon: TrendingUp,
      color: "blue",
      description: "View portfolio data from backend",
    },
    {
      id: "booking-requests",
      name: "Booking Requests",
      component: () => <BookingRequestsManagement userRole="agent" />,
      icon: Calendar,
      color: "green",
      description: "View and manage property bookings",
    },
    {
      id: "blog-management",
      name: "Blog Management",
      component: BlogManagement,
      icon: FileText,
      color: "teal",
      description: "Create and manage blog posts",
    },
    {
      id: "rental",
      name: "Rental Form",
      component: RentalPropertyForm,
      icon: Home,
      color: "blue",
      description: "Submit rental property listings",
    },
    {
      id: "property-sale",
      name: "Property Sale",
      component: PropertySale,
      icon: ShoppingCart,
      color: "green",
      description: "Submit properties for sale",
    },
    {
      id: "property-sold",
      name: "Property Sold",
      component: PropertySold,
      icon: CheckCircle,
      color: "purple",
      description: "Mark properties as sold",
    },
    {
      id: "land-sale",
      name: "Land Sale",
      component: LandSale,
      icon: MapPin,
      color: "orange",
      description: "Submit land for sale",
    },
    {
      id: "land-sold",
      name: "Land Sold",
      component: LandSold,
      icon: Award,
      color: "indigo",
      description: "Mark land as sold",
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      green: "bg-green-50 text-green-700 border-green-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      orange: "bg-orange-50 text-orange-700 border-orange-200",
      indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
      teal: "bg-teal-50 text-teal-700 border-teal-200",
    };
    return colors[color] || colors.blue;
  };

  const getActiveColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-600 text-white border-blue-600",
      green: "bg-green-600 text-white border-green-600",
      purple: "bg-purple-600 text-white border-purple-600",
      orange: "bg-orange-600 text-white border-orange-600",
      indigo: "bg-indigo-600 text-white border-indigo-600",
      teal: "bg-teal-600 text-white border-teal-600",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-500 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Agent Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">
                    Property Submission Portal
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {currentUser && (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-gray-500">Real Estate Agent</p>
                  </div>
                  <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {currentUser.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Rentals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : stats.myRentals}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <FileText className="h-4 w-4 mr-1" />
              <span>Submitted listings</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : stats.mySales}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <FileText className="h-4 w-4 mr-1" />
              <span>Active listings</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Sold</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : stats.mySold}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Award className="h-4 w-4 mr-1" />
              <span>Completed sales</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Submissions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : stats.totalSubmissions}
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Activity className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>All submissions</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>
            <button
              onClick={() => navigate("/agent/rentals")}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Manage Rental Properties</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                    isActive
                      ? getActiveColorClasses(tab.color)
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent
                    className={`h-8 w-8 mb-2 ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {tab.name}
                  </span>
                  <span
                    className={`text-xs mt-1 ${
                      isActive ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {tab.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Enhanced Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-1 p-4 overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? getActiveColorClasses(tab.color)
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">{ActiveComponent && <ActiveComponent />}</div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-gray-600 mb-3">
                Submit your property listings through the forms above. All
                submissions will be reviewed by our admin team before being
                published.
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Fill out all required fields
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Upload high-quality images
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Provide accurate information
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 340 Real Estate. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
