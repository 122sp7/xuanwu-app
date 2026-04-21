# Directory Structure

```
docs/
  structure/
    contexts/
      workspace/
        AGENTS.md (97 lines)
        bounded-contexts.md (91 lines)
        context-map.md (77 lines)
        README.md (126 lines)
        subdomains.md (80 lines)
        ubiquitous-language.md (119 lines)
src/
  modules/
    workspace/
      adapters/
        inbound/
          react/
            account-scoped-workspace.ts (13 lines)
            AccountRouteDispatcher.test.ts (11 lines)
            AccountRouteDispatcher.tsx (66 lines)
            index.ts (6 lines)
            useWorkspaceScope.ts (8 lines)
            workspace-audit-filter.ts (5 lines)
            workspace-nav-model.ts (174 lines)
            workspace-route-screens.tsx (84 lines)
            workspace-schedule-datetime.ts (5 lines)
            workspace-shell-interop.tsx (166 lines)
            workspace-ui-stubs.tsx (18 lines)
            WorkspaceAccountDailySection.tsx (19 lines)
            WorkspaceApprovalSection.tsx (41 lines)
            WorkspaceAuditSection.test.ts (6 lines)
            WorkspaceAuditSection.tsx (23 lines)
            WorkspaceContext.tsx (47 lines)
            WorkspaceDailySection.tsx (97 lines)
            WorkspaceFilesSection.tsx (65 lines)
            WorkspaceIssuesSection.tsx (115 lines)
            WorkspaceMembersSection.tsx (32 lines)
            WorkspaceOverviewSection.tsx (72 lines)
            WorkspaceQualitySection.tsx (30 lines)
            WorkspaceScheduleSection.test.ts (3 lines)
            WorkspaceScheduleSection.tsx (15 lines)
            WorkspaceScopeProvider.tsx (39 lines)
            WorkspaceSettingsSection.tsx (26 lines)
            WorkspaceSettlementSection.tsx (31 lines)
            WorkspaceTaskFormationSection.tsx (66 lines)
            WorkspaceTasksSection.tsx (47 lines)
          server-actions/
            approval-actions.ts (12 lines)
            audit-actions.ts (12 lines)
            issue-actions.ts (16 lines)
            membership-actions.ts (12 lines)
            quality-actions.ts (12 lines)
            schedule-actions.ts (15 lines)
            settlement-actions.ts (17 lines)
            task-actions.ts (14 lines)
        outbound/
          firebase-composition.ts (202 lines)
          FirebaseWorkspaceQueryRepository.ts (61 lines)
      orchestration/
        index.ts (4 lines)
      shared/
        errors/
          index.ts (15 lines)
        events/
          index.ts (1 lines)
        types/
          index.ts (15 lines)
        index.ts (0 lines)
      subdomains/
        activity/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreActivityRepository.ts (22 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              ActivityDTO.ts (3 lines)
            use-cases/
              ActivityUseCases.ts (11 lines)
            index.ts (0 lines)
          domain/
            entities/
              ActivityEvent.ts (44 lines)
            events/
              ActivityDomainEvent.ts (13 lines)
            repositories/
              ActivityRepository.ts (11 lines)
            index.ts (0 lines)
        api-key/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreApiKeyRepository.ts (26 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              ApiKeyDTO.ts (3 lines)
            use-cases/
              ApiKeyUseCases.ts (14 lines)
            index.ts (0 lines)
          domain/
            entities/
              ApiKey.ts (46 lines)
            events/
              ApiKeyDomainEvent.ts (18 lines)
            repositories/
              ApiKeyRepository.ts (15 lines)
            value-objects/
              ApiKeyId.ts (5 lines)
            index.ts (0 lines)
        approval/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreApprovalDecisionRepository.ts (28 lines)
              index.ts (1 lines)
            index.ts (0 lines)
          application/
            use-cases/
              ApprovalUseCases.ts (26 lines)
            index.ts (0 lines)
          domain/
            entities/
              ApprovalDecision.ts (44 lines)
            events/
              ApprovalDomainEvent.ts (38 lines)
            repositories/
              ApprovalDecisionRepository.ts (15 lines)
            index.ts (0 lines)
        audit/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreAuditRepository.ts (22 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              AuditDTO.ts (5 lines)
            use-cases/
              AuditUseCases.ts (15 lines)
            index.ts (0 lines)
          domain/
            entities/
              AuditEntry.ts (59 lines)
            events/
              AuditDomainEvent.ts (19 lines)
            repositories/
              AuditRepository.ts (11 lines)
            value-objects/
              AuditAction.ts (5 lines)
              AuditSeverity.ts (7 lines)
            index.ts (0 lines)
        feed/
          adapters/
            inbound/
              server-actions/
                feed-actions.ts (14 lines)
              index.ts (3 lines)
            outbound/
              firestore/
                FirestoreFeedRepository.ts (42 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              FeedDTO.ts (11 lines)
            use-cases/
              FeedUseCases.test.ts (34 lines)
              FeedUseCases.ts (28 lines)
            index.ts (0 lines)
          domain/
            entities/
              FeedPost.ts (61 lines)
            events/
              FeedDomainEvent.ts (13 lines)
            repositories/
              FeedPostRepository.ts (19 lines)
            index.ts (0 lines)
          README.md (64 lines)
        invitation/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreInvitationRepository.ts (28 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              InvitationDTO.ts (3 lines)
            use-cases/
              InvitationUseCases.ts (19 lines)
            index.ts (0 lines)
          domain/
            entities/
              WorkspaceInvitation.ts (48 lines)
            events/
              InvitationDomainEvent.ts (18 lines)
            repositories/
              InvitationRepository.ts (15 lines)
            index.ts (0 lines)
        issue/
          adapters/
            inbound/
              http/
                IssueController.ts (6 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreIssueRepository.ts (48 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              IssueDTO.ts (6 lines)
            machines/
              issueLifecycle.machine.test.ts (7 lines)
              issueLifecycle.machine.ts (32 lines)
            use-cases/
              IssueUseCases.ts (23 lines)
            index.ts (0 lines)
          domain/
            entities/
              Issue.ts (50 lines)
            events/
              IssueDomainEvent.ts (52 lines)
            repositories/
              IssueRepository.ts (25 lines)
            value-objects/
              IssueId.ts (5 lines)
              IssueStage.ts (1 lines)
              IssueStatus.ts (11 lines)
            index.ts (0 lines)
        lifecycle/
          adapters/
            inbound/
              http/
                WorkspaceController.ts (6 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreWorkspaceRepository.ts (26 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              WorkspaceDTO.ts (4 lines)
            use-cases/
              WorkspaceLifecycleUseCases.test.ts (47 lines)
              WorkspaceLifecycleUseCases.ts (53 lines)
            index.ts (0 lines)
          domain/
            entities/
              Workspace.ts (50 lines)
            events/
              WorkspaceDomainEvent.ts (26 lines)
            repositories/
              WorkspaceRepository.ts (13 lines)
            index.ts (0 lines)
        membership/
          adapters/
            inbound/
              http/
                MembershipController.ts (18 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreMemberRepository.ts (28 lines)
              permission/
                FirestorePermissionCheckAdapter.test.ts (33 lines)
                FirestorePermissionCheckAdapter.ts (22 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              MembershipDTO.ts (5 lines)
            ports/
              PermissionCheckPort.ts (16 lines)
            use-cases/
              MembershipUseCases.test.ts (29 lines)
              MembershipUseCases.ts (26 lines)
            index.ts (0 lines)
          domain/
            entities/
              WorkspaceMember.ts (46 lines)
            events/
              MembershipDomainEvent.ts (20 lines)
            repositories/
              WorkspaceMemberRepository.ts (15 lines)
            value-objects/
              WorkspaceRolePolicy.test.ts (2 lines)
              WorkspaceRolePolicy.ts (13 lines)
            index.ts (0 lines)
        orchestration/
          adapters/
            inbound/
              http/
                OrchestrationController.ts (6 lines)
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreJobRepository.ts (28 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              OrchestrationDTO.ts (3 lines)
            machines/
              settlement-lifecycle.machine.ts (12 lines)
              task-lifecycle.machine.ts (59 lines)
            sagas/
              TaskLifecycleSaga.ts (39 lines)
            use-cases/
              OrchestrationUseCases.ts (15 lines)
              ResumeTaskFlowUseCase.ts (25 lines)
            index.ts (0 lines)
          domain/
            entities/
              TaskMaterializationJob.ts (57 lines)
            events/
              JobDomainEvent.ts (18 lines)
            repositories/
              TaskMaterializationJobRepository.ts (17 lines)
            index.ts (0 lines)
        quality/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreQualityReviewRepository.ts (28 lines)
              index.ts (1 lines)
            index.ts (0 lines)
          application/
            use-cases/
              QualityUseCases.ts (26 lines)
            index.ts (0 lines)
          domain/
            entities/
              QualityReview.ts (45 lines)
            events/
              QualityDomainEvent.ts (38 lines)
            repositories/
              QualityReviewRepository.ts (15 lines)
            index.ts (0 lines)
        resource/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreQuotaRepository.ts (26 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              ResourceDTO.ts (5 lines)
            use-cases/
              ResourceUseCases.ts (15 lines)
            index.ts (0 lines)
          domain/
            entities/
              ResourceQuota.ts (49 lines)
            events/
              ResourceQuotaDomainEvent.ts (20 lines)
            repositories/
              ResourceQuotaRepository.ts (16 lines)
            index.ts (0 lines)
        schedule/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreDemandRepository.ts (26 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              ScheduleDTO.ts (4 lines)
            use-cases/
              ScheduleUseCases.ts (19 lines)
            index.ts (0 lines)
          domain/
            entities/
              WorkDemand.ts (50 lines)
            events/
              ScheduleDomainEvent.ts (13 lines)
            repositories/
              DemandRepository.ts (15 lines)
            index.ts (0 lines)
        settlement/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreInvoiceRepository.ts (33 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              SettlementDTO.ts (5 lines)
            use-cases/
              CreateInvoiceFromAcceptedTasksUseCase.ts (20 lines)
              SettlementUseCases.ts (17 lines)
            index.ts (0 lines)
          domain/
            entities/
              Invoice.ts (54 lines)
            events/
              InvoiceDomainEvent.ts (20 lines)
            repositories/
              InvoiceRepository.ts (13 lines)
            services/
              InvoiceCalculationService.ts (29 lines)
            value-objects/
              InvoiceStatus.ts (5 lines)
              LineItem.ts (15 lines)
            index.ts (0 lines)
        share/
          adapters/
            inbound/
              index.ts (0 lines)
            outbound/
              firestore/
                FirestoreShareRepository.ts (26 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              ShareDTO.ts (4 lines)
            use-cases/
              ShareUseCases.ts (15 lines)
            index.ts (0 lines)
          domain/
            entities/
              WorkspaceShare.ts (42 lines)
            events/
              ShareDomainEvent.ts (20 lines)
            repositories/
              WorkspaceShareRepository.ts (13 lines)
            index.ts (0 lines)
        task/
          adapters/
            outbound/
              firestore/
                FirestoreTaskRepository.ts (39 lines)
              index.ts (0 lines)
            index.ts (1 lines)
          application/
            dto/
              TaskDTO.ts (6 lines)
            use-cases/
              TaskUseCases.ts (25 lines)
            index.ts (0 lines)
          domain/
            entities/
              Task.ts (71 lines)
            events/
              TaskDomainEvent.ts (41 lines)
            repositories/
              TaskRepository.ts (16 lines)
            value-objects/
              TaskId.ts (5 lines)
              TaskStatus.ts (25 lines)
            index.ts (0 lines)
        task-formation/
          adapters/
            inbound/
              server-actions/
                task-formation-actions.ts (32 lines)
              index.ts (0 lines)
            outbound/
              callable/
                FirebaseCallableTaskCandidateExtractor.test.ts (5 lines)
                FirebaseCallableTaskCandidateExtractor.ts (69 lines)
              firestore/
                FirestoreTaskFormationJobRepository.ts (30 lines)
              genkit/
                GenkitTaskCandidateExtractor.ts (45 lines)
              index.ts (0 lines)
            index.ts (0 lines)
          application/
            dto/
              TaskFormationDTO.ts (7 lines)
            machines/
              task-formation.machine.ts (46 lines)
            use-cases/
              TaskFormationUseCases.ts (47 lines)
            index.ts (0 lines)
          domain/
            entities/
              TaskFormationJob.ts (62 lines)
            events/
              TaskFormationDomainEvent.ts (32 lines)
            ports/
              TaskCandidateExtractorPort.ts (21 lines)
            repositories/
              TaskFormationJobRepository.ts (17 lines)
            value-objects/
              TaskCandidate.ts (11 lines)
              TaskFormationJobStatus.ts (1 lines)
            index.ts (0 lines)
          AGENTS.md (166 lines)
          README.md (220 lines)
      AGENTS.md (75 lines)
      index.ts (14 lines)
      README.md (85 lines)
```