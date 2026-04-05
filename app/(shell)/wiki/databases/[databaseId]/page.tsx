import { redirect } from "next/navigation";

export default async function WikiDatabaseDetailRedirect({
  params,
}: {
  params: Promise<{ databaseId: string }>;
}) {
  const { databaseId } = await params;
  redirect("/knowledge-database/databases/" + databaseId);
}