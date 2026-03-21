"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";

import type { PublishDailyEntryInput } from "../../domain/entities/DailyEntry";
import { PublishDailyEntryUseCase } from "../../application/use-cases/publish-daily-entry.use-case";
import { FirebaseDailyEntryRepository } from "../../infrastructure/firebase/FirebaseDailyEntryRepository";

const dailyEntryRepository = new FirebaseDailyEntryRepository();
const publishDailyEntryUseCase = new PublishDailyEntryUseCase(dailyEntryRepository);

export async function publishDailyEntry(input: PublishDailyEntryInput): Promise<CommandResult> {
  try {
    return await publishDailyEntryUseCase.execute(input);
  } catch (error) {
    return commandFailureFrom(
      "DAILY_ENTRY_PUBLISH_FAILED",
      error instanceof Error ? error.message : "Unexpected daily entry publish error",
    );
  }
}
