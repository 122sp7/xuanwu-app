# Directory Structure

```
docs/
  structure/
    contexts/
      platform/
        AGENTS.md (108 lines)
        bounded-contexts.md (89 lines)
        context-map.md (80 lines)
        README.md (133 lines)
        subdomains.md (89 lines)
        ubiquitous-language.md (141 lines)
src/
  modules/
    platform/
      adapters/
        inbound/
          react/
            shell/
              AccountSwitcher.tsx (61 lines)
              CreateOrganizationDialog.tsx (40 lines)
              index.ts (6 lines)
              shell-quick-create.ts (22 lines)
              ShellAppRail.tsx (86 lines)
              ShellContextNavSection.tsx (36 lines)
              ShellDashboardSidebar.tsx (58 lines)
              ShellGuard.tsx (30 lines)
              ShellLanguageSwitcher.tsx (53 lines)
              ShellRootLayout.tsx (58 lines)
              ShellSidebarBody.tsx (56 lines)
              ShellSidebarHeader.tsx (21 lines)
              ShellSidebarNavData.tsx (57 lines)
              ShellThemeToggle.tsx (15 lines)
              ShellUserAvatar.tsx (42 lines)
            AccountScopeProvider.tsx (28 lines)
            AppContext.tsx (106 lines)
            index.ts (6 lines)
            platform-ui-stubs.tsx (190 lines)
            PlatformBootstrap.tsx (21 lines)
            ShellFrame.tsx (6 lines)
            useAccountRouteContext.ts (77 lines)
            useAccountScope.ts (8 lines)
          server-actions/
            file-actions.ts (34 lines)
        outbound/
          firebase-composition.ts (73 lines)
      orchestration/
        index.ts (21 lines)
      shared/
        errors/
          index.ts (9 lines)
        events/
          index.ts (27 lines)
        types/
          index.ts (5 lines)
        index.ts (0 lines)
      subdomains/
        background-job/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore-like/
                InMemoryBackgroundJobRepository.ts (20 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            use-cases/
              background-job.use-cases.ts (50 lines)
            index.ts (0 lines)
          domain/
            entities/
              BackgroundJob.ts (22 lines)
              JobChunk.ts (13 lines)
              JobDocument.ts (10 lines)
            events/
              BackgroundJobDomainEvent.ts (44 lines)
            repositories/
              BackgroundJobRepository.ts (29 lines)
            index.ts (0 lines)
        cache/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              memory/
                InMemoryCacheRepository.ts (10 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            use-cases/
              CacheUseCases.ts (30 lines)
            index.ts (0 lines)
          domain/
            entities/
              CacheEntry.ts (7 lines)
            repositories/
              CacheRepository.ts (11 lines)
            index.ts (0 lines)
        file-storage/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              memory/
                InMemoryFileStorageRepository.ts (12 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            use-cases/
              FileStorageUseCases.ts (41 lines)
            index.ts (0 lines)
          domain/
            entities/
              StoredFile.ts (10 lines)
            repositories/
              FileStorageRepository.ts (13 lines)
            index.ts (0 lines)
        notification/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              memory/
                InMemoryNotificationRepository.ts (15 lines)
                InMemoryWorkspaceNotificationPreferenceRepository.ts (12 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            dto/
              notification.dto.ts (0 lines)
            queries/
              notification.queries.ts (12 lines)
              workspace-notification-preferences.queries.ts (16 lines)
            use-cases/
              notification.use-cases.ts (17 lines)
              workspace-notification-preferences.use-case.ts (31 lines)
            index.ts (0 lines)
          domain/
            aggregates/
              NotificationAggregate.ts (35 lines)
            entities/
              Notification.ts (22 lines)
              WorkspaceNotificationPreference.ts (31 lines)
            events/
              NotificationDomainEvent.ts (37 lines)
            repositories/
              NotificationRepository.ts (15 lines)
              WorkspaceNotificationPreferenceRepository.ts (11 lines)
            value-objects/
              WorkspaceNotificationEventType.ts (5 lines)
            index.ts (0 lines)
        platform-config/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            services/
              shell-navigation-catalog.ts (94 lines)
            index.ts (0 lines)
          domain/
            index.ts (20 lines)
        search/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            services/
              shell-command-catalog.ts (29 lines)
            index.ts (0 lines)
          domain/
            index.ts (14 lines)
      AGENTS.md (58 lines)
      index.ts (4 lines)
      README.md (84 lines)
```