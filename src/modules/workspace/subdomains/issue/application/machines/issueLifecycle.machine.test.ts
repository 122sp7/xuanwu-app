import { describe, expect, it } from "vitest";
import {
  getIssueTransitionEvents,
  ISSUE_EVENT_LABEL,
  ISSUE_EVENT_TO_STATUS,
} from "./issueLifecycle.machine";
import { canTransitionIssueStatus } from "../../domain/value-objects/IssueStatus";

describe("issueLifecycle machine", () => {
  it("uses simplified transition actions", () => {
    expect(getIssueTransitionEvents("open")).toEqual(["RESOLVE"]);
    expect(getIssueTransitionEvents("investigating")).toEqual(["RESOLVE"]);
    expect(getIssueTransitionEvents("fixing")).toEqual(["RESOLVE"]);
    expect(getIssueTransitionEvents("retest")).toEqual(["RESOLVE"]);
    expect(getIssueTransitionEvents("resolved")).toEqual(["CLOSE"]);
    expect(getIssueTransitionEvents("closed")).toEqual([]);
  });

  it("does not expose removed flow action labels", () => {
    const labels = ISSUE_EVENT_LABEL as Record<string, string>;
    const targetMap = ISSUE_EVENT_TO_STATUS as Record<string, string | null>;

    expect(labels).not.toHaveProperty("INVESTIGATE");
    expect(labels).not.toHaveProperty("START_FIX");
    expect(labels).not.toHaveProperty("SUBMIT_RETEST");
    expect(labels).not.toHaveProperty("REOPEN_FIX");

    expect(targetMap).not.toHaveProperty("INVESTIGATE");
    expect(targetMap).not.toHaveProperty("START_FIX");
    expect(targetMap).not.toHaveProperty("SUBMIT_RETEST");
    expect(targetMap).not.toHaveProperty("REOPEN_FIX");
  });
});

describe("issue status transitions", () => {
  it("allows direct resolve path and close", () => {
    expect(canTransitionIssueStatus("open", "resolved")).toBe(true);
    expect(canTransitionIssueStatus("investigating", "resolved")).toBe(true);
    expect(canTransitionIssueStatus("fixing", "resolved")).toBe(true);
    expect(canTransitionIssueStatus("retest", "resolved")).toBe(true);
    expect(canTransitionIssueStatus("resolved", "closed")).toBe(true);
  });

  it("rejects removed step transitions", () => {
    expect(canTransitionIssueStatus("open", "investigating")).toBe(false);
    expect(canTransitionIssueStatus("investigating", "fixing")).toBe(false);
    expect(canTransitionIssueStatus("fixing", "retest")).toBe(false);
    expect(canTransitionIssueStatus("retest", "fixing")).toBe(false);
  });
});
