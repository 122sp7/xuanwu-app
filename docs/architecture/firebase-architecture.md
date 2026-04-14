# Firebase Architecture

Backend 以 Firebase 落地：

- Firestore：資料儲存
- Auth：身份與登入狀態
- Storage：檔案與附件
- Functions / py_fn：背景工作與重處理流程

規則是：domain 不直接依賴 Firebase SDK。
