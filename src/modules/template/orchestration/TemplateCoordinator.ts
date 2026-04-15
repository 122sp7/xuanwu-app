/**
 * TemplateCoordinator
 *
 * Handles cross-subdomain workflows that span more than one subdomain.
 * Example pipeline: document created → generation triggered → ingestion
 * queued → workflow initiated.
 *
 * Currently a stub. Wire subdomain use cases through the constructor once
 * each subdomain is activated and its cross-subdomain trigger points are
 * defined.
 *
 * Rules:
 * - Coordinator orchestrates only; it does NOT own business rules.
 * - Each step delegates to the responsible subdomain's use case.
 * - Cross-subdomain state is communicated via Published Language DTOs,
 *   never by sharing aggregate references.
 */
export class TemplateCoordinator {
  // Inject subdomain use cases or facades as constructor parameters when
  // the corresponding subdomains are activated.
  // Example:
  //   constructor(
  //     private readonly document: TemplateFacade,
  //     private readonly generation: GenerationFacade,
  //     private readonly ingestion: IngestionFacade,
  //     private readonly workflow: WorkflowFacade,
  //   ) {}

  /**
   * Full creation pipeline stub.
   * Expand this when generation / ingestion / workflow subdomains are live.
   */
  async runCreationPipeline(_templateId: string): Promise<void> {
    // 1. document subdomain: template already created — templateId provided
    // 2. generation subdomain: trigger content generation
    // 3. ingestion subdomain: queue generated content for ingestion
    // 4. workflow subdomain: initiate review workflow
    throw new Error('TemplateCoordinator.runCreationPipeline: not yet implemented');
  }
}
