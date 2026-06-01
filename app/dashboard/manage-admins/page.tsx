"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../ui/layout-dashboard";
import { getAdmins, saveAdmins, getClientSession, AdminAccount } from "../../lib/auth";

export default function ManageAdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enabled, setEnabled] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [role, setRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const session = getClientSession();
    if (!session) {
      router.push("/home?login=true");
      return;
    }
    if (session.role !== "Owner") {
      router.push("/dashboard");
      return;
    }
    setRole(session.role);
    setAdmins(getAdmins());
  }, [router]);

  if (!role) {
    return null;
  }

  const handleOpenCreate = () => {
    setEditingAdmin(null);
    setUsername("");
    setPassword("");
    setName("");
    setEmail("");
    setEnabled(true);
    setErrors({});
    setShowPassword(false);
    setShowForm(true);
  };

  const handleOpenEdit = (admin: AdminAccount) => {
    setEditingAdmin(admin);
    setUsername(admin.username);
    setPassword(""); // Keep blank unless updating password
    setName(admin.name);
    setEmail(admin.email);
    setEnabled(admin.enabled);
    setErrors({});
    setShowPassword(false);
    setShowForm(true);
  };

  const handleToggleStatus = (admin: AdminAccount) => {
    const updated = admins.map((a) => {
      if (a.username === admin.username) {
        const nextEnabled = !a.enabled;
        return { ...a, enabled: nextEnabled };
      }
      return a;
    });
    setAdmins(updated);
    saveAdmins(updated);
  };

  const handleDelete = (usernameToDelete: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun admin "${usernameToDelete}"?`)) {
      const updated = admins.filter((a) => a.username !== usernameToDelete);
      setAdmins(updated);
      saveAdmins(updated);
      if (editingAdmin?.username === usernameToDelete) {
        setShowForm(false);
        setEditingAdmin(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (!editingAdmin && admins.some((a) => a.username.toLowerCase() === username.trim().toLowerCase())) {
      newErrors.username = "Username already exists";
    } else if (!editingAdmin && username.trim().toLowerCase() === "owner") {
      newErrors.username = "Username 'owner' is reserved";
    }

    if (!editingAdmin && !password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = "Invalid email format";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let updatedAdmins: AdminAccount[] = [];

    if (editingAdmin) {
      // Editing
      updatedAdmins = admins.map((a) => {
        if (a.username === editingAdmin.username) {
          return {
            username: a.username,
            password: password.trim() ? password : a.password,
            name: name.trim(),
            email: email.trim(),
            enabled: enabled,
          };
        }
        return a;
      });
    } else {
      // Creating
      const newAdmin: AdminAccount = {
        username: username.trim(),
        password: password,
        name: name.trim(),
        email: email.trim(),
        enabled: enabled,
      };
      updatedAdmins = [...admins, newAdmin];
    }

    setAdmins(updatedAdmins);
    saveAdmins(updatedAdmins);
    setShowForm(false);
    setEditingAdmin(null);
    setErrors({});
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.username.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Admin Accounts</h1>
          <p className="text-gray-500 mt-1">Create, edit, view, and disable/delete admin accounts</p>
        </div>
        {!showForm && (
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            + Create Admin
          </button>
        )}
      </div>

      {/* INLINE FORM FOR CREATE/EDIT */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 border border-gray-100 animate-fadeIn duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editingAdmin ? `Edit Admin Account: ${editingAdmin.username}` : "Create New Admin Account"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingAdmin(null);
                setErrors({});
              }}
              className="text-gray-400 hover:text-gray-600 text-sm font-semibold transition"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username Field */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-600 mb-2">Username</label>
                <input
                  type="text"
                  placeholder="e.g. 241712926"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.username;
                        return copy;
                      });
                    }
                  }}
                  disabled={!!editingAdmin}
                  className={`border border-gray-300 p-3.5 rounded-xl outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                    editingAdmin ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200" : ""
                  } ${errors.username ? "border-red-500 focus:ring-red-100" : ""}`}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-600 mb-2">
                  Password {editingAdmin && <span className="text-gray-400 font-normal">(Leave blank to keep current)</span>}
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={editingAdmin ? "••••••••" : "Enter password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.password;
                          return copy;
                        });
                      }
                    }}
                    className={`border border-gray-300 p-3.5 pr-12 rounded-xl outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full ${
                      errors.password ? "border-red-500 focus:ring-red-100" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition focus:outline-none"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Name Field */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-600 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.name;
                        return copy;
                      });
                    }
                  }}
                  className={`border border-gray-300 p-3.5 rounded-xl outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                    errors.name ? "border-red-500 focus:ring-red-100" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-600 mb-2">Email Address</label>
                <input
                  type="text"
                  placeholder="e.g. email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.email;
                        return copy;
                      });
                    }
                  }}
                  className={`border border-gray-300 p-3.5 rounded-xl outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                    errors.email ? "border-red-500 focus:ring-red-100" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Status Field */}
            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100 w-fit">
              <input
                id="enabled-toggle"
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4.5 h-4.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enabled-toggle" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
                Enable Account (User can log in)
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAdmin(null);
                  setErrors({});
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
              >
                {editingAdmin ? "Save Changes" : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH AND LIST CONTAINER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* SEARCH BAR */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <input
            type="text"
            placeholder="Search by name, username, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition p-3.5 rounded-xl outline-none bg-white shadow-sm text-sm"
          />
        </div>

        {/* TABLE LIST */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 bg-gray-50/70 text-left">
                <th className="py-4 px-6 font-semibold">Full Name</th>
                <th className="py-4 px-6 font-semibold">Username</th>
                <th className="py-4 px-6 font-semibold">Email</th>
                <th className="py-4 px-6 font-semibold text-center">Status</th>
                <th className="py-4 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    No admin accounts found.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin, index) => (
                  <tr
                    key={admin.username}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">{admin.name}</td>
                    <td className="py-4 px-6 text-gray-600 font-mono">{admin.username}</td>
                    <td className="py-4 px-6 text-gray-600">{admin.email}</td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          admin.enabled
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {admin.enabled ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center items-center space-x-3">
                        {/* Toggle Status Button */}
                        <button
                          onClick={() => handleToggleStatus(admin)}
                          title={admin.enabled ? "Disable Account" : "Enable Account"}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            admin.enabled
                              ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {admin.enabled ? "Disable" : "Enable"}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(admin)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-xs font-semibold transition"
                        >
                          Edit
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(admin.username)}
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-semibold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
