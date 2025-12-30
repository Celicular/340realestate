  import React, { useEffect, useState, useCallback, useRef } from "react";
  import { ArrowLeft, Save, Search, Plus, X } from "lucide-react";

  import { db } from "../../../firebase/config";
  import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

  import imageCompression from "browser-image-compression";
  import { uploadImagesToSupabase } from "../../../utils/uploadImagesToSupabase";
  import { deleteSupabaseImage } from "../../../utils/deleteSupabaseImage";
  import { fixImageUrl } from "../../../utils/fixImageUrl";
  import { getPortfolioItemById } from "../../../firebase/firestore";
  import { supabase } from "../../../supabase/supabaseClient";
  import { useAuth } from "../../../auth/AuthProvider";

  const BUCKET = "portfolio-images";
  const EDGE_FUNCTION =
    "https://igahymbyfdfahtglpvcg.supabase.co/functions/v1/fetch-image";

  const PortfolioItemForm = ({ onCancel }) => {
    const { user } = useAuth();
    const dropRef = useRef(null);

    const [propertyId, setPropertyId] = useState("");
    const [loadLoading, setLoadLoading] = useState(false);
    const [formData, setFormData] = useState(null);

    const [manualUrl, setManualUrl] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);
    const [dragIndex, setDragIndex] = useState(null);

    const [amenityInput, setAmenityInput] = useState("");

    // =====================================================
    // LOAD PROPERTY
    // =====================================================
    const loadProperty = useCallback(async () => {
    if (!propertyId) return;

    setLoadLoading(true);

    const result = await getPortfolioItemById(propertyId);

    if (!result.success) {
      setLoadLoading(false);
      alert(result.error || "Portfolio item not found");
      return;
    }

    const data = result.data;

    // 🔥 FORCE COLLECTION BASED ON CATEGORY
    const collection =
      data.category === "land"
        ? "landPortfolio"
        : data.category === "residential"
        ? "residentialPortfolio"
        : "commercialPortfolio";

    setFormData({
      ...data,
      collection, // ✅ THIS FIXES "undefined" FOLDER
      images: Array.isArray(data.images)
        ? data.images.map(fixImageUrl)
        : [],
      amenities: Array.isArray(data.amenities)
        ? data.amenities
        : [],
    });

    sessionStorage.setItem("propertyId", propertyId);
    setLoadLoading(false);
  }, [propertyId]);


    useEffect(() => {
      const saved = sessionStorage.getItem("propertyId");
      if (saved) setPropertyId(saved);
    }, []);

    // =====================================================
    // IMAGE UPLOAD (FILES)
    // =====================================================
    const processAndUpload = async (files) => {
      if (!formData || !files.length) return;

      const processed = [];

      for (let i = 0; i < files.length; i++) {
        const compressed = await imageCompression(files[i], {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          fileType: "image/jpeg",
          useWebWorker: true,
        });

        processed.push(
          new File([compressed], `img-${Date.now()}-${i}.jpg`, {
            type: "image/jpeg",
          })
        );
      }

      const urls = await uploadImagesToSupabase(
        processed,
        formData.collection,
        formData.title
      );

      setFormData((p) => ({ ...p, images: [...p.images, ...urls] }));
    };

    // Drag & drop
    useEffect(() => {
      const el = dropRef.current;
      if (!el) return;

      const prevent = (e) => e.preventDefault();

      el.addEventListener("dragover", prevent);
      el.addEventListener("drop", (e) => {
        e.preventDefault();
        const files = [...e.dataTransfer.files].filter((f) =>
          f.type.startsWith("image/")
        );
        processAndUpload(files);
      });

      return () => el.removeEventListener("dragover", prevent);
    }, [formData]);


      // =====================================================
    // ⭐ NEW FEATURE: UPLOAD EXTERNAL URL → SUPABASE → SAVE ONLY SUPABASE URL
    // =====================================================
    const uploadUrlAndAddToGallery = async () => {
    if (!manualUrl.trim() || !formData) return;

    // 🔐 Ensure property is loaded
    if (!formData.id) {
      alert("Load a portfolio item first");
      return;
    }

    // 🔹 Safe title fallback
    const rawTitle =
      formData.title ||
      formData.name ||
      formData.address ||
      formData.id;

    const safeTitle = rawTitle
      .toString()
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    try {
      // 🚀 Server-side fetch via Supabase Edge Function (NO CORS issues)
      const res = await fetch(
        "https://igahymbyfdfahtglpvcg.supabase.co/functions/v1/fetch-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.REACT_APP_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            imageUrl: manualUrl,
            bucket: "portfolio-images",
            path: `${formData.collection}/${safeTitle}`, // ✅ FIXED
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      if (!data.url) throw new Error("No image URL returned");

      // ✅ Append Supabase image URL to portfolio images
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), data.url],
      }));

      setManualUrl("");
      alert("Image import Successfullly")
    } catch (err) {
      console.error("External image import failed:", err);
      alert("Image import failed");
    }
    };

    
      const getSupabaseFolderPath = () => {
      const rawTitle =
        formData?.title ||
        formData?.name ||
        formData?.address ||
        formData?.id;

      if (!rawTitle || !formData?.collection) return null;

      const safeTitle = rawTitle
        .toString()
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      return `${formData.collection}/${safeTitle}`;
    };

    const loadImagesFromSupabaseFolder = async () => {
    if (!formData) {
      alert("Load a portfolio item first");
      return;
    }

    const folderPath = getSupabaseFolderPath();
    if (!folderPath) {
      alert("Folder path not found");
      return;
    }

    try {
      // 📂 List files from bucket folder
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(folderPath, {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) throw error;
      if (!data || data.length === 0) {
        alert("No images found in this folder");
        return;
      }

      // 🔗 Convert to public URLs
      const urls = data
        .filter((file) => file.name) // safety
        .map((file) => {
          const { data } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(`${folderPath}/${file.name}`);
          return data.publicUrl;
        });

      // 🧠 Merge without duplicates
      setFormData((prev) => {
        const existing = new Set(prev.images || []);
        const merged = [
          ...(prev.images || []),
          ...urls.filter((u) => !existing.has(u)),
        ];
        return { ...prev, images: merged };
      });

      alert("Images loaded from Supabase folder ✅");
    } catch (err) {
      console.error("Failed to load images:", err);
      alert("Failed to load images from Supabase");
    }
  };

    

    // =====================================================
    // AMENITIES
    // =====================================================
    const addAmenity = () => {
      if (!amenityInput.trim()) return;
      setFormData((p) => ({
        ...p,
        amenities: [...p.amenities, amenityInput.trim()],
      }));
      setAmenityInput("");
    };

    // =====================================================
    // IMAGE URL → EDGE FUNCTION (CORS SAFE)
    // =====================================================
    const addImageUrl = async () => {
    if (!manualUrl || !formData) return;

    const rawTitle =
      formData.title ||
      formData.name ||
      formData.address ||
      formData.id;

    if (!rawTitle) {
      alert("Property title missing. Save property first.");
      return;
    }

    const safeTitle = rawTitle
      .toString()
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    
    try {
      const res = await fetch(
        "https://igahymbyfdfahtglpvcg.supabase.co/functions/v1/fetch-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            // ✅ REQUIRED
            apikey: process.env.REACT_APP_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            imageUrl: manualUrl,
            bucket: "portfolio-images",
            path: `${formData.collection}/${safeTitle}`,
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();

      if (!data.url) throw new Error("No image URL returned");

      setFormData((p) => ({
        ...p,
        images: [...(p.images || []), data.url],
      }));

      setManualUrl("");
    } catch (err) {
      console.error(err);
      alert("Image import failed");
    }
  };

    // =====================================================
    // IMAGE ACTIONS
    // =====================================================
    const removeImage = async (url) => {
      try {
        const idx = url.indexOf(`${BUCKET}/`);
        if (idx !== -1) {
          const path = url.substring(idx + BUCKET.length + 1);
          await deleteSupabaseImage(path, BUCKET);
        }
      } catch {}

      setFormData((p) => ({
        ...p,
        images: p.images.filter((img) => img !== url),
      }));
    };

    const setAsCover = (index) => {
      setFormData((p) => {
        const arr = [...p.images];
        const [img] = arr.splice(index, 1);
        arr.unshift(img);
        return { ...p, images: arr };
      });
    };

    const reorderImages = (from, to) => {
      if (from === to) return;
      setFormData((p) => {
        const arr = [...p.images];
        const [moved] = arr.splice(from, 1);
        arr.splice(to, 0, moved);
        return { ...p, images: arr };
      });
    };

    // =====================================================
    // SAVE
    // =====================================================
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData) return;

      await updateDoc(
        doc(db, `${formData.category}Portfolio`, formData.id),
        {
          ...formData,
          images: formData.images.map(fixImageUrl),
          updatedAt: serverTimestamp(),
          updatedBy: {
            email: user?.email || "",
            name: user?.displayName || "",
          },
        }
      );

      alert("Data saved Successfully")
      setPreviewUrl(null);
      onCancel?.();
    };

    // =====================================================
    // UI
    // =====================================================
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="flex items-center text-gray-600">
            <ArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold">Edit Portfolio</h1>
        </div>

        {/* LOAD PROPERTY */}
        <div className="bg-gray-50 p-6 rounded-xl border">
          <label className="font-medium">Property ID *</label>
          <div className="flex gap-3 mt-2">
            <input
              className="w-full px-4 py-3 border rounded-lg"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
            />
            <button
              type="button"
              onClick={loadProperty}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              {loadLoading ? "Loading..." : <Search size={18} />}
              Load
            </button>
          </div>
        </div>

        {!formData ? (
          <div className="p-6 bg-gray-50 rounded-xl">
            Load a property to start editing
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow space-y-6"
          >
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="border p-3 rounded-lg w-full"
              placeholder="Property Title"
              required
            />

            
        {/* CATEGORY / STATUS / QUARTER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* CATEGORY */}
          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="border p-3 rounded-lg w-full"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>
          </div>

          {/* QUARTER */}
          <div>
            <label className="block font-medium mb-1">Quarter</label>
            <input
              value={formData.quarter}
              onChange={(e) =>
                setFormData({ ...formData, quarter: e.target.value })
              }
              placeholder="Quarter"
              className="border p-3 rounded-lg w-full"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="border p-3 rounded-lg w-full"
            >
              <option value="for-sale">For Sale</option>
              <option value="recent-sale">Recent Sale</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

          {/* SOLD */}
          {formData.status === "recent-sale" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-yellow-50 p-4 border rounded-lg">
            {/* SOLD PRICE */}
            <div>
              <label className="block font-medium mb-1">Sold Price</label>
              <input
                type="number"
                value={formData.soldPrice}
                onChange={(e) =>
                  setFormData({ ...formData, soldPrice: e.target.value })
                }
                placeholder="Enter sold price"
                className="border p-3 rounded-lg w-full"
              />
            </div>

            {/* SOLD DATE */}
            <div>
              <label className="block font-medium mb-1">Sold Date</label>
              <input
                type="date"
                value={formData.soldDate}
                onChange={(e) =>
                  setFormData({ ...formData, soldDate: e.target.value })
                }
                className="border p-3 rounded-lg w-full"
              />
            </div>
          </div>

          )}

          {/* ADDRESS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-3">
            <label className="block font-medium mb-1">Country</label>
            <input
              type="text"
              value={formData.location.country}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: {
                    ...formData.location,
                    address: e.target.value,
                  },
                })
              }
              placeholder="Enter property address"
              className="border p-3 rounded-lg w-full"
            />

            <label className="block font-medium mb-1">Address</label>
            <input
              type="text"
              value={formData.location.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: {
                    ...formData.location,
                    address: e.target.value,
                  },
                })
              }
              placeholder="Enter property address"
              className="border p-3 rounded-lg w-full"
            />

          </div>
        </div>

        {/* MLS DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* MLS List Date */}
          <div>
            <label className="block font-medium mb-1">MLS List Date</label>
            <input
              type="date"
              value={formData.details.MLSListDate || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  details: {
                    ...formData.details,
                    MLSListDate: e.target.value,
                  },
                })
              }
              className="border p-3 rounded-lg w-full"
            />
          </div>

          {/* Zoning */}
          <div>
            <label className="block font-medium mb-1">Zoning</label>
            <input
              type="text"
              value={formData.details.zoning || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  details: {
                    ...formData.details,
                    zoning: e.target.value,
                  },
                })
              }
              placeholder="Residential / Commercial / Mixed"
              className="border p-3 rounded-lg w-full"
            />
          </div>

          {/* Road Assessment Year */}
          <div>
            <label className="block font-medium mb-1">Road Assessment Year</label>
            <input
              type="number"
              value={formData.details.roadAssessmentYear || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  details: {
                    ...formData.details,
                    roadAssessmentYear: e.target.value,
                  },
                })
              }
              placeholder="YYYY"
              className="border p-3 rounded-lg w-full"
            />
          </div>
        </div>


        {/* Geography */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/*latitude */}
          <div>
            <label className="block font-medium mb-1">latitude</label>
            <input className ="border rounded-lg p-3 rounded-lg w-full" value={formData.location.latitude} onChange={(e)=>setFormData({...formData,latitude:e.target.value})} placeholder="latitude"  />
          </div>

          {/* Zoning */}
          <div>
            <label className="block font-medium mb-1">longitude</label>
            <input className ="border rounded-lg p-3 rounded-lg w-full" value={formData.location.latitude} onChange={(e)=>setFormData({...formData,latitude:e.target.value})} placeholder="longitude"  />
          </div>

          {/* Road Assessment Year */}
          <div>
            <label className="block font-medium mb-1">Grade</label>
            <input value={formData.overview.grade} onChange={(e)=>setFormData({...formData,grade:e.target.value})} placeholder="grade" className="border p-3 rounded-lg" />
          </div>
        </div>


        {/* Geography */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/*latitude */}
          <div>
            <label className="block font-medium mb-1">lotSizeAcres</label>
            <input value={formData.overview.lotSizeAcres} onChange={(e)=>setFormData({...formData,lotSizeAcres:e.target.value})} placeholder="lotSizeAcres" className="border rounded-lg p-3 rounded-lg w-full" />
          </div>

          {/* Zoning */}
          <div>
            <label className="block font-medium mb-1">lotSizeSqFt</label>
            <input value={formData.overview.lotSizeSqFt} onChange={(e)=>setFormData({...formData,lotSizeSqFt:e.target.value})} placeholder="lotSizeSqFt" className="border rounded-lg p-3 rounded-lg w-full" />
          </div>

        </div>



                  {/* Lat Long  */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          </div>  */}

          {/* lotSizeAcres */}

          {/* FEATURES */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <input value={formData.overview.bedrooms} onChange={(e)=>setFormData({...formData,bedrooms:e.target.value})} placeholder="Bedrooms" className="border p-3 rounded-lg" />
            <input value={formData.bathrooms} onChange={(e)=>setFormData({...formData,bathrooms:e.target.value})} placeholder="Bathrooms" className="border p-3 rounded-lg" />
            <input value={formData.squareFeet} onChange={(e)=>setFormData({...formData,squareFeet:e.target.value})} placeholder="Square Feet" className="border p-3 rounded-lg" />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.hasPool} onChange={(e)=>setFormData({...formData,hasPool:e.target.checked})} /> Has Pool
            </label>
          </div>

          {/* DESCRIPTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-3">
              <label className="block font-medium mb-1">Description</label>
              <textarea value={formData.description} onChange={(e)=>setFormData({...formData,description:e.target.value})} rows={3} placeholder="Description" className="border p-3 rounded-lg w-full" />
            </div>
          </div>      


          {/* AMENITIES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Amenity</label>
              <input value={amenityInput} onChange={(e)=>setAmenityInput(e.target.value)} placeholder="Amenity" className="border p-2 rounded-lg w-75" />
              <button type="button" onClick={addAmenity} className="bg-blue-600 text-white px-6 py-3 rounded-lg">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.amenities.map((a,i)=><span key={i} className="bg-blue-100 px-3 py-1 rounded-full">{a}</span>)}
            </div>
          </div>


            {/* IMAGE DROP */}
            <div
              ref={dropRef}
              className="border-2 border-dashed p-6 rounded text-center"
            >
              Drag & Drop Images Here
            </div>

            {/* IMAGE URL */}
            <div className="flex gap-2">
              <input
                value={manualUrl}
                placeholder="Paste Image URL"
                onChange={(e) => setManualUrl(e.target.value)}
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
                onClick={loadImagesFromSupabaseFolder}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                Load Images from Supabase
              </button> 

            </div>

            {/* PREVIEW */}
            {previewUrl && (
              <img
                src={previewUrl}
                alt=""
                className="w-40 h-28 object-cover rounded border"
              />
            )}

            {/* GALLERY */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((img, i) => (
                <div
                  key={img}
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDrop={() => reorderImages(dragIndex, i)}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => setAsCover(i)}
                  className="relative cursor-pointer"
                >
                  <img
                    src={img}
                    alt=""
                    className="h-32 w-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img);
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                  >
                    <X size={14} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-black text-white text-xs px-2 rounded">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded flex items-center gap-2"
            >
              <Save /> Update Portfolio
            </button>
          </form>
        )}
      </div>
    );
  };

  export default PortfolioItemForm;
	