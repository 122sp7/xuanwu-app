# Runtime Entrypoints

App router structure:
- app/layout.tsx: global root layout.
- app/providers/providers.tsx: root provider composition.
- app/(public)/page.tsx: public landing route.
- app/(shell)/layout.tsx: authenticated shell layout.
- app/(shell)/dashboard/page.tsx
- app/(shell)/organization/page.tsx
- app/(shell)/settings/page.tsx

Provider order from app/providers/providers.tsx:
- AuthProvider
- AppProvider

Shell runtime notes from app/(shell)/layout.tsx:
- ShellGuard gates access to the shell.
- useAuth provides authState and logout.
- useApp provides active account and organization account switching.
- Current shell navigation includes dashboard and settings.
- Current route titles include dashboard, organization, settings.
