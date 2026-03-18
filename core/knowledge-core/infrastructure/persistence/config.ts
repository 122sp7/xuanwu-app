export const UPSTASH_CONFIG = {
  VECTOR: {
    URL: process.env.UPSTASH_VECTOR_REST_URL || '',
    TOKEN: process.env.UPSTASH_VECTOR_REST_TOKEN || '',
    TIMEOUT: 5000, // 5秒超時防禦
  },
  REDIS: {
    URL: process.env.UPSTASH_REDIS_REST_URL || '',
    TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || '',
  },
  // 緩存策略
  CACHE_TTL: 3600, // 1 hour
};

// 簡單的連線檢查防護
if (!UPSTASH_CONFIG.VECTOR.URL || !UPSTASH_CONFIG.VECTOR.TOKEN) {
  console.warn("⚠️ Upstash Vector credentials missing. Search may not work.");
}