import "dotenv/config";
import Redis from "ioredis";
import crypto from "crypto";

const redis = new Redis(process.env.REDIS_URL_CACHE as string);

export async function cacheLLM<T>(
  stepId: string,
  inputs: Record<string, unknown>,
  callFn: () => Promise<T>,
  ttl = 60 * 60 * 24 * 14
): Promise<T> {
  const hash = crypto
    .createHash("sha1")
    .update(JSON.stringify(inputs))
    .digest("hex");
  const key = `${stepId}:${hash}`;
  const cached = await redis.get(key);
  console.log(` cached ${stepId} with key ${key} and ttl ${ttl}`);
  if (cached) return JSON.parse(cached) as T;
  const lockKey = `lock:${key}`;
  const hasLock = (await redis.setnx(lockKey, "1")) === 1;
  if (hasLock) await redis.expire(lockKey, 30);
  if (!hasLock) {
    for (;;) {
      await new Promise((r) => setTimeout(r, 1000));
      const val = await redis.get(key);
      if (val) return JSON.parse(val) as T;
    }
  }
  try {
    const result = await callFn();
    await redis.set(key, JSON.stringify(result), "EX", ttl);
    console.log(` set ${stepId} with key ${key} and ttl ${ttl}`);
    return result;
  } finally {
    await redis.del(lockKey);
  }
}
