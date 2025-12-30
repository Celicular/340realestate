import { supabase } from "../supabase/supabaseClient";
import imageCompression from "browser-image-compression";

const PROJECT = "https://igahymbyfdfahtglpvcg.supabase.co";
const BUCKET = "rentalProperties";

/**
 * Upload Rental Property Images
 * - compress
 * - convert to JPG
 * - upload to Supabase
 * - auto-build public URLs
 */
export const uploadRentalImages = async (files, propertyId, onProgress) => {
  try {
    if (!files || files.length === 0) return [];

    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      // -------------------------
      // ⭐ Compress
      // -------------------------
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      // -------------------------
      // ⭐ Convert → JPG
      // -------------------------
      const dataUrl = await imageCompression.getDataUrlFromFile(compressed);
      const jpgBlob = await fetch(dataUrl).then((res) => res.blob());
      const ext = "jpg";

      const filename = `${Date.now()}-${i}.${ext}`;
      const filePath = `${propertyId}/gallery/${filename}`;

      // -------------------------
      // ⭐ Upload to Supabase
      // -------------------------
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

      // -------------------------
      // ⭐ Public URL
      // -------------------------
      const publicUrl = `${PROJECT}/storage/v1/object/public/${BUCKET}/${filePath}`;

      uploadedUrls.push(publicUrl);

      onProgress?.(Math.round(((i + 1) / files.length) * 100));
    }

    return uploadedUrls;
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return [];
  }
};
