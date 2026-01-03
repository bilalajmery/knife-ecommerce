import ProductDetailPage from "@/app/pages/product-detail";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

// This function generates metadata for the page
// This function generates metadata for the page
export async function generateMetadata(props) {
  const params = await props.params;

  try {
    await dbConnect();
    const product = await Product.findOne({ slug: params.slug }).select("name description metaTitle metaDescription mainImage");

    if (!product) {
      return {
        title: "Product Not Found | KnifeMasters",
        description: "The requested product could not be found.",
      };
    }

    const title = product.metaTitle || `${product.name} | KnifeMasters`;
    const description = product.metaDescription || product.description?.substring(0, 160) || "Premium Hand-Forged Knives";
    const image = product.mainImage || "/hero-knife.png";

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        images: [image],
      },
    };
  } catch (error) {
    console.error("METADATA ERROR:", error);
    return {
      title: "KnifeMasters | Premium Hand-Forged Knives",
      description: "Experience the pinnacle of craftsmanship.",
    };
  }
}

export default async function Page(props) {
  const params = await props.params;
  console.log("SERVER PAGE: Rendering product detail for slug:", params?.slug);
  return <ProductDetailPage params={params} />;
}
