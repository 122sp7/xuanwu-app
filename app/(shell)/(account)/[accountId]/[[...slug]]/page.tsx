import { AccountRouteDispatcher } from "@/src/modules/workspace/adapters/inbound/react";

interface AccountSlugPageProps {
  params: Promise<{ accountId: string; slug?: string[] }>;
}

export default async function AccountSlugPage({
  params,
}: AccountSlugPageProps) {
  const { accountId, slug } = await params;
  return <AccountRouteDispatcher accountId={accountId} slug={slug ?? []} />;
}
