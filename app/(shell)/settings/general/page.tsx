/**
 * /settings/general — redirect to workspace (removed from MVP nav, Occam's Razor)
 */
import { redirect } from "next/navigation";

export default function SettingsGeneralPage() {
  redirect("/workspace");
}
