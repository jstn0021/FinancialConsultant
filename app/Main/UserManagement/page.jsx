"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // FETCH USERS
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // EDIT
  const handleEdit = (user) => {
    setEditingId(user.userID);
    setForm({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email || "",
      role: user.role || "",
      department: user.department || "",
      position: user.position || "",
      e_signature: user.e_signature || "",
    });
    setShowModal(true);
  };

  // ADD BUTTON
  const handleAdd = () => {
    setForm({});
    setEditingId(null);
    setShowModal(true);
  };

  // SAVE
  const handleSubmit = async () => {
    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key] || "");
    }

    if (editingId) {
      await fetch(`/api/users/manage?id=${encodeURIComponent(editingId)}`, {
        method: "PATCH",
        body: formData,
      });
    } else {
      const res = await fetch("/api/users", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) return;
    }

    setShowModal(false);
    setForm({});
    await fetchUsers();
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirm) return;

    await fetch(`/api/users/manage?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    fetchUsers();
  };

  // FILTER
  const filtered = users.filter((u) =>
    `${u.firstname} ${u.lastname}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* TOP ACTION */}
      <div className="flex justify-between mb-4">
        <input
          placeholder="Search users..."
          className="p-2 border rounded w-1/3"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add User
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Info</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u.userID} className="border-t hover:bg-gray-50">
                {/* USER */}
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={u.profile_pic || "/default-avatar.png"}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="avatar"
                  />
                  <div>
                    <div className="font-medium">
                      {u.firstname} {u.lastname}
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">ID: </span>
                      {u.userID}
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">Email: </span>
                      {u.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">Password: </span>
                      {u.password || "—"}
                    </div>
                    {u.e_signature && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-400">
                          E-Signature:{" "}
                        </span>
                        <img
                          src={u.e_signature}
                          alt="E-Signature"
                          className="h-8 object-contain border rounded mt-0.5"
                        />
                      </div>
                    )}
                  </div>
                </td>

                {/* INFO */}
                <td className="p-3 text-sm">
                  <div>
                    <span className="text-xs text-gray-400">Role: </span>
                    {u.role}
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Dept: </span>
                    {u.department}
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Position: </span>
                    {u.position}
                  </div>
                </td>

                {/* STATUS */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full text-white ${
                      u.status === "Active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="bg-yellow-400 px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>
                    {u.status === "Active" ? (
                      <button
                        onClick={() => handleDelete(u.userID)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(u.userID)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          <div className="relative bg-white p-6 rounded-xl shadow-lg w-[420px] animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit User" : "Add User"}
            </h2>

            <div className="grid gap-3">
              <input
                name="firstname"
                value={form.firstname || ""}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="First Name"
              />
              <input
                name="lastname"
                value={form.lastname || ""}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Last Name"
              />
              <input
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Email Address required"
              />
              <input
                name="role"
                value={form.role || ""}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Role"
              />
              <input
                name="department"
                value={form.department || ""}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Department"
              />
              <input
                name="position"
                value={form.position || ""}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Position"
              />
              <input
                name="password"
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Password (optional)"
              />

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  E-Signature
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, e_signature: e.target.files[0] })
                  }
                  className="p-2 border rounded w-full text-sm"
                />
                {/* Preview — existing signature lang (string URL), hindi yung bagong file */}
                {form.e_signature && typeof form.e_signature === "string" && (
                  <img
                    src={form.e_signature}
                    alt="E-Signature"
                    className="mt-2 h-16 object-contain border rounded"
                  />
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
