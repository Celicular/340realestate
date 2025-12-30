import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../firebase/auth";
import { getUser } from "../../firebase/firestore";
import { supabase } from "../../supabase/supabaseClient";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Firebase Login
      const fb = await loginUser(formData.email, formData.password);
      if (!fb.success) return setError(fb.error);

      const firebaseUser = fb.user;

      console.log("Firebase Logged In:", firebaseUser.email);

      // 2️⃣ Load Firestore Profile
      const firestoreProfile = await getUser(firebaseUser.uid);

      if (!firestoreProfile.success)
        return setError("Profile not found in Firestore");

      const profile = firestoreProfile.data;

      // 3️⃣ Supabase Login
      const { data: sbLogin, error: sbError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (sbError) {
        console.warn("Supabase login failed (not blocking):", sbError.message);
      }

      // 4️⃣ Save Local Storage
      localStorage.setItem("userId", profile.uid);
      localStorage.setItem("userEmail", profile.email);
      localStorage.setItem("userName", profile.name);
      localStorage.setItem("userRole", profile.role);

      console.log("🔥 SESSION SAVED → Redirecting…");

      // 5️⃣ Redirect Based on Role
      if (profile.role === "admin") navigate("/admin/admindashboard");
      else navigate("/agent/agentdashboard");
    } catch (err) {
      console.log(err);
      setError("Login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded"
            onChange={handleChange}
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button className="w-full bg-blue-600 text-white p-3 rounded">
            Login
          </button>
          <Link
            to="/register" 
            className="block text-center text-blue-600 hover:underline"
          >
            Don't have an account? Register
          </Link>

        </form>
      </div>
    </div>
  );
};

export default Login;

