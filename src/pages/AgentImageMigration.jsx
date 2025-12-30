import React, { useState } from "react";
import { motion } from "framer-motion";
import { uploadAgentImage } from "../firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

// Import all agent images
import tammy1 from "../assets/agent/tammy/tammy1.jpg";
import tammy2 from "../assets/agent/tammy/tammy2.jpg";
import tammy3 from "../assets/agent/tammy/tammy3.jpg";
import tammy4 from "../assets/agent/tammy/tammy4.jpg";
import tammy5 from "../assets/agent/tammy/tammy5.jpg";
import tammy6 from "../assets/agent/tammy/tammy6.jpg";

import tina1 from "../assets/agent/tina/tina1.jpg";
import tina2 from "../assets/agent/tina/tina2.jpg";
import tina3 from "../assets/agent/tina/tina3.jpg";
import tina4 from "../assets/agent/tina/tina4.jpg";
import tina5 from "../assets/agent/tina/tina5.jpg";
import tina6 from "../assets/agent/tina/tina6.jpg";
import tina7 from "../assets/agent/tina/tina7.jpg";
import tina8 from "../assets/agent/tina/tina8.jpg";
import tina9 from "../assets/agent/tina/tina9.jpg";
import tina10 from "../assets/agent/tina/tina10.png";

import jenn1 from "../assets/agent/Jenn/jenn1.jpg";
import jenn2 from "../assets/agent/Jenn/jenn2.jpg";
import jenn3 from "../assets/agent/Jenn/jenn3.jpg";
import jenn4 from "../assets/agent/Jenn/jenn4.jpg";
import jenn5 from "../assets/agent/Jenn/jenn5.jpg";

import adonis1 from "../assets/agent/adronis/adronis1.jpg";
import adonis2 from "../assets/agent/adronis/adronis2.jpg";
import adonis3 from "../assets/agent/adronis/adronis3.jpg";
import adonis4 from "../assets/agent/adronis/adronis4.jpg";
import adonis5 from "../assets/agent/adronis/adronis5.jpg";

const agentImages = {
  1: { // Tammy Donnelly
    name: "Tammy Donnelly",
    main: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Tammy-Donnelly-About-150x150.jpg",
    gallery: [tammy1, tammy2, tammy3, tammy4, tammy5, tammy6]
  },
  2: { // Jennifer Doran
    name: "Jennifer Doran",
    main: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Jennifer-Doran-home-334x500-1-150x150.jpg",
    gallery: []
  },
  3: { // Tina Petitto
    name: "Tina Petitto", 
    main: tina10,
    gallery: [tina1, tina2, tina3, tina4, tina5, tina6, tina7, tina8, tina9]
  },
  4: { // Rosanne Ramos Lloyd
    name: "Rosanne Ramos Lloyd",
    main: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Rosanne-Ramos-Lloyd-150x150.jpg",
    gallery: []
  },
  5: { // Jenn Manes
    name: "Jenn Manes",
    main: "https://340realestatestjohn.com/wp-content/uploads/2024/05/image0-150x150.png",
    gallery: [jenn1, jenn2, jenn3, jenn4, jenn5]
  },
  6: { // Adonis Morton
    name: "Adonis Morton",
    main: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Adonis-Morton-2-150x150.jpg",
    gallery: [adonis1, adonis2, adonis3, adonis4, adonis5]
  },
  7: { // Mary Moroney
    name: "Mary Moroney",
    main: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mary-Moroney-welcome-page-150x150.jpg",
    gallery: []
  },
  8: { // John McCann
    name: "John McCann",
    main: "https://340realestatestjohn.com/wp-content/uploads/2024/02/John-McCann-150x150.jpg",
    gallery: []
  },
  9: { // Mark Shekleton
    name: "Mark Shekleton",
    main: "https://340realestatestjohn.com/wp-content/uploads/2024/02/Mark-Shekleton-500x500-1-150x150.jpg",
    gallery: []
  }
};

