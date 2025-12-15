"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

export default function AdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    status: "active",
  });

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/admins");
      const data = await res.json();
      if (res.ok) {
        setAdmins(data.admins);
      }
    } catch (error) {
      console.error("Failed to fetch admins", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for admin session
    const storedAdmin = localStorage.getItem("adminUser");
    if (!storedAdmin) {
      router.push("/admin/signin");
      return;
    }

    fetchAdmins();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    router.push("/admin/signin");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (editingAdmin) {
        // Update
        res = await fetch("/api/admin/admins", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, id: editingAdmin._id }),
        });
      } else {
        // Create
        res = await fetch("/api/admin/admins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message,
          background: "#111827",
          color: "#fff",
          confirmButtonColor: "#DC2626",
        });
        return;
      }

      fetchAdmins(); // Refresh list
      setShowModal(false);
      setEditingAdmin(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "admin",
        status: "active",
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: editingAdmin
          ? "Admin updated successfully"
          : "Admin created successfully",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#DC2626",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Operation failed", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#DC2626",
      });
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "", // Don't show password
      role: admin.role,
      status: admin.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#374151",
      confirmButtonText: "Yes, delete it!",
      background: "#111827",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/admins?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          fetchAdmins();
          Swal.fire({
            title: "Deleted!",
            text: "Admin has been deleted.",
            icon: "success",
            background: "#111827",
            color: "#fff",
            confirmButtonColor: "#DC2626",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete admin",
            background: "#111827",
            color: "#fff",
            confirmButtonColor: "#DC2626",
          });
        }
      } catch (error) {
        console.error("Delete failed", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong",
          background: "#111827",
          color: "#fff",
          confirmButtonColor: "#DC2626",
        });
      }
    }
  };

  const openCreateModal = () => {
    setEditingAdmin(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
      status: "active",
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex">
      {/* Sidebar - Reused for consistency */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-10">
        <div className="h-20 flex items-center px-8 border-b border-gray-800">
          <h1 className="text-xl font-black uppercase tracking-tighter">
            Blade<span className="text-primary">Admin</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem href="/admin/home" icon={HomeIcon}>
            Dashboard
          </NavItem>
          <NavItem href="/admin/products" icon={ShoppingBagIcon}>
            Products
          </NavItem>
          <NavItem href="/admin/orders" icon={CurrencyDollarIcon}>
            Orders
          </NavItem>
          <NavItem href="/admin/users" icon={UsersIcon}>
            Users
          </NavItem>
          <NavItem href="/admin/admins" icon={UsersIcon} active>
            Admins
          </NavItem>
          <NavItem href="/admin/analytics" icon={ChartBarIcon}>
            Analytics
          </NavItem>
          <NavItem href="/admin/settings" icon={Cog6ToothIcon}>
            Settings
          </NavItem>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Admin Management</h2>
            <p className="text-gray-400 text-sm">
              Manage admin accounts and permissions
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors font-bold text-sm uppercase tracking-wider"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Admin
          </button>
        </header>

        {/* Admins Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-950 text-gray-200 uppercase font-bold text-xs">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created At</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {admins.map((admin) => (
                  <tr
                    key={admin._id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4">{admin.email}</td>
                    <td className="px-6 py-4 capitalize">
                      {admin.role.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          admin.status === "active"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-white">
              {editingAdmin ? "Edit Admin" : "Create New Admin"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                />
              </div>
              {!editingAdmin && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingAdmin}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-bold uppercase tracking-wider"
                >
                  {editingAdmin ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ href, icon: Icon, children, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        active
          ? "bg-primary text-white"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      {children}
    </Link>
  );
}
