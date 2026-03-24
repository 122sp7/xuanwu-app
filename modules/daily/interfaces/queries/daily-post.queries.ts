/**
 * Daily 模組 — 施工動態貼文查詢（interfaces 層）。
 * 依賴方向：interfaces → infrastructure → domain
 */

import { getDailyFeed as _getDailyFeed } from "../../infrastructure/api";
import type { DailyFeedPage } from "../../domain/schema";
import type { QueryScope } from "../../../shared/domain/types";

/**
 * 取得施工動態饋送，支援分頁游標。
 * 此函式作為 interfaces 層的唯一入口；元件不應直接引入 infrastructure。
 *
 * @param scope - 查詢範圍（帳號或工作區層級）
 * @param cursor - 分頁起始游標（上一頁回傳的 nextCursor，null 代表第一頁）
 */
export async function getDailyFeed(
  scope: QueryScope,
  cursor?: string | null,
): Promise<DailyFeedPage> {
  return _getDailyFeed(scope, cursor);
}
