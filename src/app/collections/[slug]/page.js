import CollectionDetailPage from "@/app/pages/collection-detail";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { notFound } from "next/navigation";

async function getCollectionData(slug) {
  await dbConnect();

  // 1. Get Category info
  const category = await Category.findOne({ slug, status: "active" }).lean();
  if (!category) return null;

  // 2. Get Products for this category
  const products = await Product.find({
    category: category._id,
    status: "active"
  }).sort({ createdAt: -1 }).lean();

  // Serialize
  return {
    category: {
      ...category,
      _id: category._id.toString(),
      id: category._id.toString(),
      title: category.name, // Map name to title for UI
    },
    products: products.map(p => ({
      ...p,
      _id: p._id.toString(),
      id: p._id.toString(),
      category: category.name,
      image: p.mainImage,
      hoverImage: p.hoverImage,
    }))
  };
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  await dbConnect();
  const category = await Category.findOne({ slug }).lean();

  const title = category?.name || slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${title} Collection | KnifeMasters`,
    description: category?.description || `Explore our premium ${title} knives.`,
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const data = await getCollectionData(resolvedParams.slug);

  if (!data) {
    notFound();
  }

  return <CollectionDetailPage params={resolvedParams} initialData={data} />;
}
