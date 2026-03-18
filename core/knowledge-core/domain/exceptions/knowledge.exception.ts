export abstract class KnowledgeException extends Error {
  public readonly code: string;

  constructor(message: string, code: string = 'KNOWLEDGE_CORE_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}