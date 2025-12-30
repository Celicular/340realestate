import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../firebase/auth";
import { addUser } from "../../firebase/firestore";
import { supabase } from "../../supabase/supabaseClient";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "agent", // default
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password)
      return setError("Please fill all fields");

    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match");

    if (formData.password.length < 6)
      return setError("Password must be at least 6 characters");

    try {
      // 1️⃣ Firebase Auth
      const fb = await registerUser(
        formData.email,
        formData.password,
        formData.name
      );

      if (!fb.success) return setError(fb.error);
      const firebaseUID = fb.user.uid;

      // 2️⃣ Firestore Save
      await addUser({
        uid: firebaseUID,
        email: formData.email,
        name: formData.name,
        role: formData.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 3️⃣ Supabase Signup WITH ROLE METADATA
      const { data: sbUser, error: sbError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role, // ⭐ THIS FIXES YOUR ROLE ISSUE
          },
        },
      });

      if (sbError) return setError("Supabase Auth failed: " + sbError.message);

      // ⭐ IMPORTANT:
      // Supabase Trigger NOW auto-creates the profile row.
      // ❌ DO NOT manually insert profile.

      // 4️⃣ Local Storage
      localStorage.setItem("userId", firebaseUID);
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userName", formData.name);
      localStorage.setItem("userRole", formData.role);

      // 5️⃣ Redirect
      if (formData.role === "admin") navigate("/admin/admindashboard");
      else navigate("/agent/agentdashboard");

    } catch (err) {
      console.error(err);
      setError("Registration failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">

        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input name="name" placeholder="Full Name" className="w-full p-3 border rounded" onChange={handleChange} />

          <input name="email" type="email" placeholder="Email" className="w-full p-3 border rounded" onChange={handleChange} />

          <input name="password" type="password" placeholder="Password" className="w-full p-3 border rounded" onChange={handleChange} />

          <input name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full p-3 border rounded" onChange={handleChange} />

          <select name="role" className="w-full p-3 border rounded" onChange={handleChange}>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button className="w-full bg-blue-600 text-white p-3 rounded">Register</button>

        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link className="text-blue-600 underline" to="/login">Login here</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
