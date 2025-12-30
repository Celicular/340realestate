import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Save, Check , X, Grid, List, Link } from "lucide-react";
import { db } from "../../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import imageCompression from "browser-image-compression";
import { uploadImagesToSupabase } from "../../../utils/uploadImagesToSupabase";
import { fixImageUrl } from "../../../utils/fixImageUrl";
import { useAuth } from "../../../auth/AuthProvider";

/* ===========================
   CONSTANTS
=========================== */
const VIEW_OPTIONS = [
  "Caribbean",
  "Ocean",
  "Harbor",
  "Panoramic",
  "East / Sunrise",
  "West / Sunset",
  "Mountain",
  "Garden",
];

const AMENITY_OPTIONS = [
  "Swimming Pool",
  "Parking",
  "Gym",
  "Security",
  "Garden",
  "Balcony",
  "Air Conditioning",
  "Waterfront",
];

/* ===========================
   EMPTY SCHEMA
=========================== */
const EMPTY_FORM = {
  title: "",
  category: "land",
  status: "for-sale",
  price: 0,

  description: "",

  location: {
    address: "",
    country: "",
  },

  overview: {
    beds: 0,
    baths: 0,
    grade: "",
    view: [],
  },

  details: {
    zoning: "",
    financing: "",
    hoaDues: 0,
    bankOwned: false,
    concessions: false,
  },

  amenities: [],
  features: {},

  images: [],
};

