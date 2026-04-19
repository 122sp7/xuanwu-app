"""
Firebase Admin SDK 初始化 — 整個 fn 只 initialize_app() 一次，
其他模組直接 import firebase_admin 即可取得已初始化的 app。
"""

import firebase_admin
from app.container.runtime_dependencies import register_runtime_dependencies

# Cloud Run / Cloud Functions 執行環境使用 ADC（Application Default Credentials）
# 本機測試時請先執行： gcloud auth application-default login
if not firebase_admin._apps:
    firebase_admin.initialize_app()

register_runtime_dependencies()
