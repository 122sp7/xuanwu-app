/**
 * /settings/notifications — redirect to workspace (removed from MVP nav, Occam's Razor)
 */
import { redirect } from "next/navigation";

export default function SettingsNotificationsPage() {
  redirect("/workspace");
}
