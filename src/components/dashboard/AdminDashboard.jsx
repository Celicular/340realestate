// ===============================================
// ⭐ AdminDashboard.jsx — FINAL FIXED VERSION
// ===============================================

import { useState, useEffect } from "react";
import {
  Home,
  ShoppingCart,
  CheckCircle,
  LogOut,
  Shield,
  FileText,
  Calendar,
  Mail,
  ChevronLeft,
  ChevronRight,
  Clock,
  Activity,
} from "lucide-react";

// Admin Components
import AgentMigrationTool from "../admin/AgentMigrationTool";
import EmailConfiguration from "../admin/EmailConfiguration";
import BookingManagement from "../admin/BookingManagement";
import ContactManagement from "../admin/ContactManagement";
import BlogManagement from "../blog/BlogManagement";
import RentalPropertyApproval from "../admin/RentalPropertyApproval";
import SaleApproval from "../admin/SaleApproval";
import SoldApproval from "../admin/SoldApproval";

// User Management Screens
// import UserManagement from "../admin/UserManagement";
import AddUser from "../admin/UserManagement/AddUser"; 
import EditUser from "../admin/UserManagement/EditUser"; 
import AssignRole from "../admin/UserManagement/AssignRole";
import DeleteUser from "../admin/UserManagement/DeleteUser";

// Portfolio Screens (ONLY THESE — CORRECT)
import PortfolioManagement from "../admin/PortfolioManagement/PortfolioManagement";
import AddPortfolio from "../admin/PortfolioManagement/AddPortfolio";
import EditPortfolio from "../admin/PortfolioManagement/EditPortfolio";
import DeletePortfolio from "../admin/PortfolioManagement/DeletePortfolio";

import ViewPropertyRequest from "../admin/Viewing/ViewPropertyRequest";
import EditViewingProperty from "../admin/Viewing/EditViewingProperty";
import DeleteViewingProperty from "../admin/Viewing/DeleteViewingProperty";

// Forms
import RentalPropertyForm from "../forms/RentalPropertyForm";
import ViewAllRentalProperties from "../forms/ViewAllRentalProperties";
import UpdateRentalPropertyForm from "../forms/UpdateRentalPropertyForm"; 


// Firebase Utils
import { logout, getCurrentUser } from "../../utils/auth";
import {
  getRentalProperties,
  getSaleProperties,
  getAllPortfolioItems,
} from "../../firebase/firestore";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("portfolio-management");
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedViewId, setSelectedViewId] = useState(null);


  const [stats, setStats] = useState({
    pendingRentals: 0,
    pendingSales: 0,
    pendingSold: 0,
    totalApproved: 0,
  });

  const user = getCurrentUser();

  // Toggle dropdown
  const toggleDropdown = (tabId) => {
    setOpenDropdown((prev) => (prev === tabId ? null : tabId));
  };

const handleEditViewing = (id) => {
  setSelectedViewId(id);
  setActiveTab("editViewing");
};

