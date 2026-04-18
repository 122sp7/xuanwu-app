import { describe, expect, it } from 'vitest';
import { TemplateWorkflow } from './TemplateWorkflow';
import { WorkflowId } from '../value-objects/WorkflowId';
import { IngestionJob } from '../../../ingestion/domain/entities/IngestionJob';
import { IngestionId } from '../../../ingestion/domain/value-objects/IngestionId';

describe('Template state model guards', () => {
  it('enforces workflow transitions and emits domain events', () => {
    const workflow = TemplateWorkflow.initiate({
      id: WorkflowId.generate(),
      templateId: 'template-1',
    });

    const initiatedEvents = workflow.pullDomainEvents();
    expect(initiatedEvents).toHaveLength(1);
    expect(initiatedEvents[0]?.type).toBe('template.workflow.initiated');
    expect(initiatedEvents[0]?.occurredAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);

    expect(() => workflow.complete()).toThrow(
      'Invalid workflow transition: pending -> completed',
    );

    workflow.activate();
    workflow.complete();

    const completionEvents = workflow.pullDomainEvents();
    expect(completionEvents).toHaveLength(1);
    expect(completionEvents[0]?.type).toBe('template.workflow.completed');
  });

  it('enforces ingestion transitions', () => {
    const job = IngestionJob.create({
      id: IngestionId.generate(),
      sourceUrl: 'https://example.com/source.md',
    });

    expect(() => job.markCompleted()).toThrow(
      'Invalid ingestion transition: pending -> completed',
    );

    job.markProcessing();
    job.markCompleted();
    expect(job.status).toBe('completed');
  });
});
