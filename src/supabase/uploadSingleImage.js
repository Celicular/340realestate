import { supabase } from "../supabase/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export const uploadSingleImage = async (file, folderName, onProgress) => {
  try {
    if (!file) {
      console.error("❌ uploadSingleImage: file is missing");
      return null;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${folderName}/${uuidv4()}.${fileExt}`;

    // -------------------------------------------
    // 📌 Upload to Supabase Storage
    // -------------------------------------------
    const { data, error } = await supabase.storage
      .from("portfolio") // your bucket name
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        onUploadProgress: (evt) => {
          const prog = Math.round((evt.loaded / evt.total) * 100);
          if (onProgress) onProgress(prog);
        },
      });

    if (error) {
      console.error("❌ Upload Error:", error);
      return null;
    }

    // -------------------------------------------
    // 📌 Get Public URL
    // -------------------------------------------
    const { data: publicData } = supabase.storage
      .from("portfolio")
      .getPublicUrl(fileName);

    if (!publicData?.publicUrl) {
      console.error("❌ No public URL returned");
      return null;
    }

    return publicData.publicUrl; // ALWAYS RETURN A STRING URL
  } catch (err) {
    console.error("❌ uploadSingleImage Error:", err);
    return null;
  }
};
