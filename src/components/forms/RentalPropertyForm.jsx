// -----------------------------------------------------------
  // RENTAL PROPERTY FORM (FULLY REWRITTEN + MAPTILER)
// -----------------------------------------------------------

import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  MapPin,
  DollarSign,
  Camera,
  Calendar,
  Users,
  Bed,
  Bath,
  Square,
  Car,
  Wifi,
  Waves,
  AirVent,
  UtensilsCrossed,
  Tv,
  Shield,
  Save,
  X,
} from "lucide-react";

import { addRentalProperty } from "../../firebase/firestore";
import { getCurrentUser } from "../../utils/auth";

// ⭐ MAPTILER
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
const MAPTILER_KEY = process.env.REACT_APP_MAPTILER_API_KEY || "YOUR_MAPTILER_API_KEY";
maptilersdk.config.apiKey = MAPTILER_KEY;

// -----------------------------------------------------------
// REUSABLE INPUT COMPONENTS
// -----------------------------------------------------------
const Input = ({ label, value, onChange, type = "text", required }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg"
    />
  </div>
);

const InputNumber = ({ label, value, onChange, step = "1", required }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type="number"
      step={step}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg"
    />
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 text-sm">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    {label}
  </label>
);

// -----------------------------------------------------------
// MAIN FORM
// -----------------------------------------------------------
const RentalPropertyForm = ({ onSuccess, onCancel, userRole = "agent" }) => {
  const currentUser = getCurrentUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------------------------------------
  // FORM DATA
  // -----------------------------------------------------------
  const [formData, setFormData] = useState({
    propertyInfo: {
      name: "",
      slug: "",
      description: "",
      type: "villa",
      status: "available",
    },

    location: {
      address: "",
      neighborhood: "",
      city: "St. John",
      state: "USVI",
      zipCode: "",
      coordinates: { lat: "", lng: "" },
    },

    details: {
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: "",
      lotSize: "",
      yearBuilt: "",
      furnished: true,
      petFriendly: false,
      smokingAllowed: false,
      childrenAllowed: true,
      maxOccupancy: 2,
      minimumStay: 3,
      checkInTime: "15:00",
      checkOutTime: "11:00",
    },

    pricing: {
      nightly: "",
      weekly: "",
      monthly: "",
      cleaningFee: "",
      securityDeposit: "",
    },

    amenities: {
      wifi: false,
      airConditioning: false,
      kitchen: false,
      parking: false,
      pool: false,
      hotTub: false,
      tv: false,
      beachAccess: false,
      oceanView: false,
      balcony: false,
      washer: false,
      dryer: false,
      fireplace: false,
      gym: false,
      elevator: false,
      wheelchairAccessible: false,
      securitySystem: false,
    },

    images: {
      main: "",
      gallery: ["", "", "", ""],
    },

    policies: {
      cancellationPolicy: "moderate",
      houseRules: "",
    },

    contact: {
      managerName: currentUser?.displayName || "",
      managerEmail: currentUser?.email || "",
      managerPhone: "",
      emergencyContact: "",
      keyPickupLocation: "",
      keyPickupInstructions: "",
    },
  });

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // -----------------------------------------------------------
  // MAPTILER INITIALIZATION
  // -----------------------------------------------------------
  useEffect(() => {
    const lat = Number(formData.location.coordinates.lat) || 18.3381;
    const lng = Number(formData.location.coordinates.lng) || -64.7421;

    const map = new maptilersdk.Map({
      container: "rentalMap",
      style: maptilersdk.MapStyle.STREETS,
      center: [lng, lat],
      zoom: 12,
    });

    mapRef.current = map;

    markerRef.current = new maptilersdk.Marker({ color: "#2563eb" })
      .setLngLat([lng, lat])
      .addTo(map);

    // Click → Select coordinates
    map.on("click", (e) => {
      const newLat = e.lngLat.lat;
      const newLng = e.lngLat.lng;

      markerRef.current.setLngLat([newLng, newLat]);

      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: {
            lat: newLat.toFixed(6),
            lng: newLng.toFixed(6),
          },
        },
      }));
    });

    return () => map.remove();
  }, []);

  // Sync marker when typing
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const lat = Number(formData.location.coordinates.lat);
    const lng = Number(formData.location.coordinates.lng);

    if (!isNaN(lat) && !isNaN(lng)) {
      markerRef.current.setLngLat([lng, lat]);
      mapRef.current.setCenter([lng, lat]);
    }
  }, [formData.location.coordinates.lat, formData.location.coordinates.lng]);

  // -----------------------------------------------------------
  // HELPERS
  // -----------------------------------------------------------
  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleAmenityChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [key]: value },
    }));
  };

  const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const validate = () => {
    const e = [];
    if (!formData.propertyInfo.name.trim()) e.push("Property name required");
    if (!formData.location.address.trim()) e.push("Address required");
    if (!formData.pricing.nightly) e.push("Nightly rate required");
    if (!formData.images.main.trim()) e.push("Main image required");
    return e;
  };

  // -----------------------------------------------------------
  // SUBMIT
  // -----------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (errors.length) {
      setError(errors.join(", "));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = JSON.parse(JSON.stringify(formData));
      if (!payload.propertyInfo.slug)
        payload.propertyInfo.slug = slugify(payload.propertyInfo.name);

      const agentInfo = {
        email: currentUser?.email || "",
        name: currentUser?.displayName || "Unknown Agent",
        role: userRole,
      };

      const result = await addRentalProperty(payload, agentInfo);

      if (result.success) {
        setSuccess("Property submitted successfully!");
        setTimeout(() => onSuccess && onSuccess(), 1500);
      } else setError("Submission failed");
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    }

    setLoading(false);
  };

  // -----------------------------------------------------------
  // UI (FULL FORM)
  // -----------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Home className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Add Rental Property</h1>
            <p className="text-gray-600">Create a new rental listing</p>
          </div>
        </div>

        {onCancel && (
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
            <X />
          </button>
        )}
      </div>

      {/* Errors */}
      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      {success && <div className="p-3 mb-4 bg-green-100 text-green-700 rounded-lg">{success}</div>}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-10">

        {/* ----------------------------------------------------- */}
        {/* BASIC INFORMATION */}
        {/* ----------------------------------------------------- */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex gap-2 items-center">
            <Home className="h-5 w-5 text-blue-600" /> Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              required
              label="Property Name *"
              value={formData.propertyInfo.name}
              onChange={(v) => {
                handleInputChange("propertyInfo", "name", v);
                handleInputChange("propertyInfo", "slug", slugify(v));
              }}
            />

            <Input
              label="Property Slug"
              value={formData.propertyInfo.slug}
              onChange={(v) => handleInputChange("propertyInfo", "slug", v)}
            />

            <div>
              <label className="text-sm mb-1 block">Property Type</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.propertyInfo.type}
                onChange={(e) => handleInputChange("propertyInfo", "type", e.target.value)}
              >
                <option value="villa">Villa</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
              </select>
            </div>

            <div>
              <label className="text-sm mb-1 block">Status</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.propertyInfo.status}
                onChange={(e) => handleInputChange("propertyInfo", "status", e.target.value)}
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm mb-1 block">Description *</label>
            <input 
              type="text"
              required
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.propertyInfo.description}
              onChange={(e) => handleInputChange("propertyInfo", "description", e.target.value)}
            />
          </div>
        </section>

        {/* ----------------------------------------------------- */}
        {/* LOCATION */}
        {/* ----------------------------------------------------- */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex gap-2 items-center">
            <MapPin className="h-5 w-5 text-blue-600" /> Location
          </h2>

          <Input
            required
            label="Address *"
            value={formData.location.address}
            onChange={(v) => handleInputChange("location", "address", v)}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <Input
              label="Neighborhood"
              value={formData.location.neighborhood}
              onChange={(v) => handleInputChange("location", "neighborhood", v)}
            />

            <Input
              label="City"
              value={formData.location.city}
              onChange={(v) => handleInputChange("location", "city", v)}
            />

            <Input
              label="ZIP Code"
              value={formData.location.zipCode}
              onChange={(v) => handleInputChange("location", "zipCode", v)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <Input
              label="Latitude"
              type="number"
              value={formData.location.coordinates.lat}
              onChange={(v) =>
                setFormData((p) => ({
                  ...p,
                  location: { ...p.location, coordinates: { ...p.location.coordinates, lat: v } },
                }))
              }
            />

            <Input
              label="Longitude"
              type="number"
              value={formData.location.coordinates.lng}
              onChange={(v) =>
                setFormData((p) => ({
                  ...p,
                  location: { ...p.location, coordinates: { ...p.location.coordinates, lng: v } },
                }))
              }
            />
          </div>

          {/* MAPTILER MAP BLOCK */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Select Location on Map</label>
            <div id="rentalMap" className="w-full h-64 rounded-lg border shadow-sm"></div>
            <p className="text-xs text-gray-500 mt-1">
              Click on the map to auto-fill Latitude & Longitude
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------- */}
        {/* DETAILS */}
        {/* ----------------------------------------------------- */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex gap-2 items-center">
            <Square className="h-5 w-5 text-blue-600" /> Property Details
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <InputNumber
              required
              label="Bedrooms *"
              value={formData.details.bedrooms}
              onChange={(v) => handleInputChange("details", "bedrooms", Number(v))}
            />

            <InputNumber
              required
              step="0.5"
              label="Bathrooms *"
              value={formData.details.bathrooms}
              onChange={(v) => handleInputChange("details", "bathrooms", Number(v))}
            />

            <InputNumber
              label="Max Occupancy"
              value={formData.details.maxOccupancy}
              onChange={(v) => handleInputChange("details", "maxOccupancy", Number(v))}
            />

            <InputNumber
              label="Minimum Stay"
              value={formData.details.minimumStay}
              onChange={(v) => handleInputChange("details", "minimumStay", Number(v))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <InputNumber
              label="Square Feet"
              value={formData.details.squareFeet}
              onChange={(v) => handleInputChange("details", "squareFeet", v)}
            />

            <InputNumber
              label="Year Built"
              value={formData.details.yearBuilt}
              onChange={(v) => handleInputChange("details", "yearBuilt", v)}
            />

            <InputNumber
              label="Lot Size (sq ft)"
              value={formData.details.lotSize}
              onChange={(v) => handleInputChange("details", "lotSize", v)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            <Checkbox
              label="Furnished"
              checked={formData.details.furnished}
              onChange={(v) => handleInputChange("details", "furnished", v)}
            />
            <Checkbox
              label="Pet Friendly"
              checked={formData.details.petFriendly}
              onChange={(v) => handleInputChange("details", "petFriendly", v)}
            />
            <Checkbox
              label="Smoking Allowed"
              checked={formData.details.smokingAllowed}
              onChange={(v) => handleInputChange("details", "smokingAllowed", v)}
            />
            <Checkbox
              label="Children Allowed"
              checked={formData.details.childrenAllowed}
              onChange={(v) => handleInputChange("details", "childrenAllowed", v)}
            />
          </div>
        </section>

        {/* ----------------------------------------------------- */}
        {/* PRICING */}
        {/* ----------------------------------------------------- */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex gap-2 items-center">
            <DollarSign className="h-5 w-5 text-blue-600" /> Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputNumber
              required
              label="Nightly Rate (USD)"
              value={formData.pricing.nightly}
              onChange={(v) => handleInputChange("pricing", "nightly", v)}
            />

            <InputNumber
              label="Weekly Rate"
              value={formData.pricing.weekly}
              onChange={(v) => handleInputChange("pricing", "weekly", v)}
            />

            <InputNumber
              label="Monthly Rate"
              value={formData.pricing.monthly}
              onChange={(v) => handleInputChange("pricing", "monthly", v)}
            />

            <InputNumber
              label="Cleaning Fee"
              value={formData.pricing.cleaningFee}
              onChange={(v) => handleInputChange("pricing", "cleaningFee", v)}
            />

            <InputNumber
              label="Security Deposit"
              value={formData.pricing.securityDeposit}
              onChange={(v) => handleInputChange("pricing", "securityDeposit", v)}
            />
          </div>
        </section>

        {/* ----------------------------------------------------- */}
        {/* AMENITIES */}
        {/* ----------------------------------------------------- */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex gap-2 items-center">
            <Shield className="h-5 w-5 text-blue-600" /> Amenities
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries({
              wifi: "Wi-Fi",
              airConditioning: "Air Conditioning",
              kitchen: "Kitchen",
              parking: "Parking",
              pool: "Pool",
              hotTub: "Hot Tub",
              tv: "TV",
              beachAccess: "Beach Access",
              oceanView: "Ocean View",
              balcony: "Balcony",
              washer: "Washer",
              dryer: "Dryer",
              fireplace: "Fireplace",
              gym: "Gym",
              elevator: "Elevator",
              wheelchairAccessible: "Wheelchair Accessible",
              securitySystem: "Security System",
            }).map(([key, label]) => (
              <Checkbox
                key={key}
                label={label}
                checked={formData.amenities[key]}
                onChange={(v) => handleAmenityChange(key, v)}
              />
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------- */}
        {/* IMAGES */}
        {/* ----------------------------------------------------- */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex gap-2 items-center">
            <Camera className="h-5 w-5 text-blue-600" /> Images
          </h2>

          <Input
            required
            label="Main Image URL"
            value={formData.images.main}
            onChange={(v) =>
              setFormData((p) => ({
                ...p,
                images: { ...p.images, main: v },
              }))
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {formData.images.gallery.map((img, i) => (
              <Input
                key={i}
                label={`Gallery Image ${i + 1}`}
                value={img}
                onChange={(v) =>
                  setFormData((p) => {
                    const updated = [...p.images.gallery];
                    updated[i] = v;
                    return { ...p, images: { ...p.images, gallery: updated } };
                  })
                }
              />
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------- */}
        {/* POLICIES */}
        {/* ----------------------------------------------------- */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex gap-2 items-center">
            <Shield className="h-5 w-5 text-blue-600" /> Policies & Rules
          </h2>

          <div>
            <label className="block text-sm mb-1">Cancellation Policy</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.policies.cancellationPolicy}
              onChange={(e) => handleInputChange("policies", "cancellationPolicy", e.target.value)}
            >
              <option value="flexible">Flexible</option>
              <option value="moderate">Moderate</option>
              <option value="strict">Strict</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm mb-1">House Rules</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.policies.houseRules}
              onChange={(e) => handleInputChange("policies", "houseRules", e.target.value)}
            />
          </div>
        </section>

        {/* ----------------------------------------------------- */}
        {/* CONTACT */}
        {/* ----------------------------------------------------- */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex gap-2 items-center">
            <Users className="h-5 w-5 text-blue-600" /> Contact & Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Manager Name"
              value={formData.contact.managerName}
              onChange={(v) => handleInputChange("contact", "managerName", v)}
            />

            <Input
              label="Manager Phone"
              value={formData.contact.managerPhone}
              onChange={(v) => handleInputChange("contact", "managerPhone", v)}
            />

            <Input
              label="Emergency Contact"
              value={formData.contact.emergencyContact}
              onChange={(v) => handleInputChange("contact", "emergencyContact", v)}
            />

            <Input
              label="Key Pickup Location"
              value={formData.contact.keyPickupLocation}
              onChange={(v) => handleInputChange("contact", "keyPickupLocation", v)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm mb-1">Key Pickup Instructions</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.contact.keyPickupInstructions}
              onChange={(e) =>
                handleInputChange("contact", "keyPickupInstructions", e.target.value)
              }
            />
          </div>
        </section>

        {/* ----------------------------------------------------- */}
        {/* SUBMIT BUTTON */}
        {/* ----------------------------------------------------- */}
        <div className="flex justify-end gap-4">
          {onCancel && (
            <button onClick={onCancel} type="button" className="px-6 py-3 border rounded-lg">
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 text-white rounded-lg flex items-center gap-2 ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            )}
            <Save className="h-4 w-4" />
            Submit Property
          </button>
        </div>
      </form>
    </div>
  );
};

export default RentalPropertyForm;
