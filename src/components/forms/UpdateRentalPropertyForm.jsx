// =============================================
// ⭐ UpdateRentalPropertyForm.jsx (FINAL VERSION)
// Firestore Synced + Supabase Main/Gallery Upload
// =============================================
import React, { useEffect, useState, useRef } from "react";
import { Home, Search, Save, Trash, Plus } from "lucide-react";
import Dialog from "../common/Dialog";
import { supabase } from "../../supabase/supabaseClient";

import {
  getRentalPropertyById,
  updateRentalProperty,
} from "../../firebase/firestore";

import {useAuth} from "../../auth/AuthProvider";
// import { getCurrentUser } from "../../utils/auth";
import { uploadRentalImages } from "../../supabase/uploadImagesToSupabaseForRental";

const UpdateRentalPropertyForm = () => {
  // const currentUser = getCurrentUser();
  const { user: currentUser } = useAuth();
  const dropRef = useRef(null);

  const [propertyId, setPropertyId] = useState("");
  const [formData, setFormData] = useState(null); 
  const [galleryImages,setGalleryImages ] = useState([])
  const [loading, setLoading] = useState(false);
  const [loadLoading, setLoadLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("info");
  const [dialogMessage, setDialogMessage] = useState("");

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState("list"); // "list" | "grid"

  // =====================================================
  // ⭐ NORMALIZE FIRESTORE → INTERNAL FORM STRUCTURE
  // =====================================================

const normalizeData = (data) => {
  return {
    title: data.propertyInfo?.name || data.title || "",
    type: data.propertyInfo?.type || data.type || "",
    notes: data.notes || "",
    status: data.status || "available",

    property: {
      propertyInfo: {
        id: data.id || "",
        name: data.propertyInfo?.name || "",
        type: data.propertyInfo?.type || "",
        status: data.propertyInfo?.status || "",
        pricePerNight: data.propertyInfo?.pricePerNight || "",
        address: data.propertyInfo?.address || "",
        description: data.propertyInfo?.description || "",
        slug: data.propertyInfo?.slug || "",
      },
    },

    accommodation: {
      bedrooms: data.accommodation?.bedrooms || 0,
      bathrooms: data.accommodation?.bathrooms || 0,
      maxOccupancy: data.accommodation?.maxGuests || 0,
    },

    media: {
      imageList: [
        ...(data.media?.imageList || []),
        ...(data.media?.imageLinks || []),
        ...(data.imageLinks || []),
      ],
    },

    image:
      data.media?.imageList?.[0] ||
      data.media?.imageLinks?.[0] ||
      data.image ||
      "",

    rates: {
      baseRate: data.rates?.baseRate || "",
      seasonalRate: data.rates?.seasonalRate || "",
    },

    inSeasonRates: {
      fiveToSix: data.inSeasonRates?.fiveToSix || "",
      oneToFour: data.inSeasonRates?.oneToFour || "",
    },

    offSeasonRates: {
      fiveToSix: data.offSeasonRates?.fiveToSix || "",
      oneToFour: data.offSeasonRates?.oneToFour || "",
    },

    details: {
      squareFeet: data.details?.squareFeet || "",
      yearBuilt: data.details?.yearBuilt || "",
      lotSize: data.details?.lotSize || "",
    },

    policies: {
      cancellationPolicy: data.policies?.cancellationPolicy || "",
      damagePolicy: data.policies?.damagePolicy || "",
      checkedInTime: data.policies?.checkedInTime || "",
      checkedOutTime: data.policies?.checkedOutTime || "",
      smoking: data.policies?.smoking ?? false,
      pets: data.policies?.pets ?? false,
      party: data.policies?.party ?? false,
      children: data.policies?.children ?? false,
    },

    lastUpdatedBy: {
      email: currentUser?.email || "",
      name: currentUser?.displayName || "",
      role: "admin",
    },

    contact: {
      managerName: currentUser?.displayName || "",
      managerEmail: currentUser?.email || "",
    },

    updatedAt: new Date(),
  };
};


  // =====================================================
  // ⭐ Update Field (dot-notation)
  // =====================================================
  const updateField = (path, value) => {
    setFormData((prev) => {
      const copy = structuredClone(prev);
      const keys = path.split(".");
      let obj = copy;

      keys.slice(0, -1).forEach((key) => (obj = obj[key]));
      obj[keys[keys.length - 1]] = value;

      return copy;
    });
  };

  // =====================================================
  // ⭐ LOAD PROPERTY
  // =====================================================
  const loadProperty = async (id) => {
    setLoadLoading(true);

    const result = await getRentalPropertyById(id);
    if (!result.success) {
      setDialogType("error");
      setDialogMessage("Property Not Found");
      setDialogOpen(true);
      setLoadLoading(false);
      return;
    }

    setFormData(normalizeData(result.data));
    sessionStorage.setItem("propertyId", id);

    setDialogType("success");
    setDialogMessage("Property Loaded Successfully");
    setDialogOpen(true);
    setLoadLoading(false);
  };

  // Auto-load
  useEffect(() => {
    const saved = sessionStorage.getItem("propertyId");
    if (saved) {
      setPropertyId(saved);
      loadProperty(saved);
    }
  }, []);

  // =====================================================
  // ⭐ MAIN IMAGE UPLOAD
  // =====================================================
  const uploadMainImage = async (file) => {
    if (!propertyId) return;

    const fileName = `main-${Date.now()}.jpg`;
    const filePath = `${propertyId}/main/${fileName}`;

    const { error } = await supabase.storage
      .from("rentalProperties")
      .upload(filePath, file, { upsert: true });

    if (error) return;

    const url = `${supabase.storageUrl}/object/public/rentalProperties/${filePath}`;
    updateField("image", url);
  };



  // =====================================================
  // ⭐ GALLERY UPLOAD (multiple)
  // =====================================================
  const uploadGalleryFiles = async (files) => {
    const urls = await uploadRentalImages(files, propertyId, setUploadProgress);

    updateField("media.imageList", [...formData.media.imageList, ...urls]);
  };

  // =====================================================
  // ⭐ ADD IMAGE URL
  // =====================================================
  const addImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    updateField("media.imageList", [...formData.media.imageList, imageUrlInput]);
    setImageUrlInput("");
  };

  // =====================================================
// ⭐ NEW FEATURE: UPLOAD EXTERNAL URL → SUPABASE → SAVE ONLY SUPABASE URL
// =====================================================
  const uploadUrlAndAddToGallery = async () => {
    if (!imageUrlInput.trim()) return;
    if (!propertyId) {
      alert("Load a property first!");
      return;
    }

    try {
      // Download image
      const response = await fetch(imageUrlInput);
      const blob = await response.blob();

      // Create file path
      const ext = imageUrlInput.split('.').pop().split('?')[0] || "jpg";
      const fileName = `url-${Date.now()}.${ext}`;
      const safeName = formData.title.replace(/[^a-zA-Z0-9-_ ]/g, "").trim().replace(/\s+/g, "-");
      const filePath = `${safeName}/urlUploads/${fileName}`;

      // Upload to Supabase
      const { error } = await supabase.storage
        .from("rentalProperties")
        .upload(filePath, blob, { upsert: true });

      if (error) {
        console.error("Upload Failed:", error);
        return;
      }

      // Create Supabase URL
      // const supabaseUrl = `${supabase.storageUrl}/object/public/rentalProperties/${filePath}`;

      const { data } = supabase.storage.from("rentalProperties").getPublicUrl(filePath);

      const supabaseUrl = data.publicUrl;

      // Add to gallery
      updateField("media.imageList", [
        ...formData.media.imageList,
        supabaseUrl
      ]);



      setImageUrlInput("");

    } catch (err) {
      console.error("External URL processing failed:", err);
    }
  };

  // =====================================================
// ⭐ FETCH IMAGES FROM SUPABASE STORAGE FOR THIS PROPERTY
// =====================================================
 const fetchImagesFromSupabase = async () => {
  if (!formData || !formData.title) return;

  // Safe folder name
  const safeName = formData.title
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const folderPath = `${safeName}/urlUploads`;

  // Fetch objects inside folder
  const { data, error } = await supabase.storage
    .from("rentalProperties")
    .list(folderPath, { limit: 100 });

  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  // Build public URLs
  const urls = data.map((file) => {
    const { data: urlData } = supabase.storage
      .from("rentalProperties")
      .getPublicUrl(`${folderPath}/${file.name}`);

    return urlData.publicUrl;
  });

  // Append to gallery list (avoid duplicates)
  updateField("media.imageList", [
    ...new Set([...formData.media.imageList, ...urls])
  ]);
};



  // =====================================================
  // ⭐ DELETE IMAGE
  // =====================================================
 const removeGalleryImage = (url) => {
  updateField(
    "media.imageList",
    (formData.media?.imageList || []).filter((img) => img !== url)
  );

  updateField(
    "imageLinks",
    (formData.imageLinks || []).filter((img) => img !== url)
  );
};

  // =====================================================
  // ⭐ DRAG & DROP HANDLER
  // =====================================================
  const handleDrop = (e) => {
    e.preventDefault();
    const files = [...e.dataTransfer.files];
    uploadGalleryFiles(files);
  };

 useEffect(() => {
  const div = dropRef.current;
  if (!div) return; // <-- Prevent crash

  const prevent = (e) => e.preventDefault();

  div.addEventListener("dragover", prevent);
  div.addEventListener("drop", handleDrop);

  return () => {
    div.removeEventListener("dragover", prevent);
    div.removeEventListener("drop", handleDrop);
  };
}, []);

// =====================================================
// ⭐ AUTO FETCH IMAGES FROM BOTH DATABASES ON RELOAD
// =====================================================
useEffect(() => {
  if (formData) {
    fetchAllImages();
  }
}, [formData]);


useEffect(() => {
  if (!formData) return;

  const merged = [
    ...(formData.media?.imageList || []),
    ...(formData.media?.imageLinks || []),
    ...(formData.imageLinks || []),
  ];

  setGalleryImages([...new Set(merged)]);
}, [formData]);


const fetchAllImages = async () => {
  if (!formData || !formData.title) return;

  const firebaseImages = [
    ...(formData.media?.imageList || []),
    ...(formData.media?.imageLinks || []),
    ...(formData.imageLinks || []),
  ];

  const safeName = formData.title
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const folderPath = `${safeName}/urlUploads`;

  const { data: files, error } = await supabase.storage
    .from("rentalProperties")
    .list(folderPath, { limit: 300 });

  if (error) {
    console.error("Supabase fetch error:", error);
    return;
  }

  const supabaseImages = files.map((file) => {
    const full = `${folderPath}/${file.name}`;
    const { data: urlData } = supabase.storage
      .from("rentalProperties")
      .getPublicUrl(full);

    return urlData.publicUrl;
  });

  const merged = [...new Set([...firebaseImages, ...supabaseImages])];

  updateField("media.imageList", merged);
  setGalleryImages(merged);
};



  // =====================================================
  // ⭐ SUBMIT UPDATE
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const agent = {
      email: currentUser?.email ?? "",
      name: currentUser?.displayName ?? "",
      role: "admin",
    };

    const result = await updateRentalProperty(propertyId, formData, agent);

    setDialogType(result.success ? "success" : "error");
    setDialogMessage(
      result.success ? "Property Updated!" : "Update Failed. Check Console."
    );
    setDialogOpen(true);

    setLoading(false);
  };

  // =====================================================
  // ⭐ UI RENDER
  // =====================================================

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-lg">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-lg bg-blue-600 text-white">
          <Home size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Update Rental Property</h1>
          <p className="text-gray-600 text-sm">Manage & Edit Property Listing</p>
        </div>
      </div>

      {/* LOAD PROPERTY */}
      <div className="bg-gray-50 rounded-xl p-6 border mb-6">
        <label className="font-medium">Property ID *</label>
        <div className="flex gap-3 mt-2">
          <input
            className="w-full px-4 py-3 border rounded-lg"
            value={propertyId}
            placeholder="Enter Firestore Document ID"
            onChange={(e) => {
              setPropertyId(e.target.value);
              sessionStorage.setItem("propertyId", e.target.value);
            }}
          />
          <button
            type="button"
            onClick={() => loadProperty(propertyId)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            {loadLoading ? (
              <div className="h-4 w-4 border-b-2 border-white animate-spin rounded-full"></div>
            ) : (
              <Search size={18} />
            )}
            Load
          </button>
        </div>
      </div>

      {/* DIALOG */}
      <Dialog
        open={dialogOpen}
        type={dialogType}
        message={dialogMessage}
        onClose={() => setDialogOpen(false)}
      />

      {!formData && (
        <p className="text-center text-gray-500 italic py-6">
          Enter a property ID to load data.
        </p>
      )}

      {/* START FORM */}
      {formData && (
        <form onSubmit={handleSubmit} className="space-y-12">

          {/* -------------------------------- */}
          {/* ⭐ BASIC INFO */}
          {/* -------------------------------- */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label>Property Title *</label>
                <input
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg mt-1"
                />
              </div>

              <div>
                <label>Property Type</label>
                <input
                  value={formData.type}
                  onChange={(e) => updateField("type", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg mt-1"
                />
              </div>
            </div>

            <label className="block mt-4">Notes / Description</label>
            <textarea
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mt-1"
              rows="4"
            />
          </section>

          {/* -------------------------------- */}
          {/* ⭐ ACCOMMODATION */}
          {/* -------------------------------- */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Accommodation</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label>Bedrooms</label>
                <input
                  type="number"
                  value={formData.accommodation.bedrooms}
                  onChange={(e) =>
                    updateField("accommodation.bedrooms", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label>Bathrooms</label>
                <input
                  type="number"
                  value={formData.accommodation.bathrooms}
                  onChange={(e) =>
                    updateField("accommodation.bathrooms", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label>Max Occupancy</label>
                <input
                  type="number"
                  value={formData.accommodation.maxOccupancy}
                  onChange={(e) =>
                    updateField("accommodation.maxOccupancy", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </section>

          {/* -------------------------------- */}
          {/* ⭐ DETAILS */}
          {/* -------------------------------- */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label>Square Feet</label>
                <input
                  type="number"
                  value={formData.details.squareFeet}
                  onChange={(e) =>
                    updateField("details.squareFeet", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label>Year Built</label>
                <input
                  type="number"
                  value={formData.details.yearBuilt}
                  onChange={(e) =>
                    updateField("details.yearBuilt", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label>Lot Size (sq ft)</label>
                <input
                  type="number"
                  value={formData.details.lotSize}
                  onChange={(e) =>
                    updateField("details.lotSize", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mt-6">
              {[
                ["details.furnished", "Furnished"],
              ].map(([path, label]) => (
                <label key={path} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      path
                        .split(".")
                        .reduce((o, k) => (o ? o[k] : false), formData)
                    }
                    onChange={(e) => updateField(path, e.target.checked)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>

          {/* -------------------------------- */}
          {/* ⭐ MAIN IMAGE */}
          {/* -------------------------------- */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Main Image</h2>

            {formData.image && (
              <img
                src={formData.image}
                className="w-full h-48 rounded-lg object-cover border mb-4"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadMainImage(e.target.files[0])}
            />
          </section>

          {/* -------------------------------- */}
          {/* ⭐ IMAGE GALLERY (Portfolio-style UI) */}
          {/* -------------------------------- */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Images</h2>


            <span className="block text-sm text-gray-500 mb-2">
              Upload multiple images for the gallery:
            </span>
            {/* DRAG & DROP */}
            <div
              ref={dropRef}
              className="mt-4 border-2 border-dashed rounded-lg p-8 text-center text-gray-500"
            >
              Drag & Drop Images Here
            </div>
            <span className="block text-sm text-gray-500 mt-2">
              (or use the file selector below)
            </span>

            {/* FILE SELECT UPLOAD */}
            <div className="mt-3 mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => uploadGalleryFiles([...e.target.files])}
              />
            </div>

            <span className="block text-sm text-gray-500 mb-4">
              You can add image URLs directly too:
            </span>  

            {/* TOGGLE BUTTONS */}
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg border 
                  ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white"}`}
              >
                List
              </button>

              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg border 
                  ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white"}`}
              >
                Grid
              </button>
            </div>

            {/* ADD IMAGE URL */}
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Paste Image URL"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={addImageUrl}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} /> Add
              </button>
               <button
                  type="button"
                  onClick={uploadUrlAndAddToGallery}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Upload to Supabase
                </button>    
                <button
                  type="button"
                  onClick={fetchImagesFromSupabase}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Data Load from Supabase
                </button>    

            </div>

            {viewMode === "list" && (
              galleryImages.map((url, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg mb-3 bg-white">
                  <img src={url} className="w-20 h-20 rounded object-cover border" />
                  <span className="flex-1 text-sm">{url}</span>

                  <button
                    type="button"
                    onClick={() => removeGalleryImage(url)}
                    className="text-red-600 font-bold text-xl"
                  >
                    ×
                  </button>
                </div>
              ))
            )} 

           {viewMode === "grid" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {galleryImages.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    className="w-full h-32 rounded object-cover border"
                  />

                  <button
                    type="button"
                    onClick={() => removeGalleryImage(url)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}




            {uploadProgress > 0 && uploadProgress < 100 && (
              <p className="text-sm mt-2 text-blue-600">
                Uploading… {uploadProgress}%
              </p>
            )}
          </section>

          {/* -------------------------------- */}
          {/* ⭐ RATES */}
          {/* -------------------------------- */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Rates</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label>Base Rate</label>
                <input
                  type="number"
                  value={formData.rates.baseRate}
                  onChange={(e) =>
                    updateField("rates.baseRate", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label>Seasonal Rate</label>
                <input
                  type="number"
                  value={formData.rates.seasonalRate}
                  onChange={(e) =>
                    updateField("rates.seasonalRate", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </section>

          
          {/* -------------------------------- */}
          {/* ⭐ In SEASON RATES */}
          {/* -------------------------------- */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">In Season Rates</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label>5–6 Nights</label>
                <input
                  type="number"
                  value={formData.inSeasonRates.fiveToSix}
                  onChange={(e) =>
                    updateField("inSeasonRates.fiveToSix", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label>1–4 Nights</label>
                <input
                  type="number"
                  value={formData.inSeasonRates.oneToFour}
                  onChange={(e) =>
                    updateField("inSeasonRates.oneToFour", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </section>
          


          {/* -------------------------------- */}
          {/* ⭐ OFF SEASON RATES */}
          {/* -------------------------------- */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Off Season Rates</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label>5–6 Nights</label>
                <input
                  type="number"
                  value={formData.offSeasonRates.fiveToSix}
                  onChange={(e) =>
                    updateField("offSeasonRates.fiveToSix", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label>1–4 Nights</label>
                <input
                  type="number"
                  value={formData.offSeasonRates.oneToFour}
                  onChange={(e) =>
                    updateField("offSeasonRates.oneToFour", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </section>

          {/* -------------------------------- */}
          {/* ⭐ POLICIES */}
          {/* -------------------------------- */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Policies</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label>Cancellation Policy</label>
                <textarea
                  value={formData.policies.cancellationPolicy}
                  onChange={(e) =>
                    updateField("policies.cancellationPolicy", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                />
              </div>

              <div>
                <label>Damage Policy</label>
                <textarea
                  value={formData.policies.damagePolicy}
                  onChange={(e) =>
                    updateField("policies.damagePolicy", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label>Check-in Time</label>
              <input
                type="text"
                value={formData.policies.checkedInTime}
                onChange={(e) =>
                  updateField("policies.checkedInTime", e.target.value)
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label>Check-out Time</label>
              <input
                type="text"
                value={formData.policies.checkedOutTime}
                onChange={(e) =>
                  updateField("policies.checkedOutTime", e.target.value)
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>


            {/* FLAGS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                ["smoking", "Smoking Allowed"],
                ["pets", "Pets Allowed"],
                ["party", "Parties Allowed"],
                ["children", "Children Allowed"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData[key]}
                    onChange={(e) => updateField(key, e.target.checked)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>

          {/* -------------------------------- */}
          {/* ⭐ SUBMIT */}
          {/* -------------------------------- */}
          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg text-white flex items-center gap-2 ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? (
                <div className="h-4 w-4 border-b-2 border-white animate-spin rounded-full"></div>
              ) : (
                <>
                  <Save size={18} /> Update Property
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateRentalPropertyForm;
