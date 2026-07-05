import { notFound } from "next/navigation";
import { getMyPropertyById } from "@/services/properties/propertyService";
import { EditListingClient } from "@/features/agent/EditListingClient";

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  const property = await getMyPropertyById(id);

  if (!property) notFound();

  return <EditListingClient property={property} />;
}
