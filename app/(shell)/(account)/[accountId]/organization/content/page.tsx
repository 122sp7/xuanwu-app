import { redirect } from "next/navigation";

interface OrganizationKnowledgePageProps {
  params: {
    accountId: string;
  };
}

export default function OrganizationKnowledgePage({ params }: OrganizationKnowledgePageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}?tab=Overview&panel=knowledge-pages`);
}