const AgentImageMigration = () => {
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  // Function to convert image URL/import to File object
  const urlToFile = async (url, filename) => {
    try {
      let response;
      
      if (url.startsWith('http')) {
        // External URL
        response = await fetch(url);
      } else {
        // Local import (data URL or blob URL)
        response = await fetch(url);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error(`Error converting ${url} to file:`, error);
      throw error;
    }
  };

  // Function to update agent document in Firestore
  const updateAgentImages = async (agentId, imageUrls) => {
    try {
      const agentRef = doc(db, "agents", `agent_${agentId}`);
      await updateDoc(agentRef, {
        image: imageUrls.main || imageUrls.gallery[0] || "",
        additionalImages: imageUrls.gallery || [],
        allImages: [imageUrls.main, ...imageUrls.gallery].filter(Boolean),
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating agent document:", error);
      return { success: false, error: error.message };
    }
  };

  const startMigration = async () => {
    setMigrating(true);
    setProgress(0);
    setResults([]);
    setError("");
    setCompleted(false);

    console.log("🚀 Starting agent image migration...");

    try {
      const migrationResults = [];
      const totalAgents = Object.keys(agentImages).length;

      for (const [agentId, agent] of Object.entries(agentImages)) {
        console.log(`📸 Migrating images for ${agent.name} (ID: ${agentId})`);
        
        try {
          const imageUrls = { main: "", gallery: [] };
          
          // Upload main image
          if (agent.main) {
            try {
              console.log(`Uploading main image for ${agent.name}...`);
              const mainFile = await urlToFile(agent.main, `${agent.name.replace(/\s+/g, '_')}_main.jpg`);
              const mainResult = await uploadAgentImage(mainFile, agentId, 'main');
              
              if (mainResult.success) {
                imageUrls.main = mainResult.url;
                console.log(`✅ Main image uploaded: ${mainResult.url}`);
              } else {
                console.error(`❌ Failed to upload main image: ${mainResult.error}`);
              }
            } catch (error) {
              console.error(`❌ Error processing main image: ${error.message}`);
            }
          }

          // Upload gallery images
          if (agent.gallery && agent.gallery.length > 0) {
            console.log(`Uploading ${agent.gallery.length} gallery images for ${agent.name}...`);
            
            for (let i = 0; i < agent.gallery.length; i++) {
              try {
                const galleryFile = await urlToFile(
                  agent.gallery[i], 
                  `${agent.name.replace(/\s+/g, '_')}_gallery_${i + 1}.jpg`
                );
                const galleryResult = await uploadAgentImage(galleryFile, agentId, `gallery_${i + 1}`);
                
                if (galleryResult.success) {
                  imageUrls.gallery.push(galleryResult.url);
                  console.log(`✅ Gallery image ${i + 1} uploaded: ${galleryResult.url}`);
                } else {
                  console.error(`❌ Failed to upload gallery image ${i + 1}: ${galleryResult.error}`);
                }
              } catch (error) {
                console.error(`❌ Error processing gallery image ${i + 1}: ${error.message}`);
              }
            }
          }

          // Update Firestore document
          const updateResult = await updateAgentImages(agentId, imageUrls);
          
          migrationResults.push({
            agentId,
            name: agent.name,
            status: "✅ Success",
            mainImage: imageUrls.main || "Not uploaded",
            galleryCount: imageUrls.gallery.length,
            firestoreUpdated: updateResult.success
          });

          console.log(`🎉 Successfully migrated images for ${agent.name}`);
          
        } catch (err) {
          migrationResults.push({
            agentId,
            name: agent.name,
            status: "❌ Failed",
            error: err.message
          });
          console.error(`❌ Failed to migrate images for ${agent.name}:`, err);
        }

        const currentProgress = ((parseInt(agentId)) / totalAgents) * 100;
        setProgress(currentProgress);
        setResults([...migrationResults]);

        // Small delay to prevent overwhelming Firebase
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setCompleted(true);
      console.log("🎉 Image migration completed!");
      
    } catch (err) {
      setError(`Migration failed: ${err.message}`);
      console.error("❌ Migration failed:", err);
    } finally {
      setMigrating(false);
    }
  };

  const successCount = results.filter(r => r.status === "✅ Success").length;
  const failCount = results.filter(r => r.status.includes("❌")).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            📸 Agent Image Migration
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload all agent images to Firebase Storage and update the Firestore database with the new URLs.
            This will migrate {Object.keys(agentImages).length} agents and their gallery images.
          </p>
        </motion.div>

        {/* Migration Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          {!migrating && !completed && (
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">📸</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Migrate Images
              </h2>
              <p className="text-gray-600 mb-8">
                Click the button below to start uploading all agent images to Firebase Storage.
                This process will upload main images and gallery images for each agent.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startMigration}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-200"
              >
                🚀 Start Image Migration
              </motion.button>
            </div>
          )}

          {migrating && (
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <div className="animate-spin text-3xl">🔄</div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Migrating Images...
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-purple-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-gray-600">
                Progress: {Math.round(progress)}% ({results.length}/{Object.keys(agentImages).length} agents)
              </p>
            </div>
          )}

          {completed && (
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Migration Completed!
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">{successCount}</div>
                  <div className="text-sm text-green-600">Successful Migrations</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-700">{failCount}</div>
                  <div className="text-sm text-red-600">Failed Migrations</div>
                </div>
              </div>
              <p className="text-gray-600">
                All agent images have been processed. Check the results below for detailed information.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="text-red-800 font-semibold">Migration Error:</div>
              <div className="text-red-700">{error}</div>
            </div>
          )}
        </motion.div>

        {/* Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Migration Results</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    result.status === "✅ Success"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {result.name} (ID: {result.agentId})
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {result.status}
                      </div>
                      {result.mainImage && (
                        <div className="text-sm text-gray-500 mt-1">
                          Main Image: {result.mainImage !== "Not uploaded" ? "✅ Uploaded" : "❌ Not uploaded"}
                        </div>
                      )}
                      {result.galleryCount !== undefined && (
                        <div className="text-sm text-gray-500">
                          Gallery Images: {result.galleryCount} uploaded
                        </div>
                      )}
                      {result.firestoreUpdated !== undefined && (
                        <div className="text-sm text-gray-500">
                          Firestore: {result.firestoreUpdated ? "✅ Updated" : "❌ Failed"}
                        </div>
                      )}
                      {result.error && (
                        <div className="text-sm text-red-600 mt-1">
                          Error: {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-8"
        >
          <h3 className="text-lg font-semibold text-amber-800 mb-3">
            📋 Migration Process
          </h3>
          <ul className="text-amber-700 space-y-2 text-sm">
            <li>• Uploads all local agent images to Firebase Storage</li>
            <li>• Organizes images by agent ID in storage structure</li>
            <li>• Updates Firestore agent documents with new image URLs</li>
            <li>• Maintains image types (main vs gallery images)</li>
            <li>• Provides detailed progress and error reporting</li>
            <li>• After migration, update your code to fetch images from Firestore</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AgentImageMigration;