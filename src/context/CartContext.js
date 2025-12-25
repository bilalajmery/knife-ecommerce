"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState({ items: [], totalPrice: 0 });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user and cart on mount
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

            // 2. Load Cart
            if (currentUser) {
                // Fetch from API
                try {
                    const res = await fetch(`/api/cart?userId=${currentUser.id || currentUser._id}`);
                    const data = await res.json();
                    if (data.success) {
                        setCart(data.cart);
                    }
                } catch (err) {
                    console.error("Failed to fetch user cart", err);
                }
            } else {
                // Load from LocalStorage
                const localCart = localStorage.getItem("guestCart");
                if (localCart) {
                    setCart(JSON.parse(localCart));
                }
            }
            setLoading(false);
        };

        loadData();
    }, []);

    // Update LocalStorage whenever cart changes (only for guests)
    useEffect(() => {
        if (!user && !loading) {
            localStorage.setItem("guestCart", JSON.stringify(cart));
        }
    }, [cart, user, loading]);

    // Add Item
    const addToCart = async (product, quantity = 1) => {
        // Optimistic Update / Local State
        const newItem = {
            product: product, // Store full product for guest cart display
            quantity,
            name: product.name,
            price: product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price,
            image: product.mainImage || product.galleryImages?.[0],
            slug: product.slug,
        };

        if (user) {
            console.log("CONTEXT: Adding to cart for user:", user);
            const userId = user.id || user._id; // Check both id formats
            console.log("CONTEXT: Using UserID:", userId);

            // API Call
            try {
                const res = await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: userId,
                        product: product,
                        quantity
                    })
                });
                console.log("CONTEXT: API Status:", res.status, res.statusText);

                const data = await res.json();
                console.log("CONTEXT: Add to cart API response:", data);

                if (data.success) {
                    setCart(data.cart);
                    toast.success("Item added to cart successfully!");
                } else {
                    console.error("CONTEXT: API returned failure:", data);
                    toast.error(`Failed to add to cart: ${data.message}`);
                }
            } catch (err) {
                console.error("Failed to add to cart API", err);
                toast.error("Error adding item to cart. Check console.");
            }
        } else {
            // Guest Logic
            setCart((prev) => {
                const items = [...prev.items];
                const existingIndex = items.findIndex(
                    (item) => (item.product._id || item.product.id || item.product) === (product._id || product.id)
                );

                if (existingIndex > -1) {
                    items[existingIndex].quantity += quantity;
                } else {
                    items.push(newItem);
                }

                // Recalculate total
                const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                return { ...prev, items, totalPrice };
            });
        }
    };

    // Remove Item
    const removeFromCart = async (productId) => {
        if (user) {
            try {
                const res = await fetch("/api/cart", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.id || user._id,
                        productId
                    })
                });
                const data = await res.json();
                if (data.success) {
                    setCart(data.cart);
                }
            } catch (err) {
                console.error("Failed to remove from cart API", err);
            }
        } else {
            setCart((prev) => {
                const items = prev.items.filter(item => (item.product._id || item.product.id || item.product) !== productId);
                const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                return { ...prev, items, totalPrice };
            });
        }
    };

    // Update Quantity
    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;

        if (user) {
            try {
                const res = await fetch("/api/cart", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.id || user._id,
                        productId,
                        quantity
                    })
                });
                const data = await res.json();
                if (data.success) {
                    setCart(data.cart);
                }
            } catch (err) {
                console.error("Failed to update cart API", err);
            }
        } else {
            setCart((prev) => {
                const items = [...prev.items];
                const index = items.findIndex(item => (item.product._id || item.product.id || item.product) === productId);
                if (index > -1) {
                    items[index].quantity = quantity;
                }
                const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                return { ...prev, items, totalPrice };
            });
        }
    };

    // Apply Promo Code
    const applyPromo = async (code) => {
        try {
            const res = await fetch("/api/promos/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, userId: user?.id || user?._id }),
            });
            const data = await res.json();

            if (data.valid) {
                console.log("CONTEXT: Promo Validated. Discount:", data.discount);
                if (data.cart) {
                    console.log("CONTEXT: Updating Cart from Server:", data.cart);
                    // Server returned updated cart (logged in user)
                    setCart(data.cart);
                } else {
                    console.log("CONTEXT: Updating Guest Cart State");
                    // Update local state for guests
                    setCart(prev => {
                        const newState = {
                            ...prev,
                            appliedPromo: code,
                            discount: data.discount
                        };
                        console.log("CONTEXT: New Guest Cart State:", newState);
                        return newState;
                    });
                }
                return { success: true, message: data.message, discount: data.discount };
            } else {
                console.warn("CONTEXT: Promo Validation Failed", data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Apply Promo Error:", error);
            return { success: false, message: "Failed to apply promo code" };
        }
    };

    // Remove Promo Code
    const removePromo = async () => {
        if (user) {
            try {
                const res = await fetch("/api/promos/remove", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id || user._id })
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    // Update usage of returned cart
                    if (data.cart) {
                        setCart(data.cart);
                    } else {
                        await refreshCart();
                    }
                    return { success: true };
                }
            } catch (err) {
                console.error("Failed to remove promo API", err);
            }
        } else {
            setCart(prev => ({
                ...prev,
                appliedPromo: null,
                discount: 0
            }));
            return { success: true };
        }
        return { success: false };
    };

    // Sync Guest Cart on Login
    const syncCart = async (userData) => {
        const guestCart = JSON.parse(localStorage.getItem("guestCart"));

        setUser(userData); // Set user state

        if (guestCart && guestCart.items.length > 0) {
            try {
                // Merge API
                const res = await fetch("/api/cart", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: userData.id || userData._id,
                        guestItems: guestCart.items
                    })
                });
                const data = await res.json();
                if (data.success) {
                    setCart(data.cart);
                    localStorage.removeItem("guestCart"); // Clear guest cart
                }
            } catch (err) {
                console.error("Failed to sync cart", err);
            }
        } else {
            // Just fetch user cart if no guest items
            try {
                const res = await fetch(`/api/cart?userId=${userData.id || userData._id}`);
                const data = await res.json();
                if (data.success) {
                    setCart(data.cart);
                }
            } catch (err) {
                console.error("Failed to fetch user cart after login", err);
            }
        }
    };

    const logout = () => {
        setUser(null);
        setCart({ items: [], totalPrice: 0 });
        localStorage.removeItem("user");
        // Optional: Clear guest cart or keep it empty? 
        // Usually logging out means you start fresh or empty.
    };

    const refreshCart = async () => {
        if (user) {
            const res = await fetch(`/api/cart?userId=${user.id || user._id}`);
            const data = await res.json();
            if (data.success) {
                setCart(data.cart);
            }
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                applyPromo,
                removePromo,
                user,
                syncCart,
                logout,
                loading,
                refreshCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
