import { supabase } from "../supabase/supabaseClient";

const BUCKET = "portfolio-images";

/**
 * Delete a single image from Supabase storage
 * @param {string} urlOrPath - Public URL or internal file path
 * @returns {boolean} success
 */
export const deleteSupabaseImage = async (urlOrPath) => {
  try {
    let filePath = urlOrPath;

    // If URL → extract path after bucket name
    if (urlOrPath.includes("supabase.co")) {
      const idx = urlOrPath.indexOf(`${BUCKET}/`);
      if (idx === -1) return false;

      filePath = urlOrPath.substring(idx + `${BUCKET}/`.length);
    }

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("❌ Supabase Delete Error:", error);
      return false;
    }

    console.log("🗑️ Deleted from Supabase:", filePath);
    return true;
  } catch (err) {
    console.error("❌ Delete Failed:", err);
    return false;
  }
};
