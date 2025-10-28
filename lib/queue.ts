const BeeQueue = eval("require")("bee-queue") as typeof import("bee-queue");
// import BeeQueue from "bee-queue";
import redisConfig from "./redis-config";

export function createQueue<T>(name: string, isWorker = false) {
  const queue = new BeeQueue<T>(name, {
    redis: redisConfig,
    isWorker,
  });

  if (isWorker) {
    const STALL_CHECK_INTERVAL_MS = 20_000;
    setInterval(() => {
      queue
        .checkStalledJobs()
        .then((requeued) => {
          if (requeued > 0) {
            console.log(
              `🔄  ${name}: re-queued ${requeued} stalled job${
                requeued > 1 ? "s" : ""
              }`
            );
          }
        })
        .catch((err) => {
          console.error(`${name}: failed to check stalled jobs`, err);
        });
    }, STALL_CHECK_INTERVAL_MS).unref();
  }

  return queue;
}
