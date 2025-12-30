import React, { useEffect, useState } from "react";
import PortfolioItemForm from "./PortfolioItemForm";
import { getAllPortfolioItems, updatePortfolioItem } from "../../../firebase/firestore";
import { supabase } from "../../../supabase/supabaseClient";
import { LayoutGrid, List, Search } from "lucide-react";

const EditPortfolio = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("list"); // list | grid
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  // -------------------------------------------------------------
  // Load items from Firestore + Convert Supabase file paths to URL
  // -------------------------------------------------------------
  useEffect(() => {
    loadItems();
  }, []);

const loadItems = async () => {
  setLoading(true);
  const result = await getAllPortfolioItems();

  if (result.success) {
    const processed = await Promise.all(
      result.data.map(async (item) => {
        const convertedImages = (item.images || []).map((img) => {
          // ✅ already a full URL → use as-is
          if (img.startsWith("http")) return img;

          // ✅ storage path → convert
          const { data } = supabase.storage
            .from("portfolio")
            .getPublicUrl(img);

          return data?.publicUrl || null;
        });

        return {
           id: item.id || item.docId || item._id, // ← FORCE ID
          ...item,
          images: convertedImages.filter(Boolean),
        };
      })
    );

    setItems(processed);
  }

  setLoading(false);
};

  // -------------------------------------------------------------
  // Filtering
  // -------------------------------------------------------------
  useEffect(() => {
    let updated = items;

    if (category !== "all") {
      updated = updated.filter(
        (item) => item.category?.toLowerCase() === category
      );
    }

    if (search.trim() !== "") {
      updated = updated.filter((item) =>
        item.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(updated);
  }, [category, search, items]);

  // -------------------------------------------------------------
  // Update Handler
  // -------------------------------------------------------------
  const handleUpdate = async (updatedData) => {
    await updatePortfolioItem(selected.id, updatedData);
    setSelected(null);
    loadItems();
  };

  // -------------------------------------------------------------
  // If Item Selected → Show Edit Form
  // -------------------------------------------------------------
  if (selected) {
    return (
      <PortfolioItemForm
        item={selected}
        onSubmit={handleUpdate}
        onCancel={() => setSelected(null)}
      />
    );
  }

  // -------------------------------------------------------------
  // MAIN VIEW
  // -------------------------------------------------------------
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Select Portfolio Item to Edit
        </h2>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewType("list")}
            className={`p-2 rounded border ${viewType === "list" ? "bg-gray-200" : ""}`}
          >
            <List size={18} />
          </button>

          <button
            onClick={() => setViewType("grid")}
            className={`p-2 rounded border ${viewType === "grid" ? "bg-gray-200" : ""}`}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">

        {/* Category Filter */}
        <div className="flex gap-3">
          {["all", "land", "residential"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded border ${
                category === cat ? "bg-gray-900 text-white" : "bg-gray-100"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
          />
        </div>
      </div>

      {/* ITEMS LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No portfolio items found.</p>
      ) : viewType === "list" ? (
        // ---------------- LIST VIEW ----------------
        <ul className="divide-y">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="py-3 cursor-pointer hover:bg-gray-100 px-2 rounded"
              onClick={() => setSelected(item)}
            >
              <div className="flex justify-between">
                <span className="font-medium">{item.title}</span>
                <span className="text-sm text-gray-500 capitalize">
                  {item.category}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        // ---------------- GRID VIEW ----------------
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md"
              onClick={() => setSelected(item)}
            >
              {/* Image Thumbnail */}
            <div className="w-full h-32 bg-gray-100 rounded overflow-hidden mb-2">
              <img
                src={item.images?.[0] || "/placeholder.png"}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>

              <div className="font-medium truncate">{item.title}</div>
              <div className="text-xs text-gray-500 mt-1 capitalize">
                {item.category}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditPortfolio;
