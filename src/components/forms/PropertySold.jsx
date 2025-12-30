import React, { useState } from "react";
import { addPortfolioItem } from "../../firebase/firestore";

const PropertySold = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    status: "SOLD",
    description: "",
    // Highlights
    beds: "",
    baths: "",
    sqft: "",
    acres: "",
    area: "St John",
    island: "St John",
    mls: "",
    totalBathrooms: "",
    totalSqFt: "",
    approxIntSqft: "",
    estate: "",
    landscaping: "",
    quarter: "",
    totalApproxSqFt: "",
    totalBedrooms: "",
    yearBuilt: "",
    // Features
    acFans: "",
    cistern: "",
    roof: "",
    appliancesUnits: "",
    cisternCapacity: "",
    // Additional Info
    builderName: "",
    construction: "",
    easements: "",
    grade: "",
    intendedUse: "",
    sewer: "",
    zoning: "",
    condition: "",
    deckSqFt: "",
    foundation: "",
    insurance: "",
    roadAssessmentYear: "",
    waterfront: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageLink, setImageLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Remove multiple hyphens
      .trim();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addImageLink = () => {
    if (imageLink.trim()) {
      setFormData(prev => ({
        ...prev,
        imageLinks: [...(prev.imageLinks || []), imageLink.trim()]
      }));
      setImageLink('');
    }
  };

  const removeImageLink = (index) => {
    setFormData(prev => ({
      ...prev,
      imageLinks: prev.imageLinks.filter((_, i) => i !== index)
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      // Get agent info from localStorage
      const agentEmail = localStorage.getItem('userEmail');
      const agentRole = localStorage.getItem('userRole');
      
      // Get agent name or use email prefix as fallback
      let agentName = localStorage.getItem('userName');
      if (!agentName) {
        agentName = agentEmail ? agentEmail.split('@')[0] : 'Agent';
      }

      if (!agentEmail || !agentRole) {
        throw new Error('Agent information not found. Please login again.');
      }

      // Prepare data for Firebase
      const soldData = {
        ...formData,
        // Add additional fields for better organization
        propertyInfo: {
          title: formData.title,
          slug: generateSlug(formData.title),
          location: formData.location,
          price: formData.price,
          status: formData.status
        },
        highlights: {
          beds: parseInt(formData.beds) || 0,
          baths: parseFloat(formData.baths) || 0,
          sqft: parseInt(formData.sqft) || 0,
          acres: parseFloat(formData.acres) || 0,
          area: formData.area,
          island: formData.island,
          mls: formData.mls,
          totalBathrooms: parseFloat(formData.totalBathrooms) || 0,
          totalSqFt: parseInt(formData.totalSqFt) || 0,
          approxIntSqft: parseInt(formData.approxIntSqft) || 0,
          estate: formData.estate,
          landscaping: formData.landscaping,
          quarter: formData.quarter,
          totalApproxSqFt: parseInt(formData.totalApproxSqFt) || 0,
          totalBedrooms: parseInt(formData.totalBedrooms) || 0,
          yearBuilt: parseInt(formData.yearBuilt) || 0,
        },
        features: {
          acFans: formData.acFans,
          cistern: formData.cistern,
          roof: formData.roof,
          appliancesUnits: parseInt(formData.appliancesUnits) || 0,
          cisternCapacity: formData.cisternCapacity,
        },
        additionalInfo: {
          builderName: formData.builderName,
          construction: formData.construction,
          easements: formData.easements,
          grade: formData.grade,
          intendedUse: formData.intendedUse,
          sewer: formData.sewer,
          zoning: formData.zoning,
          condition: formData.condition,
          deckSqFt: parseInt(formData.deckSqFt) || 0,
          foundation: formData.foundation,
          insurance: formData.insurance,
          roadAssessmentYear: formData.roadAssessmentYear,
          waterfront: formData.waterfront,
        },
        media: {
          imageFiles: selectedFiles.map(file => ({ name: file.name, size: file.size })),
          imageLinks: formData.imageLinks || []
        },
        description: formData.description
      };

      // Submit to Firebase
      console.log('Submitting sold property to Firebase:', soldData);
      const result = await addPortfolioItem(soldData);
      console.log('Sold property submission result:', result);

      if (result.success) {
        setSubmitMessage({
          type: 'success',
          text: `Sold property submitted successfully! ID: ${result.id}`
        });
        
        // Reset form
        setFormData({
          title: "", location: "", price: "", status: "SOLD", description: "",
          beds: "", baths: "", sqft: "", acres: "", area: "St John", island: "St John", mls: "",
          totalBathrooms: "", totalSqFt: "", approxIntSqft: "", estate: "", landscaping: "",
          quarter: "", totalApproxSqFt: "", totalBedrooms: "", yearBuilt: "",
          acFans: "", cistern: "", roof: "", appliancesUnits: "", cisternCapacity: "",
          builderName: "", construction: "", easements: "", grade: "", intendedUse: "",
          sewer: "", zoning: "", condition: "", deckSqFt: "", foundation: "", insurance: "",
          roadAssessmentYear: "", waterfront: ""
        });
        setSelectedFiles([]);
        setImageLink('');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: `Submission failed: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-brand-dark mb-6">Sold Property Form</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Coral Bay, St. John, USVI 00830"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sold Price ($)</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., $1,570,000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">MLS Number</label>
                  <input
                    type="text"
                    name="mls"
                    value={formData.mls}
                    onChange={handleInputChange}
                    placeholder="e.g., 25-165"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  placeholder="Describe the sold property..."
                />
              </div>
            </div>

            {/* Property Highlights */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <input
                    type="number"
                    name="beds"
                    value={formData.beds}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    name="baths"
                    value={formData.baths}
                    onChange={handleInputChange}
                    step="0.5"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
                  <input
                    type="number"
                    name="sqft"
                    value={formData.sqft}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Acres</label>
                  <input
                    type="number"
                    name="acres"
                    value={formData.acres}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
                  <input
                    type="number"
                    name="yearBuilt"
                    value={formData.yearBuilt}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quarter</label>
                  <input
                    type="text"
                    name="quarter"
                    value={formData.quarter}
                    onChange={handleInputChange}
                    placeholder="e.g., Coral Bay"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estate</label>
                  <input
                    type="text"
                    name="estate"
                    value={formData.estate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Landscaping</label>
                  <input
                    type="text"
                    name="landscaping"
                    value={formData.landscaping}
                    onChange={handleInputChange}
                    placeholder="e.g., Professional"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Bathrooms</label>
                  <input
                    type="number"
                    name="totalBathrooms"
                    value={formData.totalBathrooms}
                    onChange={handleInputChange}
                    step="0.5"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Bedrooms</label>
                  <input
                    type="number"
                    name="totalBedrooms"
                    value={formData.totalBedrooms}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Square Feet</label>
                  <input
                    type="number"
                    name="totalSqFt"
                    value={formData.totalSqFt}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Approx Interior Sq Ft</label>
                  <input
                    type="number"
                    name="approxIntSqft"
                    value={formData.approxIntSqft}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Approx Sq Ft</label>
                  <input
                    type="number"
                    name="totalApproxSqFt"
                    value={formData.totalApproxSqFt}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>
              </div>
            </div>

            {/* Property Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">AC Fans</label>
                  <input
                    type="text"
                    name="acFans"
                    value={formData.acFans}
                    onChange={handleInputChange}
                    placeholder="e.g., split"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cistern</label>
                  <input
                    type="text"
                    name="cistern"
                    value={formData.cistern}
                    onChange={handleInputChange}
                    placeholder="e.g., Masonry"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Roof</label>
                  <input
                    type="text"
                    name="roof"
                    value={formData.roof}
                    onChange={handleInputChange}
                    placeholder="e.g., Membrane"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appliances Units</label>
                  <input
                    type="number"
                    name="appliancesUnits"
                    value={formData.appliancesUnits}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cistern Capacity</label>
                  <input
                    type="text"
                    name="cisternCapacity"
                    value={formData.cisternCapacity}
                    onChange={handleInputChange}
                    placeholder="e.g., 21279 gal"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Builder Name</label>
                  <input
                    type="text"
                    name="builderName"
                    value={formData.builderName}
                    onChange={handleInputChange}
                    placeholder="e.g., Phillips"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Construction</label>
                  <input
                    type="text"
                    name="construction"
                    value={formData.construction}
                    onChange={handleInputChange}
                    placeholder="e.g., Masonry"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Easements</label>
                  <input
                    type="text"
                    name="easements"
                    value={formData.easements}
                    onChange={handleInputChange}
                    placeholder="e.g., of record"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                  <input
                    type="text"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    placeholder="e.g., sloping"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Intended Use</label>
                  <input
                    type="text"
                    name="intendedUse"
                    value={formData.intendedUse}
                    onChange={handleInputChange}
                    placeholder="e.g., Other"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sewer</label>
                  <input
                    type="text"
                    name="sewer"
                    value={formData.sewer}
                    onChange={handleInputChange}
                    placeholder="e.g., Septic"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zoning</label>
                  <input
                    type="text"
                    name="zoning"
                    value={formData.zoning}
                    onChange={handleInputChange}
                    placeholder="e.g., R-2Residential"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <input
                    type="text"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    placeholder="e.g., Excellent"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deck Square Feet</label>
                  <input
                    type="number"
                    name="deckSqFt"
                    value={formData.deckSqFt}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foundation</label>
                  <input
                    type="text"
                    name="foundation"
                    value={formData.foundation}
                    onChange={handleInputChange}
                    placeholder="e.g., masonry"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance</label>
                  <input
                    type="text"
                    name="insurance"
                    value={formData.insurance}
                    onChange={handleInputChange}
                    placeholder="e.g., available"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Road Assessment Year</label>
                  <input
                    type="text"
                    name="roadAssessmentYear"
                    value={formData.roadAssessmentYear}
                    onChange={handleInputChange}
                    placeholder="e.g., 2025.00"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waterfront</label>
                  <input
                    type="text"
                    name="waterfront"
                    value={formData.waterfront}
                    onChange={handleInputChange}
                    placeholder="e.g., Y or N"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h3>
              
              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                />
                {selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Selected files:</p>
                    <div className="space-y-1">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Image Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Image Links</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={imageLink}
                    onChange={(e) => setImageLink(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
                  />
                  <button
                    type="button"
                    onClick={addImageLink}
                    className="px-4 py-3 bg-brand-dark text-white rounded-lg hover:bg-brand-dark/90"
                  >
                    Add
                  </button>
                </div>
                {formData.imageLinks && formData.imageLinks.length > 0 && (
                  <div className="space-y-1">
                    {formData.imageLinks.map((link, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm truncate">{link}</span>
                        <button
                          type="button"
                          onClick={() => removeImageLink(index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-brand-dark text-white rounded-lg hover:bg-brand-dark/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Sold Property'}
              </button>
            </div>

            {/* Submit Message */}
            {submitMessage.text && (
              <div className={`p-4 rounded-lg ${
                submitMessage.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {submitMessage.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertySold;
