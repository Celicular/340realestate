import { getStorage, ref, deleteObject } from "firebase/storage";

/**
 * Delete an image from Firebase Storage using its public URL.
 * @param {string} imageUrl - The public download URL
 * @returns {Promise<boolean>} TRUE if deleted successfully
 */
export async function deleteImageFromFirebase(imageUrl) {
  try {
    if (!imageUrl || typeof imageUrl !== "string") {
      console.warn("❗ deleteImageFromFirebase: Invalid image URL");
      return false;
    }

    const storage = getStorage();

    // Convert Firebase public URL to internal storage path
    const urlObj = new URL(imageUrl);
    const encoded = urlObj.pathname.split("/o/")[1];
    const filePath = decodeURIComponent(encoded);

    const fileRef = ref(storage, filePath);

    await deleteObject(fileRef);

    console.log("✅ Deleted:", filePath);
    return true;
  } catch (error) {
    console.error("🔥 Firebase delete error:", error);
    return false;
  }
}
