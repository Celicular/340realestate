import { supabase } from "../supabase/supabaseClient";
import imageCompression from "browser-image-compression";

const PROJECT = "https://igahymbyfdfahtglpvcg.supabase.co";
const BUCKET = "portfolio-images";

/**
 * Uploads multiple images to Supabase with:
 * - compression
 * - JPG conversion
 * - category + subcategory folders
 * - stable public URLs
 * - safe progress reporting
 */
export const uploadImagesToSupabase = async (
  files,
  category,
  subCategory,
  onProgress
) => {
  try {
    if (!files || files.length === 0) return [];

    const uploadedUrls = [];

    // -----------------------------
    // 🌍 Build Folder Structure
    // -----------------------------
    const mainFolder =
      category === "residential"
        ? "residentialPortfolio"
        : category === "land"
        ? "landPortfolio"
        : "commercialPortfolio";

    const safeSub =
      (subCategory || "general")
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "") || "general";

    // -----------------------------
    // 📸 Loop through all files
    // -----------------------------
    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      // -----------------------------------------
      // ⭐ 1. Compress Image (1MB max, 1920px max)
      // -----------------------------------------
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      // -----------------------------------------
      // ⭐ 2. Convert All Images → JPG
      // -----------------------------------------
      const dataUrl = await imageCompression.getDataUrlFromFile(compressed);
      const jpgBlob = await fetch(dataUrl).then((res) => res.blob());
      const ext = "jpg";

      const filename = `${Date.now()}-${i}.${ext}`;
      const filePath = `${mainFolder}/${safeSub}/${filename}`;

      // -----------------------------------------
      // ⭐ 3. Upload to Supabase
      // -----------------------------------------
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, jpgBlob, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        throw error;
      }

      // -----------------------------------------
      // ⭐ 4. Build Public URL
      // -----------------------------------------
      const publicUrl = `${PROJECT}/storage/v1/object/public/${BUCKET}/${filePath}`;
      uploadedUrls.push(publicUrl);

      // Progress callback
      onProgress?.(Math.round(((i + 1) / files.length) * 100));
    }

    return uploadedUrls;
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return [];
  }
};
