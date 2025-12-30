import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("authUser")) || null
  );

  const [role, setRole] = useState(
    sessionStorage.getItem("authRole") || null
  );

  const auth = getAuth();

  useEffect(() => {
    // Run onAuthStateChanged only once
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Save user in state + sessionStorage
        setUser(fbUser);
        sessionStorage.setItem("authUser", JSON.stringify(fbUser));

        // Fetch role from Firestore (only once)
        const ref = doc(db, "users", fbUser.uid);
        const snap = await getDoc(ref);

        const detectedRole = snap.exists()
          ? snap.data().role || "customer"
          : "customer";

        setRole(detectedRole);
        sessionStorage.setItem("authRole", detectedRole);
      } else {
        // Clear user on logout
        setUser(null);
        setRole(null);
        sessionStorage.removeItem("authUser");
        sessionStorage.removeItem("authRole");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
