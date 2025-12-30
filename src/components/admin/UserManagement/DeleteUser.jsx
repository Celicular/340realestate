import { useState, useEffect } from 'react';
import { db } from "../../../firebase/config";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { Trash } from "lucide-react";

const DeleteUser = () => {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete user "${u.name || u.email}"?`)) return;

    await deleteDoc(doc(db, "users", u.id));
    setMsg("User deleted successfully!");
    loadUsers();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <Trash className="text-red-600" /> Delete User
      </h2>

      <div className="border rounded-lg p-4 h-[500px] overflow-y-auto">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between p-3 border-b"
          >
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>

            <button
              onClick={() => handleDelete(u)}
              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}

        {msg && <p className="text-green-600 mt-3">{msg}</p>}
      </div>
    </div>
  );
};

export default DeleteUser;
