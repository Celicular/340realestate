import { supabase } from "../supabase/supabaseClient";

export const uploadMultipleImages = async (files, folderName, onProgress) => {
  try {
    const uploadedUrls = [];

    // GET PROJECT REF (IMPORTANT)
    const PROJECT_URL = supabase.storageUrl.split("/storage")[0];
    const PROJECT_REF = PROJECT_URL.replace("https://", "");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // convert jpeg → jpg
      let ext = file.name.split(".").pop().toLowerCase();
      if (ext === "jpeg") ext = "jpg";

      const fileName = `${Date.now()}_${i}.${ext}`;
      const filePath = `${folderName}/${fileName}`;

      // upload
      const { error } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file);

      if (error) throw error;

      // BUILD ABSOLUTE PUBLIC URL (NEVER FAILS)
      const publicUrl = `https://${PROJECT_REF}/storage/v1/object/public/portfolio/${filePath}`;

      uploadedUrls.push(publicUrl);

      if (onProgress) {
        onProgress(Math.round(((i + 1) / files.length) * 100));
      }
    }

    return uploadedUrls;
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    throw error;
  }
};
// 📁 ALLOWED SUBCATEGORIES