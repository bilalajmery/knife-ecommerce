import HomePage from "./pages/home";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

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

async function getRandomCategories() {
  await dbConnect();
  const categories = await Category.aggregate([
    { $match: { status: "active" } },
    { $sample: { size: 3 } }
  ]);

  // Fetch real product counts for these categories
  const categoriesWithCounts = await Promise.all(categories.map(async (cat) => {
    const productCount = await Product.countDocuments({
      category: cat._id,
      status: "active"
    });

    return {
      ...cat,
      _id: cat._id.toString(),
      id: cat._id.toString(),
      link: `/collections/${cat.slug}`,
      title: cat.name,
      count: productCount
    };
  }));

  return categoriesWithCounts;
}

export default async function Page() {
  const newArrivalsData = await getNewArrivals();
  const randomCategories = await getRandomCategories();
  return <HomePage newArrivalsData={newArrivalsData} randomCategories={randomCategories} />;
}
