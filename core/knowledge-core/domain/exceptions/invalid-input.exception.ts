import { KnowledgeException } from './knowledge.exception';

export class InvalidInputException extends KnowledgeException {
  constructor(message: string) {
    super(message, 'INVALID_INPUT');
  }
}