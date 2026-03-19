import { getNotificationsForRecipient } from "@/modules/notification";

import type {
  DailyDigestItem,
  OrganizationDailyDigestEntity,
  WorkspaceDailyDigestEntity,
} from "../../domain/entities/DailyDigest";
import type { DailyDigestRepository } from "../../domain/repositories/DailyDigestRepository";

const DEFAULT_DIGEST_SCAN_LIMIT = 300;

function isSameLocalDay(timestamp: number) {
  const today = new Date();
  const target = new Date(timestamp);

  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth() &&
    today.getDate() === target.getDate()
  );
}

function toDigestItem(notification: {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  timestamp: number;
  metadata?: Record<string, unknown>;
}): DailyDigestItem {
  const metadataWorkspaceId =
    typeof notification.metadata?.workspaceId === "string"
      ? notification.metadata.workspaceId
      : null;

  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    read: notification.read,
    timestamp: notification.timestamp,
    workspaceId: metadataWorkspaceId,
  };
}

function summarize(items: DailyDigestItem[]) {
  return {
    total: items.length,
    unread: items.filter((item) => !item.read).length,
  };
}

export class DefaultDailyDigestRepository implements DailyDigestRepository {
  constructor(private readonly digestScanLimit = DEFAULT_DIGEST_SCAN_LIMIT) {}
  async getWorkspaceDigest(
    workspaceId: string,
    accountId: string,
  ): Promise<WorkspaceDailyDigestEntity> {
    const notifications = await getNotificationsForRecipient(
      accountId,
      this.digestScanLimit,
    );
    const items = notifications
      .map(toDigestItem)
      .filter((item) => {
        if (!isSameLocalDay(item.timestamp)) {
          return false;
        }

        return item.workspaceId === null || item.workspaceId === workspaceId;
      });

    return {
      workspaceId,
      accountId,
      summary: summarize(items),
      items,
    };
  }

  async getOrganizationDigest(
    organizationId: string,
    workspaceIds: string[],
  ): Promise<OrganizationDailyDigestEntity> {
    const workspaceIdSet = new Set(workspaceIds);
    const notifications = await getNotificationsForRecipient(
      organizationId,
      this.digestScanLimit,
    );
    const items = notifications
      .map(toDigestItem)
      .filter((item) => {
        if (!isSameLocalDay(item.timestamp)) {
          return false;
        }

        if (item.workspaceId === null) {
          return true;
        }

        return workspaceIdSet.has(item.workspaceId);
      });

    return {
      organizationId,
      summary: summarize(items),
      items,
    };
  }
}
