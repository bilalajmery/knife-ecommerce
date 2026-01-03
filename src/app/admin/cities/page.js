"use client";
import { useState, useEffect } from "react";
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { showAlert, showConfirm } from "../../../utils/sweetAlert";
import Sidebar from "../../components/admin/Sidebar";
import { toast } from "sonner";

export default function CitiesPage() {
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [allStates, setAllStates] = useState([]); // Store all states
    const [filteredStates, setFilteredStates] = useState([]); // States filtered by selected country
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCity, setCurrentCity] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        country: "",
        state: "",
        isActive: true,
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [citiesRes, countriesRes, statesRes] = await Promise.all([
                fetch("/api/admin/cities"),
                fetch("/api/admin/countries"),
                fetch("/api/admin/states"),
            ]);

            const citiesData = await citiesRes.json();
            const countriesData = await countriesRes.json();
            const statesData = await statesRes.json();

            if (citiesRes.ok) setCities(citiesData.cities);
            if (countriesRes.ok) setCountries(countriesData.countries);
            if (statesRes.ok) setAllStates(statesData.states);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter states when country changes in form
    useEffect(() => {
        if (formData.country) {
            const relatedStates = allStates.filter(
                (s) => (s.country._id || s.country) === formData.country
            );
            setFilteredStates(relatedStates);
        } else {
            setFilteredStates([]);
        }
    }, [formData.country, allStates]);

    const handleOpenModal = (city = null) => {
        if (city) {
            setCurrentCity(city);
            setFormData({
                name: city.name,
                country: city.country?._id || city.country,
                state: city.state?._id || city.state,
                isActive: city.isActive,
            });
        } else {
            setCurrentCity(null);
            setFormData({
                name: "",
                country: "",
                state: "",
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCity(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => {
            const newData = {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            };

            // Reset state selection if country changes
            if (name === 'country') {
                newData.state = "";
            }

            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.country || !formData.state) {
            toast.error("Please select a country and state");
            return;
        }

        try {
            const url = currentCity
                ? `/api/admin/cities/${currentCity._id}`
                : "/api/admin/cities";
            const method = currentCity ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(
                    currentCity
                        ? "City updated successfully"
                        : "City added successfully"
                );
                handleCloseModal();
                fetchData();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Something went wrong");
        }
    };

    const handleDelete = async (id) => {
        const result = await showConfirm(
            "Are you sure?",
            "You won't be able to revert this!"
        );

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/admin/cities/${id}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    fetchData();
                    showAlert("success", "Deleted!", "City has been deleted.");
                } else {
                    showAlert("error", "Error", "Failed to delete city");
                }
            } catch (error) {
                console.error("Delete failed", error);
                showAlert("error", "Error", "Something went wrong");
            }
        }
    };

    const filteredCities = cities.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.country?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.state?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto min-h-screen">
                <header className="mt-12 lg:mt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Cities</h2>
                        <p className="text-gray-400 mt-1">
                            Manage cities for shipping destinations
                        </p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-red-700 transition-all font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add City
                    </button>
                </header>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-[#111] p-6 rounded-2xl border border-gray-900 shadow-xl">
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search cities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#111] border border-gray-900 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-black text-gray-200 uppercase font-bold text-xs tracking-wider border-b border-gray-900">
                                <tr>
                                    <th className="px-6 py-5">Name</th>
                                    <th className="px-6 py-5">State</th>
                                    <th className="px-6 py-5">Country</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-900">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-12 text-center text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : filteredCities.length > 0 ? (
                                    filteredCities.map((city) => (
                                        <tr
                                            key={city._id}
                                            className="hover:bg-gray-900/50 transition-colors group"
                                        >
                                            <td className="px-6 py-5 font-bold text-white group-hover:text-primary transition-colors">
                                                {city.name}
                                            </td>
                                            <td className="px-6 py-5 text-gray-300">
                                                {city.state?.name || "N/A"}
                                            </td>
                                            <td className="px-6 py-5 text-gray-300">
                                                {city.country?.name || "N/A"}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${city.isActive
                                                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                        : "bg-red-500/10 text-red-500 border-red-500/20"
                                                        }`}
                                                >
                                                    {city.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => handleOpenModal(city)}
                                                        className="p-2 rounded-lg hover:bg-blue-500/10 text-gray-500 hover:text-blue-500 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(city._id)}
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
                                                    No cities found
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-black">
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                                {currentCity ? "Edit City" : "Add City"}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Country
                                </label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                >
                                    <option value="" disabled>Select a Country</option>
                                    {countries.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    State / Province
                                </label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!formData.country}
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="" disabled>Select a State</option>
                                    {filteredStates.map(s => (
                                        <option key={s._id} value={s._id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>


                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    City Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Los Angeles"
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary focus:ring-offset-gray-900"
                                />
                                <label
                                    htmlFor="isActive"
                                    className="text-sm font-medium text-gray-300"
                                >
                                    Active
                                </label>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-bold text-sm uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-red-700 transition-colors font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20"
                                >
                                    {currentCity ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}





