import { useState, useEffect } from 'react';
import { db } from "../../../firebase/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Shield } from "lucide-react";

const AssignRole = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUsers(data);
  };

  const handleAssign = async () => {
    if (!selected || !role) return;

    setMsg("Updating role...");

    try {
      // 1️⃣ Update Firestore Role
      await updateDoc(doc(db, "users", selected.id), {
        role,
        updatedAt: new Date(),
      });

      // 2️⃣ Done — no server functions needed
      setMsg("✅ Role updated successfully!");
    } catch (error) {
      console.error("Role update failed:", error);
      setMsg("❌ Error updating role");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Shield className="text-purple-600" /> Assign Role
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 h-[500px] overflow-y-auto">
          <h3 className="font-semibold mb-3">Select User</h3>

          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                setSelected(u);
                setRole(u.role || "");
                setMsg("");
              }}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 ${
                selected?.id === u.id
                  ? "bg-purple-100 text-purple-700"
                  : "hover:bg-gray-100"
              }`}
            >
              {u.name || u.email}
            </button>
          ))}
        </div>

        <div className="border rounded-lg p-4">
          {!selected ? (
            <p className="text-gray-500">Choose a user from the list.</p>
          ) : (
            <>
              <h3 className="font-semibold text-gray-800 mb-2">
                Assign Role to {selected.name || selected.email}
              </h3>

              <select
                className="w-full border px-3 py-2 rounded-lg"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="viewer">Viewer</option>
                <option value="customer">Customer</option>
              </select>

              <button
                onClick={handleAssign}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                Update Role
              </button>

              {msg && <p className="mt-3 font-medium">{msg}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignRole;
