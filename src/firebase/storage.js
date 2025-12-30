import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from './config';

// Upload image for properties
export const uploadPropertyImage = async (file, propertyId, imageType = 'main') => {
  try {
    const timestamp = Date.now();
    const fileName = `${propertyId}_${imageType}_${timestamp}`;
    const storageRef = ref(storage, `properties/${propertyId}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { 
      success: true, 
      url: downloadURL, 
      fileName: fileName,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload image for agents
export const uploadAgentImage = async (file, agentId, imageType = 'main') => {
  try {
    const timestamp = Date.now();
    const fileName = `${agentId}_${imageType}_${timestamp}`;
    const storageRef = ref(storage, `agents/${agentId}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { 
      success: true, 
      url: downloadURL, 
      fileName: fileName,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload multiple images for an agent
export const uploadAgentImages = async (files, agentId) => {
  try {
    const uploadPromises = files.map((file, index) => {
      const imageType = index === 0 ? 'main' : `gallery_${index}`;
      return uploadAgentImage(file, agentId, imageType);
    });
    
    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(result => result.success);
    
    return { 
      success: true, 
      images: successfulUploads,
      totalUploaded: successfulUploads.length
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all images for an agent
export const getAgentImages = async (agentId) => {
  try {
    const agentRef = ref(storage, `agents/${agentId}`);
    const imageList = await listAll(agentRef);
    
    const imageUrls = await Promise.all(
      imageList.items.map(async (imageRef) => {
        const url = await getDownloadURL(imageRef);
        return {
          name: imageRef.name,
          url: url,
          fullPath: imageRef.fullPath
        };
      })
    );
    
    return { success: true, images: imageUrls };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload multiple images for a property
export const uploadPropertyImages = async (files, propertyId) => {
  try {
    const uploadPromises = files.map((file, index) => {
      const imageType = index === 0 ? 'main' : `gallery_${index}`;
      return uploadPropertyImage(file, propertyId, imageType);
    });
    
    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(result => result.success);
    
    return { 
      success: true, 
      images: successfulUploads,
      totalUploaded: successfulUploads.length
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload user profile image
export const uploadProfileImage = async (file, userId) => {
  try {
    const timestamp = Date.now();
    const fileName = `profile_${userId}_${timestamp}`;
    const storageRef = ref(storage, `users/${userId}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { 
      success: true, 
      url: downloadURL, 
      fileName: fileName,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload blog image
export const uploadBlogImage = async (file, blogId) => {
  try {
    const timestamp = Date.now();
    const fileName = `blog_${blogId}_${timestamp}`;
    const storageRef = ref(storage, `blogs/${blogId}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { 
      success: true, 
      url: downloadURL, 
      fileName: fileName,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete file from storage
export const deleteFile = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete all files for a property
export const deletePropertyFiles = async (propertyId) => {
  try {
    const propertyRef = ref(storage, `properties/${propertyId}`);
    const result = await listAll(propertyRef);
    
    const deletePromises = result.items.map(itemRef => deleteObject(itemRef));
    await Promise.all(deletePromises);
    
    return { success: true, deletedCount: result.items.length };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get download URL for a file
export const getFileURL = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    const url = await getDownloadURL(fileRef);
    return { success: true, url };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// List all files in a directory
export const listFiles = async (directoryPath) => {
  try {
    const directoryRef = ref(storage, directoryPath);
    const result = await listAll(directoryRef);
    
    const filePromises = result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return {
        name: itemRef.name,
        fullPath: itemRef.fullPath,
        url: url
      };
    });
    
    const files = await Promise.all(filePromises);
    
    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
