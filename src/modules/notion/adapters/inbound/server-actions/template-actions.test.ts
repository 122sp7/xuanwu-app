import { beforeEach, describe, expect, it, vi } from "vitest";

const createTemplateExecute = vi.fn();
const queryTemplatesExecute = vi.fn();

vi.mock("../../outbound/firebase-composition", () => ({
  createClientNotionTemplateUseCases: () => ({
    createTemplate: { execute: createTemplateExecute },
    queryTemplates: { execute: queryTemplatesExecute },
  }),
}));

import { createTemplateAction } from "./template-actions";

describe("createTemplateAction", () => {
  beforeEach(() => {
    createTemplateExecute.mockReset();
    createTemplateExecute.mockResolvedValue({ ok: true });
    queryTemplatesExecute.mockReset();
  });

  it("forwards optional description into template use case", async () => {
    await createTemplateAction({
      workspaceId: "00000000-0000-4000-8000-000000000001",
      accountId: "account-1",
      title: "模板 A",
      category: "workflow",
      createdByUserId: "user-1",
      description: "工作流程模板",
    });

    expect(createTemplateExecute).toHaveBeenCalledWith({
      workspaceId: "00000000-0000-4000-8000-000000000001",
      title: "模板 A",
      category: "workflow",
      createdByUserId: "user-1",
      description: "工作流程模板",
    });
  });
});
