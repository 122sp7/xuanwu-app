// Upstash Redis / QStash client
// import { Redis } from "@upstash/redis";

export const upstashConfig = {
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
};

// export const redis = new Redis(upstashConfig);
