import type { WorkspaceParserSummary } from "../entities/ParserSummary";

export interface ParserScope {
  readonly workspaceId: string;
}

export interface ParserRepository {
  summarize(scope: ParserScope): WorkspaceParserSummary;
}
