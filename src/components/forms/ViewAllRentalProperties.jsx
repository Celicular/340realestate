// ======================================
// ⭐ ViewAllRentalProperties.jsx (COMPLETE WITH ADD + EDIT)
// ======================================

import React, { useEffect, useState } from "react";
import { Home, MapPin, DollarSign, Loader2, Plus, Pencil } from "lucide-react";
import { getAllRentalProperties } from "../../firebase/firestore";
import { useNavigate } from "react-router-dom";

const ViewAllRentalProperties = ({ setActiveTab }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const result = await getAllRentalProperties();

      if (result.success) {
        setProperties(result.data);
      } else {
        console.error("Error loading properties:", result.error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);


  // Go to add property page
  const goToAddPage = () => {
    navigate("/admin/add-rental-property");
  };

  // Go to update page
  const goToUpdatePage = (id) => {
    sessionStorage.setItem("propertyId", id);
    navigate("/admin/update-rental-property");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Home size={28} className="text-blue-600" />
          All Rental Properties
        </h1>

        {/* ADD NEW PROPERTY BUTTON */}
        <button
          className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 shadow"
          onClick={() => setActiveTab("add-rental")}
        >
          <Plus size={20} />
          Add New Property
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      )}

      {/* EMPTY */}
      {!loading && properties.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No rental properties found.
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {properties.map((prop) => (
          <div
            key={prop.id}
            className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition relative"
          >
            {/* EDIT BUTTON */}
            <button
              className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
              onClick={() => {
                  sessionStorage.setItem("propertyId", prop.id);
                  setActiveTab("edit-rental");
                }}            >
              <Pencil size={16} />
            </button>

            {/* TITLE */}
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Home size={20} className="text-blue-600" />
              {prop.property?.propertyInfo?.name || prop.title || "Untitled Property"}
            </h2>

            {/* ADDRESS */}
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <MapPin size={18} className="text-red-500" />
              <span>{prop.address || "No Address Provided"}</span>
            </div>

            {/* PRICE */}
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <DollarSign size={18} className="text-green-600" />
              <span>
                {prop.propertyInfo?.pricePerNight
                  ? `₹${prop.propertyInfo.pricePerNight}`
                  : "Price Not Set"}
              </span>
            </div>

            {/* TYPE */}
            <p className="text-gray-600">
              Type:{" "}
              <span className="font-medium capitalize">
                {prop.property?.propertyInfo?.type || "N/A"}
              </span>
            </p>

            {/* BED & BATH */}
            <label className="font-medium mt-3 block">Bedrooms & Bathrooms</label>
            <p className="text-gray-600 mt-1">
              {prop.bedrooms} BHK • {prop.bathrooms} Bath
            </p>



            {/* STATUS */}
            <p
              className={`mt-3 px-3 py-1 text-sm rounded-full w-fit 
                ${
                  prop.status === "available"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }
              `}
            >
              {prop.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllRentalProperties;
