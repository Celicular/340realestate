// =============================
// 🔥 AUTH UTILITIES (FINAL)
// =============================
import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// ------------------------------------------------------
// 🔥 LOGOUT (Works w/ Firebase Auth + Local Storage)
// ------------------------------------------------------
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("✅ Firebase Auth logout successful");
  } catch (error) {
    console.error("❌ Firebase logout error:", error);
  }

  // Clear session
  localStorage.removeItem("userToken");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");

  window.location.href = "/login";
};

// ------------------------------------------------------
// 🔥 NEW getCurrentUser — loads:
// Firebase User + Claims + Firestore Profile
// ------------------------------------------------------
export const getCurrentUser = async () => {
  const fbUser = auth.currentUser;

  if (!fbUser) return null;

  // 🟡 Force-refresh custom claims
  await fbUser.getIdToken(true);
  const token = await fbUser.getIdTokenResult();

  const role = token.claims.role || "customer";

  // 🟡 Firestore profile
  const snap = await getDoc(doc(db, "users", fbUser.uid));
  const profile = snap.exists() ? snap.data() : {};

  return {
    uid: fbUser.uid,
    email: fbUser.email,
    name: profile.name || fbUser.displayName || "",
    role,
    displayName: profile.name || fbUser.displayName || "",
    ...profile,
  };
};

// ------------------------------------------------------
// 🔥 getUserFromLocal() — only reads saved session
// (Used for fast UI access, but not secure)
// ------------------------------------------------------
export const getUserFromLocal = () => {
  const userEmail = localStorage.getItem("userEmail");
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  if (!userEmail || !userToken) return null;

  return {
    email: userEmail,
    uid: userId,
    name: userName,
    role: userRole,
    displayName: userName,
  };
};

// ------------------------------------------------------
// ⚡ Authentication Helper
// ------------------------------------------------------
export const isAuthenticated = () => {
  return !!(localStorage.getItem("userToken") && localStorage.getItem("userEmail"));
};

// ------------------------------------------------------
// ⚡ Role Helpers
// ------------------------------------------------------
export const hasRole = (requiredRole) => {
  return localStorage.getItem("userRole") === requiredRole;
};

export const hasAnyRole = (rolesArray) => {
  const role = localStorage.getItem("userRole");
  return rolesArray.includes(role);
};
