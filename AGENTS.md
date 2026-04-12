NotionAPI 
NotebookLMAPI 

platform 必須提供 API
但分成 2 種：

1️⃣ Infrastructure API（低階能力）
2️⃣ Platform Service API（高階跨域能力）

① Infrastructure API（低階）

👉 給 notion / notebooklm 用
👉 不給 workspace 直接用（重要）

export interface FirestoreAPI {
  get<T>(path: string): Promise<T | null>
  set<T>(path: string, data: T): Promise<void>
  query<T>(collection: string, where: Query[]): Promise<T[]>
}

export interface StorageAPI {
  upload(file: File, path: string): Promise<string>
  getUrl(path: string): Promise<string>
  delete(path: string): Promise<void>
}

export interface GenkitAPI {
  runFlow<TInput, TOutput>(flow: string, input: TInput): Promise<TOutput>
}

② Platform Service API（高階，重點🔥）

👉 給 workspace / notion / notebooklm 都可以用
👉 封裝「跨 domain 行為」

export interface AuthAPI {
  getSession(): Promise<AuthSession>
  requireAuth(): Promise<User>
}

export interface PermissionAPI {
  can(userId: string, action: string, resource: string): Promise<boolean>
}

File

👉 不要直接用 Storage API
👉 要包成「語意 API」

export interface FileAPI {
  uploadUserFile(input: {
    file: File
    ownerId: string
  }): Promise<{ url: string; fileId: string }>

  deleteFile(fileId: string): Promise<void>
}

export interface AIAPI {
  summarize(text: string): Promise<string>
}

🔁 檔案（File）完整流
workspace (UI)
   ↓
notion.createDocument(with file)
   ↓
platform.file.uploadUserFile()
   ↓
platform.storage.upload()
   ↓
Firebase Storage

語意一致 uploadUserFile ≠ upload(path)

1. platform 是唯一 infra 入口
2. workspace 不可直接用 infra API
3. notion / notebooklm 不可繞過 platform
4. 所有跨 domain 行為 → platform service

platform 不是工具箱，而是「能力中樞」
API 要分：低階（給 module）+ 高階（給全系統）