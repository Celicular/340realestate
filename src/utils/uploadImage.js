// ==========================
// 🌎 GLOBAL IMAGE UPLOAD FUNCTION
// ==========================

import { supabase } from "../supabaseClient";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImage(file, folder = "uploads") {
  try {
    // 1️⃣ Check Supabase Auth User
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("❌ Not authenticated. Please login again.");
      return null;
    }

    // 2️⃣ Firebase Upload Path
    const storage = getStorage();
    const filePath = `${folder}/${user.id}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, filePath);

    // 3️⃣ Upload
    const snapshot = await uploadBytes(storageRef, file);

    // 4️⃣ Return File URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;

  } catch (err) {
    console.log("Upload Error:", err);
    return null;
  }
}
