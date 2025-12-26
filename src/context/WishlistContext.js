"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user and wishlist on mount
    useEffect(() => {
        const loadData = async () => {
            // 1. Check for logged in user
            const storedUser = localStorage.getItem("user");
            let currentUser = null;

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.expiry && Date.now() > parsedUser.expiry) {
                    localStorage.removeItem("user");
                } else {
                    currentUser = parsedUser;
                    setUser(currentUser);
                }
            }

            // 2. Load Wishlist
            if (currentUser) {
                // Fetch from API
                try {
                    const res = await fetch(`/api/wishlist?userId=${currentUser.id || currentUser._id}`);
                    const data = await res.json();
                    if (data.success) {
                        setWishlist(data.wishlist || []);
                    }
                } catch (err) {
                    console.error("Failed to fetch user wishlist", err);
                }
            } else {
                // Load from SessionStorage for guests as requested
                const sessionWishlist = sessionStorage.getItem("guestWishlist");
                if (sessionWishlist) {
                    try {
                        setWishlist(JSON.parse(sessionWishlist));
                    } catch (e) {
                        console.error("Error parsing guest wishlist", e);
                        setWishlist([]);
                    }
                }
            }
            setLoading(false);
        };

        loadData();
    }, []);

    // Update SessionStorage whenever wishlist changes (only for guests)
    useEffect(() => {
        if (!user && !loading) {
            sessionStorage.setItem("guestWishlist", JSON.stringify(wishlist));
        }
    }, [wishlist, user, loading]);

    // Add Item to Wishlist
    const addToWishlist = async (product) => {
        const productId = product._id || product.id;

        // Check if already in wishlist to avoid duplicates
        if (wishlist.some(item => (item._id || item.id) === productId)) {
            toast.info("Item already in wishlist");
            return;
        }

        if (user) {
            const userId = user.id || user._id;
            try {
                const res = await fetch("/api/wishlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, productId })
                });
                const data = await res.json();
                if (data.success) {
                    // Update with whatever the server returns (to get full product info if possible)
                    setWishlist(data.wishlist);
                    toast.success("Added to wishlist!");
                } else {
                    toast.error(data.message || "Failed to add to wishlist");
                }
            } catch (err) {
                console.error("Error adding to wishlist API", err);
                toast.error("Error adding to wishlist");
            }
        } else {
            // Guest Logic
            setWishlist(prev => [...prev, product]);
            toast.success("Added to wishlist (Guest)!");
        }
    };

    // Remove Item from Wishlist
    const removeFromWishlist = async (productId) => {
        if (user) {
            const userId = user.id || user._id;
            try {
                const res = await fetch("/api/wishlist", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, productId })
                });
                const data = await res.json();
                if (data.success) {
                    setWishlist(data.wishlist);
                    toast.success("Removed from wishlist");
                }
            } catch (err) {
                console.error("Error removing from wishlist API", err);
            }
        } else {
            setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));
            toast.success("Removed from wishlist");
        }
    };

    // Check if item is in wishlist
    const isInWishlist = (productId) => {
        return wishlist.some(item => (item._id || item.id || item) === productId);
    };

    // Sync Guest Wishlist on Login
    const syncWishlist = async (userData) => {
        const guestWishlist = JSON.parse(sessionStorage.getItem("guestWishlist") || "[]");
        setUser(userData);

        if (guestWishlist.length > 0) {
            try {
                const productIds = guestWishlist.map(p => p._id || p.id);
                const res = await fetch("/api/wishlist/sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: userData.id || userData._id,
                        productIds
                    })
                });
                const data = await res.json();
                if (data.success) {
                    setWishlist(data.wishlist);
                    sessionStorage.removeItem("guestWishlist");
                }
            } catch (err) {
                console.error("Failed to sync wishlist", err);
            }
        } else {
            // Just fetch user wishlist
            try {
                const res = await fetch(`/api/wishlist?userId=${userData.id || userData._id}`);
                const data = await res.json();
                if (data.success) {
                    setWishlist(data.wishlist || []);
                }
            } catch (err) {
                console.error("Failed to fetch user wishlist after login", err);
            }
        }
    };

    const logout = () => {
        setUser(null);
        setWishlist([]);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                syncWishlist,
                logout,
                loading
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
