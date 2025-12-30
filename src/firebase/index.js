// Firebase configuration
import { auth, db, storage } from "./config";
export { default as app } from "./config";
export { auth } from "./config";
export { db } from "./config";
export { storage } from "./config";

// Authentication utilities
export {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  onAuthStateChange,
  getCurrentUser,
} from "./auth";

// Firestore database utilities
export {
  addProperty,
  getProperty,
  getProperties,
  updateProperty,
  deleteProperty,
  addUser,
  getUser,
  addBlog,
  getBlogs,
  submitContact,
  subscribeToProperties,
  // Rental properties
  addRentalProperty,
  getRentalProperties,
  updateRentalPropertyStatus,
  deleteRentalProperty,
  // Villa bookings
  addVillaBookingRequest,
  getVillaBookingRequests,
  updateVillaBookingRequestStatus,
  // Booking requests
  addBookingRequest,
  getBookingRequests,
  updateBookingRequestStatus,
  getAllBookingRequestsForAgent,
  getAllBookingRequestsForAdmin,
  // Sale properties
  addSaleProperty,
  getSaleProperties,
  updateSalePropertyStatus,
  deleteSaleProperty,
} from "./firestore";

// Storage utilities
export {
  uploadPropertyImage,
  uploadPropertyImages,
  uploadProfileImage,
  uploadBlogImage,
  deleteFile,
  deletePropertyFiles,
  getFileURL,
  listFiles,
} from "./storage";
// Firebase services for direct access
export const firebaseServices = {
  auth,
  db,
  storage,
};
