import { redirect } from "next/navigation";

/**
 * Module: organization/knowledge page
 * Purpose: redirect to the consolidated knowledge hub at /wiki.
 * Knowledge management is centralised in the Wiki section.
 */
export default function OrganizationKnowledgePage() {
  redirect("/wiki");
}
