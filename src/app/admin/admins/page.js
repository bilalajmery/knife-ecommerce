"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { showAlert, showConfirm } from "../../../utils/sweetAlert";
import Sidebar from "../../components/admin/Sidebar";

export default function AdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);

  // Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/admins");
      const data = await res.json();
      if (res.ok) {
        setAdmins(data.admins);
        setFilteredAdmins(data.admins);
      }
    } catch (error) {
      console.error("Failed to fetch admins", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle Filter & Search
  useEffect(() => {
    let result = admins;

    // Search Filter
    if (searchTerm) {
      result = result.filter(
        (admin) =>
          admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status Filter
    if (filterStatus !== "all") {
      result = result.filter((admin) => admin.status === filterStatus);
    }

    setFilteredAdmins(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, filterStatus, admins]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  const handleDelete = async (id) => {
    const result = await showConfirm(
      "Are you sure?",
      "You won't be able to revert this!"
    );

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/admins?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          fetchAdmins();
          showAlert("success", "Deleted!", "Admin has been deleted.");
        } else {
          showAlert("error", "Error", "Failed to delete admin");
        }
      } catch (error) {
        console.error("Delete failed", error);
        showAlert("error", "Error", "Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen custom-scrollbar">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Admin Management
            </h2>
            <p className="text-gray-400 mt-1">
              Manage admin accounts and permissions
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/admins/create")}
            className="flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-red-700 transition-all font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/40"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Admin
          </button>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-[#111] p-6 rounded-2xl border border-gray-900 shadow-xl">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Filter:
              </span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-black border border-gray-800 text-white text-sm rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary block p-3 min-w-[150px] transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-[#111] border border-gray-900 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-black text-gray-200 uppercase font-bold text-xs tracking-wider border-b border-gray-900">
                <tr>
                  <th className="px-8 py-5">Name</th>
                  <th className="px-6 py-5">Email</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Created At</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {currentAdmins.length > 0 ? (
                  currentAdmins.map((admin) => (
                    <tr
                      key={admin._id}
                      className="hover:bg-gray-900/50 transition-colors group"
                    >
                      <td className="px-8 py-5 font-bold text-white group-hover:text-primary transition-colors">
                        {admin.name}
                      </td>
                      <td className="px-6 py-5">{admin.email}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                            admin.status === "active"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}
                        >
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() =>
                              router.push(`/admin/admins/edit/${admin._id}`)
                            }
                            className="p-2 rounded-lg hover:bg-blue-500/10 text-gray-500 hover:text-blue-500 transition-colors"
                            title="Edit"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <MagnifyingGlassIcon className="h-12 w-12 text-gray-700 mb-4" />
                        <p className="text-lg font-medium text-gray-400">
                          No admins found
                        </p>
                        <p className="text-sm text-gray-600">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-8 py-5 border-t border-gray-900 flex items-center justify-between bg-[#111]">
              <span className="text-sm text-gray-400">
                Showing{" "}
                <span className="font-bold text-white">
                  {indexOfFirstItem + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-white">
                  {Math.min(indexOfLastItem, filteredAdmins.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-white">
                  {filteredAdmins.length}
                </span>{" "}
                results
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl border border-gray-800 hover:bg-gray-800 hover:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-400 hover:text-white"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-xl border border-gray-800 hover:bg-gray-800 hover:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-400 hover:text-white"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
