import { Queue } from "bullmq";
import { redis } from "@/lib/redis";

export const notificationQueue = new Queue("notificationQueue", {
  connection: redis,
});
