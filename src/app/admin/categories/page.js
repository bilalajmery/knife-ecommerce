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
import Pagination from "../../components/admin/Pagination";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories);
        setFilteredCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Filter & Search
  useEffect(() => {
    let result = categories;

    // Search Filter
    if (searchTerm) {
      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status Filter
    if (filterStatus !== "all") {
      result = result.filter((category) => category.status === filterStatus);
    }

    setFilteredCategories(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, filterStatus, categories]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handleDelete = async (id) => {
    const result = await showConfirm(
      "Are you sure?",
      "You won't be able to revert this!"
    );

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/categories?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          fetchCategories();
          showAlert("success", "Deleted!", "Collection has been deleted.");
        } else {
          showAlert("error", "Error", "Failed to delete collection");
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
      <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto min-h-screen">
        <header className="mt-12 lg:mt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Collection Ward
            </h2>
            <p className="text-gray-400 mt-1">
              Manage product collections and organization
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/categories/create")}
            className="flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-red-700 transition-all font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/40"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Collection
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
              placeholder="Search collections..."
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

        {/* Categories Table */}
        <div className="bg-[#111] border border-gray-900 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-black text-gray-200 uppercase font-bold text-xs tracking-wider border-b border-gray-900">
                <tr>
                  <th className="px-8 py-5">Image</th>
                  <th className="px-6 py-5">Name</th>
                  <th className="px-6 py-5">Slug</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {currentCategories.length > 0 ? (
                  currentCategories.map((category) => (
                    <tr
                      key={category._id}
                      className="hover:bg-gray-900/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="h-12 w-12 rounded-lg bg-gray-800 overflow-hidden border border-gray-700">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-5 font-bold text-white group-hover:text-primary transition-colors">
                        {category.name}
                      </td>
                      <td className="px-6 py-5 text-gray-500">
                        {category.slug}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${category.status === "active"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                            }`}
                        >
                          {category.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/categories/edit/${category._id}`
                              )
                            }
                            className="p-2 rounded-lg hover:bg-blue-500/10 text-gray-500 hover:text-blue-500 transition-colors"
                            title="Edit"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
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
                          No collections found
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalResults={filteredCategories.length}
            showingCount={currentCategories.length}
          />
        </div>
      </main>
    </div>
  );
}





