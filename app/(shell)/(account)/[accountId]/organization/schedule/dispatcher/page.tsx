import { redirect } from "next/navigation";

/**
 * Dispatcher page — redirects to the organization schedule view.
 * Route: /organization/schedule/dispatcher
 */
interface DispatcherPageProps {
  params: {
    accountId: string;
  };
}

export default function DispatcherPage({ params }: DispatcherPageProps) {
  redirect(`/${encodeURIComponent(params.accountId)}/organization/schedule`);
}
