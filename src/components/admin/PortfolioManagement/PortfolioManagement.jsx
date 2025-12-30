import React, { useState, useEffect, useCallback } from "react";
import {
  Building2,
  Home,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  DollarSign,
  Calendar,
  Tag,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import {
  getAllPortfolioItems,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from "../../../firebase/firestore";

import PortfolioItemForm from "./PortfolioItemForm";

const PortfolioManagement = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    forSale: 0,
    recentSale: 0,
    residential: 0,
    commercial: 0,
    land: 0,
  });

  // =====================================================
  // LOAD PORTFOLIO ITEMS
  // =====================================================
  const loadPortfolioItems = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllPortfolioItems();

      if (result.success) {
        // Remove duplicates by ID
        const uniqueMap = new Map();
        result.data.forEach((item) => {
          uniqueMap.set(item.id, item);
        });

        const uniqueItems = Array.from(uniqueMap.values());
        setPortfolioItems(uniqueItems);
        calculateStats(uniqueItems);
      } else {
        setPortfolioItems([]);
      }
    } catch (err) {
      console.error(err);
      setPortfolioItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPortfolioItems();
  }, [loadPortfolioItems]);

  // =====================================================
  // STATS
  // =====================================================
  const calculateStats = (items) => {
    setStats({
      total: items.length,
      forSale: items.filter((i) => i.status === "for-sale").length,
      recentSale: items.filter((i) => i.status === "recent-sale").length,
      residential: items.filter((i) => i.category === "residential").length,
      commercial: items.filter((i) => i.category === "commercial").length,
      land: items.filter((i) => i.category === "land").length,
    });
  };

  // =====================================================
  // FILTERING
  // =====================================================
  const filterItems = useCallback(() => {
    let list = [...portfolioItems];

    if (selectedCategory !== "all") {
      list = list.filter((i) => i.category === selectedCategory);
    }

    if (selectedStatus !== "all") {
      list = list.filter((i) => i.status === selectedStatus);
    }

    if (selectedSubcategory !== "all") {
      list = list.filter((i) => i.subcategory === selectedSubcategory);
    }

    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      list = list.filter(
        (i) =>
          i.title?.toLowerCase().includes(s) ||
          i.description?.toLowerCase().includes(s) ||
          i.location?.toLowerCase?.().includes(s)
      );
    }

    setFilteredItems(list);
  }, [
    portfolioItems,
    selectedCategory,
    selectedStatus,
    selectedSubcategory,
    searchTerm,
  ]);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  // =====================================================
  // FORM HANDLERS
  // =====================================================
  const handleAddItem = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditItem = (item) => {
    setEditingId(item.id);
    setShowForm(true);
  };

  const editingItem = portfolioItems.find((i) => i.id === editingId);

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    const result = await deletePortfolioItem(item.category, item.id);
    if (result.success) loadPortfolioItems();
  };

  const handleFormSubmit = async (formData) => {
    let result;
    if (editingId) {
      result = await updatePortfolioItem(editingId, formData);
    } else {
      result = await addPortfolioItem(formData, formData.category);
    }

    if (result.success) {
      setShowForm(false);
      setEditingId(null);
      loadPortfolioItems();
    } else {
      alert("Error saving: " + result.error);
    }
  };

  // =====================================================
  // UI HELPERS
  // =====================================================
  const categoryOptions = ["residential", "commercial", "land"];

  const getSubcategoryOptions = () => {
    const set = new Set();
    portfolioItems.forEach((i) => i.subcategory && set.add(i.subcategory));
    return [...set];
  };

  // const formatPrice = (p) =>
  //   typeof p === "number" ? p.toLocaleString() : p || "Price not listed";

  const formatPrice = (price) => {
  // Convert anything to number safely
  const numericPrice =
    typeof price === "number"
      ? price
      : Number(String(price || "").replace(/[^0-9.]/g, ""));

  // If invalid or missing → default to 0
  if (isNaN(numericPrice) || numericPrice <= 0) {
    return "$0";
  }

  return `$${numericPrice.toLocaleString()}`;
};


  const getCategoryIcon = (cat) =>
    cat === "residential" ? <Home className="h-4 w-4" /> :
    cat === "commercial" ? <Building2 className="h-4 w-4" /> :
    <MapPin className="h-4 w-4" />;

  const getCategoryColor = (cat) =>
    cat === "residential"
      ? "bg-blue-100 text-blue-800"
      : cat === "commercial"
      ? "bg-purple-100 text-purple-800"
      : "bg-green-100 text-green-800";

  const getStatusColor = (status) =>
    status === "for-sale"
      ? "bg-green-100 text-green-800"
      : "bg-orange-100 text-orange-800";

  const getStatusIcon = (status) =>
    status === "for-sale" ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );

  // =====================================================
  // FORM MODE
  // =====================================================
  if (showForm && editingItem) {
    return (
      <PortfolioItemForm
        item={editingItem}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setShowForm(false);
          setEditingId(null);
        }}
      />
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Management</h2>
          <p className="text-gray-600">
            Manage Residential, Commercial & Land Listings
          </p>
        </div>

        <button
          onClick={handleAddItem}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Building2 className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">For Sale</p>
              <p className="text-2xl font-bold text-green-600">{stats.forSale}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recent Sales</p>
              <p className="text-2xl font-bold text-orange-600">{stats.recentSales}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Residential</p>
              <p className="text-2xl font-bold text-blue-600">{stats.residential}</p>
            </div>
            <Home className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Commercial</p>
              <p className="text-2xl font-bold text-purple-600">{stats.commercial}</p>
            </div>
            <Building2 className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Land</p>
              <p className="text-2xl font-bold text-green-600">{stats.land}</p>
            </div>
            <MapPin className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="font-medium text-gray-900">Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="for-sale">For Sale</option>
            <option value="recent-sale">Recent Sale</option>
          </select>

          {/* Subcategory Filter */}
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {getSubcategoryOptions().map(subcategory => (
              <option key={subcategory} value={subcategory}>
                {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedStatus('all');
              setSelectedSubcategory('all');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-lg border p-6">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-10">No items found.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {/* IMAGE */}
                <div className="h-48 bg-gray-200 relative">
                  {item.images?.length ? (
                    <img
                      src={item.images[0]}
                      alt={item.title || "Portfolio image"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Building2 className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h4 className="font-bold">{item.title}</h4>
                  <p className="text-sm text-gray-500 mb-2">{item.id}</p>

                  <div className="flex items-center text-green-600 mb-2">
                    {/* <DollarSign className="h-4 w-4" /> */}
                    <span className="ml-1">{formatPrice(item.price)}</span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {item.description}
                  </p>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="bg-red-50 text-red-700 px-3 py-1 rounded flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManagement;
