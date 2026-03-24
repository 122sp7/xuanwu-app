/**
 * Daily 模組基礎設施 — Firebase Firestore 動態饋送查詢。
 * 支援工作區層級或帳號層級（跨工作區）的查詢範圍。
 */

import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentSnapshot,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import type { QueryScope } from "../../shared/domain/types";
import type { Attachment, DailyFeedPage, DailyPost, DailyPostType } from "../domain/schema";
import { DAILY_POST_TYPES } from "../domain/schema";

const COLLECTION = "dailyPosts";
const PAGE_SIZE = 10;

const VALID_POST_TYPES = new Set<DailyPostType>(DAILY_POST_TYPES);

// ── 資料轉換 ───────────────────────────────────────────────────────────────

function toAttachment(raw: unknown): Attachment | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  if (typeof data.id !== "string" || typeof data.url !== "string") return null;
  const type = data.type as string;
  if (type !== "image" && type !== "video" && type !== "document") return null;
  return {
    id: data.id,
    type,
    url: data.url,
    thumbnailUrl: typeof data.thumbnailUrl === "string" ? data.thumbnailUrl : undefined,
  };
}

function toDailyPost(id: string, data: Record<string, unknown>): DailyPost | null {
  if (typeof data.content !== "string" || !data.content) return null;
  if (typeof data.accountId !== "string" || !data.accountId) return null;
  if (typeof data.workspaceId !== "string" || !data.workspaceId) return null;

  const postType = VALID_POST_TYPES.has(data.type as DailyPostType)
    ? (data.type as DailyPostType)
    : "progress";

  const createdBy =
    data.createdBy && typeof data.createdBy === "object"
      ? (data.createdBy as Record<string, unknown>)
      : {};

  const rawAttachments = Array.isArray(data.attachments) ? data.attachments : [];

  return {
    id,
    accountId: data.accountId,
    workspaceId: data.workspaceId,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
    createdBy: {
      id: typeof createdBy.id === "string" ? createdBy.id : "",
      name: typeof createdBy.name === "string" ? createdBy.name : "未知",
      avatarUrl: typeof createdBy.avatarUrl === "string" ? createdBy.avatarUrl : undefined,
    },
    content: data.content,
    type: postType,
    attachments: rawAttachments.map(toAttachment).filter((a): a is Attachment => a !== null),
    reactionCount: typeof data.reactionCount === "number" ? data.reactionCount : 0,
    commentCount: typeof data.commentCount === "number" ? data.commentCount : 0,
    isFlagged: data.isFlagged === true,
  };
}

// ── 查詢游標快取（模組內部） ──────────────────────────────────────────────

const cursorCache = new Map<string, DocumentSnapshot>();

// ── 主要查詢函式 ───────────────────────────────────────────────────────────

/**
 * 從 Firestore 取得施工動態饋送，支援分頁游標。
 *
 * @param scope - 查詢範圍（帳號或工作區層級）
 * @param cursor - 分頁起始游標（上一頁回傳的 nextCursor）
 */
export async function getDailyFeed(
  scope: QueryScope,
  cursor?: string | null,
): Promise<DailyFeedPage> {
  const db = getFirestore(firebaseClientApp);
  const col = collection(db, COLLECTION);

  // 根據 scope 決定過濾條件
  const scopeFilter = scope.workspaceId
    ? where("workspaceId", "==", scope.workspaceId)
    : where("accountId", "==", scope.accountId);

  // 游標分頁：有 cursor 時加入 startAfter 限制
  const cursorSnapshot = cursor ? cursorCache.get(cursor) : undefined;

  const snapshot = await getDocs(
    cursorSnapshot
      ? query(
          col,
          scopeFilter,
          orderBy("createdAt", "desc"),
          startAfter(cursorSnapshot),
          limit(PAGE_SIZE + 1),
        )
      : query(
          col,
          scopeFilter,
          orderBy("createdAt", "desc"),
          limit(PAGE_SIZE + 1),
        ),
  );
  const docs = snapshot.docs;
  const hasMore = docs.length > PAGE_SIZE;
  const pageDocs = hasMore ? docs.slice(0, PAGE_SIZE) : docs;

  // 儲存最後一筆快照供下一頁使用
  let nextCursor: string | null = null;
  if (hasMore && pageDocs.length > 0) {
    const lastDoc = pageDocs[pageDocs.length - 1];
    nextCursor = lastDoc.id;
    cursorCache.set(nextCursor, lastDoc);
  }

  const items = pageDocs
    .map((doc) => toDailyPost(doc.id, doc.data() as Record<string, unknown>))
    .filter((p): p is DailyPost => p !== null);

  return { items, nextCursor };
}
