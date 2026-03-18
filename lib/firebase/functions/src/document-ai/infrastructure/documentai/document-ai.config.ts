const DEFAULT_PROCESS_URL =
  "https://asia-southeast1-documentai.googleapis.com/v1/projects/65970295651/locations/asia-southeast1/processors/1516a32299c1709e:process";

const PROCESS_URL_SUFFIX = ":process";
const API_VERSION_SEGMENT = "/v1/";

export function resolveDefaultProcessorName(): string {
  const candidate =
    process.env.DOCUMENT_AI_PROCESSOR_NAME ??
    process.env.DOCUMENT_AI_PROCESS_URL ??
    DEFAULT_PROCESS_URL;

  return toProcessorName(candidate);
}

export function resolveDocumentAiApiEndpoint(): string {
  const explicitEndpoint = process.env.DOCUMENT_AI_API_ENDPOINT;
  if (explicitEndpoint && explicitEndpoint.trim().length > 0) {
    return explicitEndpoint.trim();
  }

  const defaultProcessorName = resolveDefaultProcessorName();
  const segments = defaultProcessorName.split("/");
  const location = segments[3];
  return `${location}-documentai.googleapis.com`;
}

export function toProcessorName(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error("Document AI processor reference cannot be empty.");
  }

  let processorName = trimmed;

  const versionIndex = processorName.indexOf(API_VERSION_SEGMENT);
  if (versionIndex >= 0) {
    processorName = processorName.slice(versionIndex + API_VERSION_SEGMENT.length);
  }

  if (processorName.endsWith(PROCESS_URL_SUFFIX)) {
    processorName = processorName.slice(0, -PROCESS_URL_SUFFIX.length);
  }

  if (!processorName.startsWith("projects/")) {
    throw new Error(
      "Document AI processor name must start with 'projects/' or be a full v1 process URL."
    );
  }

  return processorName;
}
