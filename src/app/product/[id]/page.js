import ProductDetailPage from "@/app/pages/product-detail";

// This function generates metadata for the page
export async function generateMetadata({ params }) {
  // In a real app, fetch product data here
  // const product = await getProduct(params.id);

  // For now, using static data to match the mock data in ProductDetailPage
  const productName = "Damascus Hunter";
  const productDescription =
    "Hand-forged with 67 layers of premium Damascus steel, this hunting knife is a masterpiece of craftsmanship.";

  return {
    title: `${productName} | KnifeMaster`,
    description: productDescription,
    openGraph: {
      title: `${productName} | KnifeMaster`,
      description: productDescription,
      images: ["/hero-knife.png"], // Replace with actual product image URL
    },
  };
}

export default function Page({ params }) {
  return <ProductDetailPage params={params} />;
}
