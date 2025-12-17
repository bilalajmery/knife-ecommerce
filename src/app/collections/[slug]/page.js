import CollectionDetailPage from "@/app/pages/collection-detail";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${title} Collection | KnifeMaster`,
    description: `Explore our premium ${title} knives.`,
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <CollectionDetailPage params={resolvedParams} />;
}
