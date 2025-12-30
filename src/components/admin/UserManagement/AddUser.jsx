import { useState } from 'react';
import { db } from "../../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { UserPlus } from "lucide-react";

const AddUserMake = () => {
  const [form, setForm] = useState({
    name: "",
    displayName: "",
    email: "",
    role: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await addDoc(collection(db, "users"), {
        ...form,
        uid: "", // optional (you can store firebase auth uid separately)
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setMsg("User created successfully!");

      // Reset form
      setForm({
        name: "",
        displayName: "",
        email: "",
        role: "",
      });

    } catch (error) {
      console.error("Error adding user:", error);
      setMsg("Error creating user!");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <UserPlus className="text-green-600" /> Add New User
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-lg"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Display Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-lg"
            value={form.displayName}
            onChange={(e) =>
              setForm({ ...form, displayName: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded-lg"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Role</label>
          <select
            className="w-full border px-3 py-2 rounded-lg"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="viewer">Viewer</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-3 rounded-lg text-white font-medium ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Saving..." : "Create User"}
        </button>

        {msg && <p className="mt-3 text-green-600">{msg}</p>}
      </form>
    </div>
  );
};

export default AddUserMake;
