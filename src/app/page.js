import HomePage from "./pages/home";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Order from "@/models/Order";

async function getBestSellers() {
  await dbConnect();

  // Aggregate orders to find most sold products
  const bestSellingAgg = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 8 },
  ]);

  const bestSellingIds = bestSellingAgg.map((item) => item._id);

  let products;
  if (bestSellingIds.length > 0) {
    products = await Product.find({
      _id: { $in: bestSellingIds },
      status: "active",
    })
      .populate("category", "name slug")
      .lean();

    // Sort products back in the order of bestSellingIds
    products.sort((a, b) => {
      return (
        bestSellingIds.indexOf(a._id.toString()) -
        bestSellingIds.indexOf(b._id.toString())
      );
    });
  } else {
    // Fallback: If no orders yet, show 8 active products
    products = await Product.find({ status: "active" })
      .limit(8)
      .populate("category", "name slug")
      .lean();
  }

  return products.map((product) => ({
    ...product,
    id: product._id.toString(),
    _id: product._id.toString(),
    category: product.category ? product.category.name : "Uncategorized",
    image: product.mainImage,
    hoverImage: product.hoverImage,
    createdAt: product.createdAt ? product.createdAt.toISOString() : null,
    updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
    badge: "Best Seller",
    slug: product.slug,
  }));
}

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
  const bestSellersData = await getBestSellers();
  const newArrivalsData = await getNewArrivals();
  const randomCategories = await getRandomCategories();
  return (
    <HomePage
      bestSellersData={bestSellersData}
      newArrivalsData={newArrivalsData}
      randomCategories={randomCategories}
    />
  );
}
