import "dotenv/config";
const REDIS_URL = process.env.REDIS_URL!;
const { hostname, port, password } = new URL(REDIS_URL);
export const redisConfig = {
  host: hostname,
  port: Number(port),
  password,
  tls: {},

  connectTimeout: 10_000,
  retryStrategy: (times: number) => Math.min(times * 500, 30_000),
  keepAlive: 60_000,
};

export default redisConfig;
