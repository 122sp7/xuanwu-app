/**
 * Shell composition barrel — app/(shell)/_shell
 *
 * Cross-module shell layout components that compose platform, workspace,
 * and notion modules. Lives in app/ (the composition layer) instead of
 * inside any single module to respect upstream/downstream boundaries.
 */

export { ShellLayout } from "./ShellRootLayout";
export { quickCreateKnowledgePage, type QuickCreatePageInput, type QuickCreatePageResult } from "./shell-quick-create";
export { isActiveOrganizationAccount } from "./ShellSidebarNavData";
