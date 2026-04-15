import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import { Database, type CreateDatabaseInput, type DatabaseProperty } from "../../domain/entities/Database";
import type { DatabaseRepository } from "../../domain/repositories/DatabaseRepository";

export class CreateDatabaseUseCase {
  constructor(private readonly repo: DatabaseRepository) {}

  async execute(input: CreateDatabaseInput): Promise<CommandResult> {
    try {
      const db = Database.create(input);
      await this.repo.save(db.getSnapshot());
      return commandSuccess(db.id, Date.now());
    } catch (err) {
      return commandFailureFrom("CREATE_DATABASE_FAILED", err instanceof Error ? err.message : "Failed to create database");
    }
  }
}

export class AddPropertyUseCase {
  constructor(private readonly repo: DatabaseRepository) {}

  async execute(databaseId: string, property: DatabaseProperty): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(databaseId);
      if (!snapshot) return commandFailureFrom("DATABASE_NOT_FOUND", `Database ${databaseId} not found`);
      const db = Database.reconstitute(snapshot);
      db.addProperty(property);
      await this.repo.save(db.getSnapshot());
      return commandSuccess(databaseId, Date.now());
    } catch (err) {
      return commandFailureFrom("ADD_PROPERTY_FAILED", err instanceof Error ? err.message : "Failed to add property");
    }
  }
}
