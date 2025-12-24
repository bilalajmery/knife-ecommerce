import ProductDetailPage from "@/app/pages/product-detail";

// This function generates metadata for the page
// This function generates metadata for the page
export async function generateMetadata(props) {
  const params = await props.params;
  console.log("SERVER METADATA: Generating metadata for slug:", params.slug);

  // In a real app, fetch product data here
  // const product = await getProduct(params.slug);

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

export default async function Page(props) {
  const params = await props.params;
  console.log("SERVER PAGE: Rendering product detail for slug:", params?.slug);
  return <ProductDetailPage params={params} />;
}
