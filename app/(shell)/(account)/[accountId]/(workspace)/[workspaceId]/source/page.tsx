import { redirect } from "next/navigation";

interface AccountWorkspaceSourcePageProps {
  params: {
    accountId: string;
    workspaceId: string;
  };
}

export default function AccountWorkspaceSourcePage({ params }: AccountWorkspaceSourcePageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/${encodeURIComponent(params.workspaceId)}?tab=Overview&panel=source-libraries`);
}