const AddPortfolio = ({ onCancel }) => {
  const { user } = useAuth();
  const dropRef = useRef(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [galleryView, setGalleryView] = useState("grid");
  const [manualUrl, setManualUrl] = useState("");
  const [amenityInput, setAmenityInput] = useState("");
  const [fieldGroup, setFieldGroup] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  /* ===========================
     HELPERS
  =========================== */
  const update = (path, value) => {
    setFormData((prev) => {
      const copy = structuredClone(prev);
      let ref = copy;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
      return copy;
    });
  };

  const collectionName =
    formData.category === "land"
      ? "landPortfolio"
      : formData.category === "commercial"
      ? "commercialPortfolio"
      : "residentialPortfolio";

          
  /* ===========================
     sanitizeField 
  =========================== */

 const sanitizeField = (value) =>
  value
    .trim()
    .replace(/\./g, "_")
    .replace(/\$/g, "_")
    .replace(/\//g, "_");

    
  /* ===========================
     Add Delete Field 
  =========================== */

    const addField = () => {
  if (!fieldGroup || !fieldKey || !fieldValue) {
    alert("Field group, name and value are required");
    return;
  }

  const safeGroup = sanitizeField(fieldGroup);
  const safeKey = sanitizeField(fieldKey);

  setFormData((prev) => ({
    ...prev,
    [safeGroup]: {
      ...(prev[safeGroup] || {}),
      [safeKey]: fieldValue.trim(),
    },
  }));

  setFieldKey("");
  setFieldValue("");
};

const removeField = (group, key) => {
  setFormData((prev) => {
    const copy = { ...prev[group] };
    delete copy[key];

    return {
      ...prev,
      [group]: copy,
    };
  });
};


  /* ===========================
     IMAGE UPLOAD
  =========================== */
  const uploadFiles = async (files) => {
    const processed = [];
    for (let i = 0; i < files.length; i++) {
      const compressed = await imageCompression(files[i], {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
      });
      processed.push(
        new File([compressed], `img-${Date.now()}-${i}.jpg`)
      );
    }

    const urls = await uploadImagesToSupabase(
      processed,
      collectionName,
      formData.title || "portfolio"
    );

    update(["images"], [...formData.images, ...urls]);
  };

  /* Drag & Drop */
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    el.addEventListener("dragover", (e) => e.preventDefault());
    el.addEventListener("drop", (e) => {
      e.preventDefault();
      const files = [...e.dataTransfer.files].filter((f) =>
        f.type.startsWith("image/")
      );
      uploadFiles(files);
    });
  }, [formData]);

  /* ===========================
     IMAGE URL UPLOAD
  =========================== */
  const addImageUrl = async () => {
    if (!manualUrl) return;

    const urls = await uploadImagesToSupabase(
      [manualUrl],
      collectionName,
      formData.title || "portfolio",
      true // 👈 url mode
    );

    update(["images"], [...formData.images, ...urls]);
    setManualUrl("");
  };

  /* ===========================
     TOGGLES
  =========================== */
  const toggleArray = (path, value) => {
    const arr = path.reduce((o, k) => o[k], formData);
    update(
      path,
      arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value]
    );
  };



  /* ===========================
     SAVE
  =========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, collectionName), {
      ...formData,
      images: formData.images.map(fixImageUrl),
      createdAt: serverTimestamp(),
      createdBy: {
        email: user?.email || "",
        name: user?.displayName || "",
      },
    });

    alert("Portfolio saved successfully ✅");
    onCancel?.();
  };

  /* ===========================
     UI
  =========================== */
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="flex items-center text-gray-600">
          <ArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-2xl font-bold">Add Portfolio</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* BASIC */}
        <section className="card">
          <h2 className="section-title">Basic Info</h2>
          <h4 className="section-title">Property Title</h4>

          <input
            className="input"
            placeholder="Property Title"
            value={formData.title}
            onChange={(e) => update(["title"], e.target.value)}
            required
          />
          <h2 className="section-title">Price</h2>
          <input
            className="input"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => update(["price"], Number(e.target.value))}
          />
        </section>

        {/* VIEW */}
        <section className="card">
          <h2 className="section-title">View</h2>
          <div className="flex flex-wrap gap-3">
            {VIEW_OPTIONS.map((v) => (
              <label
                key={v}
                className={`chip ${
                  formData.overview.view.includes(v) ? "chip-active" : ""
                }`}
              >
                <input
                  type="checkbox"
                  hidden
                  checked={formData.overview.view.includes(v)}
                  onChange={() => toggleArray(["overview", "view"], v)}
                />
                {v}
              </label>
            ))}
          </div>
        </section>

         {/* AMENITIES */}
        <section className="card">
          <h2 className="section-title">Amenities</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AMENITY_OPTIONS.map((a) => {
              const checked = formData.amenities.includes(a);

              return (
                <label
                  key={a}
                  className={`chip flex items-center justify-between gap-2 ${
                    checked ? "chip-active" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    hidden
                    checked={checked}
                    onChange={() => toggleArray(["amenities"], a)}
                  />

                  <span>{a}</span>

                  {/* CHECK ICON */}
                  {checked && (
                    <Check size={16} className="text-white" />
                  )}
                </label>
              );
            })}
          </div> 

              <div className="flex gap-2 mt-4">
            <input
              className="input"
              placeholder="Custom amenity"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                if (!amenityInput) return;
                update(
                  ["amenities"],
                  [...new Set([...formData.amenities, amenityInput])]
                );
                setAmenityInput("");
              }}
              className="btn-dark"
            >
              Add
            </button>
          </div>
      
        </section>
     

        {/* ADD FIELD (FIRESTORE STYLE) */}
        <section className="card">
          <h2 className="section-title">Add Field</h2>

          {/* FIELD GROUP */}
          <input
            className="input"
            placeholder="Field Group Name (e.g. Features, Legal Info)"
            value={fieldGroup}
            onChange={(e) => setFieldGroup(e.target.value)}
          />

            {/* FIELD NAME & VALUE */}
            <div className="flex gap-2 mt-3">
              <input
                className="input"
                placeholder="Field name"
                value={fieldKey}
                onChange={(e) => setFieldKey(e.target.value)}
              />
              <input
                className="input"
                placeholder="Field value"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
              />
              <button type="button" onClick={addField} className="btn-dark">
                Add
              </button>
            </div>

            {/* SHOW ALL GROUPS & FIELDS */}
            <div className="mt-6 space-y-4">
              {Object.entries(formData).map(([group, fields]) =>
                typeof fields === "object" && !Array.isArray(fields) ? (
                  <div key={group} className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">{group}</h3>

                    {Object.entries(fields).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between items-center bg-white p-2 rounded mb-2"
                      >
                        <span>
                          <strong>{k}:</strong> {v}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeField(group, k)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null
              )}
            </div>
          </section>


        {/* IMAGES */}
        <section className="card">
          <h2 className="section-title flex justify-between">
            Images
            <div className="flex gap-2">
              <button type="button" onClick={() => setGalleryView("grid")}>
                <Grid />
              </button>
              <button type="button" onClick={() => setGalleryView("list")}>
                <List />
              </button>
            </div>
          </h2>

          <div
            ref={dropRef}
            className="border-dashed border-2 rounded-xl p-10 text-center"
          >
            Drag & Drop Images
          </div>

          <div className="flex gap-1 mt-3">
            <input
              className="input"
              placeholder="Paste image URL"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
            />
            <button type="button" onClick={addImageUrl} className="btn-dark w-25">
              <Link size={16} /> Add URL
            </button>
          </div>

          <div
            className={`mt-4 ${
              galleryView === "grid"
                ? "grid grid-cols-2 md:grid-cols-4 gap-4"
                : "space-y-3"
            }`}
          >
            {formData.images.map((img) => (
              <div key={img} className="relative">
                <img
                  src={img}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    update(
                      ["images"],
                      formData.images.filter((i) => i !== img)
                    )
                  }
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SAVE */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end">
          <button className="btn-primary">
            <Save /> Save Portfolio
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddPortfolio;
