import { redirect } from "next/navigation";

/**
 * Dispatcher page — redirects to the organization schedule view.
 * Route: /organization/schedule/dispatcher
 */
export default function DispatcherPage() {
  redirect("/organization/schedule");
}
