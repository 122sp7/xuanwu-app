"use server";

import { addDoc, collection, getFirestore } from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { DailyPostType } from "../../domain/schema";

// ── 輸入型別 ────────────────────────────────────────────────────────────────

export interface CreateDailyPostInput {
  /** 所屬租戶（帳號）ID */
  accountId: string;
  /** 所屬工作區 ID */
  workspaceId: string;
  /** 貼文正文（IG 風格 caption） */
  content: string;
  /** 施工分類 */
  type: DailyPostType;
  /** 建立者摘要 */
  createdBy: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

// ── Server Action ──────────────────────────────────────────────────────────

/**
 * 建立一筆施工動態貼文（寫入 dailyPosts collection）。
 * 骨架版本：不含附件上傳，預留 attachments[] 空陣列供後續擴充。
 */
export async function createDailyPost(input: CreateDailyPostInput): Promise<CommandResult> {
  try {
    const now = new Date().toISOString();
    const db = getFirestore(firebaseClientApp);

    const docRef = await addDoc(collection(db, "dailyPosts"), {
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      content: input.content.trim(),
      type: input.type,
      attachments: [],
      reactionCount: 0,
      commentCount: 0,
      isFlagged: false,
      createdAt: now,
      updatedAt: now,
      createdBy: {
        id: input.createdBy.id,
        name: input.createdBy.name,
        ...(input.createdBy.avatarUrl ? { avatarUrl: input.createdBy.avatarUrl } : {}),
      },
    });

    return commandSuccess(docRef.id, 1);
  } catch (error) {
    return commandFailureFrom(
      "DAILY_POST_CREATE_FAILED",
      error instanceof Error ? error.message : "Unexpected error creating daily post",
    );
  }
}
