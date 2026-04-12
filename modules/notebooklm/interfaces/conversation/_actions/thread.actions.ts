"use server";

import type { Thread } from "../../../subdomains/conversation/application/dto/conversation.dto";
import { makeThreadRepo } from "../composition/adapters";

export async function saveThread(accountId: string, thread: Thread): Promise<void> {
  await makeThreadRepo().save(accountId, thread);
}

export async function loadThread(accountId: string, threadId: string): Promise<Thread | null> {
  return makeThreadRepo().getById(accountId, threadId);
}
