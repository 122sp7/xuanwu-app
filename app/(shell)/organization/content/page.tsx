import { redirect } from "next/navigation";

/**
 * Module: organization/content page
 * Purpose: redirect to the consolidated content hub at /wiki.
 * Content management is centralised in the Wiki section.
 */
export default function OrganizationKnowledgePage() {
  redirect("/wiki");
}
