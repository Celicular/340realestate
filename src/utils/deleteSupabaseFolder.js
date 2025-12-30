import { supabase } from "../supabase/supabaseClient";

const BUCKET = "portfolio-images";

/**
 * Delete a full folder from Supabase storage
 * @param {string} folderPath - example: "residential/oceanviewvilla"
 */
export const deleteSupabaseFolder = async (folderPath) => {
  try {
    // List everything inside folder
    const { data, error: listError } = await supabase.storage
      .from(BUCKET)
      .list(folderPath, { limit: 1000 });

    if (listError) throw listError;

    if (!data || !data.length) {
      console.log("⚠️ Folder empty or not found:", folderPath);
      return true;
    }

    // Build full paths
    const removePaths = data.map((f) => `${folderPath}/${f.name}`);

    // Delete all files
    const { error: deleteError } = await supabase.storage
      .from(BUCKET)
      .remove(removePaths);

    if (deleteError) throw deleteError;

    console.log("🗑️ Folder deleted:", folderPath);
    return true;
  } catch (err) {
    console.error("❌ Folder Delete Error:", err);
    return false;
  }
};
