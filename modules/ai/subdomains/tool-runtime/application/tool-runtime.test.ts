import { describe, expect, it, vi } from "vitest";

import { GenerateWithToolsUseCase } from "./use-cases/generate-with-tools.use-case";
import type { ToolRuntimePort } from "../domain/ports/ToolRuntimePort";

const MOCK_DATETIME_DESCRIPTOR = {
  name: "ai.getCurrentDatetime",
  description: "Returns the current date and time.",
};

const MOCK_CALC_DESCRIPTOR = {
  name: "ai.evaluateMathExpression",
  description: "Evaluates a safe arithmetic expression.",
};

function buildMockPort(overrides?: Partial<ToolRuntimePort>): ToolRuntimePort {
  return {
    generateWithTools: vi.fn().mockResolvedValue({
      text: "mock response",
      toolCallsCount: 1,
      model: "mock-model",
      traceId: "mock-trace",
      completedAt: "2026-01-01T00:00:00.000Z",
    }),
    listAvailableTools: vi
      .fn()
      .mockReturnValue([MOCK_DATETIME_DESCRIPTOR, MOCK_CALC_DESCRIPTOR]),
    ...overrides,
  };
}

describe("GenerateWithToolsUseCase", () => {
  it("rejects empty toolNames with a descriptive error", async () => {
    const useCase = new GenerateWithToolsUseCase(buildMockPort());

    await expect(
      useCase.execute({ prompt: "hello", toolNames: [] }),
    ).rejects.toThrow("At least one tool name must be specified");
  });

  it("rejects unknown tool names and lists available tools", async () => {
    const useCase = new GenerateWithToolsUseCase(buildMockPort());

    await expect(
      useCase.execute({
        prompt: "hello",
        toolNames: ["unknown.tool"],
      }),
    ).rejects.toThrow("Unknown tools: unknown.tool");
  });

  it("includes all unknown tools in the error message", async () => {
    const useCase = new GenerateWithToolsUseCase(buildMockPort());

    await expect(
      useCase.execute({
        prompt: "hello",
        toolNames: ["unknown.a", "unknown.b"],
      }),
    ).rejects.toThrow("Unknown tools: unknown.a, unknown.b");
  });

  it("delegates to the port when all tool names are valid", async () => {
    const mockPort = buildMockPort();
    const useCase = new GenerateWithToolsUseCase(mockPort);

    const result = await useCase.execute({
      prompt: "What time is it?",
      toolNames: ["ai.getCurrentDatetime"],
    });

    expect(result.text).toBe("mock response");
    expect(result.toolCallsCount).toBe(1);
    expect(mockPort.generateWithTools).toHaveBeenCalledOnce();
    expect(mockPort.generateWithTools).toHaveBeenCalledWith({
      prompt: "What time is it?",
      toolNames: ["ai.getCurrentDatetime"],
    });
  });

  it("passes system and model overrides through to the port", async () => {
    const mockPort = buildMockPort();
    const useCase = new GenerateWithToolsUseCase(mockPort);

    await useCase.execute({
      prompt: "Calculate 2+2",
      system: "You are a math assistant.",
      model: "custom-model",
      toolNames: ["ai.evaluateMathExpression"],
    });

    expect(mockPort.generateWithTools).toHaveBeenCalledWith({
      prompt: "Calculate 2+2",
      system: "You are a math assistant.",
      model: "custom-model",
      toolNames: ["ai.evaluateMathExpression"],
    });
  });

  it("accepts multiple valid tool names in one call", async () => {
    const mockPort = buildMockPort();
    const useCase = new GenerateWithToolsUseCase(mockPort);

    await expect(
      useCase.execute({
        prompt: "Tell me the time and calculate 3+4",
        toolNames: ["ai.getCurrentDatetime", "ai.evaluateMathExpression"],
      }),
    ).resolves.not.toThrow();
  });
});
