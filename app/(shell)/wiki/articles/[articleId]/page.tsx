import { redirect } from "next/navigation";

export default async function WikiArticleDetailRedirect({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;
  redirect("/knowledge-base/articles/" + articleId);
}