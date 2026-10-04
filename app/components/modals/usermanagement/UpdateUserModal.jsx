"use client";
import { FiEdit } from "react-icons/fi";
import React, { useState } from "react";

const UpdateUserModal = React.memo((props) => {
  const { handleclose, user, onSaved } = props;

  const [form, setForm] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    role: user?.role || "",
    department: user?.department || "",
    position: user?.position || "",
  });
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSignatureFile(file);
    setSignaturePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setSaving(true);
    const formData = new FormData();
    for (const key in form) formData.append(key, form[key]);
    if (signatureFile) formData.append("e_signature", signatureFile);

    await fetch(`/api/users/manage?id=${encodeURIComponent(user.userID)}`, {
      method: "PATCH",
      body: formData,
    });

    setSaving(false);
    onSaved?.();
    handleclose();
  };

  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-250 h-220 rounded-2xl bg-modalFace z-10 opacity-100 fixed">
        <div className="grid grid-rows-[150px_1fr] relative">
          {/* RED HEADER */}
          <div className="bg-darkRed rounded-t-2xl" />

          {/* FORM BODY */}
          <div className="mt-25 ml-10 mr-10">
            <h4 className="text-xl mb-2">ID: {user?.userID}</h4>

            <div className="w-full h-120 bg-white rounded-md grid grid-rows-8 gap-2 px-10">
              <div className="border-b border-gray-200 py-3 flex flex-row items-center">
                <label className="flex-1 text-sm text-gray-500">
                  First Name
                </label>
                <input
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  className="bg-modalFace border-b border-gray-300 text-sm px-1 w-48 focus:outline-none"
                />
              </div>

              <div className="border-b border-gray-200 py-3 flex flex-row items-center">
                <label className="flex-1 text-sm text-gray-500">
                  Last Name
                </label>
                <input
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  className="bg-modalFace border-b border-gray-300 text-sm px-1 w-48 focus:outline-none"
                />
              </div>

              <div className="border-b border-gray-200 py-3 flex flex-row items-center">
                <label className="flex-1 text-sm text-gray-500">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="bg-modalFace border-b border-gray-300 text-sm px-1 w-48 focus:outline-none"
                />
              </div>

              <div className="border-b border-gray-200 py-3 flex flex-row items-center">
                <label className="flex-1 text-sm text-gray-500">Role</label>
                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="bg-modalFace border-b border-gray-300 text-sm px-1 w-48 focus:outline-none"
                />
              </div>

              <div className="border-b border-gray-200 py-3 flex flex-row items-center">
                <label className="flex-1 text-sm text-gray-500">
                  Department
                </label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="bg-modalFace border-b border-gray-300 text-sm px-1 w-48 focus:outline-none"
                />
              </div>

              <div className="border-b border-gray-200 py-3 flex flex-row items-center">
                <label className="flex-1 text-sm text-gray-500">Position</label>
                <input
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className="bg-modalFace border-b border-gray-300 text-sm px-1 w-48 focus:outline-none"
                />
              </div>

              <div className="border-b border-gray-200 py-3 flex flex-row items-center gap-3">
                <label className="flex-1 text-sm text-gray-500">
                  E-Signature
                </label>
                <div className="flex items-center gap-2">
                  {(signaturePreview || user?.e_signature) && (
                    <img
                      src={signaturePreview || user.e_signature}
                      alt="sig"
                      className="h-8 object-contain border rounded"
                    />
                  )}
                  <label className="cursor-pointer text-xs text-blue-500 underline">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end items-center py-2">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="bg-darkRed text-white text-sm px-6 py-1.5 rounded-lg disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>

          {/* CLOSE */}
          <button
            className="text-white bg-darkRed absolute top-2 right-2 px-2 py-1 rounded text-sm"
            onClick={handleclose}
          >
            close
          </button>

          {/* AVATAR + NAME */}
          <div className="absolute top-7 right-92 flex flex-col justify-center items-center">
            <div className="flex flex-row">
              <img
                src={user?.profile_pic || "/profile/Generic avatar.png"}
                className="h-40 w-40"
                alt="avatar"
              />
              <FiEdit size={20} className="self-end" />
            </div>
            <div className="mt-2">
              <h4 className="font-semibold text-xl">
                {user?.lastname}, {user?.firstname}
              </h4>
              <h4 className="text-sm text-center mt-2">{user?.role}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default UpdateUserModal;
