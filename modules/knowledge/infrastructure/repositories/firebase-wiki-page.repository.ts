import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";

import type { WikiPage } from "../../domain/entities/wiki-page.types";
import type { WikiPageRepository } from "../../domain/repositories/WikiPageRepository";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toDateOrNow(value: unknown): Date {
  if (isRecord(value)) {
    if (typeof value.toDate === "function") {
      try {
        const converted = (value.toDate as () => unknown)();
        if (converted instanceof Date) {
          return converted;
        }
      } catch {
        // fall through
      }
    }
  }
  if (value instanceof Date) {
    return value;
  }
  return new Date();
}

function mapToPage(id: string, accountId: string, data: Record<string, unknown>): WikiPage {
  return {
    id,
    accountId,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : undefined,
    title: typeof data.title === "string" ? data.title : "Untitled",
    slug: typeof data.slug === "string" ? data.slug : id,
    parentPageId: typeof data.parentPageId === "string" ? data.parentPageId : null,
    order: typeof data.order === "number" ? data.order : 0,
    status: data.status === "archived" ? "archived" : "active",
    createdAt: toDateOrNow(data.createdAt),
    updatedAt: toDateOrNow(data.updatedAt),
  };
}

function mapForWrite(page: WikiPage): Record<string, unknown> {
  return {
    workspaceId: page.workspaceId ?? null,
    title: page.title,
    slug: page.slug,
    parentPageId: page.parentPageId,
    order: page.order,
    status: page.status,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
  };
}

export class FirebaseWikiPageRepository implements WikiPageRepository {
  async listByAccountId(accountId: string): Promise<WikiPage[]> {
    const db = getFirebaseFirestore();
    const ref = firestoreApi.collection(db, "accounts", accountId, "pages");
    const snap = await firestoreApi.getDocs(ref);

    const pages = snap.docs.map((docSnap) => {
      const raw = docSnap.data();
      const data = isRecord(raw) ? raw : {};
      return mapToPage(docSnap.id, accountId, data);
    });

    pages.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.title.localeCompare(b.title, "zh-Hant");
    });

    return pages;
  }

  async findById(accountId: string, pageId: string): Promise<WikiPage | null> {
    const db = getFirebaseFirestore();
    const ref = firestoreApi.doc(db, "accounts", accountId, "pages", pageId);
    const snap = await firestoreApi.getDoc(ref);
    if (!snap.exists()) {
      return null;
    }
    const raw = snap.data();
    const data = isRecord(raw) ? raw : {};
    return mapToPage(snap.id, accountId, data);
  }

  async create(page: WikiPage): Promise<void> {
    const db = getFirebaseFirestore();
    const ref = firestoreApi.doc(db, "accounts", page.accountId, "pages", page.id);
    await firestoreApi.setDoc(ref, mapForWrite(page));
  }

  async update(page: WikiPage): Promise<void> {
    const db = getFirebaseFirestore();
    const ref = firestoreApi.doc(db, "accounts", page.accountId, "pages", page.id);
    await firestoreApi.updateDoc(ref, {
      workspaceId: page.workspaceId ?? null,
      title: page.title,
      slug: page.slug,
      parentPageId: page.parentPageId,
      order: page.order,
      status: page.status,
      updatedAt: page.updatedAt,
    });
  }
}
