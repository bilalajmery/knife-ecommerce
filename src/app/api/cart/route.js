import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

// Helper to get cart by userId
async function getCart(userId) {
    return await Cart.findOne({ user: userId }).populate("items.product");
}

// GET: Fetch user's cart
export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const cart = await getCart(userId);

        return NextResponse.json({
            success: true,
            cart: cart || { items: [], totalPrice: 0 },
        });
    } catch (error) {
        console.error("Get Cart Error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}

// POST: Add item to cart
export async function POST(req) {
    console.log("API: POST /api/cart CALLED");
    try {
        await dbConnect();
        const body = await req.json();
        console.log("API: Add to Cart Request Body:", body);
        const { userId, product, quantity } = body;

        if (!userId || !product || !quantity) {
            console.error("API: Missing fields", { userId, productId: product?._id, quantity });
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Fetch fresh product details to ensure price is correct
        console.log("API: Fetching product details for:", product._id || product.id);
        const productDetails = await Product.findById(product._id || product.id);
        if (!productDetails) {
            console.error("API: Product not found:", product._id || product.id);
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        let cart = await Cart.findOne({ user: userId });

        const price =
            productDetails.discount > 0
                ? productDetails.price * (1 - productDetails.discount / 100)
                : productDetails.price;

        if (cart) {
            // Check if item exists
            const itemIndex = cart.items.findIndex(
                (p) => p.product.toString() === productDetails._id.toString()
            );

            if (itemIndex > -1) {
                // Update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Add new item
                cart.items.push({
                    product: productDetails._id,
                    quantity: quantity,
                    name: productDetails.name,
                    price: price,
                    image: productDetails.mainImage || productDetails.galleryImages?.[0],
                    slug: productDetails.slug,
                });
            }
        } else {
            // Create new cart
            cart = new Cart({
                user: userId,
                items: [
                    {
                        product: productDetails._id,
                        quantity: quantity,
                        name: productDetails.name,
                        price: price,
                        image: productDetails.mainImage || productDetails.galleryImages?.[0],
                        slug: productDetails.slug,
                    },
                ],
            });
        }

        // Manually calculate total price since pre-save hook is disabled for debugging
        cart.totalPrice = cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        await cart.save();
        return NextResponse.json({ success: true, cart });
    } catch (error) {
        console.error("Add to Cart Error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}

// PUT: Update item quantity
export async function PUT(req) {
    try {
        await dbConnect();
        const { userId, productId, quantity } = await req.json();

        if (!userId || !productId || !quantity) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return NextResponse.json({ message: "Cart not found" }, { status: 404 });
        }

        const itemIndex = cart.items.findIndex((p) => p.product.toString() === productId);

        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                // Remove item if quantity is 0 or less
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
            return NextResponse.json({ success: true, cart });
        } else {
            return NextResponse.json({ message: "Item not found in cart" }, { status: 404 });
        }
    } catch (error) {
        console.error("Update Cart Error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}

// DELETE: Remove item from cart
export async function DELETE(req) {
    try {
        await dbConnect();
        const { userId, productId } = await req.json();

        if (!userId || !productId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return NextResponse.json({ message: "Cart not found" }, { status: 404 });
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);

        await cart.save();
        return NextResponse.json({ success: true, cart });
    } catch (error) {
        console.error("Remove from Cart Error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}

// PATCH: Merge guest cart
export async function PATCH(req) {
    try {
        await dbConnect();
        const { userId, guestItems } = await req.json();

        if (!userId || !Array.isArray(guestItems)) {
            return NextResponse.json({ message: "Invalid data" }, { status: 400 });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Process each guest item
        for (const item of guestItems) {
            const productDetails = await Product.findById(item.product._id || item.product);

            if (productDetails) {
                const price =
                    productDetails.discount > 0
                        ? productDetails.price * (1 - productDetails.discount / 100)
                        : productDetails.price;

                const itemIndex = cart.items.findIndex(
                    (p) => p.product.toString() === productDetails._id.toString()
                );

                if (itemIndex > -1) {
                    cart.items[itemIndex].quantity += item.quantity;
                } else {
                    cart.items.push({
                        product: productDetails._id,
                        quantity: item.quantity,
                        name: productDetails.name,
                        price: price,
                        image: productDetails.mainImage || productDetails.galleryImages?.[0],
                        slug: productDetails.slug,
                    });
                }
            }
        }

        await cart.save();
        return NextResponse.json({ success: true, cart });
    } catch (error) {
        console.error("Merge Cart Error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
