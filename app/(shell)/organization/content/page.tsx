import { redirect } from "next/navigation";

/**
 * Module: organization/content page
 * Purpose: redirect to the consolidated content hub at /knowledge.
 */
export default function OrganizationKnowledgePage() {
  redirect("/knowledge");
}
