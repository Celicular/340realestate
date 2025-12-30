import { useState, useEffect } from 'react';
import { db } from "../../../firebase/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { User, Save } from "lucide-react";

const EditUser = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const handleSelect = (user) => {
    setSelected(user);
    setForm(user);
    setMsg("");
  };

  const handleSave = async () => {
    if (!selected) return;

    await updateDoc(doc(db, "users", selected.id), {
      ...form,
      updatedAt: new Date(),
    });

    setMsg("User updated successfully!");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <User className="text-blue-600" /> Edit User
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User List */}
        <div className="border rounded-lg p-4 h-[500px] overflow-y-auto">
          <h3 className="font-semibold mb-3">Users</h3>

          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => handleSelect(u)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 ${
                selected?.id === u.id
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              {u.name || u.email}
            </button>
          ))}
        </div>

        {/* Edit Form */}
        <div className="col-span-2 border rounded-lg p-4">
          {!selected ? (
            <p className="text-gray-500">Select a user to edit.</p>
          ) : (
            <>
              {["name", "displayName", "email", "role"].map((key) => (
                <div key={key} className="mb-4">
                  <label className="text-sm font-medium">{key}</label>
                  <input
                    className="w-full border px-3 py-2 rounded-lg"
                    value={form[key] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </div>
              ))}

              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save size={18} /> Save
              </button>

              {msg && <p className="text-green-600 mt-3">{msg}</p>}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default EditUser;
