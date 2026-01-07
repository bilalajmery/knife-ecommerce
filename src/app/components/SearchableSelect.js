"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchableSelect({
    options = [],
    value,
    onChange,
    placeholder = "Select an option",
    disabled = false,
    name
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef(null);
    const searchRef = useRef(null);

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find(opt => opt._id === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchRef.current) {
            searchRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (option) => {
        onChange({ target: { name, value: option._id } });
        setIsOpen(false);
        setSearch("");
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                className={`w-full bg-gray-900 border border-gray-800 rounded px-4 py-3 flex items-center justify-between text-left transition-colors ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary focus:border-primary"
                    }`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <span className={selectedOption ? "text-white" : "text-gray-500"}>
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-3 border-b border-gray-800 bg-black/50">
                        <div className="relative group">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                            <input
                                ref={searchRef}
                                type="text"
                                className="w-full bg-gray-900 border border-gray-800 rounded-md pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                                placeholder="Search here..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar divide-y divide-gray-800/30">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option._id}
                                    type="button"
                                    className={`w-full px-4 py-3 text-left text-sm transition-all flex items-center justify-between group ${value === option._id
                                            ? "bg-primary text-white font-bold"
                                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                        }`}
                                    onClick={() => handleSelect(option)}
                                >
                                    <span>{option.name}</span>
                                    {value === option._id && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-12 text-center">
                                <p className="text-gray-500 text-sm font-medium">No results found for "{search}"</p>
                                <p className="text-gray-600 text-xs mt-1 italic">Try a different keyword</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
