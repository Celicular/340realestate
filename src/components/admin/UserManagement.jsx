import React, { useEffect, useState, useCallback } from "react";
import { 
  User, 
  Shield, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  Plus 
} from "lucide-react";

import { 
  getAllUsers, 
  updateUser, 
  deleteUser 
} from "../../firebase/firestore";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();

    if (result.success) {
      setUsers(result.data);
      setFiltered(result.data);
    }

    setLoading(false);
  };

  const filterUsers = useCallback(() => {
    let list = [...users];

    if (selectedRole !== "all") {
      list = list.filter(user => user.role === selectedRole);
    }

    if (search.trim()) {
      list = list.filter(
        user =>
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(list);
  }, [users, search, selectedRole]);

  useEffect(() => filterUsers(), [filterUsers]);

  const updateRole = async (user, newRole) => {
    const result = await updateUser(user.id, { role: newRole });

    if (result.success) loadUsers();
  };

  const removeUser = async (user) => {
    if (!window.confirm(`Delete user "${user.name}"?`)) return;
    
    const result = await deleteUser(user.id);
    if (result.success) loadUsers();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage all platform users & roles</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4 space-x-3">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 p-2 border rounded-lg"
            />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="viewer">Viewer</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setSelectedRole("all");
            }}
            className="border p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">
          Users ({filtered.length})
        </h3>

        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center border p-4 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{user.name}</h4>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Role Dropdown */}
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user, e.target.value)}
                    className="border px-3 py-1 rounded-lg"
                  >
                    <option value="admin">Admin</option>
                    <option value="agent">Agent</option>
                    <option value="viewer">Viewer</option>
                  </select>

                  {/* Actions */}
                  <button
                    onClick={() => removeUser(user)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
