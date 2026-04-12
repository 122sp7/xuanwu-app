"use server";

import type { Thread } from "../../../subdomains/conversation/application/dto/conversation.dto";
import { makeConversationUseCases } from "../composition/use-cases";

export async function saveThread(accountId: string, thread: Thread): Promise<void> {
  const { saveThread: save } = makeConversationUseCases();
  await save.execute(accountId, thread);
}

export async function loadThread(accountId: string, threadId: string): Promise<Thread | null> {
  const { loadThread: load } = makeConversationUseCases();
  return load.execute(accountId, threadId);
}
