import HomePage from "./pages/home";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

async function getNewArrivals() {
  await dbConnect();

  // Find active products, sort by creation date desc, limit 8
  const products = await Product.find({ status: "active" })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate("category", "name slug")
    .lean();

  // Serialize MongoDB objects
  return products.map(product => ({
    ...product,
    id: product._id.toString(),
    _id: product._id.toString(),
    category: product.category ? product.category.name : "Uncategorized",
    image: product.mainImage,
    hoverImage: product.hoverImage,
    createdAt: product.createdAt ? product.createdAt.toISOString() : null,
    updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
    badge: "New Arrival",
    slug: product.slug,
  }));
}

export default async function Page() {
  const newArrivalsData = await getNewArrivals();
  return <HomePage newArrivalsData={newArrivalsData} />;
}
