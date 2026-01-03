import CollectionsPage from "@/app/pages/collections";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

async function getAllCollections() {
  await dbConnect();

  const categories = await Category.find({ status: "active" }).sort({ name: 1 }).lean();

  const collectionsWithCounts = await Promise.all(categories.map(async (cat) => {
    const productCount = await Product.countDocuments({
      category: cat._id,
      status: "active"
    });

    return {
      id: cat._id.toString(),
      _id: cat._id.toString(),
      title: cat.name,
      description: cat.description,
      image: cat.image,
      link: `/collections/${cat.slug}`,
      count: productCount
    };
  }));

  return collectionsWithCounts;
}

export const metadata = {
  title: "Collections | KnifeMasters",
  description: "Explore our premium knife collections.",
};

export default async function Page() {
  const collections = await getAllCollections();
  return <CollectionsPage initialCollections={collections} />;
}
