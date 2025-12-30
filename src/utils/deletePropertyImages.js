// utils/deletePropertyImages.js

import { supabase } from "../supabase/supabaseClient";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../firebase/config";

/**
 * Deletes property images safely from Supabase or Firebase Storage.
 * @param {string[]} images - Array of image URLs
 */
export const deletePropertyImages = async (images = []) => {
  if (!Array.isArray(images) || images.length === 0) return;

  for (const url of images) {
    try {
      // ------------------------------------------
      // 1. SUPABASE IMAGE DELETE
      // ------------------------------------------
      if (url.includes("supabase")) {
        const path = extractSupabasePath(url);

        const { error } = await supabase.storage
          .from("portfolio")
          .remove([path]);

        if (error) console.warn("Supabase delete error:", error);
        continue;
      }

      // ------------------------------------------
      // 2. FIREBASE STORAGE DELETE
      // ------------------------------------------
      if (url.includes("firebasestorage")) {
        const fileRef = ref(storage, decodeFirebasePath(url));
        await deleteObject(fileRef);
        continue;
      }

      // ------------------------------------------
      // 3. UNKNOWN STORAGE → ignore safely
      // ------------------------------------------
      console.warn("Unknown image storage, skipped:", url);

    } catch (error) {
      console.warn("Error deleting image:", url, error);
    }
  }
};

/**
 * Extracts the Supabase path from the full public URL.
 */
const extractSupabasePath = (url) => {
  try {
    const parts = url.split("/object/public/portfolio/");
    return parts[1] || "";
  } catch {
    return "";
  }
};

/**
 * Converts Firebase URL back to a storage path.
 */
const decodeFirebasePath = (url) => {
  try {
    const start = url.indexOf("/o/") + 3;
    const end = url.indexOf("?");
    return decodeURIComponent(url.substring(start, end));
  } catch {
    return "";
  }
};