const handleDeleteViewing = (id) => {
  setSelectedViewId(id);
  setActiveTab("deleteViewing");
};


  useEffect(() => {
    document.body.classList.add("hide-public-navbar");
    return () => document.body.classList.remove("hide-public-navbar");
  }, []);

  useEffect(() => {
    loadDashboardStats();
  }, []);



  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      const [rentalResult, saleResult, soldResult] = await Promise.all([
        getRentalProperties({ status: "approved" }),
        getSaleProperties({ status: "approved" }),
        getAllPortfolioItems({ status: "recent-sale" }),
      ]);

      const pendingRentals = rentalResult.success ? rentalResult.data.length : 0;
      const pendingSales = saleResult.success ? saleResult.data.length : 0;
      const pendingSold = soldResult.success ? soldResult.data.length : 0;

      setStats({
        pendingRentals,
        pendingSales,
        pendingSold,
        totalApproved: pendingRentals + pendingSales + pendingSold,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =======================================
  // ⭐ TAB CONFIG
  // =======================================
  const tabs = [
    {
      id: "user-management",
      name: "User Management",
      icon: Home,
      isDropdown: true,
      children: [
        { id: "add-user", name: "Add User", component: AddUser },
        { id: "edit-user", name: "Edit User", component: EditUser },
        { id: "assign-role", name: "Assign Role", component: AssignRole },
        { id: "delete-user", name: "Delete User", component: DeleteUser },
      ],
    },
    {
      id: "portfolio-management",
      name: "Portfolio Management",
      icon: Home,
      component: PortfolioManagement,
      isDropdown: true,
      children: [
        { id: "add-portfolio", name: "Add Portfolio", component: AddPortfolio },
        { id: "view-portfolio", name: "View Portfolio", component: PortfolioManagement },
        { id: "edit-portfolio", name: "Edit Portfolio", component: EditPortfolio },
        { id: "delete-portfolio", name: "Delete Portfolio", component: DeletePortfolio },
      ],
    },
    {
      id: "property_viewings",
      name: "Property Viewings",
      icon: Home,
      isDropdown: true,
      children: [
        {
          id: "viewRequests",
          name: "View Requests",
          component: () => (
            <ViewPropertyRequest
              onEdit={handleEditViewing}
              onDelete={handleDeleteViewing}
            />
          )
        },
        {
          id: "editViewing",
          name: "Edit Viewing",
          component: EditViewingProperty,
          props: { selectedViewId },
        },
        {
          id: "deleteViewing",
          name: "Delete Viewing",
          component: DeleteViewingProperty,
          props: { selectedViewId }
        },
      ],
    },
    {    // Rental Operations
      id: "rental-property",
      name: "Rental Property",
      icon: Home,
      isDropdown: true,
      children: [
        {
           id: "add-rental", 
          name: "Add Rental Property", 
          icon: Home, 
          component: RentalPropertyForm 
        },
        {
         id: "view-rentals", 
         name: "View Rentals", 
         icon: Home, 
         component: () => 
          (<ViewAllRentalProperties setActiveTab={setActiveTab} />) 
        },
        { id: "edit-rental", 
          name: "Edit Rental", 
          icon: Home, 
          component: UpdateRentalPropertyForm 
        },
      ],
    },
    {    // Agent Management
      id: "agent-management",
      name: "Agent Management",
      icon: Shield,
      component: AgentMigrationTool,
    },
    {
      id: "email-settings",
      name: "Email Settings",
      icon: FileText,
      component: EmailConfiguration,
    },
   
    // Other Panels
    { id: "booking", name: "Booking Requests", icon: Calendar, component: BookingManagement },
    { id: "contact", name: "Contact Messages", icon: Mail, component: ContactManagement },
    { id: "blog", name: "Blog Management", icon: FileText, component: BlogManagement },

    // Approval Tabs
    {
      id: "rental-approval",
      name: "Rental Approval",
      icon: Home,
      badge: stats.pendingRentals,
      component: RentalPropertyApproval,
    },
    {
      id: "sale-approval",
      name: "Sale Approval",
      icon: ShoppingCart,
      badge: stats.pendingSales,
      component: SaleApproval,
    },
    {
      id: "sold-approval",
      name: "Sold Approval",
      icon: CheckCircle,
      badge: stats.pendingSold,
      component: SoldApproval,
    },
  ];

  // Find active component
  const findActiveComponent = () => {
    const mainTab = tabs.find((t) => t.id === activeTab);
    if (mainTab?.component) return mainTab.component;

    for (const t of tabs) {
      if (t.children) {
        const child = t.children.find((c) => c.id === activeTab);
        if (child) return child.component;
      }
    }

    return null;
  };

  const ActiveComponent = findActiveComponent();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`bg-white border-r border-gray-200 shadow-sm h-full transition-all duration-300 ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex justify-between items-center">
          {!collapsed && <h1 className="font-bold text-lg">Admin Panel</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-150px)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <div key={tab.id}>
                {/* MAIN TAB */}
                <button
                  onClick={() => {
                    if (tab.isDropdown) {
                      toggleDropdown(tab.id);
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && <span className="ml-3 flex-1">{tab.name}</span>}

                  {!collapsed && tab.isDropdown && (
                    <span className="text-xs">{openDropdown === tab.id ? "▲" : "▼"}</span>
                  )}

                  {!collapsed && tab.badge > 0 && (
                    <span className="ml-auto bg-red-100 text-red-700 px-2 py-1 text-xs rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>

                {/* DROPDOWN CHILDREN */}
                {tab.isDropdown && openDropdown === tab.id && (
                  <div className="ml-10 mt-2 space-y-2">
                    {tab.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => setActiveTab(child.id)}
                        className={`block text-left w-full px-3 py-2 rounded-md text-sm ${
                          activeTab === child.id
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl flex items-center justify-center"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* TOP HEADER */}
        <div className="shadow-sm border border-gray-200 bg-white rounded-xl">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Property Management System</p>
              </div>
            </div>

            {/* User */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Pending Rentals"
            value={stats.pendingRentals}
            icon={<Home className="text-blue-600" />}
            bg="bg-blue-50"
          />

          <StatCard
            title="Pending Sales"
            value={stats.pendingSales}
            icon={<ShoppingCart className="text-purple-600" />}
            bg="bg-purple-50"
          />

          <StatCard
            title="Pending Sold"
            value={stats.pendingSold}
            icon={<CheckCircle className="text-orange-500" />}
            bg="bg-orange-50"
          />

          <StatCard
            title="Total Pending"
            value={stats.pendingRentals + stats.pendingSales + stats.pendingSold}
            icon={<Activity className="text-green-600" />}
            bg="bg-green-50"
          />
        </div>     

        {ActiveComponent && (
          <ActiveComponent selectedViewId={selectedViewId} />
        )}

       
      </main>
    </div>
  );
};

// =======================================
// ⭐ Stat Card Component
// =======================================
const StatCard = ({ title, value, icon, bg }) => (
  <div className="bg-white p-6 rounded-xl border shadow-sm">
    <div className="flex justify-between items-center">
      <h3 className="text-gray-700 font-semibold">{title}</h3>
      <div className={`p-3 rounded-lg ${bg}`}>{icon}</div>
    </div>

    <p className="text-3xl font-bold mt-2">{value}</p>

    <div className="mt-3 flex items-center text-gray-500 text-sm">
      <Clock className="h-4 w-4 mr-1" />
      Awaiting approval
    </div>
  </div>
);

export default AdminDashboard;
