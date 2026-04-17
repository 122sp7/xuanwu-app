export type EvaluationVerdict = "pass" | "fail" | "needs_review";

export interface EvaluationCriterion {
  readonly name: string;
  readonly weight: number;
  readonly description?: string;
}

export interface EvaluationResult {
  readonly id: string;
  readonly responseId: string;
  readonly criteria: Array<{
    readonly criterion: EvaluationCriterion;
    readonly score: number;
    readonly verdict: EvaluationVerdict;
    readonly reasoning?: string;
  }>;
  readonly overallScore: number;
  readonly overallVerdict: EvaluationVerdict;
  readonly evaluatedAtISO: string;
}

export interface EvaluationPort {
  evaluate(input: {
    response: string;
    context?: string;
    criteria: EvaluationCriterion[];
    model?: string;
  }): Promise<Omit<EvaluationResult, "id" | "responseId" | "evaluatedAtISO">>;
}
