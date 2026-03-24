/**
 * modules/shared — 跨模組共用的領域事件基礎介面。
 * 遵循奧卡姆剃刀：只定義跨領域事件所需的最小結構。
 */

/** 所有領域事件的基礎介面。 */
export interface DomainEvent {
  /** 事件的唯一識別碼 */
  readonly eventId: string;
  /** 事件類型（格式：module.event-name，例如 content.block-updated） */
  readonly type: string;
  /** 觸發此事件的聚合根 ID */
  readonly aggregateId: string;
  /** 事件發生時間（ISO 8601） */
  readonly occurredAt: string;
}
